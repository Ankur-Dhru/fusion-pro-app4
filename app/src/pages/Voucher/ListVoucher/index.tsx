import React, {Component} from 'react';
import {Platform, ScrollView, TouchableOpacity, View} from 'react-native';
import {styles as theme, styles} from "../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../lib/ServerRequest";
import {Container, ProIcon} from "../../../components";
import {connect} from "react-redux";
import {Divider, Paragraph, Text, Title, withTheme} from "react-native-paper";

import {filterArray, getCurrentCompanyDetails, getType, isEmpty, log, toCurrency} from "../../../lib/functions";

import Search from "../../../components/SearchBox";


import {setLoader} from "../../../lib/Store/actions/components";
import moment from "moment";

import {backButton, backupVoucher, nav, update, voucher} from "../../../lib/setting";
import {resetVoucherItems} from "../../../lib/Store/actions/appApiData";
import {ACCESS_TYPE, assignOption, FILTERED_VOUCHER} from "../../../lib/static";
import {v4 as uuidv4} from "uuid";
import InputField from "../../../components/InputField";

import FlatListItems from "../../../components/FlatList/FlatListItems";
import {DAY_OPTIONS, getStartDateTime} from "../../../lib/dayoptions";


class ProfileView extends Component<any> {

    title: any;
    initdata: any = [];
    params: any;
    voucherlist: any = [];
    skip: any = 0;
    take: any = 1000;
    search: any = '';
    config: any;
    onEndReachedCalledDuringMomentum: any;
    isFilter: any = false;
    filterRef: any;
    staff_options: any;
    assets_type_options: any;

    constructor(props: any) {
        super(props);
        let {route: params, settings} = props;
        const {tickets, staff, assettype}: any = settings;
        this.params = params.params.item;
        this.state = {filtervoucher: [], isLoad: false};
        let filterDate = getStartDateTime(DAY_OPTIONS.LAST_7_DAY);

        this.state = {
            filtervoucher: [], isLoad: false,
            filter: {
                assettype: '',
                assignee: '',
                ...filterDate
            },
            datetitle: DAY_OPTIONS.LAST_7_DAY
        }
        this.filterRef = React.createRef();

        this.assets_type_options = [{label: 'Any', value: 'all'}]
        if (!isEmpty(assettype)) {
            let data = Object.keys(assettype).map((at: any) => assignOption(assettype[at].assettypename, at));
            this.assets_type_options = [
                ...this.assets_type_options,
                ...data
            ]
        }

        this.staff_options = [{label: 'Any', value: 'all'}, {label: 'Unassigned', value: 'unassigned'}]
        staff && Object.keys(staff).filter((key:any)=>{
            return !staff[key].support
        }).map((key: any) => {
            let staf: any = staff[key];
            this.staff_options.push({label: staf.username, value: key})
        });
    }


    componentDidMount() {
        const {navigation}: any = this.props;
        this.config = {
            paymentstatus: false,
            processstatus: false,
            deliverystatus: false,
            voucherstatus: false
        }

        ///// INVOICE
        if (voucher.type.vouchertypeid === 'b152d626-b614-4736-8572-2ebd95e24173') {
            this.config = {...this.config, paymentstatus: true}
        }
        ///// BILL
        if (voucher.type.vouchertypeid === '71e9cc99-f2d1-4b47-94ee-7aafd481e3c5') {
            this.config = {...this.config, paymentstatus: true}
        }
        ///// SALES ORDER
        else if (voucher.type.vouchertypeid === 'ec6da168-5659-4a2f-9896-6ef4c8598532') {
            this.config = {...this.config}
        }
        ///// ESTIMATE
        else if (voucher.type.vouchertypeid === 'd7310e31-acee-4cfc-aa4d-4935b150706b') {
            this.config = {...this.config, processstatus: true}
        }
        ///// DELIVERY CHALLAN
        else if (voucher.type.vouchertypeid === '6516aa72-876f-4d7e-a02f-4d0333dd855a') {
            this.config = {...this.config, deliverystatus: true}
        }
        ///// JOBSHEET
        else if (voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5') {
            this.config = {...this.config, voucherstatus: true}
        }
        this.getVouchers().then(r => {
        })
    }

