import React, {Component} from 'react';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, ERROR, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {Button, Container, AppBar, ProIcon, Menu} from "../../../../components";
import {connect} from "react-redux";
import {
    Appbar, Paragraph,
    Searchbar, Title,
} from "react-native-paper";
import {
    errorAlert,
    findObject,
    getCurrentCompanyDetails,
    getIntraStateTax, getType,
    log,
    objectToArray, storeData
} from "../../../../lib/functions";

import {setCompany, setItems, setVoucherItems} from "../../../../lib/Store/actions/appApiData";

import { withTheme } from 'react-native-paper';

import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView} from "@gorhom/bottom-sheet";


import QRCodeScanner from "../../../../components/QRCodeScanner"
import AddedItems from "./AddedItems";
import {setAlert, setModal} from "../../../../lib/Store/actions/components";



import { Platform, StyleSheet } from 'react-native';
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import {options_itc} from "../../../../lib/static";
import {getProductData} from "../../../../lib/voucher_calc";
import {backButton, voucher} from "../../../../lib/setting";
import DropdownList from "../../../../components/Dropdown2/DropdownList";
import Search from "../../../../components/SearchBox";
import InputField from "../../../../components/InputField";

let Sound:any;
if(Platform.OS === 'android') {
    Sound = require('react-native-sound');
}


class ScanItem extends Component<any> {

    title:any;
    initdata:any = {items:[]};
    sheetRef:any;
    whoosh:any;
    params:any;
    isInward:any;
    isOutward:any;
    serialnolist:any=[];
    search:any ;
    favouriteitems:any;

    constructor(props:any) {
        super(props);
        const {route}:any = this.props;
        this.params = route.params;

        this.state={search:'',byitem:Boolean(this.params.itemid)}
        this.sheetRef = React.createRef();
        if(Platform.OS === 'android') {
            this.whoosh = new Sound(require('../../../../assets/beep.mp3'), Sound.MAIN_BUNDLE, (error: any) => {
                if (error) {
                    log('failed to load the sound', error);
                    return;
                }
            });
        }
        this.isInward = voucher.data.vouchertype === "inward";
        this.isOutward = voucher.data.vouchertype === "outward";

        this.favouriteitems = props.companydetails.companies[props.companydetails.currentuser].services[voucher.type.vouchertypeid] || [];

    }

    handleSearch = (search:any) => {
        this.search = search
    }

    componentDidMount() {
        const {navigation}:any = this.props;
        if(Boolean(this.params.itemid)){
            requestApi({
                method: methods.get,
                action: actions.getstock,
                queryString: {productid: this.params.itemid,qty:1},
                showlog:false,
            }).then((response: any) => {
                if (response.status === SUCCESS && response.data) {
                    let serials = response.data;
                    Object.keys(serials).map((key:any)=>{
                        let value = serials[key];
                        this.serialnolist.push({label:value.serialno,value:value.serialno});
                    })
                }
                else{
                    navigation.goBack()
                }
            })
        }
    }

