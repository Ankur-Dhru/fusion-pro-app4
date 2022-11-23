import React, {Component} from "react";
import {FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {setDialog} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Container} from "../../components";
import {Caption, Card, IconButton, Paragraph, Title, withTheme} from "react-native-paper";

import {
    clone,
    getRoleModuleAccess, getVisibleNav, log,
    nFormatter,
    objToArray,
    PERMISSION_NAME,
    retrieveData,
    setSpotLight,
    storeData,
    toCurrency
} from "../../lib/functions";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
//import BottomSheet from "reanimated-bottom-sheet";
//import BottomSheet from 'react-native-bottomsheet-reanimated';
// @ts-ignore
import _ from "lodash";

import MCIcon from "react-native-vector-icons/MaterialCommunityIcons"
import {setCompany, updateVoucherItems} from "../../lib/Store/actions/appApiData";
import {current, spotlight, voucher} from "../../lib/setting";
import {globalVar, vouchers} from "../../lib/static";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {sliderWidth} from "../BeforeLogin/GettingStarted";


import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryGroup,
    VictoryLine,
    VictoryPie,
    VictoryScatter,
    VictoryStack,
    VictoryTheme,
    VictoryTooltip
} from "victory-native";
import {DAY_OPTIONS, getStartDateTime} from "../../lib/dayoptions";
import InputField from "../../components/InputField";
import ProIcon from "../../components/ProIcon";
import {Divider} from "react-native-elements/dist/divider/Divider";
import ListLoader from "../../components/ContentLoader/ListLoader";
import HeaderLocation from "../../components/HeaderLocation";
import {store} from "../../App";
import {setActiveStep} from "../../lib/Store/actions/walkthrough";
import GuideOptions from "../ClientArea/GuideOptions";

class Index extends Component<any, any> {

    sheetRef: any;
    filter: any;
    frequntVouchers: any = {};
    _carousel: any;
    oldCompany: any;
    vouchersmenufilter:any;

    constructor(props: any) {
        super(props);
        this.state = {
            visible: false,
            searchbar: false,
            sort: false,
            activeSlide: 0,
            activeSlide2:0,
            refreshing: false,
            filterTitle: 'Today',
            filterDate: getStartDateTime(),
            showBottomSheet: false,
            isLoading: false,
            spotlight: spotlight.one
        };

        spotlight.one = false;
        setSpotLight(spotlight);
        this.sheetRef = React.createRef();
    }

    handleState = (item: any) => {
        this.setState({...this.state, ...item})
    }

    handleSearch = (search: any) => {

        this.forceUpdate()
    }

    componentDidMount() {
        this.oldCompany = this.props?.companydetails?.current;
        retrieveData('fusion-pro-app').then((data: any) => {
            this.frequntVouchers = data.companies[data.currentuser]['vouchers'] || {};
            this.getDashboard();
            //this.forceUpdate()
        });
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        if (Boolean(this.oldCompany !== nextProps?.companydetails?.current)) {
            this.oldCompany = nextProps?.companydetails?.current;
            this.getDashboard()
        }
    }

