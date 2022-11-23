import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from "../../../../theme";
import {ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Paragraph, TextInput, withTheme} from "react-native-paper";
import {log} from "../../../../lib/functions";
import {Field} from "react-final-form";
import {setDialog} from "../../../../lib/Store/actions/components";
import InputField from "../../../../components/InputField";
import {composeValidators, required} from "../../../../lib/static";

let CurrencyFormat = require('react-currency-format');


class SerialNos extends Component<any> {

    askonplacetype: any = 'auto'

    constructor(props: any) {
        super(props);

        this.askonplacetype = props.item.askonplacetype;

        this.state = {noofserials: (props.item.serialno && props.item.serialno.length) || +props.item.productqnt};
        if (props.item.askonplacetype === 'askonplace') {
            this.askonplacetype = 'auto';
        }
        if (props.item.askonplacetypechange) {
            this.askonplacetype = props.item.askonplacetypechange;
        }
    }

    componentWillMount() {

    }


    handleSubmit = () => {

    }

    serialnoremove = (index: any) => {

        try {
            const {item} = this.props;
            const {noofserials}: any = this.state;

            if (Boolean(item.updatedserial[index]?.newserial)) {
                item.updatedserial[index].newserial = '';
            }

            if (Boolean(item.updatedserial[index]?.oldserial)) {
                this.forceUpdate()
            } else {
                item.updatedserial.splice(index, 1)
                this.setState({noofserials: noofserials - 1})
            }
        } catch (e) {
            log(e)
        }
    }

    addSerialnos = () => {
        const {noofserials}: any = this.state;
        const {item} = this.props;
        item.updatedserial.push({})
        item.productqnt = noofserials + 1
        this.setState({noofserials: item.productqnt})
    }

    removeSerialnos = () => {
        const {noofserials}: any = this.state;
        const {item} = this.props;
        item.updatedserial.pop({})
        item.productqnt = noofserials - 1
        this.setState({noofserials: item.productqnt})
    }


