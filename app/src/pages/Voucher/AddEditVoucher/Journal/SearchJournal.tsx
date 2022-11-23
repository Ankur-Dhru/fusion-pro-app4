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
    TextInput as TI
} from "react-native-paper";

import {clone, filterArray, getCurrencySign, log, objToArray} from "../../../../lib/functions";

import Search from "../../../../components/SearchBox";
import {setItems, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";

import { withTheme } from 'react-native-paper';

import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView} from "@gorhom/bottom-sheet";

import {setLoader} from "../../../../lib/Store/actions/components";
import AddedJournal from "./AddedJournal";
import {backButton, voucher} from "../../../../lib/setting";
import InputField from "../../../../components/InputField";
import ClientDetail from "../Client/ClientDetail";
import {v4 as uuidv4} from "uuid";

class SearchJournal extends Component<any> {

    title:any;
    initdata:any = {items:[]};
    sheetRef:any;
    scanner:any;
    defaulttax:any;
    params:any;
    accountlist:any;

    constructor(props:any) {
        super(props);
        const {route } = this.props;
        this.params = route.params;
        this.accountlist = props.settings.chartofaccount;
        this.state = {searchbar:false,searchtext:'',filteritems:this.accountlist};
        this.sheetRef = React.createRef();
        this.scanner = React.createRef()


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
        updateVoucherItems(clone(items));
    }




    renderItem = ({item}:any) => {
        const {setVoucherItems,voucheritems,navigation} = this.props;
        const {productdisplayname,type,updateItem}:any = this.params
        item.itemunique = item.accountid;


        const { colors } = this.props.theme;
        return (
            <View  style={[styles.px_6]}>
                <View>

                <View  style={[styles.mb_5]}>
                    <TouchableOpacity  onPress={()=> {
                        navigation.navigate('EditJournal', {
                            item:item,
                            productdisplayname:productdisplayname
                        })

                    }}>

                        <View style={[styles.grid,styles.justifyContent,styles.middle]}>
                            <Paragraph>
                                {item.accountname}
                            </Paragraph>
                            <Paragraph style={[styles.paragraph,styles.textCenter, {paddingLeft:5,paddingRight:5, color: colors.primary}]}>{`+ Add ${type}`}</Paragraph>
                        </View>

                    </TouchableOpacity>
                </View>

                    {/*<View style={[styles.mb_5]}>
                        {voucheritems[item.itemunique] ?
                            <View style={[styles.bg_global,styles.px_5,styles.py_2,{borderRadius:5}]}>

                                <Paragraph style={[styles.paragraph,styles.textRight,styles.red,styles.absolute,{right:0,zIndex:99}]} onPress={()=>{
                                    this.removeItem(item)
                                }}><ProIcon name={'circle-xmark'} /></Paragraph>

                                <InputBox
                                    value={item.productratedisplay}
                                    label={`${type} Amount ${type==='Debit'?'from':'to'} ${item.accountname}`}
                                    autoFocus={true}
                                    keyboardType='numeric'
                                    left={<TI.Affix text={getCurrencySign()} />}
                                    onChange={(value:any)=>{ item.productratedisplay = item.productrate = value; this.updateItem(item) }}
                                />
                                <View style={[styles.grid,styles.middle,styles.justifyContent,styles.mt_4]}>
                                    <View style={[{width:'100%'}]}>

                                        <ClientDetail  selectClient={(client:any)=>{
                                            item.clientid = client.clientid;
                                            item.clientname = client.displayname
                                        }}  item={item}  foritem={true}  editmode={true}  navigation={navigation}/>

                                    </View>
                                </View></View>:
                            <TouchableOpacity  onPress={()=> {
                                item.productqnt = 1;
                                item.voucherrelatedid = 2;
                                item.productdisplayname= productdisplayname;
                                setVoucherItems(item);
                            }}>

                                <View style={[styles.grid,styles.justifyContent,styles.middle]}>
                                    <Paragraph>
                                        {item.accountname}
                                    </Paragraph>
                                    <Paragraph style={[styles.paragraph,styles.textCenter, {paddingLeft:5,paddingRight:5, color: colors.primary}]}>{`+ Add ${type}`}</Paragraph>
                                </View>

                            </TouchableOpacity>
                        }
                    </View>*/}

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
            <Container>

                <View style={[]}>
                    <Search autoFocus={false} placeholder={`Search...`}    handleSearch = {this.handleSearch}/>
                </View>

                <View style={[styles.mt_4]}>

                    <FlatList
                        data={filteritems}
                        scrollIndicatorInsets={{ right: 1 }}
                        initialNumToRender = {10}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.accountid}
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
                            <AddedJournal navigation={navigation} type={'dr'} validate={validate}  disableButton={true}  editmode={editmode}/>
                            <AddedJournal navigation={navigation} type={'cr'}  validate={validate}  editmode={editmode}/>
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

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(SearchJournal));