    getDashboard = () => {
        const {filterDate, refreshing} = this.state;
        const {colors}: any = this.props.theme
        let queryString = filterDate;
        requestApi({
            method: methods.get,
            action: actions.dashboard,
            queryString,
            companyname: current.company,
            showlog: false,
            loader: false,
            /*loader: !refreshing*/
        }).then((response: any) => {
            if (response?.status === SUCCESS) {

                let {
                    totalincome,
                    totalexpense,
                    receivable,
                    payable,
                    cashflow,
                    cashflow_flag,
                    cashflow_amount,
                    topexpense_flag,
                    incomeexpense,
                    topexpense,
                    graph,
                    onholdjob,
                    openjob,
                    overduejob,
                    partwaitingjob,
                    pendingoutsourcing,
                    unassignedjob,
                    assigneegraphnew
                } = response?.data;

                let receivableData = {}, payableData = {}, cashFlowData = {}, incomeExpenseData = {},
                    topExpensesData = {};

                if (receivable) {

                    receivableData = {
                        title: "Total Receivable",
                        type: "horizontal_bar",
                        graph: Boolean(receivable.totalreceivable > 0),
                        receivable,
                        barData: [
                            [{x: "receivable", y: parseFloat(receivable?.totalreceivable)}],
                            [{x: "receivable", y: parseFloat(receivable?.overduereceivable)}]
                        ]
                    }
                }



                if (payable) {
                    payableData = {
                        title: "Total Payable",
                        type: "horizontal_bar",
                        graph: Boolean(payable.totalpayable > 0),
                        payable,
                        barData: [
                            [{x: "payable", y: parseFloat(payable?.totalpayable)}],
                            [{x: "payable", y: parseFloat(payable?.overduepayable)}]
                        ]
                    }
                }

                if (cashflow) {

                    cashFlowData = {
                        title: "Cash Flow",
                        type: "line",
                        number: 'cashflow',
                        showDateOptions: true,
                        graph: cashflow_flag,
                        barData: Object.keys(cashflow)
                            .sort((d1: any, d2: any) => {
                                return cashflow[d1].sort - cashflow[d2].sort
                            })
                            .map((key: any) => {
                                let {period, amount} = cashflow[key]
                                return {
                                    x: period,
                                    y: parseFloat(amount)
                                }
                            })
                    }


                }



                if (incomeexpense) {
                    let barData: any, incomes: any = [], expenses: any = [];
                    Object.keys(incomeexpense)
                        .sort((d1: any, d2: any) => {
                            return incomeexpense[d1].sort - incomeexpense[d2].sort
                        })
                        .forEach((key: any) => {

                            let {income, expense, hover} = incomeexpense[key]

                            incomes = [
                                ...incomes,
                                {x: key, y: income}
                            ];

                            expenses = [
                                ...expenses,
                                {x: key, y: expense}
                            ]
                        });



                    barData = [incomes, expenses];
                    incomeExpenseData = {
                        title: "Income & Expense",
                        type: "group_bar",
                        number: 'incomeexpense',
                        showDateOptions: true,
                        graph: Boolean(totalexpense) || Boolean(totalincome),
                        barData,
                        fillColor: [styles.green.color, styles.red.color]
                    }

                }

                if (topexpense) {
                    topExpensesData = {
                        title: "Your Top Expenses",
                        type: "list",
                        listData: topexpense,
                        showDateOptions: false,
                        graph: topexpense_flag,
                        itemComponent: ({item}: any) => <><View
                            style={[styles.grid, styles.justifyContentSpaceBetween, styles.py_4]}>
                            <Paragraph style={[styles.paragraph]}>{item.acname}</Paragraph>
                            <Paragraph style={[styles.paragraph, styles.red]}>{toCurrency(item.debit)}</Paragraph>
                        </View><Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/></>
                    }
                }

                let chartData: any = [
                    {
                        data: [
                            receivableData,
                            payableData
                        ],
                    },
                    {
                        data: [cashFlowData]
                    },
                    {
                        data: [incomeExpenseData]
                    },
                    {
                        data: [
                            topExpensesData
                        ],
                    },
                ];


                let pendingtask: any = [], completedtask: any = [], assignee:any =[];
                if(Boolean(graph)) {
                    Object.keys(graph)
                        .sort((d1: any, d2: any) => {
                            return graph[d1].sort - graph[d2].sort
                        })
                        .forEach((key: any) => {
                            let {pending, completed, hover} = graph[key];

                            pendingtask = [
                                ...pendingtask,
                                {x: key, y: pending || 0}
                            ];
                            completedtask = [
                                ...completedtask,
                                {x: key, y: completed || 0}
                            ]
                        });
                }

                if(Boolean(assigneegraphnew)) {
                    Object.keys(assigneegraphnew)
                        .forEach((key: any) => {
                            let {value, name} = assigneegraphnew[key];
                            assignee = [
                                ...assignee,
                                {x: name, y: value || 0}
                            ];
                        });
                }

                let taskData: any = [

                    {
                        numbers: {
                            title:'Job Summary',
                            data:{
                                onholdjob: onholdjob,
                                openjob:openjob,
                                overduejob:overduejob,
                                partwaitingjob:partwaitingjob,
                                pendingoutsourcing:pendingoutsourcing,
                                unassignedjob:unassignedjob
                            }
                        },
                    },
                    {
                        taskcolumn: {
                            title:'JOB Status',
                            data : [pendingtask, completedtask]
                        }
                    },
                    {
                        distribution: {
                            title:'Job Distribution',
                            data:assignee
                        }
                    },


                ];

                this.setState({
                    dashboardData: {
                        totalincome,
                        totalexpense,
                        cashflow_amount,
                        chartData
                    },
                    taskData,
                    isLoading: true,
                    refreshing: false
                })
            }
        })
    }

