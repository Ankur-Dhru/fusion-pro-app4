import React, {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, View,} from 'react-native';
import {styles} from "../../theme";

import {Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Caption, Card, Paragraph, withTheme,} from "react-native-paper";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryTooltip} from 'victory-native';
import {toCurrency, toDateFormat} from "../../lib/functions";
import HeaderLocation from "../../components/HeaderLocation";
import InputField from "../../components/InputField";
import {DAY_OPTIONS, getStartDateTime} from "../../lib/dayoptions";
import requestApi, {actions, methods, SUCCESS} from '../../lib/ServerRequest';
import {current} from "../../lib/setting";
import {Divider} from "react-native-elements/dist/divider/Divider";


const colors = ['#023047', '#ffb703', '#fb8500', '#2a9d8f', '#f4a261', '#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff', '#8ecae6', '#219ebc']


const ItemBox = (props: any) => {
    const {name, amount}: any = props.item;
    const index = props.index;
    return (
        <Card style={[styles.card, {width: '50%', marginBottom: 0}]}>
            <View
                style={[styles.flex, styles.h_100, styles.grid, styles.top, styles.p_5, styles.mr_1, styles.mb_2, styles.noWrap, {
                    borderRadius: 10,
                    backgroundColor: `${colors[index]}40`
                }]}>

                <View>
                    <Paragraph style={[styles.paragraph, styles.bold]}>{amount}</Paragraph>
                    <Paragraph>{name}</Paragraph>
                </View>
            </View>
        </Card>
    )
}

const LineGraph = (props: any) => {
    const {name, amount, percentage}: any = props.item;
    const index = props.index;
    return (
        <View style={[styles.py_3,{borderTopColor: '#f4f4f4', borderTopWidth: index === 0 ? 0 : 1}]} >
            <View style={[styles.grid, styles.noWrap, styles.justifyContent,styles.py_3]}>
                <View style={{minWidth: 100}}>
                    <Paragraph style={[styles.paragraph]}>{name}</Paragraph>
                </View>
                <View style={[styles.flexGrow]}>
                    <View style={[styles.bg_light, styles.w_100, {borderRadius: 10}]}>
                        <View style={[{
                            backgroundColor: `${colors[index]}`,
                            width: `${percentage}%`,
                            height: 5,
                            borderRadius: 10
                        }]}></View>
                    </View>
                </View>
                <View style={{minWidth: 100}}>
                    <Paragraph
                        style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}>{toCurrency(amount)}</Paragraph>
                </View>
            </View>
        </View>
    )
}

const TableRow = (props: any) => {
    const {typenumber} = props;
    const {name, amount, percentage}: any = props.item;
    const index = props.index;
    return (

        <View style={{borderTopColor: '#f4f4f4', borderTopWidth: index === 0 ? 0 : 1}}>
            <View style={[styles.grid, styles.noWrap, styles.justifyContent, styles.py_3,]}>
                <View style={[styles.flexGrow]}>
                    <Paragraph style={[styles.paragraph]}>{name}</Paragraph>
                </View>
                <View style={{minWidth: 50}}>
                    <Paragraph
                        style={[styles.paragraph, styles.text_xs]}>{`${percentage ? percentage + '%' : ''}`}</Paragraph>
                </View>
                <View style={{minWidth: 80}}>
                    <Paragraph
                        style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}>{typenumber?parseInt(amount):toCurrency(amount)}</Paragraph>
                </View>
            </View>
        </View>

    )
}



const ItemList = (props: any) => {
    const {name, amount, orders}: any = props.item;
    const index = props.index;
    return (

        <View style={[styles.py_3,{borderTopColor: '#f4f4f4', borderTopWidth: index === 0 ? 0 : 1}]}>
            <View style={[styles.grid, styles.noWrap, styles.justifyContent, styles.py_3,]}>
                <View style={[styles.bg_light,styles.mr_2,{borderRadius:50}]}>
                   <ProIcon name={name === 'Dinein'?'utensils':name==='Pickup'?'basket-shopping':'truck-pickup'} size={18}/>
                </View>
                <View style={[styles.flexGrow]}>
                    <Paragraph style={[styles.paragraph,styles.bold]}>{name}</Paragraph>
                    <Paragraph style={[styles.paragraph,styles.muted,styles.text_xs]}>{orders} Orders</Paragraph>
                </View>
                <View style={{minWidth: 80}}>
                    <Paragraph
                        style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}>{toCurrency(amount)}</Paragraph>
                </View>
            </View>
        </View>

    )
}

const Nodatafound = () => {
    return  <Paragraph>No data found</Paragraph>
}

