import React, {Component} from 'react';
import {View, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {InputBox, Button, Container, AppBar,CheckBox} from "../../../../components";
import {connect} from "react-redux";
import {
    Appbar,
    Card,
    DataTable,
    Menu,
    Paragraph,
    Searchbar,
    Title,
    List,
    Surface,

    Badge, TouchableRipple,Divider
} from "react-native-paper";

import {Field, Form} from "react-final-form";
import {
    clone,
    filterArray,
    findObject,
    getLabel,
    getSelectedColumn, getType,
    log,
    objToArray,
    toCurrency
} from "../../../../lib/functions";

import Search from "../../../../components/SearchBox";
import {setItems, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";
import NumericInput from 'react-native-numeric-input'
import { withTheme } from 'react-native-paper';


import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import Add from "../../../Menu";
import EditExpense from "./EditExpense";

import {setDialog} from "../../../../lib/Store/actions/components";
import {voucher} from "../../../../lib/setting";
import EditItem from "../Items/EditItem";
import {options_itc} from "../../../../lib/static";
import Swipeout from "rc-swipeout";
import {fonts} from "react-native-elements/dist/config";

class AddedExpense extends Component<any> {

    title:any;
    initdata:any = {items:[]};
    sheetRef:any;
    scanner:any;
    totals:any = 0;

    option_notaxreason:any;

    constructor(props:any) {
        super(props);
        this.state = {searchbar:false,filters:[],editmode:false};

        this.option_notaxreason  = Object.keys(props.settings?.reason?.notaxreason).map((key:any)=>{
            let reason = props.settings?.reason?.notaxreason[key];
            return {label:reason,value:key}
        })

        this.sheetRef = React.createRef()
        this.scanner = React.createRef()
    }


    getTotal = () => {
        const {voucheritems} = this.props
        let total =0;
        Object.keys(voucheritems).map((key:any)=>{
            let item = voucheritems[key];
            if(item.productqnt > 0) {
                total += (parseFloat(item.expenseamount) || 0)
            }
        })
        return total;
    }



    removeItem = (item: any) => {
        const {voucheritems, updateVoucherItems} = this.props;
        if (!Boolean(item.itemunique)) {
            item.itemunique = item.voucheritemid
        }
        let items = clone(voucheritems);
        delete items[item.itemunique];
        updateVoucherItems(items);
    }


    updateItem = (item:any) => {
        const {setVoucherItems} = this.props;
        setVoucherItems(item);
    }


    renderItem = (item:any,index:any) => {
        const {navigation,editmode,settings,theme:{colors}} = this.props;

        const account = findObject(settings.chartofaccount,'accountid',item.accountid);

        return (
            <>

                <Swipeout
                    right={[
                        {
                            text: 'Delete',
                            onPress:() => {
                                this.removeItem(item);
                            },
                            style: { backgroundColor: styles.red.color, color: 'white'},
                        }
                    ]}
                    autoClose={true}
                    disabled={!editmode}
                    style={{backgroundColor:'transparent'}}>
                    <View>
                        <View  style={[styles.mt_4]}>
                            <View>
                                <TouchableOpacity  onPress={() =>{
                                    if(editmode) {
                                        if (item?.voucheritemid) {
                                            item.itemunique = item?.voucheritemid;
                                        }

                                        navigation.navigate('EditExpense', {
                                            screen: EditExpense,
                                            item:item,
                                            updateItem: this.updateItem,
                                        })
                                    }
                                }}>

                                    <View style={[styles.row,{paddingRight:4}]}>

                                        <View style={[styles.cell, styles.w_auto,{paddingLeft:0}]}>

                                            <Paragraph style={[styles.paragraph,styles.text_sm,styles.bold,styles.ellipse]} numberOfLines={1}>{account[0]?.accountname}</Paragraph>

                                            <View style={[styles.middle,styles.row,{marginBottom:0}]}>
                                                <Text style={[styles.badge,styles.text_xxs,{padding:1,textAlignVertical:'top',borderRadius:2,textTransform:'uppercase',backgroundColor:item.itemtype==='service'?'orange':'green'}]}>
                                                    {item.itemtype}
                                                </Text>
                                            </View>
                                            {Boolean(item.hsn) && <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>{item.itemtype === 'service'?'SAC Code':'HSN Code'} : {item.hsn}</Paragraph>}
                                            {voucher.settings.eligibleforitc && <Paragraph style={[styles.paragraph,styles.text_xs]}>{settings?.tax[item?.producttaxgroupid]?.notaxreasonenable? getLabel(this.option_notaxreason,item.taxreason):getLabel(options_itc,item.itc)}</Paragraph>}

                                        </View>
                                        <View style={[styles.cell,{paddingRight:0}]}>
                                            <Paragraph style={[styles.paragraph,styles.text_sm, styles.textRight,styles.bold]}>
                                                {toCurrency(item.productratedisplay)}
                                            </Paragraph>
                                            <Paragraph style={[styles.paragraph,styles.text_xs, styles.textRight]}>
                                                {settings?.tax[item.producttaxgroupid]?.taxgroupname}
                                            </Paragraph>
                                        </View>
                                    </View>


                                </TouchableOpacity>

                            </View>

                        </View>

                    </View>
                </Swipeout>



                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>

            </>
        );
    };


    render() {

        const {searchbar,filters}:any = this.state;
        const {navigation,items,voucheritems,hidetitle,sheetRef,editmode,settings} = this.props;
        const { colors } = this.props.theme;

        let addeditems:any = objToArray(voucheritems)

        return (
            <View>


                {Boolean(addeditems && addeditems.length) && <><View >
                    <Paragraph  style={[styles.paragraph,styles.caption]}>{addeditems && addeditems.length} Expense{addeditems && addeditems.length>1?'S':''}</Paragraph>
                </View>
                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/></>}

                <View>

                    {addeditems && Boolean(addeditems.length) &&  <View style={[{marginVertical:10}]}>
                        {
                            addeditems.map((item: any,index:any) => {
                                return this.renderItem(item,index)
                            })
                        }
                    </View> }

                </View>

                {<>
                    {!hidetitle && Boolean(addeditems.length) && <View style={[styles.mb_10]}>
                        <Button   onPress={() => { this.props.validate()}}> Generate {voucher.type.label} </Button>
                    </View> }
                </>}


            </View>
        )
    }
}



const mapStateToProps = (state:any) => ({
    items: state.appApiData.items,
    voucheritems:state.appApiData.voucheritems,
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({
    setItems: (items:any) => dispatch(setItems(items)),
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
    setVoucherItems: (items:any) => dispatch(setVoucherItems(items)),
    updateVoucherItems: (items:any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(AddedExpense));