    handleNavigation = (page: any, item: any, add: any) => {

        const {navigation, vouchers, companydetails, updateVoucherItems, setActiveStep}: any = this.props;



        let key = `${item.vouchertypeid}-${add ? 'add' : 'list'}`;

        if (!Boolean(this.frequntVouchers[key])) {
            this.frequntVouchers[key] = item;
        }
        this.frequntVouchers[key].counter = this.frequntVouchers[key].counter + 1;
        this.frequntVouchers[key].add = add;
        companydetails.companies[companydetails.currentuser]['vouchers'] = this.frequntVouchers;
        storeData('fusion-pro-app', companydetails).then((r: any) => {
            store.dispatch(setCompany({companydetails: companydetails}));
        });

        let screen: any = '';

        if (!add) {
            screen = 'ListVoucher';
            if (item.vouchertypeid === '000-000-000' || item.vouchertypeid === '111-111-111') {
                screen = 'ListClient';
            } else if (item.vouchertypeid === '222-222-222') {
                screen = 'AccountGroups';
            } else if (item.vouchertypeid === '333-333-333') {
                screen = 'ListItem';
            } else if (item.vouchertypeid === '444-444-444') {
                screen = 'ListCategory';
            }

        } else {
            screen = 'AddEditVoucher';
            if (item.vouchertypeid === '000-000-000' || item.vouchertypeid === '111-111-111') {
                screen = 'AddEditClient';
            } else if (item.vouchertypeid === '222-222-222') {
                screen = 'AddEditAccount';
            } else if (item.vouchertypeid === '333-333-333') {
                screen = 'AddEditItem';
            } else if (item.vouchertypeid === '444-444-444') {
                screen = 'AddEditCategory';
            }
        }

        voucher.type = {...item, ...vouchers[item.vouchertypeid]};
        voucher.data = {};
        updateVoucherItems({});

        navigation.push(screen, {
            screen: screen,
            item: {...item, ...vouchers[item.vouchertypeid]},
        });

    }

