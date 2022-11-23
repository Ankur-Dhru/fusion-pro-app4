import React, {Component} from 'react';
import {FlatList, Platform, RefreshControl, ScrollView, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Container, Menu, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Card, Divider, Paragraph, Text, Title, withTheme} from "react-native-paper";

import {downloadFile, filterArray, getThisYear, objToArray, toCurrency} from "../../lib/functions";

import Search from "../../components/SearchBox";


import {setLoader} from "../../lib/Store/actions/components";


import requestApi, {actions, jsonToQueryString, methods, SUCCESS} from "../../lib/ServerRequest";
import {apiUrl, backButton, chevronRight, current, voucher} from "../../lib/setting";
import moment from "moment";
import InputField from "../../components/InputField";
import {assignOption} from "../../lib/static";
import NoResultFound from "../../components/NoResultFound";


class ListStatement extends Component<any> {

    title: any;
    initdata: any = [];
    statementlist: any = [];
    sheetRef: any;
    dates: any;
    params: any;
    menuitems = [{label: 'Preview', value: 'preview'}, {label: 'Download', value: 'download'}, {
        label: 'Print',
        value: 'print'
    }];
    printdata: any;
    vouchersfilter: any;

    constructor(props: any) {
        super(props);
        const {route: {params}}: any = this.props;

        const defaultDateTime = getThisYear();
        this.state = {
            searchbar: false,
            searchtext: false,
            filters: [],
            isLoading: false,
            summary: {
                dueamount: '0',
                invoiceamount: '0',
                openingbalance: '0',
                paidamount: '0'
            },
            client: params.client,
            filterType: '',
            filterTitle: 'This Year',
            vouchertypeid: '',
            filterDate: {
                enddate: defaultDateTime.enddate,
                startdate: defaultDateTime.startdate,
            }
        };
        this.sheetRef = React.createRef();

    }

    componentDidMount() {
        this.getStatement(false);
    }


