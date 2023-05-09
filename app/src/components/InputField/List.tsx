import React, {Component} from 'react';
import {FlatList, Keyboard, TouchableOpacity, View} from 'react-native';
import {connect} from "react-redux";
import {filterArray, getType, log} from "../../lib/functions";
import {Divider, List, Paragraph, withTheme} from "react-native-paper";

import {AppBar, Button, ProIcon} from "../index";
import {setBottomSheet, setModal, setPageSheet} from "../../lib/Store/actions/components";
import {styles as theme, styles} from "../../theme";

import Avatar from "../Avatar";

import {defaultvalues} from "../../lib/setting";
import BottomSpace from "../BottomSpace";
import {assignOption, TASK_ICONS} from "../../lib/static";
import Search from "../SearchBox";

let tickettype: any = defaultvalues.tickettype;

class ListView extends Component<any> {


    filterlist: any = [];
    originalList: any = [];
    searchText: any;

    constructor(props: any) {
        super(props);
        const {selected, list, multiselect,listtype}: any = this.props;
        this.originalList = list;
        this.filterlist = list;



        if (getType(selected) === 'array' && multiselect) {
            this.filterlist.map((item: any) => {
                selected.some((value: any) => {
                    if (item.value === value) {
                        item.selected = true;
                    }
                })
            })
        }
    }

    selectItem = (item: any) => {

        Keyboard.dismiss();
        const {multiselect}: any = this.props;

        if (!multiselect) {
            this._select(item);
        } else {
            item.selected = !Boolean(item.selected);
            this.forceUpdate()
        }
    }

    _select = (item: any) => {
        const {onSelect, setBottomSheet, setModal, setPageSheet, multiselect, disabledCloseModal,modal}: any = this.props;

        onSelect(item);
        setBottomSheet({visible: false});
        if (!Boolean(disabledCloseModal)) {
            Keyboard.dismiss();
            setTimeout(() => {
                modal.visible && setModal({visible: false});
                setPageSheet({visible: false})
            }, 100)
        }
    }

    confirm = () => {

        Keyboard.dismiss();

        const {onSelect, setPageSheet, setModal,modal}: any = this.props;

        let selected = this.filterlist?.filter((item: any) => {
            return item.selected
        }).map((item: any) => {
            return item.value
        })

        onSelect({value: selected})

        setTimeout(() => {
            modal.visible && setModal({visible: false});
            setPageSheet({visible: false})
        }, 100)

    }