    _getChart = (item: any) => {
        const {colors}: any = this.props.theme;

        if (item?.type === "horizontal_bar") {
            return <VictoryStack
                horizontal={true}
                colorScale={[colors.secondary, colors.screenbg]}
                height={28}

                padding={{
                    top: 0,
                    left: 0,
                    right: 60,
                    bottom: 0,
                }}
            >
                {
                    Boolean(item?.barData.length) && item?.barData.map((data: any) => {
                        return <VictoryBar
                            data={data}
                            barWidth={10}
                        />
                    })
                }

            </VictoryStack>
        } else if (item?.type === "line") {
            return <VictoryChart
                theme={VictoryTheme.material}
                height={180}
                domainPadding={10}
                padding={{
                    top: 12,
                    left: 35,
                    right: 60,
                    bottom: 28
                }}
            >
                <VictoryAxis
                    dependentAxis
                    style={{
                        tickLabels: {
                            fontSize: 9,
                        }
                    }}
                    tickFormat={(t) => `${nFormatter(t, 1)}`}
                />
                <VictoryAxis
                    tickCount={6}
                    style={{
                        tickLabels: {
                            fontSize: 9,
                        }
                    }}
                />
                <VictoryScatter
                    style={{data: {fill: colors.secondary}}}
                    size={4}
                    data={item?.barData}
                />
                <VictoryLine
                    style={{
                        data: {stroke: colors.secondary, strokeWidth: 2},
                    }}

                    data={item?.barData}
                />
            </VictoryChart>
        } else if (item?.type === "group_bar") {
            return <VictoryChart
                height={180}
                padding={{
                    top: 12,
                    left: 30,
                    right: 60,
                    bottom: 28
                }}
            >
                <VictoryAxis
                    dependentAxis
                    style={{
                        tickLabels: {
                            fontSize: 9,
                            color: 'white'
                        }
                    }}
                    tickFormat={(t) => `${nFormatter(t, 1)}`}
                />
                <VictoryAxis
                    tickCount={6}
                    style={{
                        tickLabels: {
                            fontSize: 9,
                            color: 'white'
                        }
                    }}
                />
                <VictoryGroup
                    offset={8}
                    colorScale={"qualitative"}
                >
                    {
                        item?.barData.map((data: any, index: number) => {

                            let fill;

                            if (item?.fillColor) {
                                fill = item?.fillColor[index]
                            }

                            let style: any = {data: {fill}}

                            return <VictoryBar
                                data={data}
                                barWidth={6}
                                style={style}
                                labels={({datum}) => datum.y || ""}
                                labelComponent={<VictoryTooltip/>}
                            />
                        })
                    }
                </VictoryGroup>
            </VictoryChart>
        }
        else if (item?.type === "pie") {

            return <VictoryPie
                height={320}
                width={330}
                labelPosition={({ index }:any) => index
                    ? "centroid"
                    : "startAngle"
                }
                labelPlacement={({ index }:any) => index
                    ? "parallel"
                    : "vertical"
                }
                colorScale={["#FD573A", "#126AFB", "#fdaa29", "#880311", "#29a745" ]}
                data={item?.barData}
            />
        } else if (item?.type === "list") {
            return <View>
                <View>
                    <Paragraph style={[styles.paragraph, styles.caption, styles.mb_5]}>{item.title}</Paragraph>
                </View>
                <FlatList
                    data={item?.listData}
                    keyboardShouldPersistTaps={'handled'}
                    renderItem={item?.itemComponent}
                    initialNumToRender={5}
                /></View>
        }

        return <>
            <Text></Text>
        </>
    }

