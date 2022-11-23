import React, {Component} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Card, Paragraph, Text, Title, withTheme} from "react-native-paper";
import {clone, findObject, getMonthsYear, nFormatter, toCurrency} from "../../lib/functions";

import {defalut_payment_term} from "../../lib/static";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {setModal} from "../../lib/Store/actions/components";
import {backButton} from "../../lib/setting";
import InputField from "../../components/InputField";
import FormLoader from "../../components/ContentLoader/FormLoader";
import OpeningBalance from "./OpeningBalance";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryGroup} from "victory-native";
import {DAY_OPTIONS, getStartDateTime} from "../../lib/dayoptions";
import KeyboardScroll from "../../components/KeyboardScroll";
import Avatar from "../../components/Avatar";


class ClientOverview extends Component<any> {

    paymentterms: any;
    sheetRef: any;
    dates: any;
    initdata: any;
    params: any;

    constructor(props: any) {
        super(props);
        this.sheetRef = React.createRef();

        const defaultDateTime = getStartDateTime(DAY_OPTIONS.THIS_YEAR);

        const {route}: any = this.props;
        const {client}: any = route.params;
        this.params = route.params;

        this.initdata = {...client}


        this.state = {
            isLoading: false,
            monthsList: [],
            filterTitle: DAY_OPTIONS.THIS_YEAR,
            filterDate: {
                enddate: defaultDateTime.enddate,
                startdate: defaultDateTime.startdate,
                starttime: defaultDateTime.starttime,
                endtime: defaultDateTime.endtime,
            }
        }
    }


    updateOpeningBalance = () => {
        const {setModal}: any = this.props;
        setModal({
            title: 'Preferences',
            visible: true,
            component: () => <OpeningBalance client={this.initdata} handleSubmit={this.handleSubmit}/>
        })
    }

    componentDidMount() {
        const {settings: {paymentterms}} = this.props;
        this.paymentterms = Object.keys(paymentterms).map((key: any) => {
            if (Boolean(paymentterms[key])) {
                return {label: paymentterms[key].termname, value: paymentterms[key].termdays}
            }
        }).filter((item: any) => {
            return Boolean(item)
        })
        this.paymentterms = [
            ...this.paymentterms,
            ...defalut_payment_term
        ]
        this.getClientDetail()
    }

