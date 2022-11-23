import React, {Component, useCallback} from 'react';
import {View, Text, ScrollView, FlatList, TouchableOpacity, Platform, Image, Keyboard} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {InputBox, Button, Container, AppBar, CheckBox, Accordian, ProIcon} from "../../../../components";
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
    TextInput as TI, TextInput
} from "react-native-paper";
import {Field, Form} from "react-final-form";
import {
    clone,
    filterArray,
    findObject,
    getCurrencySign, getCurrentCompanyDetails, getIntraStateTax,
    getSelectedColumn,
    log,
    objToArray, storeData
} from "../../../../lib/functions";

import Search from "../../../../components/SearchBox";
import {setCompany, setItems, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";
import NumericInput from 'react-native-numeric-input'
import {withTheme} from 'react-native-paper';


import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView} from "@gorhom/bottom-sheet";


import AddedInventory from "./AddedInventory";
import {Accordion} from "react-native-paper/lib/typescript/components/List/List";
import {store} from "../../../../App";
import {setLoader} from "../../../../lib/Store/actions/components";
import Dropdown from "../../../../components/Dropdown";
import {backButton, voucher} from "../../../../lib/setting";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import ListLoader from "../../../../components/ContentLoader/ListLoader";
import AddedItems from "../Items/AddedItems";
import InputField from "../../../../components/InputField";
import {options_itc} from "../../../../lib/static";
import {getProductData} from "../../../../lib/voucher_calc";
import BottomSpace from '../../../../components/BottomSpace';
import Avatar from "../../../../components/Avatar";
import EditItem from "../Items/EditItem";

class ProfileView extends Component<any> {

    title: any;
    initdata: any = {items: []};
    sheetRef: any;
    scanner: any;
    itemlist: any;
    params: any;
    favouriteitems: any;

    constructor(props: any) {
        super(props);
        this.state = {searchbar: false, searchtext: ''};
        this.sheetRef = React.createRef();
        this.scanner = React.createRef();

        this.favouriteitems = props.companydetails.companies[props.companydetails.currentuser].services[voucher.type.vouchertypeid] || [];


        this.state = {searchbar: false, searchtext: '', filteritems: this.favouriteitems, isLoading: true};

        const {route}: any = this.props;
        this.params = route.params;
    }

