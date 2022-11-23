import React, {Component, useCallback} from 'react';
import {View, Text, ScrollView, FlatList, TouchableOpacity, Platform, Image} from 'react-native';
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

import {
    clone,
    currencyRate,
    filterArray,
    getCurrencySign,
    getDefaultCurrency,
    log,
    objToArray
} from "../../../../lib/functions";

import Search from "../../../../components/SearchBox";
import {setItems, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";

import { withTheme } from 'react-native-paper';

import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView} from "@gorhom/bottom-sheet";

import {setLoader} from "../../../../lib/Store/actions/components";
import AddedExpense from "./AddedExpense";
import {Field} from "react-final-form";
import Dropdown from "../../../../components/Dropdown";
import {backButton, voucher} from "../../../../lib/setting";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import AddedItems from "../Items/AddedItems";
import InputField from "../../../../components/InputField";
import Avatar from "../../../../components/Avatar";

class SearchExpense extends Component<any> {

    title:any;
    initdata:any = {items:[]};
    sheetRef:any;
    scanner:any;
    defaulttax:any;
    params:any;
    accountlist:any;

    constructor(props:any) {
        super(props);
        this.accountlist = props.settings.chartofaccount;
        this.state = {searchbar:false,searchtext:'',filteritems:this.accountlist};
        this.sheetRef = React.createRef();
        this.scanner = React.createRef()
        const {route}:any = this.props;
        this.params = route.params;
    }

    handleState = (item:any) => {
        this.setState({...this.state,...item})
    }

    handleSearch = (search:any) => {
        this.setState({searchtext:search,filteritems: search ? filterArray(this.accountlist,['accountname'],search):this.accountlist})
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

    updateItem = (item:any) =>{
        const {setVoucherItems} = this.props;
        setVoucherItems(item);
    }

    componentDidMount() {
        const {settings}:any = this.props;

        Object.keys(settings?.tax).map((key:any)=>{
            settings?.tax[key]?.taxes?.map((value:any,key2:any)=>{
                if(settings.tax[key].taxes[key2].taxpercentage === "0"){
                    this.defaulttax = key;
                }
            })
        });
    }

    renderItem = ({item}:any) => {
        const {setVoucherItems,voucheritems} = this.props;
        item.itemunique = item.accountid;

        let companyCurreny = getDefaultCurrency();


        const { colors } = this.props.theme;
        return (


            <View>
                <View>

                    <View>
                        {voucheritems[item.itemunique] ?
                            <View style={[styles.p_5,styles.bg_global,{borderRadius:5,marginHorizontal:10,marginTop:12}]}>

                                <Paragraph style={[styles.paragraph,styles.textRight,styles.red,styles.absolute,{right:0,zIndex:99}]} onPress={()=>{
                                    this.removeItem(item)
                                }}><ProIcon name={'circle-xmark'} /></Paragraph>

                                <InputBox
                                    value={item.productratedisplay}
                                    label={`${item.accountname} Amount`}
                                    autoFocus={true}
                                    keyboardType='numeric'
                                    left={<TI.Affix text={getCurrencySign()} />}
                                    onChange={(value:any)=>{ item.productrate = (1/ currencyRate(voucher.data.currency)) * value;  item.productratedisplay=   value; log('item.productrate',item.productrate);  this.updateItem(item) }}
                                />

                            <View style={[styles.grid,styles.middle,styles.justifyContent,styles.mt_4]}>
                                <View style={[{width:'40%'}]}>


                                    <InputField
                                        label={'Expense Type'}
                                        divider={false}
                                        displaytype={'bottomlist'}
                                        inputtype={'dropdown'}
                                        list={[{value:'services',label:'Services'},{value:'goods',label:'Goods'}]}
                                        search={false}
                                        listtype={'other'}
                                        selectedValue={item.itemtype || 'services'}
                                        onChange={(value: any) => {
                                            item.itemtype=value;
                                            this.updateItem(item)
                                        }}
                                    />

                                </View>


                                <View style={[{width:'40%'}]}>

                                    <InputField
                                        value={item.hsn}
                                        label={`${item.itemtype === 'services'?'SAC':'HSN Code'}`}
                                        inputtype={'textbox'}
                                        keyboardType='numeric'
                                        autoFocus={false}
                                        onChange={(value: any) => {
                                            item.hsn=value;
                                            this.updateItem(item)
                                        }}
                                    />

                                </View>
                            </View></View>:
                            <>


                                <View  style={[styles.grid,styles.middle,styles.p_5]}>
                                    <Avatar label={item?.accountname} value={item.accountid} size={35}/>
                                    <Paragraph style={[styles.paragraph,styles.ml_2]}>
                                        {item.accountname}
                                    </Paragraph>
                                    <View style={[styles.ml_auto,{width:100}]}>
                                        <Button compact={true} secondbutton={true}  onPress={()=> {
                                            item.productqnt = 1
                                            item.itemtype='goods'
                                            item.itc='eligible'
                                            item.producttaxgroupid = this.defaulttax;
                                            setVoucherItems(item);
                                        }}>
                                            + Add
                                        </Button>
                                    </View>
                                </View>

                            <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                            </>
                        }
                    </View>

                </View>
            </View>
        );
    };



    render() {

        const {filteritems,searchtext}:any = this.state;

        const {navigation,voucheritems} = this.props;
        const {validate,editmode}:any = this.params;
        const { colors } = this.props.theme;


        navigation.setOptions({
            headerTitle:'Select Account',
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });


        return (
            <Container surface={true}>

                <View style={[]}>
                <Search autoFocus={false} placeholder={`Search...`}    handleSearch = {this.handleSearch}/>
                </View>

                <View   style={[styles.h_80]}>

                    <FlatList
                        data={filteritems}
                        scrollIndicatorInsets={{ right: 1 }}
                        initialNumToRender = {10}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.itemid}
                        ListEmptyComponent={<View style={[styles.middle]}><Image
                            style={[{height:150,width:150,opacity:0.5}]}
                            source={require('../../../../assets/noitems.png')}
                        /><Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph></View>}
                        onEndReachedThreshold={0.5}
                        progressViewOffset={100}
                    />



                </View>


                {voucheritems && Boolean(Object.keys(voucheritems).length) &&  <BottomSheet
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
                            <AddedExpense navigation={navigation} validate={validate} editmode={editmode}/>
                        </View>
                    </BottomSheetScrollView>

                </BottomSheet>}


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
        <View style={[{backgroundColor:'#f4f4f4'}]}></View>
    );
};

const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
    voucheritems:state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch:any) => ({
    setItems: (items:any) => dispatch(setItems(items)),
    setVoucherItems: (items:any) => dispatch(setVoucherItems(items)),
    setLoader: (loader:any) => dispatch(setLoader(loader)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(SearchExpense));