    _renderItem = ({item, index}: any) => {

        const {type, showDateOptions, title, number, cashflow_amount}: any = item?.data[0];


        const {dashboardData, filterTitle}: any = this.state;
        const {colors}: any = this.props.theme;

        return (
            <View>

                <View>
                    <View>

                        {showDateOptions && <View style={[styles.grid, styles.middle, styles.justifyContent,]}>
                            <View>
                                <Paragraph style={[styles.paragraph, styles.caption]}>{title}</Paragraph>
                            </View>
                            <><View>
                                <InputField
                                    inputtype={'daterange'}
                                    render={() => <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                        <Paragraph style={[styles.paragraph]}> {filterTitle} </Paragraph>
                                        <Paragraph style={[styles.paragraph]}>
                                            <ProIcon name={'calendar'} align={'right'}/>
                                        </Paragraph>
                                    </View>}
                                    list={[DAY_OPTIONS.TODAY, DAY_OPTIONS.YESTERDAY, DAY_OPTIONS.THIS_MONTH, DAY_OPTIONS.THIS_QUARTER, DAY_OPTIONS.THIS_YEAR]}
                                    onChange={(value: any, obj: any) => {
                                        this.setState({
                                            filterTitle: obj.title,
                                            filterDate: value,
                                            showBottomSheet: false
                                        }, this.getDashboard);
                                    }}
                                />
                            </View>
                            </>
                        </View>}


                        {number == 'incomeexpense' &&
                            <View style={[styles.grid, styles.justifyContent, styles.middle, styles.py_4]}>
                                <View>
                                    <View>
                                        <Title
                                            style={[styles.green]}>{toCurrency(dashboardData?.totalincome || '0')}</Title>
                                        <Caption style={[styles.paragraph, styles.text_xs]}>Income</Caption>
                                    </View>

                                </View>

                                <View>
                                    <Title style={[styles.red]}>{toCurrency(dashboardData?.totalexpense || '0')}</Title>
                                    <Caption
                                        style={[styles.paragraph, styles.text_xs, {textAlign: 'right'}]}>Expense</Caption>
                                </View>
                            </View>}

                        {number == 'cashflow' && <View>
                            <View style={[styles.py_4]}>
                                <View>
                                    <Title
                                        style={{color: colors.secondary}}>{toCurrency(dashboardData?.cashflow_amount || '0')}</Title>
                                    <Caption style={[styles.paragraph, styles.text_xs]}>Amount</Caption>
                                </View>
                            </View>
                        </View>}


                        {
                            item?.data.map((dataItem: any, index: any) => {

                                const {receivable, payable, graph} = dataItem;
                                let topContent, bottomContent;

                                if (receivable) {

                                    topContent =
                                        <>
                                            <View>
                                                <Paragraph style={[styles.paragraph, styles.caption]}>Total
                                                    Receivable</Paragraph>
                                            </View>
                                            <Paragraph style={[styles.paragraph, styles.text_xs]}>Total Unpaid
                                                Invoices {toCurrency(receivable?.totalinvoice)}</Paragraph>
                                        </>


                                    bottomContent =
                                        <View style={[styles.grid, styles.justifyContentSpaceBetween, styles.mb_5]}>
                                            <View>
                                                <Title
                                                    style={[styles.paragraph, styles.text_md, {color: colors.secondary}]}>{toCurrency(receivable?.totalreceivable)}</Title>
                                                <Caption style={[styles.paragraph, styles.text_xs]}>Current</Caption>
                                            </View>
                                            <View>
                                                <Title
                                                    style={[styles.paragraph, styles.text_md, {textAlign: 'right'}]}>{toCurrency(receivable?.overduereceivable)}</Title>
                                                <Caption
                                                    style={[styles.paragraph, styles.text_xs, {textAlign: 'right'}]}>Overdue</Caption>
                                            </View>
                                        </View>
                                }


                                if (payable) {

                                    topContent = <>
                                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                        <View>
                                            <Paragraph style={[styles.paragraph, styles.caption, styles.mt_5]}>Total
                                                Payable</Paragraph>
                                        </View>
                                        <Paragraph style={[styles.paragraph, styles.text_xs]}>Total Unpaid
                                            Bill {toCurrency(payable?.totalbills)}</Paragraph>
                                    </>


                                    bottomContent =
                                        <View style={[styles.grid, styles.justifyContentSpaceBetween]}>
                                            <View>
                                                <Title
                                                    style={[styles.paragraph, styles.text_md, {color: colors.secondary}]}>{toCurrency(payable?.totalpayable)}</Title>
                                                <Caption style={[styles.paragraph, styles.text_xs]}>Current</Caption>
                                            </View>
                                            <View>
                                                <Title
                                                    style={[styles.paragraph, styles.text_md, {textAlign: 'right'}]}>{toCurrency(payable?.overduepayable)}</Title>
                                                <Caption
                                                    style={[styles.paragraph, styles.text_xs, {textAlign: 'right'}]}>Overdue</Caption>
                                            </View>
                                        </View>

                                }


                                return <View>
                                    <View>
                                        <View>
                                            {topContent}
                                            {graph ? this._getChart(dataItem) : showDateOptions && <View
                                                style={[styles.mt_5, {
                                                    alignItems: 'center',
                                                    alignContent: 'center'
                                                }]}><ProIcon name={'chart-bar'} color={'#ccc'} size={60}/><Paragraph
                                                style={[styles.paragraph, styles.text_xs, styles.py_5, {color: '#ccc'}]}>No
                                                record available</Paragraph></View>}
                                            {bottomContent}
                                        </View>
                                    </View>
                                </View>
                            })
                        }

                    </View>

                </View>
            </View>
        )

    }