    handleState = (item: any) => {
        this.setState({...this.state, ...item})
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

    getItemDetails = (item: any) => {

        Keyboard.dismiss()

        const {setVoucherItems, companydetails}: any = this.props;

        requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {itemid: item.itemid, stockcheck: true, location: voucher.data.locationid},
            showlog: true
        }).then((result) => {
            if (result.status === SUCCESS) {


                let data = result.data;

                item = {
                    ...item,
                    productid: data.itemid,
                    purchasecost: data.purchasecost,
                    productrate: data.purchasecost,
                    stockonhand: data.stockonhand,
                    unit: data.units[data.salesunit],
                    inventorytype: data.inventorytype,
                }
                if (item.inventorytype === "specificidentification" && item?.stockonhand) {
                    item.productqnt = item.stockonhand.toString();
                }


                setVoucherItems(clone(item));

                let found = findObject(this.favouriteitems, 'itemid', item.itemid);

                if (!found[0]) {

                    try {
                        this.favouriteitems?.unshift({
                            itemname: data.itemname,
                            inventorytype: data.inventorytype,
                            itemunique: data.itemid,
                            itemid: data.itemid
                        });
                        this.favouriteitems?.length > 10 && this.favouriteitems?.splice(10, 1);
                        companydetails.companies[companydetails.currentuser]['services'] = {
                            ...companydetails.companies[companydetails.currentuser]['services'],
                            [voucher.type.vouchertypeid]: this.favouriteitems
                        };

                        storeData('fusion-pro-app', companydetails).then((r: any) => {
                            setCompany({companydetails: companydetails})
                        });
                    } catch (e) {
                        log(e)
                    }


                }
            }
        });
    }

    updateItem = (item: any) => {
        const {setVoucherItems} = this.props;
        item = {
            ...item,
            adjustedqnt: item.productqnt - item.stockonhand,
            oldrate: item.productrate,
        }
        setVoucherItems(item);
    }


    handleSearch = (search: any) => {
        this.setState({isLoading: false})
        requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {search: search || '', mobile: 1},
            loadertype: 'list',
            showlog: false
        }).then((result: any) => {
            if (result.status === SUCCESS) {

                this.itemlist = Boolean(result.data.length) && objToArray(result.data);

                this.setState({
                    searchtext: search,
                    filteritems: search ? filterArray(this.itemlist, ['itemname', 'sku'], search) : this.itemlist,
                    isLoading: true
                })
            }
        });
    }


    renderItem = ({item}: any) => {
        const {setVoucherItems, voucheritems, settings, navigation} = this.props;

        item.itemunique = item.itemid;

        item = {...item, ...voucheritems[item.itemid]}

        const {colors} = this.props.theme;

        let isSpecificItem = Boolean(item?.inventorytype === "specificidentification")

        return (
            <>

                <View>
                    <View>
                        <View>
                            {Boolean(voucheritems[item.itemunique]) ?
                                <View style={[styles.p_5, styles.bg_global, {
                                    borderRadius: 5,
                                    marginHorizontal: 10,
                                    marginTop: 12
                                }]}>

                                    <View style={[styles.grid, styles.middle]}>
                                        <Avatar label={item?.itemname} value={item.itemid} size={35}/>
                                        <Paragraph style={[styles.paragraph, styles.ml_2]}>
                                            {item.itemname}
                                        </Paragraph>
                                    </View>

                                    <Paragraph
                                        style={[styles.paragraph, styles.textRight, styles.red, styles.absolute, {
                                            right: 0,
                                            zIndex: 99
                                        }]} onPress={() => {
                                        this.removeItem(item)
                                    }}><ProIcon name={'circle-xmark'}/></Paragraph>

                                    <View>
                                        <InputField
                                            value={item.stockonhand + ' ' + item.unit}
                                            label={`Available Qnt`}
                                            inputtype={'textbox'}
                                            disabled={true}
                                            autoFocus={false}
                                        />
                                    </View>

                                    <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                        <View style={[{width: '45%'}]}>

                                            <InputField
                                                value={item?.productqnt}
                                                label={`Actual Qty`}
                                                autoFocus={true}
                                                disabled={isSpecificItem}
                                                inputtype={'textbox'}
                                                right={<TextInput.Affix text={item.unit}/>}
                                                keyboardType='numeric'
                                                onChange={(value: any) => {
                                                    item.productqnt = value;
                                                    this.updateItem(item)
                                                }}
                                            />

                                        </View>
                                        <View style={[{width: '45%'}]}>
                                            <InputField
                                                value={item.productrate}
                                                label={`Price / Qnt`}
                                                inputtype={'textbox'}
                                                keyboardType='numeric'
                                                autoFocus={false}
                                                disabled={true}
                                                left={<TextInput.Affix text={getCurrencySign()}/>}
                                                onChange={(value: any) => {
                                                    item.productrate = value;
                                                    this.updateItem(item)
                                                }}
                                            />

                                        </View>
                                    </View>

                                    {
                                        isSpecificItem &&
                                        <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('RemoveSerialStock', {
                                                    item,
                                                    updateItem: this.updateItem
                                                })
                                            }}>

                                                <Paragraph style={[styles.paragraph, {color:colors.secondary}]}>Serial No.</Paragraph>
                                            </TouchableOpacity>
                                        </View>
                                    }


                                </View> : <>
                                    <>
                                        <View style={[styles.grid, styles.middle, styles.p_5]}>
                                            <Avatar label={item?.itemname} value={item.itemid} size={35}/>
                                            <Paragraph style={[styles.paragraph, styles.ml_2]}>
                                                {item.itemname}
                                            </Paragraph>
                                            <View style={[styles.ml_auto, {width: 100}]}>
                                                <Button compact={true} secondbutton={true} onPress={() => {
                                                    this.getItemDetails(item);
                                                }}>
                                                    + Add
                                                </Button>
                                            </View>
                                        </View>
                                    </>
                                    <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                </>
                            }
                        </View>
                    </View>
                </View>


            </>
        );
    };


    render() {

        const {filteritems, searchtext, isLoading}: any = this.state;


        const {navigation, voucheritems} = this.props;

        const {colors} = this.props.theme;
        const {validate, editmode}: any = this.params;


        navigation.setOptions({
            headerTitle: 'Select Item',
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
        });


        return (
            <Container surface={true}>

                <Search autoFocus={false} placeholder={`Search...`} disableKeypress={true} disabledefaultload={true}
                        handleSearch={this.handleSearch}/>

                <View style={[styles.h_80]}>

                    {!isLoading ? <ListLoader/> : <FlatList
                        data={filteritems}
                        scrollIndicatorInsets={{right: 1}}
                        initialNumToRender={10}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.itemid}
                        ListEmptyComponent={<View style={[styles.middle]}><Image
                            style={[{height: 150, width: 150, opacity: 0.5}]}
                            source={require('../../../../assets/noitems.png')}
                        /><Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph></View>}
                        onEndReachedThreshold={0.5}
                        progressViewOffset={100}
                    />}

                </View>

                {voucheritems && Boolean(Object.keys(voucheritems).length) && <BottomSheet
                    ref={this.sheetRef}
                    index={0}
                    handleComponent={() =>
                        <View style={{
                            backgroundColor: colors.backdrop,
                            width: '100%',
                            borderTopLeftRadius: 50,
                            borderTopRightRadius: 50,
                            marginBottom: -1,
                            ...styles.shadow
                        }}>
                            <View style={{alignSelf: 'center',}}>
                                <View style={[styles.bg_global, {
                                    width: 40,
                                    height: 5,
                                    borderRadius: 5,
                                    marginTop: 10,
                                }]}></View>
                            </View>
                        </View>
                    }
                    snapPoints={[100, '78%']}>

                    <BottomSheetScrollView style={{backgroundColor: colors.backdrop}}>
                        <View style={[styles.px_6]}>
                            <AddedInventory navigation={navigation} validate={validate} editmode={editmode}/>
                        </View>
                    </BottomSheetScrollView>

                </BottomSheet>}

            </Container>

        )
    }
}


const renderBackdrop = (props: any) => {
    return (
        <BottomSheetBackdrop
            {...props}
            closeOnPress={false}
        />
    );
};

const backgroundComponent = (props: any) => {
    return (
        <View style={[{backgroundColor: '#f4f4f4'}]}></View>
    );
};

const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    items: state.appApiData.items,
    voucheritems: state.appApiData.voucheritems,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({
    setItems: (items: any) => dispatch(setItems(items)),
    setVoucherItems: (items: any) => dispatch(setVoucherItems(items)),
    setLoader: (loader: any) => dispatch(setLoader(loader)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ProfileView));


