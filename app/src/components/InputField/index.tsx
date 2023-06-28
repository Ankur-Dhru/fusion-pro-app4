import * as React from 'react';
import {Card, Divider, Paragraph, Text, Title, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {
    Image,
    Platform,
    TextInput as TextInputReact,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";


import List from "./List";
import {setBottomSheet, setModal, setPageSheet} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {InputBox, ProIcon} from "../index";
import DateTimePicker from './DateTimePicker';
import moment from "moment";
import Attachment from "../../pages/Attachment";
import {findObject, getType, isEmpty, log} from "../../lib/functions";
import DayPicker from "../DayPicker";
import Tags from "../Tags";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import ToggleSwitch from "./Switch";
import {chevronRight, voucher} from "../../lib/setting";
import Signature from "../../pages/Signature";


class Index extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        let findSelected;
        if (props.selectedValue) {
            const list = props.list;
            let find = findObject(list, 'value', props.selectedValue);
            findSelected = Boolean(find) && find[0] && find[0]?.label
        }

        this.state = {
            selectedValue: props.selectedValue,
            selectedLabel: findSelected ? findSelected : props.selectedLabel,
            showDatePicker: false
        }

    }

    onSelect = (value: any) => {

        if (Boolean(value)) {
            this.props.onChange(value?.value, value);
            this.setState({selectedLabel: value.label, selectedValue: value.value, showDatePicker: false})
        }
    }

    _onRead = (data: any) => {
        const {navigation, onChange} = this.props;
        onChange(data);
        navigation.goBack();
    }



    _getDays = () => {

        const {
            showDays,
            showTodayTomorrow,
            message,
            fromJob
        }: any = this.props;
        let {selectedValue}: any = this.state
        let display: any = ""
        let days = moment(selectedValue)
            .startOf("days")
            .diff(moment(fromJob && voucher.data.date).startOf("days"), 'days');
        if (Boolean(showDays) && ((showTodayTomorrow && days > -1) || (!showTodayTomorrow && days > 0))) {
            display = `(${days} ${days > 1 ? "Days" : "Day"})`;
            if (showTodayTomorrow && !fromJob) {
                if (days === 0) {
                    display = `( Today )`;
                } else if (days === 1) {
                    display = `( Tomorrow )`;
                }
            }
        }
        if (message) {
            display += ` ${message}`
        }
        return display
    }

    render() {
        let {
            label,
            list,
            customrange,
            navigation,
            listtype,
            showlabel = true,
            search = false,
            appbar = true,
            dueterm = true,
            divider = true,
            inputtype,
            hideLabel,
            preview = true,
            icon = false,
            fullView = false,
            displaytype,
            editmode = true,
            setBottomSheet,
            setModal,
            render,
            onChange,
            singleImage,
            value,
            multiselect,
            meta,
            input,
            addItem,
            lines,
            defaultValue,
            settings,
            multiline,
            mode = 'date',
            minimumDate,
            description,
            placeholder,
            disabledCloseModal,
            showDays,
            moreStyle,
            doNotReplaceProtocol,
            removeSpace,
            setPageSheet,
            message,
            validateWithError,
            descriptionStyle,
            readonly,
            customRef
        }: any = this.props;


        if (isEmpty(descriptionStyle)){
            descriptionStyle=[]
        }


        const dateformat: any = settings?.general?.date_format.toUpperCase();

        const {colors} = this.props.theme;
        let {selectedValue, selectedLabel, showDatePicker}: any = this.state

        let Render: any = render;

        const isRequired = Boolean(meta?.error);
        const labelstyle = [styles.inputLabel, {
            color: isRequired ? colors.inputLabel : colors.inputLabel,
            fontSize: (inputtype === 'dropdown' || inputtype === 'datepicker') ? 12 : 16
        }]

        let listComponent = () => <List
            label={label}
            list={list}
            appbar={appbar}
            search={search}
            listtype={listtype}
            selected={selectedValue}
            displaytype={displaytype}
            multiselect={multiselect}
            addItem={addItem}
            disabledCloseModal={disabledCloseModal}
            {...input}
            {...this.props}
            onSelect={this.onSelect}
        >
        </List>

        let style: any = [];
        if (inputtype !== 'daterange' && !Boolean(removeSpace)) {
            style = [...style, styles.fieldspace]
        }
        if (!isEmpty(moreStyle)) {
            style = [...style, ...moreStyle]
        }

        return (
            <View style={style}>

                {
                    inputtype === "bottommenu" && <View>

                        <><TouchableOpacity
                            onPress={() => {
                                setBottomSheet({
                                    visible: true,
                                    fullView: fullView,
                                    component: listComponent
                                })
                            }}>
                            {Boolean(render) ?
                                <Render/> :
                                <View style={[styles.filterBox, {backgroundColor: colors.filterbox}]}>
                                    <Text style={[styles.text_xxs, {color: colors.secondary}]}>{label}</Text>
                                    <View style={[styles.grid, styles.middle, styles.noWrap, styles.justifyContent]}>
                                        <Text
                                            style={[colors.inputLabel, {color: colors.secondary}]}>{selectedLabel || 'Any'} </Text>
                                        {editmode &&
                                            <ProIcon name={'chevron-down'} color={colors.secondary} action_type={'text'}
                                                     size={10}/>}
                                    </View>
                                </View>
                            }
                        </TouchableOpacity>
                        </>
                    </View>
                }

                {inputtype === 'dropdown' &&
                    <View>
                        <><TouchableWithoutFeedback
                            ref={customRef}
                            onPress={() => editmode && (displaytype === 'bottomlist' ?
                                setBottomSheet({
                                    visible: true,
                                    fullView: fullView,
                                    component: listComponent
                                }) : setPageSheet({
                                    visible: true,
                                    fullView: fullView,
                                    component: listComponent
                                }))}><View>
                            {Boolean(render) ?
                                <Render/> : <View>
                                    <Text style={[labelstyle, {marginBottom: -3}]}>{label}</Text>
                                    <View style={[styles.grid, styles.middle, styles.justifyContent, styles.noWrap]}>
                                        {!multiselect && <Text>{selectedLabel}</Text>}
                                        {(multiselect && getType(selectedValue) === 'array') &&
                                            <Text>{selectedValue?.join(", ")}</Text>}
                                        <View style={{marginLeft: 'auto'}}>
                                            {editmode ? <Text>
                                                {chevronRight}
                                            </Text> : <Paragraph style={[{height: 26}]}>{}</Paragraph>}
                                        </View>
                                    </View>
                                    {divider &&
                                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>}
                                </View>
                            }</View>
                        </TouchableWithoutFeedback>
                        </>
                    </View>
                }

                {inputtype === 'textbox' &&
                    <View>
                        <InputBox
                            defaultValue={defaultValue}
                            label={label}
                            labelstyle={labelstyle}
                            editmode={editmode}
                            onChange={(value: any) => {
                                onChange(value)
                            }}
                            {...input}
                            {...this.props}
                        />
                    </View>
                }

                {inputtype === 'scan' &&
                    <View style={[styles.tagContainer]}>
                        <View style={[styles.tagInputContainer]}>
                            {multiline ? <View>
                                    <Text style={labelstyle}>{label}</Text>
                                    <TextInputReact
                                        onChangeText={(value: any) => {
                                            onChange(value)
                                        }}
                                        defaultValue={defaultValue}
                                        placeholder={label}
                                        style={[styles.input, styles.mb_5, {
                                            backgroundColor: colors.backgroundColor,
                                            fontSize: 16,
                                            color: colors.inputbox
                                        }]}
                                        {...this.props}
                                    />
                                    <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                </View> :

                                <InputBox
                                    defaultValue={defaultValue}
                                    label={label}
                                    labelstyle={labelstyle}
                                    editmode={editmode}
                                    onChange={(value: any) => {
                                        onChange(value)
                                    }}
                                    {...input}
                                    {...this.props}
                                />}
                        </View>

                        <View style={[styles.tagButton]}>
                            <Title onPress={() => {
                                if (navigation) {
                                    if (Platform.OS === "ios") {
                                        requestMultiple([
                                            PERMISSIONS.IOS.CAMERA,
                                        ]).then(statuses => {
                                            if (statuses[PERMISSIONS.IOS.CAMERA] === 'granted') {
                                                navigation.navigate('Scanner', {
                                                    onRead: this._onRead,
                                                    multiline: multiline
                                                });
                                            }
                                        });
                                    } else {
                                        navigation.navigate('Scanner', {onRead: this._onRead, multiline: multiline});
                                    }
                                }
                            }}>
                                <Paragraph><ProIcon name={'barcode-read'} size={22}/></Paragraph>
                            </Title>
                        </View>

                    </View>
                }


                {inputtype === 'textarea' &&
                    <View>
                        <Text style={labelstyle}>{label}</Text>
                        <TextInputReact
                            onChangeText={(value: any) => {
                                onChange(value)
                            }}
                            editable={editmode}
                            defaultValue={defaultValue}
                            placeholder={label}
                            multiline={true}
                            placeholderTextColor={colors.inputLabel}
                            style={[styles.input, styles.mb_5, {
                                backgroundColor: colors.backgroundColor,
                                fontSize: 16,
                                color: colors.inputbox
                            }]}
                            {...this.props}
                        />
                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                    </View>
                }

                {inputtype === 'tags' &&
                    <Tags label={label} onChange={onChange} list={defaultValue}/>
                }

                {inputtype === 'switch' && <>
                    <Text style={labelstyle}>{label}</Text>
                    <ToggleSwitch value={value} onChange={onChange}/>
                </>
                }

                {inputtype === 'daterange' && <TouchableOpacity
                    onPress={() => editmode && setBottomSheet({
                        visible: true,
                        fullView: fullView,
                        component: () => <DayPicker onSelect={this.onSelect} customrange={customrange} list={list}/>
                    })}>
                    {Boolean(render) ?
                        <Render/> : <ProIcon name={'calendar'}/>}
                </TouchableOpacity>
                }


                {inputtype === 'datepicker' &&
                    <View>
                        <TouchableOpacity
                            onPress={() => editmode && (Platform.OS === "ios" ? setBottomSheet({
                                visible: true,
                                fullView: fullView,
                                component: () => <DateTimePicker
                                    label={label}
                                    dueterm={dueterm}
                                    defaultValue={moment(selectedValue).format('YYYY-MM-DD')}
                                    mode={mode}
                                    onSelect={this.onSelect}
                                />
                            }) : this.setState({showDatePicker: true}))}>
                            {Boolean(render) ?
                                <Render/> : <View>
                                    <Text style={[labelstyle]}>{label}</Text>
                                    <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                        <Text>{moment(selectedValue).format(mode === "time" ? "HH:mm:ss" : dateformat)} {this._getDays()} </Text>
                                        <View>{editmode ? <Text>{chevronRight}</Text> :
                                            <Paragraph style={[{height: 26}]}>{}</Paragraph>}</View>
                                    </View>
                                    {divider &&
                                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>}
                                </View>
                            }
                        </TouchableOpacity>


                        {showDatePicker && <DateTimePicker
                            label={label}
                            dueterm={dueterm}
                            defaultValue={moment(selectedValue).format('YYYY-MM-DD')}
                            mode={mode}
                            minimumDate={minimumDate}
                            onSelect={this.onSelect}
                        />}

                    </View>
                }

                {inputtype === 'attachment' &&
                    <View>
                        <Attachment
                            editmode={editmode}
                            icon={icon}
                            navigation={navigation}
                            label={label}
                            hideLabel={hideLabel}
                            doNotReplaceProtocol={doNotReplaceProtocol}
                            onChange={(value: any) => {
                                onChange(value)
                            }}
                            singleImage={singleImage}
                            preview={preview}/>
                    </View>
                }


                {inputtype === 'signature' &&
                     <Signature editmode={editmode}
                                readonly={readonly}
                                navigation={navigation}
                                label={label}
                     />
                }


                {Boolean(description) &&
                    <Text style={[styles.paragraph, styles.mt_1, styles.text_xs]}><Text
                        style={[...descriptionStyle]}>{description} </Text></Text>}
                {meta?.error && meta?.touched && !voucher.data.reseterror &&
                    <Text style={[styles.paragraph, {position: 'absolute', bottom: -5}]}><Text
                        style={[styles.errorText]}>{!Boolean(validateWithError) ? `${label} ` : ""}{meta?.error} </Text></Text>}


            </View>
        );
    }
}

const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({
    setBottomSheet: (dialog: any) => dispatch(setBottomSheet(dialog)),
    setPageSheet: (dialog: any) => dispatch(setPageSheet(dialog)),
    setModal: (dialog: any) => dispatch(setModal(dialog)),

});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));
