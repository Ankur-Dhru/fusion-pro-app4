import React, {Component} from 'react';
import {View, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {InputBox, Button, Container, AppBar, CheckBox, ProIcon} from "../../../../components";
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
    Divider,
    Badge, TouchableRipple
} from "react-native-paper";

import {
    clone,
    filterArray,
    findObject,
    getLabel,
    getSelectedColumn, getType,
    log, objectToArray,
    objToArray,
    toCurrency
} from "../../../../lib/functions";

import {setItems, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";

import { withTheme } from 'react-native-paper';

import EditJournal from "./EditInventory";

import {setDialog} from "../../../../lib/Store/actions/components";
import {voucher} from "../../../../lib/setting";
import EditItem from "../Items/EditItem";
import {options_itc} from "../../../../lib/static";
import Swipeout from "rc-swipeout";
import {itemTotalCalculation} from "../../../../lib/voucher_calc";

class AddedInventory extends Component<any> {

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




    removeItem = (item: any) => {
        const {voucheritems, updateVoucherItems} = this.props;
        if (!Boolean(item?.itemunique)) {
            item.itemunique = item?.voucheritemid
        }
        let items = clone(voucheritems);
        delete items[item.itemunique];
        updateVoucherItems(items);
    }

    updateItem = (item:any) => {
        const {setVoucherItems} = this.props;
        setVoucherItems(item);
    }


    renderItem = (item:any) => {
        const {navigation, settings,editmode,hidetitle,theme:{colors}} = this.props;

        if(item.productremark){
            const {stockonhand,productqnt}:any = item.productremark;

            const unit = item?.itemdetail?.salesunits[item?.itemdetail?.salesunit]
            item = {
                ...item,stockonhand:stockonhand,productqnt:productqnt,unit:unit,itemname:item.itemdetail.itemname
            }
        }

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
                    <View key={item.itemunique} style={[styles.mb_4]}>
                        <View  style={[styles.py_4]}>
                            <View>

                                <TouchableOpacity  onPress={() =>{

                                    if(editmode) {
                                        if (item?.voucheritemid) {
                                            item.itemunique = item?.voucheritemid;
                                        }

                                        navigation.navigate('EditInventory', {
                                            screen: 'EditInventory',
                                            item:item,
                                            updateItem: this.updateItem,
                                        })
                                    }
                                }}>

                                    <View style={[styles.row,{paddingRight:4}]}>

                                        {editmode && !hidetitle && <View style={[styles.cell,{paddingLeft:0}]}>
                                            <TouchableOpacity onPress={() => this.removeItem(item)}>
                                                <ProIcon color={'#a72929'}  name={'circle-xmark'}/>
                                            </TouchableOpacity>
                                        </View>}

                                        <View style={[styles.cell, styles.w_auto,{paddingLeft:0}]}>
                                            <Paragraph style={[styles.paragraph,styles.caption]} numberOfLines={1}>{item.itemname || item.productdisplayname}</Paragraph>

                                            <View style={[styles.row,{marginBottom:5}]}>
                                                <View style={[styles.cell, styles.w_auto]}>
                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>Available Qty</Paragraph>
                                                </View>
                                                <View style={[styles.cell,{paddingRight:0}]}>
                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>{item.stockonhand} {item.unit}</Paragraph>
                                                </View>
                                            </View>

                                            <View style={[styles.row,{marginBottom:5}]}>
                                                <View style={[styles.cell, styles.w_auto]}>
                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>Actual Qty</Paragraph>
                                                </View>
                                                <View style={[styles.cell,{paddingRight:0}]}>
                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>{item.productqnt} {item.unit}</Paragraph>
                                                </View>
                                            </View>

                                            <View style={[styles.row,{marginBottom:5}]}>
                                                <View style={[styles.cell, styles.w_auto]}>
                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>Adjusted Qty</Paragraph>
                                                </View>
                                                <View style={[styles.cell,{paddingRight:0}]}>
                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>{+item.productqnt - +item.stockonhand} {item.unit}</Paragraph>
                                                </View>
                                            </View>


                                            <View style={[styles.row,{marginBottom:5}]}>
                                                <View style={[styles.cell, styles.w_auto]}>
                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>Price / Qty</Paragraph>
                                                </View>
                                                <View style={[styles.cell,{paddingRight:0}]}>
                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>{toCurrency(item.productrate)}</Paragraph>
                                                </View>
                                            </View>

                                        </View>

                                    </View>


                                </TouchableOpacity>

                            </View>

                        </View>

                        <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>

                    </View>
                </Swipeout>



            </>
        );
    };


    render() {

        const {searchbar,filters,editmode}:any = this.state;
        const {navigation,items,voucheritems,hidetitle,sheetRef,type} = this.props;
        const { colors } = this.props.theme;

        let addeditems:any = objToArray(voucheritems);

        voucher.data.voucheritem = voucher.data.invoiceitems = clone(addeditems)

        return (
            <View>

                {Boolean(addeditems && addeditems.length) && <><View>
                    <Paragraph style={[styles.paragraph,styles.caption]}>{addeditems && addeditems.length} ITEM{addeditems && addeditems.length>1?'S':''}</Paragraph>
                </View>
                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/></>}

                {addeditems && Boolean(addeditems.length) &&  <View style={[styles.mt_4]}>
                    {
                        addeditems.slice(0,10).map((item: any,index:any) => {
                            return this.renderItem(item)
                        })
                    }
                </View> }

                {!hidetitle &&  <View>
                    <Button      onPress={() => {  this.props.validate() }}> Generate {voucher.type.label}  </Button>
                </View> }

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

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(AddedInventory));