    getVouchers = async (loader = true, reset = false) => {

        if (reset) {
            this.skip = 0;
            this.take = 1000;
            this.voucherlist = []
        }

        const {filter}: any = this.state;

        const {locationid}: any = getCurrentCompanyDetails();

        await requestApi({
            method: methods.get,
            action: actions.voucher,
            queryString: {
                vouchertype: voucher.type.vouchertypeid,
                voucherdisplayid: this.search,
                skip: this.skip,
                take: this.take,
                ...filter
            },
            loader: false,
            showlog: true,
            loadertype: 'list'
        }).then((result) => {
            if (result.status === SUCCESS) {

                if (getType(result.data) === 'array' && Boolean(result.data.length)) {
                    this.voucherlist = this.voucherlist.concat(result.data);
                    this.voucherlist = filterArray(this.voucherlist, ['location'], locationid);
                } else if (getType(result.data) === 'object' && Boolean(result.data.length)) {
                    this.voucherlist = [result.data];
                }
                this.setState({filtervouchers: this.voucherlist, isLoad: true})
            }
        });
    }

    onEndReached = () => {
        this.skip = this.take + 1;
        this.take = this.take + 1000;
        this.getVouchers(false).then(r => {

        })
    }

    /*handleSearch = (search:any) => {
        if(search) {
            this.search = search;
            this.setState({isLoad:false})
            this.getVouchers().then(r => {})
        }
    }*/

    handleSearch = (search: any) => {
        this.setState({
            searchtext: search,
            filtervouchers: search ? filterArray(this.voucherlist, ['voucherdisplay', 'client'], search) : this.voucherlist
        })
    }


    voucherDetail = (item: any) => {
        const {navigation, resetVoucherItems}: any = this.props;

        backupVoucher.voucher = {};
        voucher.type = item;
        resetVoucherItems()
        nav.navigation.getVouchers = this.getVouchers;
        if (item.vouchertype === "jobsheet" && Boolean(item.voucherid)) {
            update.required = false;
            navigation.navigate('EditJobsheet', {
                screen: 'EditJobsheet',
                getVouchers: this.getVouchers
            });
        } else {
            navigation.navigate('AddEditVoucher', {
                screen: 'AddEditVoucher',
                getVouchers: this.getVouchers
            });
        }


    }

    menuItemClick = (item: any) => {
        const {filter}: any = this.state;
        this.setState({filter: {...filter, assettype: item.value}, isLoad: false}, () => {
            this.getVouchers(true, true).then(r => {
            })
        })
    }
    menuItemClick2 = (item: any) => {
        const {filter}: any = this.state;
        this.setState({filter: {...filter, assignee: item.value}, isLoad: false}, () => {
            this.getVouchers(true, true).then(r => {
            })
        })
    }

