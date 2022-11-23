import React, {Component} from 'react';
import {
    View,
    ScrollView,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Image,
    Platform,
    PermissionsAndroid
} from 'react-native';
import {styles} from "../../theme";

import {Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {
    Paragraph,
    List, Title, Appbar, FAB, withTheme, Text, Divider, Card
} from "react-native-paper";

import {
    filterArray,
    getThisYear, objToArray,
    toCurrency
} from "../../lib/functions";


import {setDialog, setLoader} from "../../lib/Store/actions/components";


import requestApi, {actions, jsonToQueryString, methods, SUCCESS} from "../../lib/ServerRequest";
import {apiUrl, auth, backButton, chevronRight, nav, voucher} from "../../lib/setting";
import moment from "moment";
import Search from "../../components/SearchBox";
import InputField from "../../components/InputField";
import {assignOption} from "../../lib/static";
import {v4 as uuidv4} from "uuid";
import NoResultFound from "../../components/NoResultFound";



class ClientVouchers extends Component<any> {

    title:any;
    initdata:any=[];
    voucherlist:any = [];
    sheetRef:any;
    dates:any;
    params:any;
    menuitems=[{label:'Preview',value:'preview'},{label:'Download',value:'download'},{label:'Print',value:'print'}];
    printdata:any;
    vouchersfilter:any;

    constructor(props:any) {
        super(props);
        const {route:{params}}:any = this.props;

        const defaultDateTime = getThisYear();
        this.state = {
            searchbar:false,
            searchtext:false,
            filters:[],
            isLoading:false,
            vouchertypeid:'',
            client:params.client,
            filterType:'',
            filterTitle:'This Year',
            filterDate : {
                enddate: defaultDateTime.enddate,
                startdate: defaultDateTime.startdate,
            }};
        this.sheetRef = React.createRef();

    }



    componentDidMount() {
        this.getVouchers(false);
    }


    getVouchers = (loader=true) => {

        const {filterDate:{startdate,enddate},client,vouchertypeid}:any = this.state;


        requestApi({
            method: methods.get,
            action: actions.voucher,
            queryString:{
                clientid:client.clientid,
                starttime:'12:00 AM',
                endtime:'11:59 PM',
                filter:JSON.stringify({"mainLogical":"and","filters":[{"logical":"and","filterColumns":[{"name":"date","process":"between","value":`_${startdate}_and_${enddate}_`},Boolean(vouchertypeid) && {"name":"vouchertypeid","process":"is","value":`${vouchertypeid}`}]}]}),
                skip:0,
                take:500
            },
            alert:false,
            loader:loader,
            loadertype:'list',
            showlog:true
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.voucherlist = result.data;
                this.setState({
                    searchtext: '',
                    filters: this.voucherlist,
                    isLoading:true,
                })
            }
        });
    }


    handleSearch = (search:any) => {
        this.setState({searchtext:search,filters: search ? filterArray(this.voucherlist,['voucherdisplay','voucherdate','vouchertype'],search):this.voucherlist})
    }


    voucherDetail = (item:any) => {

        if(item.vouchertypeid) {
            const {navigation, vouchers}: any = this.props;
            voucher.type = {...item, ...vouchers[item.vouchertypeid]};

            navigation.navigate('AddEditVoucher', {
                screen: 'AddEditVoucher',
            });
        }
    }


    renderItems = ({item}:any) => {

        const {settings}:any = this.props;
        const dateformat:any = settings.general.dateformat;
        const {colors}:any = this.props.theme;

        let description = `${moment(item.date).format(dateformat)} `;

        return (

            <>

            <TouchableOpacity   onPress={()=>this.voucherDetail({voucherdisplayid:item.voucherdisplayid,voucherid:item.voucherid,vouchertypeid:item.vouchertypeid})}>


                <View style={[styles.grid,styles.justifyContent,styles.middle,styles.py_4]}>

                    <View>
                        <Paragraph style={[styles.paragraph,styles.bold]}>{item.voucherdisplay}</Paragraph>
                        {Boolean(item.convertedid) && <Paragraph style={[ styles.paragraph,styles.text_xs]}>Converted to {item.convertedid}</Paragraph>}
                        <Paragraph style={[styles.description,styles.paragraph,styles.text_xs]}>{description}</Paragraph>
                    </View>

                    <View>
                        <View style={[styles.grid,styles.middle]}>

                            <View>
                                <View><Paragraph style={[{textAlign: 'right'}, styles.paragraph]}>{toCurrency(item.vouchertotaldisplay, item.currency)}</Paragraph></View>
                                <View style={[styles.grid,styles.right]}>
                                    {item.voucherstatus && <View
                                        style={[styles.badge, styles[item.voucherstatus], {
                                            padding: 0,
                                            textAlign: 'center'
                                        }, styles.px_5, styles.text_xs]}><Paragraph style={[styles.paragraph,{color:'white'}]}>{item.voucherstatus}</Paragraph></View>}
                                </View>
                            </View>

                        </View>

                    </View>

                </View>



            </TouchableOpacity>

        <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>

            </>

        );
    };





    render() {

        const {filters,isLoading,client,summary,filterType,filterTitle,vouchertypeid}:any = this.state;


        const {navigation,vouchers}:any = this.props;
        const {colors}:any = this.props.theme;

        this.vouchersfilter =  [{label: 'Any',value:''}].concat(objToArray(vouchers).map((voucher: any, key: any) => assignOption(voucher.vouchertypename, voucher.vouchertypeid)));

        navigation.setOptions({headerTitle:'Vouchers',
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Vouchers'}</Title>,
            })
        }



        return (
            <Container>

                <View>
                    <Search autoFocus={false} placeholder={`Search...`}   handleSearch = {this.handleSearch}/>

                    <View style={[styles.px_5,{backgroundColor:colors.surface}]}>

                        <View  style={[styles.grid,styles.middle,styles.justifyContent,styles.mb_4]}>


                            <View  style={[styles.mr_2,styles.w_auto]}>

                                <InputField
                                    removeSpace={true}
                                    label={'Asset'}
                                    divider={true}
                                    displaytype={'bottomlist'}
                                    inputtype={'bottommenu'}
                                    list={this.vouchersfilter}
                                    search={false}
                                    listtype={'other'}
                                    selectedValue={vouchers[vouchertypeid]?.vouchertypename}
                                    onChange={(value: any) => {
                                        this.setState({vouchertypeid:value},()=> this.getVouchers())
                                    }}
                                />
                            </View>


                            <View  style={[styles.w_auto]}>
                                <InputField
                                    removeSpace={true}
                                    inputtype={'daterange'}
                                    render={() =>
                                        <View style={[styles.filterBox,{backgroundColor: colors.filterbox}]}>
                                            <Text style={[styles.text_xxs,{color:colors.secondary}]}>{'Date'}</Text>
                                            <View style={[styles.grid, styles.middle,styles.noWrap,styles.justifyContent]}>
                                                <Text style={[colors.inputLabel,{color:colors.secondary}]}>{filterTitle} </Text>
                                                {<ProIcon name={'chevron-down'} color={colors.secondary} action_type={'text'} size={10}/>}
                                            </View>
                                        </View>}
                                    onChange={(value:any,obj:any) => {
                                        this.setState({filterDate: value,filterTitle:obj.title},()=> {this.getVouchers()});
                                    }}
                                />
                            </View>


                        </View>

                    </View>

                </View>



                <View style={[styles.pageContent]}>

                    <Card style={[styles.card,{height:550}]}>
                        <Card.Content>

                            <FlatList
                                data={filters}
                                renderItem={this.renderItems}
                                keyboardShouldPersistTaps={'handled'}
                                keyExtractor={item => item.statementid}
                                initialNumToRender = {10}

                                stickyHeaderHiddenOnScroll={true}
                                invertStickyHeaders={true}
                                progressViewOffset={100}
                                ListEmptyComponent={<View style={[styles.middle]}>
                                    <NoResultFound/>
                                    <Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph>
                                </View>}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={false}
                                        onRefresh={() => this.getVouchers(false)}
                                    />
                                }

                            />

                        </Card.Content>
                    </Card>

                </View>

            </Container>

        )
    }

}



const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
    vouchers: state.appApiData.settings.voucher,
})
const mapDispatchToProps = (dispatch:any) => ({
    setLoader: (loader:any) => dispatch(setLoader(loader)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(ClientVouchers));


