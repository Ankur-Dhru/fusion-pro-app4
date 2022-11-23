import React, {Component} from 'react';
import {FlatList, Image, Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import {styles} from "../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../lib/ServerRequest";
import {Container, ProIcon} from "../../../components";
import {connect} from "react-redux";
import {Divider, Paragraph, Title, withTheme} from "react-native-paper";

import {clone, filterArray, findObject, log, objToArray, storeData} from "../../../lib/functions";

import Search from "../../../components/SearchBox";
import {setCompany, setVoucherItems, updateVoucherItems} from "../../../lib/Store/actions/appApiData";


import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";

import {backButton, voucher} from "../../../lib/setting";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import ListLoader from "../../../components/ContentLoader/ListLoader";
import AddedConsumable from "./AddedConsumable";
import withFocused from "../../../components/withFocused";


class SearchConsumableItems extends Component<any, any> {

    title: any;
    initdata: any = {items: []};
    sheetRef: any;
    scanner: any;
    itemlist: any;
    isInward: boolean = false;
    isOutward: boolean = false;
    params: any;
    favouriteitems: any;

    constructor(props: any) {
        super(props);


        this.favouriteitems = props.companydetails.companies[props.companydetails.currentuser].services[voucher.type.vouchertypeid] || [];
        const {route}: any = this.props;
        this.params = route.params;
        const {products} = route.params;

        this.state = {
            searchbar: false,
            searchtext: '',
            filteritems: this.favouriteitems,
            isLoading: true,
            products: products || []
        };
        this.isInward = voucher.data.vouchertype === "inward";
        this.isOutward = voucher.data.vouchertype === "outward";
        this.sheetRef = React.createRef();
        this.scanner = React.createRef();


    }

    handleState = (item: any) => {
        this.setState({...this.state, ...item})
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

    updateItem = (item: any) => {
        const {setVoucherItems} = this.props;
        setVoucherItems(item);
    }

    componentDidMount() {

    }


    getItemDetails = (item: any) => {

        Keyboard.dismiss()

        const {setVoucherItems, companydetails}: any = this.props;
        const {products}: any = this.state;

        requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {itemid: item.itemid},
            showlog: true
        }).then((result) => {
            if (result.status === SUCCESS) {

                let data = result.data;
                let serialNoValue = ""

                let productqntunitid;
                let {
                    itemid,
                    itemname,
                    pricing,
                    serial
                } = data;

                let rctypes = pricing.price && pricing.price.default && pricing.price.default[0] && Object.keys(pricing.price.default[0]);
                let price = 0;
                if (Boolean(rctypes)) {
                    let rctype = pricing.price.default[0][rctypes[0]];
                    if (rctype) {
                        price = rctype['baseprice'];
                    }
                }
                if (serial) {
                    serialNoValue = serial;
                }


                this._setProducts([
                    ...products,
                    {
                        item: itemid,
                        name: itemname,
                        serial: serialNoValue,
                        price
                    }
                ]);


                let found = findObject(this.favouriteitems, 'itemid', itemid);

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

    renderItem = ({item}: any) => {

        const {setVoucherItems, voucheritems, navigation} = this.props;
        const {validate, editmode}: any = this.params;
        if (!item.itemunique) {
            item.itemunique = item.itemid;
        }

        const freezqnt = !(voucher.settings.checkserialqnt && (item.inventorytype === 'specificidentification'))

        const {colors} = this.props.theme;
        return (
            <>
                <View style={[styles.px_6, {paddingTop: 10}]}>

                    <View style={[styles.row, styles.middle]}>

                        <View style={[styles.cell]}>
                            <View style={[{
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `#0000002b`,
                                borderRadius: 50
                            }]}>
                                <Paragraph>{item?.itemname?.charAt(0)}</Paragraph>
                            </View>
                        </View>

                        <View style={[styles.cell, styles.w_auto]}>
                            <Paragraph style={[styles.paragraph, styles.bold]}>{item.itemname}</Paragraph>

                        </View>

                        <View style={[styles.cell, {paddingRight: 0}]}>

                            <View>
                                <View>
                                    <View>
                                        <View>

                                            {<View style={[styles.border, styles.center, {
                                                width: 100,
                                                borderColor: colors.text,
                                                borderRadius: 5,
                                                maxHeight: 30,
                                            }]}>
                                                <TouchableOpacity onPress={() => {
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
                                                }}>
                                                    <View>
                                                        <Paragraph style={[styles.paragraph, styles.textCenter, {
                                                            paddingLeft: 5,
                                                            paddingRight: 5,
                                                            color: colors.primary
                                                        }]}>+ Add</Paragraph>
                                                    </View>
                                                </TouchableOpacity>

                                            </View>}


                                        </View>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>
                </View>
                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </>
        );
    };

    _setProducts = (products: any) => {
        this.setState({
            products
        }, () => {
            const {route}: any = this.props;
            const {setProducts} = route.params;
            const {products} = this.state;
            setProducts(products);
        })
    }


    _removeProduct = (productIndex: number) => {
        let {products} = this.state;
        products = products.filter((p: any, index: number) => productIndex !== index)
        this._setProducts(products)
    }

    render() {


        const {filteritems, searchtext, isLoading, products}: any = this.state;


        const {navigation, voucheritems} = this.props;

        const {colors} = this.props.theme;
        const {validate, editmode}: any = this.params;


        navigation.setOptions({
            headerTitle: 'Select Item or Service',
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) => <>
                <View style={[styles.grid, styles.middle]}>
                    <Title onPress={() => {
                        navigation.navigate('AddEditItem', {
                            screen: 'AddEditItem',
                            item: '333-333-333',
                            getItemDetails: this.getItemDetails
                        })
                    }} style={[{paddingRight: 10}]}>
                        <Paragraph><ProIcon name={'plus'} size={18}/></Paragraph>
                    </Title>

                    <Title onPress={() => {
                        if (Platform.OS === "ios") {
                            requestMultiple([
                                PERMISSIONS.IOS.CAMERA,
                            ]).then(statuses => {
                                if (statuses[PERMISSIONS.IOS.CAMERA] === 'granted') {
                                    navigation.navigate('ScanItemConsumable', {
                                        products,
                                        setProducts: this._setProducts,
                                        getItemDetails: this.getItemDetails
                                    });
                                }
                            });
                        } else {
                            navigation.navigate('ScanItemConsumable', {
                                products,
                                setProducts: this._setProducts,
                                getItemDetails: this.getItemDetails
                            });
                        }
                    }}>
                        <Paragraph><ProIcon name={'barcode-read'} size={22}/></Paragraph>
                    </Title>
                </View></>
        });


        return (
            <Container surface={true}>

                <Search autoFocus={false} placeholder={`Search...`} disableKeypress={true} disabledefaultload={true}
                        handleSearch={this.handleSearch}/>


                {!isLoading ? <ListLoader/> : <FlatList
                    data={filteritems}
                    scrollIndicatorInsets={{right: 1}}
                    initialNumToRender={10}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.itemid}
                    ListEmptyComponent={<View style={[styles.middle]}><Image
                        style={[{height: 150, width: 150,opacity:0.5}]}
                        source={require('../../../assets/noitems.png')}
                    /><Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph></View>}
                    onEndReachedThreshold={0.5}
                    progressViewOffset={100}
                />}


                {products && Boolean(Object.keys(products).length) && <BottomSheet
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
                            <AddedConsumable products={products} showRemove={true}   removeProduct={this._removeProduct}/>
                        </View>
                    </BottomSheetScrollView>

                </BottomSheet>}

            </Container>

        )
    }
}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    voucheritems: state.appApiData.voucheritems,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({
    setVoucherItems: (items: any) => dispatch(setVoucherItems(items)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withFocused(SearchConsumableItems)));