    render() {


        const {noofserials}: any = this.state;


        const {item, settings, navigation} = this.props;




        const {colors} = this.props.theme;

        let soldedSerialno: any = []

        let increaseDisabled = false;
        if (item.voucheritemid) {

            if (!Boolean(item?.updatedserial.length)) {
                item.updatedserial = [{}]
            }

            item.productqnt = item?.updatedserial.filter((value: any) => {
                return (!Boolean(value?.oldserial)) || (Boolean(value?.oldserial) && Boolean(value?.newserial))
            }).length;


            if (Boolean(item?.soldSerial)) {
                soldedSerialno = Object.keys(item?.soldSerial).filter((keys: any) => {
                    return Boolean(item?.soldSerial[keys]?.sold)
                }).map((keys: any) => {
                    return item?.soldSerial[keys]?.serialno
                })

                if (Boolean(soldedSerialno?.length)) {
                    increaseDisabled = true;
                    //return <View><Paragraph style={[styles.paragraph, styles.red]}>Sold Serial No.</Paragraph></View>
                }
            }

        }


        return (
            <View>

                {(item.askonplacetype === 'askonplace' || Boolean(item.serial)) && <View>


                    {item.askonplacetype === 'askonplace' && <InputField
                        label={'Serial No. Type'}
                        divider={true}
                        displaytype={'bottomlist'}
                        inputtype={'dropdown'}
                        list={[{label: 'Auto', value: 'auto'}, {label: 'Manual', value: 'manual'}]}
                        search={false}
                        listtype={'other'}
                        selectedValue={this.askonplacetype}
                        onChange={(value: any) => {
                            this.askonplacetype = value;
                            item.askonplacetypechange = value;
                            this.forceUpdate()
                        }}
                    />}




                    {this.askonplacetype === 'auto' && <View style={[{marginBottom: 20,}]}>
                        <View style={[styles.border, styles.center, {borderColor: colors.text, borderRadius: 5,}]}>
                            <View style={[styles.grid, styles.middle, styles.center, styles.justifyContent]}>
                                <View style={{width: 50}}>
                                    {item.productqnt > 1 && !Boolean(item.voucheritemid) && this.askonplacetype === 'auto' &&
                                        <TouchableOpacity onPress={() => {
                                            this.removeSerialnos()
                                        }}>
                                            <ProIcon name={'minus'} align={'right'} size={15}/>
                                        </TouchableOpacity>}
                                </View>
                                <View style={{width: 150}}>
                                    <TextInput
                                        keyboardType={'numeric'}
                                        value={'' + item.productqnt}
                                        disabled={Boolean(item.voucheritemid)}
                                        style={[styles.px_6, {
                                            height: 50,
                                            textAlign: 'center',
                                            backgroundColor: 'transparent'
                                        }]}
                                        onBlur={() => {
                                            if (!Boolean(item.productqnt)) {
                                                item.productqnt = 1
                                            }
                                        }}
                                        onChangeText={(value: any) => {
                                            item.productqnt = +value || '';
                                            this.setState({noofserials: item.productqnt})
                                        }}
                                    />
                                </View>

                                <View style={{width: 50}}>
                                    {(this.askonplacetype === 'auto' && !increaseDisabled) &&
                                        <TouchableOpacity onPress={() => {
                                            this.addSerialnos()
                                        }}>
                                            <ProIcon name={'plus'} align={'right'} size={15}/>
                                        </TouchableOpacity>}
                                </View>
                            </View>
                        </View>

                        <View><Paragraph style={[styles.paragraph, styles.text_xs, styles.red]}>Serial number will be
                            auto generated by system</Paragraph></View>

                    </View>}

                    {!Boolean(item.voucheritemid) && <View>
                        {this.askonplacetype !== 'auto' && <View>
                            <View>
                                <Field name={`numbers.serialno`} validate={composeValidators(required)}>
                                    {props => (
                                        <InputField
                                            {...props}
                                            defaultValue={props.input.value}
                                            label={`Serial No.`}
                                            inputtype={'scan'}
                                            multiline={true}
                                            navigation={navigation}
                                            description={'Each serial no. in new line'}
                                            placeholder={''}
                                            onChange={(value: any) => {
                                                props.input.onChange(value);
                                            }}
                                        />
                                    )}
                                </Field>
                            </View>
                        </View>}
                        <View>
                            <Field name={`numbers.mfdno`}>
                                {props => (
                                    <InputField
                                        {...props}
                                        value={props.input.value + ''}
                                        label={'MFD/IMEI No.'}
                                        description={'Each MFD no. in new line'}
                                        inputtype={'scan'}
                                        keyboardType='numeric'
                                        navigation={navigation}
                                        multiline={true}
                                        placeholder={''}
                                        onChange={(value: any) => {
                                            props.input.onChange(value);
                                        }}
                                    />
                                )}
                            </Field>
                        </View>
                    </View>}


                    {Boolean(item.voucheritemid) && Array.from(Array(noofserials), (e, i) => {

                        let serial = item?.updatedserial[i] || {newserial: '', mfdno: ''};

                        const isDisable = soldedSerialno.some((sold: any) => sold === serial.oldserial)

                        if (Boolean(serial?.oldserial) && !Boolean(serial?.newserial)) {
                            return <View></View>
                        }

                        return (
                            <View key={i} style={[styles.grid, styles.middle]}>

                                {<View style={[styles.w_auto, styles.mr_2]}>
                                    <Field name={`serialno[${i}]`}
                                           validate={this.askonplacetype !== 'auto' ? required : undefined}>
                                        {props => (
                                            <InputField
                                                {...props}
                                                value={props.input.value}
                                                label={`Serial No. ${Boolean(+serial?.auto) ? '(Auto)' : ''} ${isDisable ? '(Sold)' : ''}`}
                                                inputtype={'textbox'}
                                                editmode={!isDisable}
                                                onChange={(value: any) => {
                                                    serial.newserial = value
                                                    props.input.onChange(value)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>}

                                <View style={[styles.w_auto]}>
                                    <Field name={`mfdno[${i}]`}>
                                        {props => (
                                            <InputField
                                                value={props.input.value}
                                                label={'MFD/IMEI No.'}
                                                keyboardType='numeric'
                                                inputtype={'textbox'}
                                                editmode={!isDisable}
                                                onChange={(value: any) => {
                                                    serial.mfdno = value
                                                    props.input.onChange(value)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>

                                {item.productqnt > 1 && !isDisable && <View>
                                    <TouchableOpacity onPress={() => {
                                        this.serialnoremove(i)
                                    }}>
                                        <ProIcon name={'circle-xmark'}/>
                                    </TouchableOpacity>
                                </View>}


                            </View>
                        )
                    })}


                    {/*{
                      Boolean(item?.updatedserial) &&  item?.updatedserial.map((serialno:any,index:any)=>{

                            return (
                                <View key={index} style={[styles.grid,styles.middle]}>

                                    {<View style={[styles.w_auto,styles.mr_2]}>
                                        <InputField
                                            value={serialno.newserial}
                                            label={'Inventory Serial No.'}
                                            inputtype={'textbox'}
                                            onChange={(value:any)=> {
                                                serialno.newserial = value
                                                this.forceUpdate()
                                            }}
                                        />
                                    </View>}


                                    <View style={[styles.w_auto]}>
                                        <InputField
                                            value={serialno.mfdno}
                                            label={'MFD/IMEI No.'}
                                            inputtype={'textbox'}
                                            onChange={(value:any)=> {
                                                serialno.mfdno = value
                                                this.forceUpdate()
                                            }}
                                        />
                                    </View>




                                </View>
                            )
                        })
                    }*/}


                </View>}


            </View>

        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SerialNos));