    onRead = (value?:any) =>{
        Keyboard.dismiss()
        const {setVoucherItems,setAlert,navigation,voucheritems,companydetails}:any = this.props;



        if(!value){
            value = this.search
        }

        let searchnos = value;
        if(getType(value)==='array'){
            value = value.join('","').toString();
        }

        const {locationid}:any = getCurrentCompanyDetails();

        let stockcheck:any = {}
        if(voucher.settings.disableStockCheck){
            stockcheck = {vouchertype:'creditnote'}
        }

        requestApi({
            method: methods.get,
            action: actions.stock,
            queryString: {serial: `["${value}"]`,checkall:true,location:locationid,...stockcheck},
            showlog:false,
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

                        data.settings = '';
                        data.productqnt = qnt;


                        if (serialdetail.itemtaxgroupid) {
                            data.itemtaxgroupid = serialdetail.itemtaxgroupid;
                        }
                        if (serialdetail.itemhsncode) {
                            data.hsn = serialdetail.itemhsncode;
                        }

                        let serialno = serialdetail.serial;

                        if (serialno) {
                            data.itemunique = data.itemid;

                            const isAlreadyAdded = Boolean(voucheritems) && voucheritems[data.itemunique];

                            if (Boolean(isAlreadyAdded)) {
                                data.serial = isAlreadyAdded.serial || data.serial;
                                const serialadded: any = data.serial.some((number: any) => {
                                    return number === serialno
                                })
                                !serialadded && data.serial.push(serialno);
                            } else {
                                data.serial = [serialno];
                                if (data.productqnt > 1) {
                                    data.serial = searchnos
                                }
                            }
                        }

                        if (Platform.OS === 'android') {
                            this.whoosh.play();
                        }

                        let productqntunitid;
                        let {
                            itemtaxgroupid,
                            itemunit,
                            units,
                            defaultitc,
                            itemhsncode
                        } = data;
                        let producttaxgroupid;

                        if (Boolean(itemtaxgroupid)) {
                            producttaxgroupid = itemtaxgroupid;
                        }

                        if (!Boolean(itemunit)) {
                            productqntunitid = Object.keys(units)[0]
                        } else {
                            productqntunitid = itemunit;
                        }

                        let selectedITC = options_itc[0].value;
                        if (defaultitc) {
                            selectedITC = defaultitc;
                        }

                        const {defaultcurrency}: any = getCurrentCompanyDetails();


                        setVoucherItems({
                            ...data,
                            retailconfig: '',
                            serialno:data.serial,
                            productdisplayname: data.itemname,
                            inventorytype: data.inventorytype,
                            identificationtype: data.identificationtype,
                            pricing: data.pricing,
                            productid: data.itemid,
                            defaulttaxgroupid: producttaxgroupid,
                            producttaxgroupid: (this.isOutward || this.isInward) ? getIntraStateTax(producttaxgroupid, voucher.data.placeofsupply, voucher.data.taxregtype) : producttaxgroupid,
                            productqntunitid,
                            itc: selectedITC,
                            hsn: itemhsncode,
                            productqnt: data?.serial.length || 1,
                            ...getProductData(data, voucher.data.currency, defaultcurrency, undefined, undefined, false)
                        });


                        let found = findObject(this.favouriteitems, 'itemid', data.itemid);

                        if (!found[0]) {

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


                        }



                    } else {
                        errorAlert('Item out of stock');
                    }


                }
                if (Boolean(this.params.itemid)) {
                    navigation.goBack()
                }
            }
            catch(e){
                log(e)
            }
        })
    }

    onSelect = (value:any) => {
        this.onRead(value.value)
    }


    render() {

        const {navigation,voucheritems,setModal} = this.props


        const {search,byitem}:any = this.state;
        const { colors } = this.props.theme;

        const {validate,editmode}:any = this.params


        navigation.setOptions({
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
            headerRight: (props:any) =><>
                {<View style={[styles.grid,styles.middle]}>
                    {byitem &&

<>
                       <InputField
                            label={''}
                            mode={'flat'}
                            list={this.serialnolist}
                            render={()=><ProIcon  name={'list'} size={20} />}
                            displaytype={'pagelist'}
                            inputtype={'dropdown'}
                            multiselect={true}
                            listtype={'other'}
                            onChange={(value: any) => {
                                this.onRead(value)
                            }}>
                        </InputField>


                        {/*<TouchableOpacity  onPress={() => setModal({
                            visible: true,
                            component: () => <DropdownList
                                label={'Serial No.'}
                                list={this.serialnolist}
                                onSelect={this.onSelect}
                            >
                            </DropdownList>
                        })}><ProIcon  name={'list'} size={16} />
                        </TouchableOpacity>*/}

</>
                    }
                </View>}</>
        });



        return (
            <Container surface={true}>


                <View style={[styles.grid,styles.middle,{position:'absolute',zIndex:99,width:'100%',paddingRight:10,backgroundColor:colors.surface}]}>
                    <View style={[styles.w_auto]}>
                        <Search autoFocus={false} disabledefaultload={true} timeout={100}  placeholder="Serial No. / SKU" style={[{elevation:0,height:40}]}  handleSearch = {this.handleSearch}/>
                    </View>
                    <View>
                        <Button  more={{width:100}}   compact={true}  onPress={()=> this.onRead() }>Add</Button>
                    </View>
                </View>

                {/*<AppBar  back={true}  navigation={navigation}>
                    <Searchbar
                        placeholder="Serial No. / SKU"
                        onChangeText={this.handleSearch}
                        keyboardType='numeric'
                        value={search}
                        style={[{elevation:0},styles.w_auto]}
                    />
                    <View style={{width:5}}></View>
                    <Button mode={'contained'}  contentStyle={[{width:60,height:50}]}  compact={true}  onPress={()=> this.onRead() }>Add</Button>

                    {byitem && <Appbar.Action icon={()=><ProIcon name={'list'}/>} onPress={() => setModal({
                        visible: true,
                        component: () => <DropdownList
                            label={'Serial No.'}
                            list={this.serialnolist}
                            onSelect={this.onSelect}
                        >
                        </DropdownList>
                    })} />}

                </AppBar>*/}

                <>
                    <QRCodeScanner
                        onRead={this.onRead}
                    />
                </>

                {Boolean(Object.keys(voucheritems).length) &&  <BottomSheet
                    ref={this.sheetRef}
                    index={0}
                    handleComponent={() =>
                        <View style={{backgroundColor: colors.backdrop,
                            width: '100%',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            marginBottom: -1,
                            ...styles.shadow}}>
                            <View style={{alignSelf: 'center',}}>
                            <View style={[styles.bg_global,{
                                width: 40,
                                height: 5,
                                borderRadius: 5,
                                marginTop: 10,}
                            ]}></View>
                            </View>
                        </View>
                    }
                    snapPoints={[230, '78%']}>

                    <BottomSheetScrollView style={{backgroundColor:colors.backdrop}}>
                        <View style={[styles.px_6]}>
                            <AddedItems navigation={navigation} validate={validate}  editmode={editmode} />
                        </View>
                    </BottomSheetScrollView>

                </BottomSheet> }



            </Container>

        )
    }
}


const renderBackdrop = (props:any) => {
    return (
        <BottomSheetBackdrop
            {...props}
            closeOnPress={false}
        />
    );
};

const backgroundComponent = (props:any) => {
    return (
        <View style={[styles.h_100,{backgroundColor:'white'}]}>
        </View>
    );
};

const mapStateToProps = (state:any) => ({
    items: state.appApiData.items,
    voucheritems: state.appApiData.voucheritems,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch:any) => ({
    setItems: (items:any) => dispatch(setItems(items)),
    setAlert: (alert:any) => dispatch(setAlert(alert)),
    setVoucherItems: (items:any) => dispatch(setVoucherItems(items)),
    setModal: (dialog:any) => dispatch(setModal(dialog)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(ScanItem));