    getStatement = (loader = true) => {

        const {filterDate: {startdate, enddate}, client, filterType, vouchertypeid}: any = this.state;

        requestApi({
            method: methods.get,
            action: actions.ledger,
            queryString: {
                clientid: client.clientid,
                starttime: '12:00 AM',
                endtime: '11:59 PM',
                type: filterType,
                filter: JSON.stringify({
                    "mainLogical": "and",
                    "filters": [{
                        "logical": "and",
                        "filterColumns": [{
                            "name": "date",
                            "process": "between",
                            "value": `_${startdate}_and_${enddate}_`
                        }, Boolean(vouchertypeid) && {
                            "name": "vouchertypeid",
                            "process": "is",
                            "value": `${vouchertypeid}`
                        }]
                    }]
                }),
                skip: 0,
                take: 500
            },
            alert: false,
            loader: loader,
            loadertype: 'list',
            showlog: true
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.statementlist = result.data;
                this.printdata = result.info.printdata;
                this.setState({
                    searchtext: '',
                    filters: this.statementlist,
                    isLoading: true,
                    summary: result.info.extra.summary
                })
            }
        });
    }


    handleSearch = (search: any) => {
        this.setState({
            searchtext: search,
            filters: search ? filterArray(this.statementlist, ['description', 'relid'], search) : this.statementlist
        })
    }


    clientSelection = (statement: any) => {
        const {navigation}: any = this.props;
        navigation.navigate('AddEditAccount', {
            screen: 'AddEditAccount',
            statement: {...statement},
            getStatement: this.getStatement
        });
    }


    voucherDetail = (item: any) => {

        if (item.vouchertypeid) {
            const {navigation, vouchers}: any = this.props;
            voucher.type = {...item, ...vouchers[item.vouchertypeid]};

            navigation.navigate('AddEditVoucher', {
                screen: 'AddEditVoucher',
            });
        }
    }


    renderItems = ({item}: any) => {

        const {settings}: any = this.props;
        const dateformat: any = settings.general.dateformat;
        const {colors}: any = this.props.theme;

        let description = `${moment(item.date).format(dateformat)}  ${item.relid}`;

        return (

            <>

                <TouchableOpacity onPress={() => this.voucherDetail({
                    voucherdisplayid: item.voucherdisplayid,
                    voucherid: item.voucherid,
                    vouchertypeid: item.vouchertypeid
                })}>


                    <View style={[styles.grid, styles.justifyContent, styles.middle, styles.py_4]}>

                        <View>
                            <Paragraph style={[styles.paragraph, styles.bold,]}>{item.description}</Paragraph>
                            <Paragraph
                                style={[styles.description, styles.paragraph, styles.text_xs]}>{description}</Paragraph>
                        </View>

                        <View>
                            <View style={[styles.grid, styles.middle]}>
                                <View>
                                    {Boolean(item.dr) && <Paragraph style={[{
                                        textAlign: 'right',
                                        color: styles.red.color
                                    }, styles.paragraph]}>{toCurrency(item.dr)} DR</Paragraph>}
                                    {Boolean(item.cr) && <Paragraph style={[{
                                        textAlign: 'right',
                                        color: styles.green.color
                                    }, styles.paragraph]}>{toCurrency(item.cr)} CR</Paragraph>}
                                </View>
                                <View>
                                    {chevronRight}
                                </View>
                            </View>

                        </View>

                    </View>


                </TouchableOpacity>

                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>

            </>

        );
    };


    downloadPDF = async () => {

        const {filterDate: {startdate, enddate}, client, filterType}: any = this.state;
        const {setLoader}: any = this.props
        setLoader({show: true})
        let url = apiUrl(current.company) + actions.ledger;
        url += jsonToQueryString({
            clientid: client.clientid,
            type: filterType,
            download: 1,
            /*filter: {"mainLogical":"and","filters":[{"logical":"and","filterColumns":[{"name":"date","process":"between","value":`_${startdate}_and_${enddate}_`}]}]},*/
            skip: 0,
            take: 500
        });

        await downloadFile({url: url, filename: `Statement_${client.clientid}`})

    }


    getPrintingData = (options?: any) => {
        const {navigation} = this.props;
        const {client}: any = this.state;

        navigation.navigate('Print', {
            data: this.printdata,
            downloadPDF: this.downloadPDF,
            filename: `Statement_${client.clientid}`,
            navigation: navigation,
            ...options
        });
    }


    clickMenu = (menu: any) => {

        if (menu.value === 'preview') {
            this.getPrintingData({menu: true})
        } else if (menu.value === 'print') {
            this.getPrintingData({menu: true, autoprint: true,})
        } else if (menu.value === 'download') {
            this.downloadPDF().then(r => {
            });
        }

    }


    render() {

        const {filters, isLoading, client, summary, filterType, filterTitle, vouchertypeid}: any = this.state;


        const {navigation, vouchers}: any = this.props;

        this.vouchersfilter = [{
            label: 'Any',
            value: ''
        }].concat(objToArray(vouchers).map((voucher: any, key: any) => assignOption(voucher.vouchertypename, voucher.vouchertypeid)));

        const {colors}: any = this.props.theme;

        navigation.setOptions({
            headerTitle: client.displayname,
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) => <Menu menulist={this.menuitems}
                                               onPress={(value: any) => this.clickMenu(value)}>
                <ProIcon name={'ellipsis-vertical'} align={'right'}/>
            </Menu>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{client.displayname}</Title>,
            })
        }


        return (
            <Container>
                <View>
                    <Search autoFocus={false} placeholder={`Search...`} handleSearch={this.handleSearch}/>

                    <View style={[styles.px_5, {backgroundColor: colors.surface}]}>

                        <ScrollView style={[styles.noWrap]} horizontal={true}
                                    contentContainerStyle={{minWidth: '100%'}}>
                            <View
                                style={[styles.grid, styles.middle, styles.justifyContent, styles.noWrap, styles.w_100, styles.mb_4]}>

                                <View style={[styles.w_auto]}>
                                    <InputField
                                        removeSpace={true}
                                        label={'Status'}
                                        divider={false}
                                        displaytype={'bottomlist'}
                                        inputtype={'bottommenu'}
                                        list={[{value: '', label: 'All Statement'}, {
                                            value: 'outstanding',
                                            label: 'Outstanding'
                                        }]}
                                        search={false}
                                        listtype={'other'}
                                        selectedValue={filterType || ''}
                                        onChange={(value: any) => {
                                            this.setState({filterType: value}, () => this.getStatement())
                                        }}
                                    />
                                </View>


                                <View style={[styles.ml_2, styles.mr_2, styles.w_auto]}>
                                    <InputField
                                        removeSpace={true}
                                        label={'Type'}
                                        divider={false}
                                        displaytype={'bottomlist'}
                                        inputtype={'bottommenu'}
                                        list={this.vouchersfilter}
                                        search={false}
                                        listtype={'other'}
                                        selectedValue={vouchers[vouchertypeid]?.vouchertypename || ''}

                                        onChange={(value: any) => {
                                            this.setState({vouchertypeid: value}, () => this.getStatement())
                                        }}
                                    />
                                </View>


                                <View style={[styles.w_auto]}>
                                    <InputField
                                        removeSpace={true}
                                        inputtype={'daterange'}
                                        render={() =>
                                            <View style={[styles.filterBox, {backgroundColor: colors.filterbox}]}>
                                                <Text
                                                    style={[styles.text_xxs, {color: colors.secondary}]}>{'Date'}</Text>
                                                <View
                                                    style={[styles.grid, styles.middle, styles.noWrap, styles.justifyContent]}>
                                                    <Text
                                                        style={[colors.inputLabel, {color: colors.secondary}]}>{filterTitle} </Text>
                                                    {<ProIcon name={'chevron-down'} color={colors.secondary}
                                                              action_type={'text'} size={10}/>}
                                                </View>
                                            </View>}
                                        onChange={(value: any, obj: any) => {
                                            this.setState({filterDate: value, filterTitle: obj.title}, () => {
                                                this.getStatement()
                                            });
                                        }}
                                    />
                                </View>


                            </View>
                        </ScrollView>

                    </View>

                </View>
                <View style={[styles.pageContent]}>
                    <Card style={[styles.card, styles.h_statement]}>
                        <Card.Content>


                            <FlatList
                                data={filters}
                                renderItem={this.renderItems}
                                keyboardShouldPersistTaps={'handled'}
                                keyExtractor={item => item.statementid}
                                initialNumToRender={10}

                                stickyHeaderHiddenOnScroll={true}
                                invertStickyHeaders={false}
                                progressViewOffset={100}
                                ListEmptyComponent={<View style={[styles.middle]}>
                                    <NoResultFound/>
                                    <Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph>
                                </View>}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={false}
                                        onRefresh={() => this.getStatement(false)}
                                    />
                                }

                            />

                        </Card.Content>
                    </Card>
                    <Card style={[styles.card]}>
                        <Card.Content style={{paddingBottom: 0}}>
                            <View style={[styles.py_5]}>


                                <View style={[styles.grid, styles.middle, styles.justifyContent, styles.mb_3]}>
                                    <Text>Opening Balance </Text>
                                    <Text>{toCurrency(summary.openingbalance || '0')}</Text>
                                </View>

                                <View style={[styles.grid, styles.middle, styles.justifyContent, styles.mb_3]}>
                                    <Text>Amount Received </Text>
                                    <Text style={[styles.green]}>{toCurrency(summary.invoiceamount || '0')}</Text>
                                </View>


                                <View style={[styles.grid, styles.middle, styles.justifyContent, styles.mb_3]}>
                                    <Text>{client.clienttype === '0' ? 'Invoice' : 'Bill'} </Text>
                                    <Text>{toCurrency(summary.paidamount || '0')}</Text>
                                </View>


                                <View style={[styles.grid, styles.middle, styles.justifyContent, styles.mb_3]}>
                                    <Text>Balance Due </Text>
                                    <Text style={[styles.red]}>{toCurrency(summary.dueamount || '0')}</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </Container>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    vouchers: state.appApiData.settings.voucher,
})
const mapDispatchToProps = (dispatch: any) => ({
    setLoader: (loader: any) => dispatch(setLoader(loader)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ListStatement));