    renderList = ({item}: any) => {
        const {
            onSelect,
            setBottomSheet,
            selected,
            displaytype,
            multiselect,
            listtype,
            settings: {tickets, staff}
        }: any = this.props;

        const tasktypes = (listtype === 'task_type' && tickets) && tickets[tickettype]?.task_types;
        const {colors}: any = this.props.theme;

        return (
            <>
                <View style={[styles.px_5, {paddingLeft: 5}]}>
                    {listtype === 'staff' && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item title={item.label}
                                   titleStyle={{textTransform: 'capitalize'}}
                                   left={() => <Avatar label={item.label} size={30} value={item.value}/>}
                                   right={() => +item.value === +selected &&
                                       <View style={{marginTop: 10}}><ProIcon action_type={'text'}
                                                                              color={colors.secondary}
                                                                              name={'check'}/></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'task_status' && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item title={() => <View
                            style={[styles.flexwidth, {backgroundColor: item.color, borderRadius: 3}]}><Paragraph
                            style={[styles.paragraph, {color: 'white'}]}>  {item.label}  </Paragraph></View>}
                                   titleStyle={{textTransform: 'capitalize'}}
                                   right={() => item.value === selected &&
                                       <View style={{marginTop: 10}}><ProIcon action_type={'text'}
                                                                              color={colors.secondary}
                                                                              name={'check'}/></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'task_type' && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item
                            title={() => <View><Paragraph style={[styles.paragraph]}>{item.label}</Paragraph></View>}
                            titleStyle={{textTransform: 'capitalize'}}
                            left={() => <View style={{marginTop: 3}}>
                                {Boolean(TASK_ICONS[tasktypes[item?.value]?.type_key]) && <ProIcon name={TASK_ICONS[tasktypes[item?.value]?.type_key]} size={14}/>}
                            </View>}
                            right={() => item.value === selected &&
                                <View style={{marginTop: 10}}><ProIcon action_type={'text'} color={colors.secondary}
                                                                       name={'check'}/></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'priority' && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item
                            title={() => <View><Paragraph style={[styles.paragraph]}>{item.label}</Paragraph></View>}
                            titleStyle={{textTransform: 'capitalize'}}
                            left={() => <View style={{marginTop: 3}}>
                                <ProIcon color={theme[item.value].color}
                                         name={`${item.value === 'highest' ? 'chevrons-up' : item.value === 'high' ? 'chevron-up' : item.value === 'low' ? 'chevron-down' : item.value === 'lowest' ? 'chevrons-down' : 'equals'}`}
                                         size={15}/>
                            </View>}
                            right={() => item.value === selected &&
                                <View style={{marginTop: 10}}><ProIcon action_type={'text'} color={colors.secondary}
                                                                       name={'check'}/></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'other' && !multiselect && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item
                            title={() => <View><Paragraph style={[styles.paragraph]}>{item.label}</Paragraph></View>}
                            titleStyle={{textTransform: 'capitalize'}}
                            right={() => (item.value === selected) &&
                                <View style={{marginTop: 10}}><ProIcon action_type={'text'} color={colors.secondary}
                                                                       name={'check'}/></View>}
                        />
                    </TouchableOpacity>}

                    {listtype === 'other' && multiselect && <TouchableOpacity onPress={() => {
                        this.selectItem(item);
                    }}>
                        <List.Item
                            title={() => <View><Paragraph
                                style={[styles.paragraph]}>{item.label}</Paragraph></View>}
                            titleStyle={{textTransform: 'capitalize'}}
                            right={() => item.selected &&
                                <View style={{marginTop: 10}}><ProIcon action_type={'text'} color={colors.secondary}
                                                                       name={'check'}/></View>}
                        />
                    </TouchableOpacity>}
                </View>
                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </>
        );
    };

    handleSearch = (search: any) => {
        // let {list}: any = this.props;
        this.filterlist = filterArray(this.originalList, ['label'], search);
        this.searchText = search;
        this.forceUpdate();
    }

    _onAdd = () => {
        let {onAdd}: any = this.props;

        if (Boolean(this.searchText?.trim())) {
            this.originalList = [...this.originalList, assignOption(this.searchText, this.searchText,'','','','',true)];
            this.handleSearch(this.searchText);
            onAdd(this.searchText, (value: any) => {
                log('_onAdd value',value)
                this._select(value);
            });
            //this.confirm()
        } else {
            onAdd(this.props)
        }
    }

    render() {

        const {
            theme: {colors},
            label,
            showlabel,
            search,
            appbar,
            navigation,
            addItem,
            multiselect,
            displaytype,
            onAdd
        }: any = this.props;

        return (

            <View style={[styles.w_100, styles.h_100, {backgroundColor: colors.surface}]}>


                {appbar && <AppBar back={true} title={label} isModal={true}>
                    {/*<Search handleSearch={this.handleSearch} label={label}/>*/}
                    {Boolean(addItem) && <View style={{width: 40, marginRight: 20}}>
                        {addItem}
                    </View>}
                </AppBar>}

                <View style={[styles.w_100, {height: '80%'}]}>
                    <FlatList
                        scrollIndicatorInsets={{right: 1}}
                        data={this.filterlist}
                        accessible={true}
                        keyboardDismissMode={'none'}
                        keyboardShouldPersistTaps={'always'}

                        ListHeaderComponent={!Boolean(displaytype === 'bottomlist') ?
                            <View style={[styles.grid, styles.middle]}>
                                <View style={[styles.w_auto]}>
                                    <Search autoFocus={false} placeholder={`Search...`}
                                            handleSearch={this.handleSearch}/>
                                </View>

                                {Boolean(onAdd) && <View style={[{paddingRight: 15}]}>
                                    <Button compact={true} secondbutton={!Boolean(this.searchText)} disabled={!Boolean(this.searchText)} onPress={() => {
                                        this._onAdd()
                                    }}>{'Add'}  </Button>
                                </View>}

                            </View> : <View></View>}
                        renderItem={this.renderList}
                        initialNumToRender={20}
                    />
                </View>

                <BottomSpace/>

                {multiselect && <View style={{marginTop: 'auto'}}>
                    <View style={[styles.px_5, styles.mb_6]}>
                        <Button onPress={() => {
                            this.confirm()
                        }}> Confirm </Button>
                    </View>
                </View>}


            </View>
        );
    }
}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    modal: state.components.modal
})
const mapDispatchToProps = (dispatch: any) => ({
    setBottomSheet: (dialog: any) => dispatch(setBottomSheet(dialog)),
    setPageSheet: (dialog: any) => dispatch(setPageSheet(dialog)),
    setModal: (dialog: any) => dispatch(setModal(dialog)),

});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ListView));




