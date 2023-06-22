import React, {Component} from 'react';
import {BackHandler, Keyboard, Platform, SectionList, TouchableOpacity, View} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {Button, Container, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Divider, Paragraph, Title, withTheme} from "react-native-paper";

import {
    clone,
    findObject,
    getDefaultCurrency,
    getIntraStateTax,
    loadItems,
    log,
    objToArray,
    storeData
} from "../../../../lib/functions";

import Search from "../../../../components/SearchBox";
import {setCompany, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";


import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";

import AddedItems from "./AddedItems";
import {backButton, voucher} from "../../../../lib/setting";
import {getProductData} from "../../../../lib/voucher_calc";
import {options_itc} from '../../../../lib/static';
import EditItem from "./EditItem";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import Avatar from "../../../../components/Avatar";
import NoResultFound from "../../../../components/NoResultFound";
import Tooltip, {STEPS, TooltipContainer} from "../../../../components/Spotlight/Tooltip";
import {isVisibleTooltip} from "../../../../lib/Store/store-service";


class SearchItem extends Component<any> {

    title: any;
    initdata: any = {items: []};
    sheetRef: any;
    scanner: any;
    itemlist: any;
    isInward: boolean = false;
    isOutward: boolean = false;
    params: any;
    favouriteitems: any;
    isNotOutsourcing: any;
    backHandler: any = null;
    enableBackHandler: any = false;
    skip = 0;
    take = 50;
    fromSpotlight: boolean = false

    constructor(props: any) {
        super(props);


        this.favouriteitems = props.companydetails.companies[props.companydetails.currentuser].services[voucher.type.vouchertypeid] || [];

        this.state = {
            searchbar: false,
            searchtext: '',
            filteritems: [],
            favouriteitems: this.favouriteitems,
            isLoading: false,
            total: 0,
            listVisible: false,
            addButtonVisible: false
        };
        this.isInward = voucher.data.vouchertype === "inward";
        this.isOutward = voucher.data.vouchertype === "outward";
        this.sheetRef = React.createRef();
        this.scanner = React.createRef();

        const {route}: any = this.props;
        this.params = route.params;

        this.isNotOutsourcing = !Boolean(voucher?.settings?.outsourcing)


        this.enableBackHandler = Boolean(voucher?.settings?.assettype) && Boolean(voucher?.data?.voucherid)

        this.fromSpotlight = Boolean(voucher?.type?.fromSpotlight)
    }

    handleState = (item: any) => {
        this.setState({...this.state, ...item})
    }

    onHardwareBackPress = () => {
        const {validate}: any = this.params;
        validate && validate();
        return false;
    }

    async componentWillMount() {
        await this.getItems().then()
        if (Boolean(this.enableBackHandler)) {
            BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress)
        }
    }

    componentWillUnmount() {
        if (Boolean(this.enableBackHandler)) {
            BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress)
        }
    }


    getItems = async () => {

        let {items}: any = this.props;

        try {

            this.itemlist = items || [];

            if ((!Boolean(items?.length))) {
                await loadItems().then((data: any) => {
                    this.itemlist = data;
                })
            }

            if (Boolean(this.fromSpotlight) && this.itemlist?.length > 0 &&
                (voucher?.type?.spotkey === "fifo" || voucher?.type?.spotkey === "specificidentification")) {
                this.itemlist = this.itemlist?.filter(({inventorytype}: any) => voucher?.type?.spotkey === inventorytype)
            }

            let visibleOptions = Boolean(this.itemlist?.length > 0)

            this.uniqueItem()

            this.setState({
                isLoading: true,
                total: this.itemlist?.length,
                filteritems: clone(this.itemlist),
                listVisible: visibleOptions,
                addButtonVisible: !visibleOptions
            })
        } catch (e) {
            log('e', e)
        }

    }


    uniqueItem = () => {
        const {favouriteitems}: any = this.state;
        this.itemlist = [...new Map(this.itemlist.map((item:any) =>  [item['itemid'], item])).values()];
        this.itemlist = this.itemlist.filter((item:any) => {
            const find = findObject(favouriteitems,'itemid',item.itemid)
            return !find.length
        });
    }

    handleSearch = async (search: any,) => {

        if (Boolean(search)) {
            this.skip = 0;
            this.take = 50;
            this.itemlist = []
        }

        this.setState({
            isLoading: false,
        })

        let resultdata: any = []

        // remove by akashbhai date - 18-august-2022 base on mobilemagic issue item not found chargin;
        //queryString: {search: search || '', mobile: 1, sku:1, skip: this.skip, take: this.take},




        await requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {search: search || '', skip: this.skip, take: this.take},
            loader: false,
            showlog: true,
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                resultdata = result?.data;
            }

            if (result.info?.total) {
                this.itemlist = this.itemlist.concat(result.data);
                if (!Boolean(search)) {
                    this.uniqueItem()
                }
            }

            this.setState({
                searchtext: search || '',
                total: result?.info?.total,
                filteritems: this.itemlist,
                isLoading: true
            })
        });


    }


    loadMore = () => {
        this.skip = this.skip + 50;
        this.take = 50;

        this.handleSearch('').then()
    }

    updateItem = (item: any) => {
        const {setVoucherItems} = this.props;
        setVoucherItems(item);
    }


    getItemDetails = (item: any) => {

        log("DATA",item);

        Keyboard.dismiss();

        const {setVoucherItems, companydetails, walkThroughActive, navigation}: any = this.props;

        requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {itemid: item.itemid},
            showlog: true
        }).then((result) => {
            if (result.status === SUCCESS) {


                let data = result.data;

                let productqntunitid;
                let {
                    itemtaxgroupid,
                    itemunit,
                    units,
                    salesunit,
                    salesunits,
                    defaultitc,
                    itemhsncode,
                    itemtype
                } = data;

                let producttaxgroupid;

                if (Boolean(itemtaxgroupid)) {
                    producttaxgroupid = itemtaxgroupid;
                }

                if (!this.isInward) {

                    if (Boolean(salesunit)) {
                        productqntunitid = salesunit;
                    }

                    /* if (!Boolean(salesunit)) {
                         if (Boolean(salesunits)) {
                             productqntunitid = Object.keys(salesunits)[0]
                         }
                     } else {
                         productqntunitid = salesunit;
                     }*/
                } else {


                    if (Boolean(itemunit)) {
                        productqntunitid = itemunit;
                    }


                    /*if (!Boolean(itemunit)) {
                        productqntunitid = Object.keys(units)[0]
                    } else {
                        productqntunitid = itemunit;
                    }*/
                }


                let selectedITC = options_itc[0].value;
                if (defaultitc) {
                    selectedITC = defaultitc;
                }

                let companyCurreny = getDefaultCurrency();


                try {

                    let itemDetail = {
                        ...item,
                        retailconfig: '',
                        productqnt: 1,
                        productdisplayname: data.itemname,
                        inventorytype: data.inventorytype,
                        identificationtype: data.identificationtype,
                        pricing: data.pricing,
                        productid: data.itemid,
                        itemunique: data.itemid,
                        defaulttaxgroupid: producttaxgroupid,
                        producttaxgroupid: (this.isOutward || this.isInward) ? getIntraStateTax(producttaxgroupid, voucher.data.placeofsupply, voucher.data.taxregtype) : producttaxgroupid,
                        productqntunitid,
                        itc: selectedITC,
                        hsn: itemhsncode,
                        itemtype: itemtype,
                        purchasecost: data.purchasecost,
                        serialno: [],
                    }


                    if (Boolean(this.isNotOutsourcing)) {
                        itemDetail = {
                            ...itemDetail,
                            ...getProductData(data, voucher.data.currency, companyCurreny.__key, undefined, undefined, this.isInward)
                        }
                    } else {
                        itemDetail = {
                            ...itemDetail,
                            productrate: "0",
                            productratedisplay: "0"
                        }
                    }

                    if (!Boolean(this.fromSpotlight)) {
                        let found = findObject(this.favouriteitems, 'itemid', data.itemid);
                        if (!found[0]) {
                            try {
                                this.favouriteitems?.unshift({
                                    itemname: data.itemname,
                                    inventorytype: data.inventorytype,
                                    itemunique: data.itemid,
                                    itemid: data.itemid,
                                    productqnt: 1
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


                    setVoucherItems(itemDetail);

                    if (walkThroughActive) {
                        navigation.goBack();
                    }

                } catch (e) {
                    log('e', e)
                }


            }
        });
    }


    removeItem = (item: any) => {
        const {voucheritems, updateVoucherItems} = this.props;
        if (!Boolean(item.itemunique)) {
            item.itemunique = item.voucheritemid
        }
        delete voucheritems[item.itemunique];
        updateVoucherItems(clone(voucheritems));
    }

    renderItem = (itemProps: any) => {

        const {item, index, listVisible, section} = itemProps;

        const {setVoucherItems, voucheritems, navigation} = this.props;


        const {validate, editmode}: any = this.params;

        let findinVoucher = findObject(objToArray(voucheritems), 'productid', item?.itemid);

        let voucheritemid = findinVoucher[0]?.voucheritemid || item.itemid;

        if (Boolean(voucheritems) && Boolean(voucheritems[voucheritemid])) {
            voucheritems[voucheritemid].itemunique = voucheritemid;
        }

        const freezqnt = !(voucher.settings.checkserialqnt && (item.inventorytype === 'specificidentification'))

        const {colors} = this.props.theme;

        return (
            <>
                <Tooltip
                    customVisible={index === 0 && listVisible && section?.title !== "Frequently" && isVisibleTooltip(STEPS.SELECT_OR_ADD_PRODUCT)}
                    message={`Select Prouct Or Service
                              From List`}
                    stepOrder={STEPS.SELECT_OR_ADD_PRODUCT}
                    nextStep={STEPS.SAVE_INVOICE}
                    isCustomVisible={true}
                >
                    <TooltipContainer stepOrder={STEPS.SELECT_OR_ADD_PRODUCT}>
                        <View style={[styles.p_5]}>

                            <View style={[styles.grid, styles.middle, styles.justifyContent, styles.noWrap]}>

                                <Avatar label={item?.itemname} value={item.itemid} size={35}/>

                                <View style={[styles.w_auto]}>
                                    <Paragraph style={[styles.paragraph, styles.ml_2]}>{item.itemname}</Paragraph>
                                </View>

                                <View style={[{width: 100}]}>

                                    {voucheritems && Boolean(voucheritems[voucheritemid] && voucheritems[voucheritemid].productqnt) ?

                                        <View>

                                            {voucheritems && Boolean(voucheritems[voucheritemid] && voucheritems[voucheritemid].productqnt) &&
                                                <Button compact={true} secondbutton={true} onPress={() => {

                                                    navigation.navigate('EditItem', {
                                                        screen: EditItem,
                                                        item: voucheritems[voucheritemid],
                                                        updateItem: this.updateItem,
                                                    })
                                                }}>Edit</Button>}

                                            {
                                                Boolean(this.isNotOutsourcing) && <View
                                                    style={[styles.grid, styles.mt_2, styles.middle, styles.justifyContent, styles.border, styles.center, {
                                                        marginBottom: 0,
                                                        alignItems: 'center',
                                                        borderColor: colors.secondary,
                                                        borderRadius: 5,
                                                    }]}>
                                                    <View style={[styles.grid, styles.middle]}>
                                                        {freezqnt && <TouchableOpacity onPress={() => {
                                                            voucheritems[voucheritemid].productqnt = parseInt(voucheritems[voucheritemid]?.productqnt) - 1;
                                                            if (!Boolean(voucheritems[voucheritemid].productqnt)) {
                                                                this.removeItem(voucheritems[voucheritemid]);
                                                            } else {
                                                                setVoucherItems(voucheritems[voucheritemid]);
                                                            }
                                                        }}>
                                                            <ProIcon name={'minus'} color={colors.secondary} size={13}/>
                                                        </TouchableOpacity>}
                                                        <Paragraph
                                                            style={[styles.paragraph, styles.caption, styles.flexGrow, styles.textCenter, {color: colors.secondary}]}>{parseInt(voucheritems[voucheritemid]?.productqnt)}</Paragraph>
                                                        {freezqnt && <TouchableOpacity onPress={() => {
                                                            voucheritems[voucheritemid].productqnt = parseInt(voucheritems[voucheritemid]?.productqnt) + 1;
                                                            setVoucherItems(voucheritems[voucheritemid]);
                                                        }}>
                                                            <ProIcon name={'plus'} color={colors.secondary} size={13}/>
                                                        </TouchableOpacity>}
                                                    </View>


                                                </View>
                                            }


                                        </View> :
                                        <Button compact={true} secondbutton={true} onPress={() => {
                                            if (item.inventorytype === 'specificidentification' && voucher.settings.scanitem) {
                                                {
                                                    if (Platform.OS === "ios") {
                                                        requestMultiple([
                                                            PERMISSIONS.IOS.CAMERA,
                                                        ]).then(statuses => {
                                                            if (statuses[PERMISSIONS.IOS.CAMERA] === 'granted') {
                                                                navigation.navigate('ScanItem', {
                                                                    validate: validate,
                                                                    editmode: editmode,
                                                                    itemid: item.itemid,
                                                                    getItemDetails: this.getItemDetails
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        navigation.navigate('ScanItem', {
                                                            validate: validate,
                                                            editmode: editmode,
                                                            itemid: item.itemid,
                                                            getItemDetails: this.getItemDetails
                                                        });
                                                    }
                                                }
                                            } else {
                                                item.productqnt = 1;
                                                this.getItemDetails(item);
                                            }
                                        }}> + Add </Button>

                                    }

                                </View>
                            </View>
                        </View>
                    </TooltipContainer>
                </Tooltip>

                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </>
        );
    };


    render() {


        const {
            filteritems, favouriteitems, searchtext, isLoading, total, addButtonVisible,
            listVisible
        }: any = this.state;

        const {navigation, voucheritems} = this.props;

        const {colors} = this.props.theme;
        const {validate, editmode}: any = this.params;


        let itemlist: any = [];

        if (Boolean(filteritems?.length)) {
            itemlist = [{title: 'Item List', data: filteritems}];
        }

        if (!Boolean(searchtext) && Boolean(favouriteitems?.length)) {
            itemlist.unshift({title: 'Frequently', data: favouriteitems})
        }

        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerTitle: 'Select Item or Service',
            headerLeft: () => <Title onPress={() => {
                if (Boolean(this.enableBackHandler)) {
                    validate();
                }
                navigation.goBack()
            }}>{backButton}</Title>,
            headerRight: (props: any) => <>
                <View style={[styles.grid, styles.middle]}>
                    <Title onPress={() => {
                        navigation.navigate('AddEditItem', {
                            screen: 'AddEditItem',
                            item: '333-333-333',
                            getItemDetails: this.getItemDetails,
                            searchtext:searchtext
                        })
                    }} style={[{paddingRight: 10}]}>
                        <Paragraph><ProIcon name={'plus'} size={18}/></Paragraph>
                    </Title>

                    {voucher.settings.scanitem &&
                        <Title onPress={() => {
                            if (Platform.OS === "ios") {
                                requestMultiple([
                                    PERMISSIONS.IOS.CAMERA,
                                ]).then(statuses => {
                                    if (statuses[PERMISSIONS.IOS.CAMERA] === 'granted') {
                                        navigation.navigate('ScanItem', {
                                            validate: validate,
                                            editmode: editmode,
                                            getItemDetails: this.getItemDetails
                                        });
                                    }
                                });
                            } else {
                                navigation.navigate('ScanItem', {
                                    validate: validate,
                                    editmode: editmode,
                                    getItemDetails: this.getItemDetails
                                });
                            }
                        }}>
                            <Paragraph><ProIcon name={'barcode-read'} size={22}/></Paragraph>
                        </Title>
                    }
                </View></>
        });

        const hasAddedItems = voucheritems && Boolean(Object.keys(voucheritems).length);


        return (
            <Container surface={true}>


                <Search autoFocus={false} placeholder={`Search...`} disabledefaultload={true} disableKeypress={true}
                        handleSearch={this.handleSearch}/>


                <View style={[styles.h_80]}>

                    {<SectionList
                        sections={itemlist}
                        keyboardShouldPersistTaps='handled'
                        keyExtractor={(item, index) => item + index}
                        renderItem={(props: any) => this.renderItem({listVisible, ...props})}
                        renderSectionHeader={({section: {title, data}}) => (
                            <Paragraph style={[styles.paragraph, styles.caption, Boolean(data.length) && styles.p_5, {
                                backgroundColor: colors.surface,
                                paddingBottom: 0,
                                marginTop: 0
                            }]}> {Boolean(data.length) && title}</Paragraph>
                        )}
                        ListEmptyComponent={<View
                            style={[styles.center, styles.middle, styles.noRecordFound]}>
                            <NoResultFound/>
                            <Paragraph
                                style={[styles.paragraph, styles.mb_5]}>No Product Or Service Found</Paragraph>
                            <Tooltip
                                message={`Add Product Or Service`}
                                stepOrder={STEPS.SELECT_OR_ADD_PRODUCT}
                                isCustomVisible={true}
                                customVisible={addButtonVisible && isVisibleTooltip(STEPS.SELECT_OR_ADD_PRODUCT)}
                            >
                                <Button
                                    secondbutton={true}
                                    onPress={() => {
                                        navigation.navigate('AddEditItem', {
                                            screen: 'AddEditItem',
                                            item: '333-333-333',
                                            getItemDetails: this.getItemDetails,
                                            searchtext:searchtext
                                        })
                                    }}>Add Product Or Service</Button>
                            </Tooltip>
                        </View>}
                        initialNumToRender={50}
                        onEndReachedThreshold={0.5}
                        onEndReached={({distanceFromEnd}) => {
                            ((Boolean(total) && Boolean(filteritems?.length <= total)) && !Boolean(searchtext)) && this.loadMore();
                        }}
                    />}

                    {hasAddedItems && <View style={{height: 70}}></View>}

                </View>


                {hasAddedItems && <BottomSheet
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
                    snapPoints={[230, '78%']}>

                    <BottomSheetScrollView style={{backgroundColor: colors.backdrop}}>
                        <View style={[styles.px_6]}>
                            <AddedItems navigation={navigation} validate={validate} editmode={editmode}/>
                        </View>
                    </BottomSheetScrollView>

                </BottomSheet>}

            </Container>

        )
    }
}


const mapStateToProps = (state: any) => ({
    items: state.appApiData.items,
    settings: state.appApiData.settings,
    voucheritems: state.appApiData.voucheritems,
    companydetails: state.appApiData.companydetails,
    walkThroughActive: state.walkthrough?.enable
})
const mapDispatchToProps = (dispatch: any) => ({
    setVoucherItems: (items: any) => dispatch(setVoucherItems(items)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(SearchItem));