    renderVoucher = ({item}: any) => {
        const {settings, theme: {colors}, ticketsList}: any = this.props;
        const dateformat: any = settings.general.dateformat;
        const brandmodel:any = Boolean(voucher.type?.listsetting?.brandmodel);
        const displayitem:any = Boolean(voucher.type?.listsetting?.displayitem);

        const {paymentstatus, processstatus, deliverystatus, voucherstatus}: any = this.config;

        let title = item.client ? item.client : item.voucherdisplay;
        let description = `${Boolean(item.client) ? item.voucherprefix + '' + item.voucherdisplayid : ''} ${moment(item.voucherdate).format(dateformat)} ${item.vouchertime}`;


        let currentTicket = ticketsList[item?.tickettypeid];
        let color = currentTicket?.ticketstatuslist[item?.voucherstatusuuid]?.ticketstatuscolor;

        const priority_icon = item.priority === 'highest' ? 'chevrons-up' : item.priority === 'high' ? 'chevron-up' : item.priority === 'low' ? 'chevron-down' : item.priority === 'lowest' ? 'chevrons-down' : 'equals';

        return (
            <TouchableOpacity onPress={() => this.voucherDetail({
                ...this.params,
                voucherdisplayid: item.voucherdisplayid,
                voucherid: item.voucherid
            })}>

                <View style={[styles.row, styles.middle, styles.px_5, styles.mt_4]}>

                    <View style={[styles.cell, styles.w_auto]}>
                        <View style={[styles.grid, styles.middle]}>
                            <Paragraph style={[styles.paragraph, styles.bold]}>
                                {title}
                            </Paragraph>
                            {voucher.type.vouchertype === "jobsheet" &&
                                <ProIcon color={theme[item.priority]?.color} name={priority_icon} size={12}/>}
                        </View>

                        {Boolean(brandmodel) && <Paragraph
                            style={[styles.description,styles.paragraph, styles.text_xs,]}>{item?.brand} {item?.model}</Paragraph>}

                        {Boolean(displayitem) && <Paragraph  style={[styles.description,styles.paragraph, styles.text_xs,]}>{item?.products}</Paragraph>}

                        {Boolean(item.convertedid) && <Paragraph style={[styles.text_xs, styles.paragraph]}>Converted
                            to {item.convertedid}</Paragraph>}
                        {Boolean(description) && <Paragraph
                            style={[styles.description,styles.paragraph, styles.text_xs,]}>{description}</Paragraph>}

                    </View>

                    <View>
                        <View><Paragraph
                            style={[{textAlign: 'right'}, styles.paragraph]}>{toCurrency(item.vouchertotaldisplay, item.currency)}</Paragraph></View>
                        <View style={[styles.grid, styles.right]}>
                            {paymentstatus && <View
                                style={[styles.badge, styles[item.voucherstatus], {
                                    padding: 0,
                                    textAlign: 'center'
                                }, styles.px_5, styles.text_xs]}><Paragraph
                                style={[styles.paragraph, {color: 'white'}]}>{item.voucherstatus}</Paragraph></View>}
                            {processstatus && <View
                                style={[styles.badge, styles.paragraph, styles[item.processstatus], {
                                    padding: 0,
                                    textAlign: 'center'
                                }, styles.px_5, styles.text_xs]}><Paragraph
                                style={[styles.paragraph, {color: 'white'}]}>{item.processstatus}</Paragraph></View>}
                            {deliverystatus && <View
                                style={[styles.badge, styles.paragraph, styles[item.deliverystatus], {
                                    padding: 0,
                                    textAlign: 'center'
                                }, styles.px_5, styles.text_xs]}><Paragraph
                                style={[styles.paragraph, {color: 'white'}]}>{item.deliverystatus}</Paragraph></View>}
                            {voucherstatus && <View
                                style={[styles.badge, styles.paragraph, {
                                    padding: 0,
                                    textAlign: 'center',
                                    backgroundColor: color
                                }, styles.px_5, styles.text_xs]}><Paragraph
                                style={[styles.paragraph, {color: 'white'}]}>{item.voucherstatus}</Paragraph></View>}
                        </View>
                    </View>

                </View>

                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>

            </TouchableOpacity>
        );
    };