    _renderItem2 = ({item, index}: any) => {

        let key = Object.keys(item)[0];
        const {title,data}: any = item[key];

        const {filterTitle}: any = this.state;

        const {colors}: any = this.props.theme;

        return (
            <View>

                <View>
                    <View>

                        {<View style={[styles.grid, styles.middle, styles.justifyContent,]}>
                            <View>
                                <Paragraph style={[styles.paragraph, styles.caption]}>{title}</Paragraph>
                            </View>
                            <><View>
                                <InputField
                                    inputtype={'daterange'}
                                    render={() => <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                        <Paragraph style={[styles.paragraph]}> {filterTitle} </Paragraph>
                                        <Paragraph style={[styles.paragraph]}>
                                            <ProIcon name={'calendar'} align={'right'}/>
                                        </Paragraph>
                                    </View>}
                                    list={[DAY_OPTIONS.TODAY, DAY_OPTIONS.YESTERDAY, DAY_OPTIONS.THIS_MONTH, DAY_OPTIONS.THIS_QUARTER, DAY_OPTIONS.THIS_YEAR]}
                                    onChange={(value: any, obj: any) => {
                                        this.setState({
                                            filterTitle: obj.title,
                                            filterDate: value,
                                            showBottomSheet: false
                                        }, this.getDashboard);
                                    }}
                                />
                            </View>
                            </>
                        </View>}


                        {key == 'numbers' &&
                            <>
                            <View style={[styles.grid, styles.justifyContent, styles.middle, styles.py_4]}>
                                <View>
                                    <View>
                                        <Title style={[styles.red]}>{data?.overduejob || '0'}</Title>
                                        <Caption style={[styles.paragraph, styles.text_xs]}>Over Due Job</Caption>
                                    </View>
                                </View>
                                <View>
                                    <View>
                                        <Title style={[styles.green,{textAlign: 'right'}]}>{data?.openjob || '0'}</Title>
                                        <Caption style={[styles.paragraph, styles.text_xs]}>Open Job</Caption>
                                    </View>
                                </View>

                            </View>

                                <View style={[styles.grid, styles.justifyContent, styles.middle, styles.py_4]}>

                                <View>
                                    <View>
                                        <Title style={{color:colors.secondary}}>{data?.unassignedjob || '0'}</Title>
                                        <Caption style={[styles.paragraph, styles.text_xs]}>Unassigned Job</Caption>
                                    </View>
                                </View>

                                <View>
                                    <View>
                                        <Title style={{textAlign: 'right'}}>{data?.onholdjob || '0'}</Title>
                                        <Caption style={[styles.paragraph, styles.text_xs]}>On Hold Job</Caption>
                                    </View>
                                </View>

                                </View>

                                <View style={[styles.grid, styles.justifyContent, styles.middle, styles.py_4]}>

                                <View>
                                    <View>
                                        <Title>{data?.partwaitingjob || '0'}</Title>
                                        <Caption style={[styles.paragraph, styles.text_xs]}>Waiting for parts</Caption>
                                    </View>
                                </View>
                                <View>
                                    <View>
                                        <Title style={{textAlign: 'right'}}>{data?.pendingoutsourcing || '0'}</Title>
                                        <Caption style={[styles.paragraph, styles.text_xs]}>Pending Outsourcing</Caption>
                                    </View>
                                </View>
                            </View>
                            </>
                            }


                        {key == 'taskcolumn' &&
                            <View >
                                {Boolean(data.length) ? this._getChart({barData:data,type:'group_bar',fillColor: [styles.red.color, styles.green.color]}) : <View
                                    style={[styles.mt_5, {
                                        marginTop: 50,
                                        alignItems: 'center',
                                        alignContent: 'center'
                                    }]}><ProIcon name={'chart-bar'} color={'#ccc'} size={60}/><Paragraph
                                    style={[styles.paragraph, styles.text_xs, styles.py_5, {color: '#ccc'}]}>No
                                    record available</Paragraph></View> }
                            </View>}


                        {key == 'distribution' &&
                            <View >
                                {Boolean(data.length) ? this._getChart({barData:data,type:'pie'}) : <View
                                    style={[styles.mt_5, {
                                        marginTop: 50,
                                    alignItems: 'center',
                                    alignContent: 'center'
                                }]}><ProIcon name={'chart-bar'} color={'#ccc'} size={60}/><Paragraph
                                    style={[styles.paragraph, styles.text_xs, styles.py_5, {color: '#ccc'}]}>No
                                    record available</Paragraph></View>}
                            </View>}




                    </View>

                </View>
            </View>
        )

    }