    getClientDetail = () => {
        const {filterDate: {startdate, enddate}}: any = this.state;
        requestApi({
            method: methods.get,
            action: actions.clients,
            queryString: {
                clientid: this.initdata.clientid,
                starttime: '12:00 AM',
                endtime: '11:59 PM',
                'datefrom': enddate,
                'dateto': startdate
            },
            loader: false,
            showlog: true,
            loadertype: 'form'
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.initdata = {...this.initdata, ...result.data};
                this.setupGraph()
            }
        });
    }

    setupGraph = () => {


        const {filterDate}: any = this.state;

        const {paidamount}: any = this.initdata;

        let monthsLists: any = getMonthsYear(filterDate.startdate, filterDate.enddate);

        monthsLists.map((item: any) => {
            if (paidamount && paidamount[item.month]) {
                item.amount = paidamount[item.month].value
            } else {
                item.amount = 0
            }
        })

        this.setState({isLoading: true, monthsList: clone(monthsLists)}, () => this.forceUpdate());
    }

    handleSubmit = (values: any) => {

        requestApi({
            method: methods.put,
            action: actions.clients,
            body: values
        }).then((result) => {
            if (result.status === SUCCESS) {
                this.getClientDetail()
            }
        });
    }


    render() {

        const {isLoading, monthsList, filterTitle}: any = this.state;

        const {navigation}: any = this.props;

        const {colors}: any = this.props.theme;

        navigation.setOptions({
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{this.initdata.displayname}</Title>,
            })
        }

        if (!isLoading) {
            return <FormLoader/>
        }

        navigation.setOptions({
            headerTitle: this.initdata.displayname,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
        });


        const pt = this.paymentterms && findObject(this.paymentterms, 'value', this.initdata.paymentterm)

        const data = monthsList.map((month: any) => {
            return {x: month.format4, y: month.amount || 0}
        });

        return (
            <Container>


                <View style={[styles.pageContent]}>
                    <KeyboardScroll>
                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View style={[styles.grid, styles.mb_5, styles.noWrap]}>

                                    <View style={[styles.mr_2]}>
                                        <Avatar label={this.initdata.displayname} value={this.initdata.displayname}
                                                size={40}/>
                                    </View>


                                    <View style={[styles.w_auto]}>

                                        <Paragraph
                                            style={[styles.text_md]}>{this.initdata.displayname} {Boolean(this.initdata.company) &&
                                            <Paragraph style={[styles.paragraph, styles.text_xs, styles.muted]}>
                                                ({this.initdata.company})
                                            </Paragraph>}</Paragraph>


                                        {Boolean(this.initdata?.firstname) || Boolean(this.initdata?.lastname) &&
                                            <Paragraph style={[styles.paragraph, styles.text_xs, styles.muted]}>
                                                {this.initdata?.firstname} {this.initdata?.lastname}
                                            </Paragraph>}


                                        {Boolean(this.initdata.email) && <View style={[styles.grid, styles.middle]}>
                                            <Paragraph style={[styles.paragraph, styles.text_sm, styles.muted]}>
                                                {this.initdata.email}
                                            </Paragraph>
                                        </View>}

                                        {Boolean(this.initdata.phone) && <View style={[styles.grid, styles.middle]}>

                                            <Paragraph style={[styles.paragraph, styles.text_sm, styles.muted]}>
                                                {this.initdata.phone}
                                            </Paragraph>
                                        </View>}

                                        <Paragraph
                                            style={[styles.paragraph, {color: this.initdata.status === 'active' ? styles.green.color : styles.red.color}]}>{this.initdata.status === 'active' ? 'Active' : 'Inactive'}  </Paragraph>


                                    </View>

                                    <View>
                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('AddEditClient', {
                                                screen: 'AddEditClient',
                                                client: {...this.initdata},
                                                getClientDetail: this.getClientDetail
                                                //getClients:this.params.getClients
                                            });
                                        }}>
                                            <View style={[styles.grid, styles.middle]}>
                                                <ProIcon color={colors.secondary} size={26} name={'pen-to-square'}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>

                                <View style={[styles.grid, styles.justifyContent, styles.middle]}>

                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('ClientVouchers', {
                                            screen: 'ClientVouchers',
                                            client: {...this.initdata},
                                        });
                                    }}>
                                        <View style={[styles.grid, styles.middle]}>
                                            <ProIcon color={colors.secondary} name={'receipt'}/>
                                            <Paragraph
                                                style={[styles.paragraph, styles.text_sm, {color: colors.secondary}]}>
                                                Vouchers
                                            </Paragraph>
                                        </View>
                                    </TouchableOpacity>


                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('ListAssets', {
                                            screen: 'ListAssets',
                                            client: {...this.initdata},
                                        });
                                    }}>
                                        <View style={[styles.grid, styles.middle]}>
                                            <ProIcon color={colors.secondary} name={'laptop'}/>
                                            <Paragraph
                                                style={[styles.paragraph, , styles.text_sm, {color: colors.secondary}]}>
                                                Assets
                                            </Paragraph>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate('ListStatement', {
                                            screen: 'ListStatement',
                                            client: {...this.initdata},
                                        });
                                    }}>
                                        <View style={[styles.grid, styles.middle]}>
                                            <ProIcon color={colors.secondary} name={'ballot-check'}/>
                                            <Paragraph
                                                style={[styles.paragraph, styles.text_sm, {color: colors.secondary}]}>
                                                Statement
                                            </Paragraph>
                                        </View>
                                    </TouchableOpacity>


                                </View>

                            </Card.Content>
                        </Card>


                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View style={[styles.textCenter]}>

                                    <Title
                                        style={[styles.red, styles.textCenter, {fontSize: 30}]}>{toCurrency(this.initdata?.totaloutstanding || '0')}</Title>
                                    <Paragraph style={[styles.textCenter, styles.paragraph, styles.text_xs]}>Outstanding
                                        Amount</Paragraph>
                                    <Paragraph style={[styles.textCenter, {marginTop: 15}]}>
                                        Inclusive of Outstanding Opening Balance amount : <Text
                                        style={[styles.bold]}> {toCurrency(this.initdata.openingbalance ? this.initdata.openingbalance : '0')}</Text>
                                    </Paragraph>
                                    <View style={[styles.textCenter, styles.mt_5]}>
                                        <TouchableOpacity onPress={() => {
                                            this.updateOpeningBalance()
                                        }}><Button secondbutton={true}> Update Opening
                                            Balance</Button></TouchableOpacity>
                                    </View>
                                </View>

                            </Card.Content>
                        </Card>

                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View style={[styles.textCenter]}>
                                    <Title
                                        style={[styles.green, styles.textCenter, {fontSize: 30}]}>{toCurrency(this.initdata?.creditbalance + this.initdata.invoicebalance || '0')}</Title>
                                    <Paragraph style={[styles.textCenter, styles.paragraph, styles.text_xs]}>Unused
                                        Credits</Paragraph>

                                    <Paragraph style={[styles.textCenter, {marginTop: 15}]}>
                                        Payment due period : <Text style={[styles.bold]}> {pt[0]?.label}</Text>
                                    </Paragraph>

                                </View>

                            </Card.Content>
                        </Card>


                        {Boolean(data.length) && <Card style={[styles.card, styles.center]}>
                            <Card.Content>
                                <View>
                                    <View style={[styles.grid, styles.justifyContentSpaceBetween]}>
                                        <Paragraph
                                            style={[styles.paragraph, styles.caption, styles.p_0, styles.m_0]}>{'Amount'}</Paragraph>

                                        <InputField
                                            inputtype={'daterange'}
                                            render={() => <View
                                                style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                <Paragraph style={[styles.paragraph]}> {filterTitle} </Paragraph>
                                                <Paragraph style={[styles.paragraph]}>
                                                    <ProIcon name={'calendar'} align={'right'}/>
                                                </Paragraph>
                                            </View>}
                                            list={[DAY_OPTIONS.LAST_6_MONTH, DAY_OPTIONS.LAST_12_MONTH, DAY_OPTIONS.THIS_YEAR]}
                                            onChange={(value: any, obj: any) => {
                                                this.setState({
                                                    filterDate: value,
                                                    filterTitle: obj.title,
                                                    showBottomSheet: false
                                                }, () => this.setupGraph());
                                            }}
                                        />


                                    </View>

                                    <VictoryChart
                                        height={240}
                                        domainPadding={10}
                                        padding={{
                                            top: 12,
                                            left: 32,
                                            right: 72,
                                            bottom: 28
                                        }}
                                    >
                                        <VictoryAxis
                                            dependentAxis
                                            style={{
                                                tickLabels: {
                                                    fontSize: 9
                                                }
                                            }}
                                            tickFormat={(t) => `${nFormatter(t, 1)}`}
                                        />
                                        <VictoryAxis
                                            tickCount={6}
                                            style={{
                                                tickLabels: {
                                                    fontSize: 9
                                                }
                                            }}
                                        />
                                        <VictoryGroup
                                            offset={8}
                                            colorScale={"qualitative"}
                                        >

                                            <VictoryBar
                                                data={clone(data) || []}
                                                barWidth={6}
                                                style={{
                                                    data: {fill: '#0e1e40'},
                                                }}
                                            />

                                        </VictoryGroup>
                                    </VictoryChart>

                                </View>
                            </Card.Content>
                        </Card>}


                    </KeyboardScroll>
                </View>


            </Container>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({
    setModal: (modal: any) => {
        dispatch(setModal(modal))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ClientOverview));


