import React, {Component} from 'react';
import {Keyboard, Platform, View} from 'react-native';
import {styles} from "../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../lib/ServerRequest";
import {Button, Container, ProIcon} from "../../../components";
import {connect} from "react-redux";
import {Title, withTheme,} from "react-native-paper";
import {errorAlert, getCurrentCompanyDetails, getType, log} from "../../../lib/functions";

import {setItems, setVoucherItems} from "../../../lib/Store/actions/appApiData";

import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView} from "@gorhom/bottom-sheet";


import QRCodeScanner from "../../../components/QRCodeScanner"
import {setAlert, setModal} from "../../../lib/Store/actions/components";
import {backButton, voucher} from "../../../lib/setting";
import Search from "../../../components/SearchBox";
import InputField from "../../../components/InputField";
import AddedConsumable from "./AddedConsumable";

let Sound: any;
if (Platform.OS === 'android') {
    Sound = require('react-native-sound');
}


class ScanItemConsumable extends Component<any, any> {

    title: any;
    initdata: any = {items: []};
    sheetRef: any;
    whoosh: any;
    params: any;
    isInward: any;
    isOutward: any;
    serialnolist: any = [];
    search: any;

    constructor(props: any) {
        super(props);
        const {route}: any = this.props;
        this.params = route.params;

        const {products} = route.params;

        this.state = {search: '', byitem: Boolean(this.params.itemid), products: products || []}
        this.sheetRef = React.createRef();
        if (Platform.OS === 'android') {
            this.whoosh = new Sound(require('../../../assets/beep.mp3'), Sound.MAIN_BUNDLE, (error: any) => {
                if (error) {
                    log('failed to load the sound', error);
                    return;
                }
            });
        }
        this.isInward = voucher.data.vouchertype === "inward";
        this.isOutward = voucher.data.vouchertype === "outward";

    }

    handleSearch = (search: any) => {
        this.search = search
    }

    componentDidMount() {
        const {navigation}: any = this.props;

        if (Boolean(this.params.itemid)) {
            requestApi({
                method: methods.get,
                action: actions.getstock,
                queryString: {productid: this.params.itemid, qty: 1},
                showlog: false,
            }).then((response: any) => {
                if (response.status === SUCCESS && response.data) {
                    let serials = response.data;
                    Object.keys(serials).map((key: any) => {
                        let value = serials[key];
                        this.serialnolist.push({label: value.serialno, value: value.serialno});
                    })
                } else {
                    navigation.goBack()
                }
            })
        }
    }

    onRead = (value?: any) => {
        Keyboard.dismiss()
        const {setVoucherItems, setAlert, navigation, route, voucheritems}: any = this.props;

        const {products} = this.state;
        if (!value) {
            value = this.search
        }

        let searchnos = value;
        if (getType(value) === 'array') {
            value = value.join('","').toString();
        }

        const {locationid}: any = getCurrentCompanyDetails();

        requestApi({
            method: methods.get,
            action: actions.stock,
            queryString: {serial: `["${value}"]`, checkall: true, location: locationid},
            showlog: false,
        }).then((response: any) => {

            try {

                if (response.status === SUCCESS && response.data) {

                    let qnt: any = 1;
                    let serial = searchnos;

                    if (searchnos.length > 1 && getType(searchnos) === 'array') {
                        qnt = searchnos.length
                        serial = searchnos[0]
                    }

                    const serialdetail = response.data[serial];

                    if (serialdetail?.stock > 0) {
                        let data = serialdetail.itemdata;

                        if (Platform.OS === 'android') {
                            this.whoosh.play();
                        }

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
                        let serialNoValue = ""
                        if (serial) {
                            serialNoValue = serial;
                        }


                        this.setState({
                            products: [
                                ...products,
                                {
                                    item: itemid,
                                    name: itemname,
                                    serial: searchnos,
                                    price
                                }
                            ]
                        }, () => {
                            this._setProducts(this.state.products)
                        })

                    } else {
                        errorAlert('Item out of stock');
                    }


                }
                if (Boolean(this.params.itemid)) {
                    navigation.goBack()
                }
            } catch (e) {
                log(e)
            }
        })
    }

    onSelect = (value: any) => {
        this.onRead(value.value)
    }

    _setProducts = (products: any) => {
        const {route}: any = this.props;
        const {setProducts} = route.params;
        setProducts(products)
    }

    _removeProduct = (productIndex: number) => {
        let {products} = this.state;
        products = products.filter((p: any, index: number) => productIndex !== index);
        this.setState({products}, () => {
            this._setProducts(products)
        })
    }


    render() {

        const {navigation, voucheritems, setModal} = this.props


        const {search, byitem, products}: any = this.state;
        const {colors} = this.props.theme;

        const {validate, editmode}: any = this.params


        navigation.setOptions({
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) => <>
                {<View style={[styles.grid, styles.middle]}>
                    {byitem &&

                        <>
                            <InputField
                                label={''}
                                mode={'flat'}
                                list={this.serialnolist}
                                render={() => <ProIcon name={'list'} size={16}/>}
                                displaytype={'pagelist'}
                                inputtype={'dropdown'}
                                multiselect={true}
                                listtype={'other'}
                                onChange={(value: any) => {
                                    this.onRead(value)
                                }}>
                            </InputField>

                        </>
                    }
                </View>}</>
        });


        return (
            <Container>


                <View style={[styles.grid, styles.middle, styles.py_5, {
                    position: 'absolute',
                    zIndex: 99,
                    width: '100%',
                    paddingRight: 10,
                    backgroundColor: colors.surface
                }]}>
                    <View style={[styles.w_auto]}>
                        <Search autoFocus={true} disabledefaultload={true} timeout={100} placeholder="Serial No. / SKU"
                                style={[{elevation: 0, height: 40}]}
                                handleSearch={this.handleSearch}/>
                    </View>
                    <View>
                        <Button more={{width: 100, height: 40}} secondbutton={true} compact={true}
                                onPress={() => this.onRead()}>Add</Button>
                    </View>
                </View>


                <>
                    <QRCodeScanner
                        onRead={this.onRead}
                    />
                </>

                {Boolean(Object.keys(voucheritems).length) && <BottomSheet
                    ref={this.sheetRef}
                    index={0}
                    handleComponent={() =>
                        <View style={{
                            backgroundColor: colors.backdrop,
                            width: '100%',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            marginBottom: -1,
                            ...styles.shadow
                        }}>
                            <View style={{alignSelf: 'center',}}>
                                <View style={[styles.bg_global, {
                                    width: 40,
                                    height: 5,
                                    borderRadius: 5,
                                    marginTop: 10,
                                }
                                ]}></View>
                            </View>
                        </View>
                    }
                    snapPoints={[100, '78%']}>

                    <BottomSheetScrollView style={{backgroundColor: colors.backdrop}}>
                        <View style={[styles.px_6]}>
                            <AddedConsumable products={products} showRemove={true} removeProduct={this._removeProduct}/>
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
        <View style={[styles.h_100, {backgroundColor: 'white'}]}>
        </View>
    );
};

const mapStateToProps = (state: any) => ({
    items: state.appApiData.items,
    voucheritems: state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch: any) => ({
    setItems: (items: any) => dispatch(setItems(items)),
    setAlert: (alert: any) => dispatch(setAlert(alert)),
    setVoucherItems: (items: any) => dispatch(setVoucherItems(items)),
    setModal: (dialog: any) => dispatch(setModal(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ScanItemConsumable));