    render() {

        const financialdashboard = getRoleModuleAccess(PERMISSION_NAME.FINANCIAL_DASHBOARD);
        const taskdashboard = getRoleModuleAccess(PERMISSION_NAME.TASK_DASHBOARD);

        const {navigation, setDialog, settings}: any = this.props;
        const {
            searchbar,
            sort,
            dashboardData,
            activeSlide,
            activeSlide2,
            refreshing,
            filterDate,
            showBottomSheet,
            isLoading,
            spotlight,
            taskData
        }: any = this.state;

        const {colors} = this.props.theme;

        navigation.setOptions({headerShown: true, headerTitle: () => <HeaderLocation/>})

        const frequentvoucher = this.frequntVouchers && clone(getVisibleNav(objToArray(this.frequntVouchers))).sort(function (a: any, b: any) {
            return b.counter - a.counter;
        }).filter((item: any) => {
            return item.counter > 0
        }).slice(0, 6);

        this.vouchersmenufilter = getVisibleNav(vouchers);



        return (
            <Container>

                <GuideOptions from={"dashboard"} handleNavigation={this.handleNavigation} />

                <View style={[styles.pageContent]}>

                    <ScrollView refreshControl={<RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                this.setState({refreshing: true}, () => {
                                    this.getDashboard()
                                })
                            }}
                        />}>