    render() {


        const {filtervouchers, searchbar, isLoad, filter, filterDate, datetitle}: any = this.state;
        const {navigation, settings, theme, vouchers}: any = this.props;
        const {colors}: any = theme;
        const {staff, assettype}: any = settings;
        const dateformat: any = settings.general.dateformat;



        navigation.setOptions({
            headerTitle: voucher.type.label,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft: () => <TouchableOpacity onPress={() => navigation.goBack()}>{backButton}</TouchableOpacity>,
            headerRight: (props: any) =>
                <View style={[styles.grid]}>
                    {
                        this.params?.accessType[ACCESS_TYPE.ADD] && <Title
                            onPress={() => this.voucherDetail(this.params)}>
                            <ProIcon name={'plus'}/>
                        </Title>
                    }
                </View>,
        });



        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{voucher.type.label}</Title>,
            })
        }


        return (
            <Container surface={true}>


                <FlatListItems
                    data={filtervouchers}
                    isLoading={isLoad}
                    renderItem={this.renderVoucher}

                    handleSearch={this.handleSearch}
                    keyExt={'voucherid'}
                    ListHeaderComponent={<View style={[{backgroundColor: colors.surface}]}>
                        <View style={[styles.grid, styles.middle]}>
                            <View style={[styles.w_auto]}>
                                <Search autoFocus={false} placeholder={`Search...`}
                                        handleSearch={this.handleSearch}/>
                            </View>
                        </View>

                        {

                            <View style={[styles.px_5,styles.mb_4]} ref={this.filterRef}>
                                <ScrollView style={[styles.noWrap]} horizontal={true} contentContainerStyle={{minWidth:'100%'}}>
                                    <View style={[styles.grid, styles.middle, styles.justifyContent,styles.noWrap,styles.w_100]}>


                                    <View  style={[styles.w_auto]}>
                                        <InputField
                                            removeSpace={true}
                                            inputtype={'daterange'}
                                            render={() =>
                                                <View style={[styles.filterBox,{backgroundColor: colors.filterbox}]}>
                                                    <Text style={[styles.text_xxs,{color:colors.secondary}]}>{'Date'}</Text>
                                                    <View style={[styles.grid, styles.middle,styles.noWrap,styles.justifyContent]}>
                                                        <Text style={[colors.inputLabel,{color:colors.secondary}]}>{datetitle} </Text>
                                                        {<ProIcon name={'chevron-down'} color={colors.secondary} action_type={'text'} size={10}/>}
                                                    </View>
                                                </View>}
                                            onChange={(value: any, obj: any) => {
                                                this.setState({
                                                    filter:{
                                                        ...filter,
                                                        ...value
                                                    },
                                                    datetitle:obj.title,
                                                },()=>{
                                                    this.getVouchers(true, true).then(r => {
                                                    })
                                                })
                                            }}
                                        />
                                    </View>

                                    {voucher.type.vouchertype === "jobsheet" && <>
                                        {this.assets_type_options && <View  style={[styles.ml_2,styles.mr_2,styles.w_auto]}>

                                        <InputField
                                            removeSpace={true}
                                            label={'Asset'}
                                            divider={true}
                                            displaytype={'bottomlist'}
                                            inputtype={'bottommenu'}
                                            list={this.assets_type_options}
                                            search={false}
                                            key={uuidv4()}
                                            listtype={'other'}
                                            selectedValue={filter.assettype || 'all'}
                                            selectedLabel={"Asset Type"}
                                            onChange={(value: any) => {
                                                this.menuItemClick({value: value === "all" ? "" : value})
                                            }}
                                        />
                                    </View>}
                                        {!isEmpty(this.staff_options) && <View style={[,styles.w_auto]}>

                                                <InputField
                                                    removeSpace={true}
                                                    label={'Assignee'}
                                                    divider={true}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'bottommenu'}
                                                    list={this.staff_options}
                                                    search={false}
                                                    key={uuidv4()}
                                                    listtype={'staff'}
                                                    selectedValue={filter.assignee || 'all'}
                                                    selectedLabel={"Select Asset Type"}
                                                    onChange={(value: any) => {
                                                        this.menuItemClick2({value: value === "all" ? "" : value})
                                                    }}
                                                />

                                            </View>}
                                        </>}


                                    </View>
                                </ScrollView>
                            </View>
                        }

                    </View>}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentum) {
                            this.onEndReached   // LOAD MORE DATA
                            this.onEndReachedCalledDuringMomentum = true;
                        }
                    }}
                    onRefresh={() => {
                        this.voucherlist = [];
                        this.skip = 0;
                        this.take = 1000;
                        this.getVouchers(false)
                    }}
                />
            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({
    vouchers: state.appApiData.settings.voucher,
    settings: state.appApiData.settings,
    companydetails: state.appApiData.companydetails,
    ticketsList: state?.appApiData.settings.tickets,
})
const mapDispatchToProps = (dispatch: any) => ({
    setLoader: (loader: any) => dispatch(setLoader(loader)),
    resetVoucherItems: () => dispatch(resetVoucherItems()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ProfileView));


