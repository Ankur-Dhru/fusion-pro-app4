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



import {
    clone,
    filterArray,
    findObject,
    getLabel,
    getSelectedColumn,
    log,
    objToArray,
    toCurrency
} from "../../../../lib/functions";

import {setItems, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";

import { withTheme } from 'react-native-paper';

import EditJournal from "./EditJournal";

import {setDialog} from "../../../../lib/Store/actions/components";
import Swipeout from "rc-swipeout";
import EditExpense from "../Expense/EditExpense";
import {voucher} from "../../../../lib/setting";
import {options_itc} from "../../../../lib/static";

class AddedJournal extends Component<any> {

    title:any;
    initdata:any = {items:[]};
    sheetRef:any;
    scanner:any;
    totals:any = 0;
    constructor(props:any) {
        super(props);
        this.state = {searchbar:false,filters:[],editmode:false};

        this.sheetRef = React.createRef()
        this.scanner = React.createRef()
    }



    removeItem = (item:any) => {
        const {voucheritems, updateVoucherItems} = this.props;
        if (!Boolean(item.itemunique)) {
            item.itemunique = item.voucheritemid
        }
        let items = clone(voucheritems);
        delete items[item.itemunique];
        updateVoucherItems(items);
    }




    renderItem = (item:any) => {
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
                    style={{backgroundColor:'transparent'}}
                >
                    <View>

                        <View  style={[styles.mt_4]}>
                            <View>

                                <TouchableOpacity  onPress={() =>{

                                    if (item?.voucheritemid) {
                                        item.itemunique = item?.voucheritemid;
                                    }

                                    if(editmode) {
                                        navigation.navigate('EditJournal', {
                                            item:item,
                                            edititem:true,
                                            productdisplayname:item.productdisplayname
                                        })
                                    }
                                }}>

                                    <View style={[styles.row,{paddingRight:4}]}>

                                        <View style={[styles.cell, styles.w_auto,{paddingLeft:0}]}>
                                            <Paragraph style={[styles.paragraph,styles.text_sm,styles.ellipse,item.productdisplayname === 'dr'?styles.red:styles.green]}>{account[0]?.accountname}</Paragraph>
                                            {/*<Paragraph style={[styles.paragraph,styles.text_sm,styles.ellipse]}>{item?.clientname}</Paragraph>*/}
                                        </View>
                                        <View style={[styles.cell,{paddingRight:0}]}>
                                            <Paragraph style={[styles.paragraph,styles.text_sm, styles.textRight,item.productdisplayname === 'dr'?styles.red:styles.green]}>
                                                {toCurrency(item.productrate)}
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

        const {searchbar,filters,editmode}:any = this.state;
        const {navigation,items,voucheritems,hidetitle,sheetRef,type,disableButton} = this.props;
        const { colors } = this.props.theme;

        let addeditems:any = objToArray(voucheritems);


        const journallist = addeditems.filter((item:any)=> {return item.productqnt > 0 && item.productdisplayname === type })

        return (
            <View>




                <View>
                    {journallist && <>
                        {Boolean(journallist && journallist.length) && <><View   style={[{marginTop:12}]}>
                            <Paragraph style={[styles.paragraph,styles.bold,styles.muted,styles.text_sm,type === 'dr'?styles.red:styles.green,{textTransform:'uppercase'}]}>{journallist && journallist.length} {type === 'dr'?'Debit':'Credit'}{journallist && journallist.length>1?'S':''}</Paragraph>
                        </View>
                            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/></>}

                        {
                            journallist.map((item: any) => {
                            return this.renderItem(item)
                        })
                    }</>}
                </View>



                {!disableButton && Boolean(addeditems.length) && <View style={[styles.mb_10]}>
                    <Button   onPress={() => { this.props.validate()}}> Generate {voucher.type.label} </Button>
                </View>}

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

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(AddedJournal));