                        {!searchbar && <View>

                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption]}>Quick
                                            Actions</Paragraph>
                                    </View>
                                    <ScrollView style={[styles.noWrap]} horizontal={true}>
                                        <View style={[styles.grid]}>


                                            {
                                                this.vouchersmenufilter.filter((item: any) => {
                                                    return item.quickaction && Boolean(item.accessType?.add)
                                                }).map((item: any, key: any) => {
                                                    return (
                                                        <View style={[styles.mb_5, {width: 75, marginTop: 10}]}>
                                                            <TouchableOpacity
                                                                onPress={() => this.handleNavigation('Voucher', item, true)}>
                                                                <View style={{
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}>
                                                                    <View style={{width: 50}}>
                                                                        <View style={[{
                                                                            backgroundColor: `${item.color}2b`,
                                                                            borderRadius: 50
                                                                        }]}>
                                                                            <IconButton
                                                                                icon={() => <ProIcon
                                                                                    name={item?.icon}
                                                                                    color={item.color}
                                                                                    size={20}/>}
                                                                            />
                                                                            <View style={[styles.absolute, {
                                                                                right: 0,
                                                                                bottom: 5,
                                                                                backgroundColor: item.color,
                                                                                height: 12,
                                                                                width: 12,
                                                                                borderRadius: 50
                                                                            }]}>
                                                                                <MCIcon name={'plus'}
                                                                                        color={'white'}
                                                                                        size={12}/>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <Paragraph
                                                                    style={[styles.paragraph, styles.text_xs, styles.mt_2, styles.textCenter, {lineHeight: 15}]}>{item.label}</Paragraph>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </ScrollView>
                                </Card.Content>
                            </Card>

                            {Boolean(frequentvoucher && frequentvoucher.length) && <>

                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <View>
                                            <Paragraph style={[styles.paragraph, styles.caption]}>Frequently  Used</Paragraph>
                                        </View>

                                        <ScrollView style={[styles.noWrap]} horizontal={true}>
                                            <View style={[styles.grid]}>
                                                {
                                                    frequentvoucher.filter((item:any)=>{

                                                        return  (Boolean(item.accessType?.add) && item.add) ||  (Boolean(item.accessType?.view) && !item.add)
                                                    }).map((item: any, key: any) => {
                                                        return (
                                                            <View style={[styles.mb_5, {width: 80, marginTop: 10}]}>
                                                                <TouchableOpacity
                                                                    onPress={() => this.handleNavigation('Voucher', item, item.add)}>
                                                                    <View style={{
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center'
                                                                    }}>
                                                                        <View style={{width: 50}}>
                                                                            <View style={[{
                                                                                backgroundColor: `${item.color}2b`,
                                                                                borderRadius: 50
                                                                            }]}>
                                                                                <IconButton
                                                                                    icon={() => <ProIcon
                                                                                        name={item.icon}
                                                                                        color={item.color}
                                                                                        size={20}/>}
                                                                                />
                                                                                {item.add &&
                                                                                    <View style={[styles.absolute, {
                                                                                        right: 0,
                                                                                        bottom: 5,
                                                                                        backgroundColor: item.color,
                                                                                        height: 12,
                                                                                        width: 12,
                                                                                        borderRadius: 50
                                                                                    }]}>
                                                                                        <MCIcon name={'plus'}
                                                                                                color={'white'}
                                                                                                size={12}/>
                                                                                    </View>}
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                    <Paragraph
                                                                        style={[styles.paragraph, styles.text_xs, styles.textCenter, {lineHeight: 15}]}>{item.label}</Paragraph>
                                                                </TouchableOpacity>
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </ScrollView>
                                    </Card.Content>
                                </Card>

                            </>}


                        </View>}


                        {financialdashboard?.view &&   <Card style={[styles.card]}>
                            <Card.Content>

                                {!isLoading ? <View style={{margin: -10}}><ListLoader/></View> : <>
                                    <Carousel
                                        ref={(c) => {
                                            this._carousel = c;
                                        }}
                                        data={dashboardData?.chartData}
                                        activeSlideAlignment={'start'}
                                        inactiveSlideScale={1}
                                        renderItem={this._renderItem}
                                        sliderWidth={sliderWidth - 60}
                                        sliderHeight={100}
                                        lockScrollTimeoutDuration={100}
                                        itemWidth={sliderWidth - 60}
                                        lockScrollWhileSnapping={true}
                                        onSnapToItem={(index) => this.setState({activeSlide: index})}
                                    />


                                    <Pagination
                                        dotsLength={dashboardData?.chartData?.length}
                                        activeDotIndex={activeSlide}
                                        containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
                                        dotStyle={{
                                            width: 5,
                                            height: 5,
                                            borderRadius: 5,
                                            marginHorizontal: 0,
                                            marginVertical: 0,
                                            backgroundColor: colors.inputbox
                                        }}
                                        inactiveDotStyle={{
                                            // Define styles for inactive dots here
                                        }}
                                        inactiveDotOpacity={0.4}
                                        inactiveDotScale={0.6}
                                    />

                                </>}


                            </Card.Content>
                        </Card>}


                        {taskdashboard?.view &&  <Card style={[styles.card]}>
                            <Card.Content>

                                {!isLoading ? <View style={{margin: -10}}><ListLoader/></View> : <>
                                    <Carousel
                                        ref={(c) => {
                                            this._carousel = c;
                                        }}
                                        data={taskData}
                                        activeSlideAlignment={'start'}
                                        inactiveSlideScale={1}
                                        renderItem={this._renderItem2}
                                        sliderWidth={sliderWidth - 60}
                                        sliderHeight={100}
                                        lockScrollTimeoutDuration={100}
                                        itemWidth={sliderWidth - 60}
                                        lockScrollWhileSnapping={true}
                                        onSnapToItem={(index) => this.setState({activeSlide2: index})}
                                    />


                                    <Pagination
                                        dotsLength={taskData?.length}
                                        activeDotIndex={activeSlide2}
                                        containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
                                        dotStyle={{
                                            width: 5,
                                            height: 5,
                                            borderRadius: 5,
                                            marginHorizontal: 0,
                                            marginVertical: 0,
                                            backgroundColor: colors.inputbox
                                        }}
                                        inactiveDotStyle={{
                                            // Define styles for inactive dots here
                                        }}
                                        inactiveDotOpacity={0.4}
                                        inactiveDotScale={0.6}
                                    />

                                </>}


                            </Card.Content>
                        </Card>}


                    </ScrollView>


                </View>


            </Container>
        );
    }
}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    vouchers: state.appApiData.settings.voucher,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
    setActiveStep: (activeStep: number) => dispatch(setActiveStep(activeStep)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));