const Index = (props: any) => {



    const {navigation, companydetails: {currentuser, companies}}: any = props;
    const locationid = companies[currentuser].locationid

    const [data,setData]:any = useState({orderstatistics:[],
        payments:[],
        locations:[],
        revenueleakage:[],
        topsellingsales:[],
        topsellingquantity:[],
        lowsellingsales:[],
        lowsellingquantity:[],
        salesdata:[],
        salesDetails:[]});

    const [filter, setFilter]: any = useState({...getStartDateTime(), locationid: locationid});

    const [refreshing, setRefreshing] = React.useState(false);



    useEffect(() => {

        let queryString = {...filter, locationid: locationid === 'all'?'':locationid,newdashboard:1};

        requestApi({
            method: methods.get,
            action: actions.dashboard,
            queryString:queryString,
            loader:!refreshing,
            companyname: current.company,
        }).then((response: any) => {
            if (response?.status === SUCCESS) {
                setData(response.data)
            }
        })
    }, [filter, locationid,refreshing])



    navigation.setOptions({headerShown: true, headerTitle: () => <HeaderLocation all={true}/>})

    navigation.setOptions({
        headerRight: (props: any) =>
            <View style={[styles.mr_2]}>
                <InputField
                    inputtype={'daterange'}
                    render={() => <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                        <Paragraph style={[styles.paragraph]}>
                            <ProIcon name={'calendar'} align={'right'}/>
                        </Paragraph>
                    </View>}
                    list={[DAY_OPTIONS.TODAY, DAY_OPTIONS.YESTERDAY, DAY_OPTIONS.LAST_7_DAY, DAY_OPTIONS.LAST_30_DAY, DAY_OPTIONS.THIS_MONTH,DAY_OPTIONS.LAST_MONTH, DAY_OPTIONS.THIS_QUARTER, DAY_OPTIONS.THIS_YEAR]}
                    customrange={true}
                    onChange={(value: any, obj: any) => {
                        setFilter(obj.value);
                    }}
                />
            </View>
    });



    const {
        orderstatistics,
        payments,
        locations,
        revenueleakage,
        topsellingsales,
        topsellingquantity,
        lowsellingsales,
        lowsellingquantity,
        salesdata,
        salesDetails,
        ordertypewise
    } = data || {};


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    return (
        <Container>
            <View style={[styles.pageContent]}>

                <ScrollView contentContainerStyle={styles.scrollView}
                            refreshControl={  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} >

                    {<View>

                        <>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        {/*<Paragraph>{filter.value.startdate} To {filter.value.enddate}</Paragraph>*/}
                                        <Paragraph style={[styles.paragraph,styles.mb_4]}><Paragraph style={[styles.bold]}>Location(s) Sales </Paragraph>  ({toDateFormat(filter.startdate)} to {toDateFormat(filter.enddate)})</Paragraph>
                                    </View>
                                    {
                                        Boolean(locations) && Object.values(locations)?.map((item: any, index: any) => {
                                            return (
                                                <LineGraph item={item} index={index}/>
                                            )
                                        })
                                    }
                                </Card.Content>
                            </Card>
                        </>


                        <>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption]}>Sales Report</Paragraph>
                                    </View>
                                    {Boolean(salesdata) &&  <View style={{marginLeft: -30, marginTop: -30}}>
                                        <VictoryChart domainPadding={0}>
                                            <VictoryBar
                                                labelComponent={<VictoryTooltip/>}
                                                singleQuadrantDomainPadding={{x: false}}
                                                style={{data: {fill: colors[0]}}}
                                                x="date"
                                                y="amount"
                                                data={salesdata || []}
                                            />
                                            <VictoryAxis crossAxis={false} style={{ tickLabels: { angle: 0,fontSize:10 } }} fixLabelOverlap={true}/>
                                        </VictoryChart>
                                    </View>}

                                    <View>
                                        {
                                            salesDetails?.map((data: any, index: any) => {
                                                return (
                                                    <TableRow item={data} index={index}/>
                                                )
                                            })
                                        }
                                    </View>

                                </Card.Content>
                            </Card>
                        </>

                        {Boolean(ordertypewise?.length) &&   <>
                            <Card  style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        {
                                            ordertypewise?.map((data: any, index: any) => {
                                                return (
                                                    <ItemList item={data} index={index}/>
                                                )
                                            })
                                        }
                                    </View>
                                </Card.Content>
                            </Card>
                        </>}

                        <>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Payment
                                            Details</Paragraph>
                                    </View>

                                    {
                                        payments?.map((item: any, index: any) => {
                                            return (
                                                <LineGraph item={item} index={index}/>
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>
                        </>

                        <>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Order
                                            Statistics</Paragraph>
                                    </View>
                                    <View style={[styles.grid]}>

                                        {
                                            orderstatistics?.map((item: any, index: any) => {
                                                return (
                                                    <ItemBox item={item} index={index}/>
                                                )
                                            })
                                        }

                                    </View>
                                </Card.Content>
                            </Card>
                        </>

                        <>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Revenue
                                            Leakage</Paragraph>
                                    </View>
                                    {<View style={[styles.grid]}>
                                        {
                                            revenueleakage?.map((item: any, index: any) => {
                                                return (
                                                    <ItemBox item={item} index={index + 6}/>
                                                )
                                            })
                                        }
                                    </View>}
                                </Card.Content>
                            </Card>
                        </>

                        <>
                        {Boolean(topsellingsales?.length) && <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Top Selling
                                            (Sales Wise)</Paragraph>
                                    </View>

                                    {
                                        topsellingsales?.map((item: any, index: any) => {
                                            return (
                                                <TableRow item={item} index={index}/>
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>}

                        {Boolean(topsellingquantity?.length) && <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Top Selling
                                            (Quantity Wise)</Paragraph>
                                    </View>

                                    {
                                        topsellingquantity?.map((item: any, index: any) => {
                                            return (
                                                <TableRow item={item} index={index} typenumber={true} />
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>}

                        {Boolean(lowsellingsales?.length) && <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Low Selling
                                            (Sales Wise)</Paragraph>
                                    </View>

                                    {
                                        lowsellingsales?.map((item: any, index: any) => {
                                            return (
                                                <TableRow item={item} index={index}/>
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>}

                        {Boolean(lowsellingquantity?.length) && <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Low Selling
                                            (Quantity Wise)</Paragraph>
                                    </View>

                                    {
                                        lowsellingquantity?.map((item: any, index: any) => {
                                            return (
                                                <TableRow item={item} index={index} typenumber={true}/>
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>}
                        </>


                    </View>}


                </ScrollView>


            </View>
        </Container>

    )

}


const mapStateToProps = (state: any) => ({
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));









