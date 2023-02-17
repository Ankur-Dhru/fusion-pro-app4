import React, {useEffect, useState} from 'react';
import {ScrollView, View,} from 'react-native';
import {styles} from "../../theme";

import {Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Card, Paragraph, withTheme,} from "react-native-paper";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryTooltip} from 'victory-native';
import {toCurrency} from "../../lib/functions";
import HeaderLocation from "../../components/HeaderLocation";
import InputField from "../../components/InputField";
import {DAY_OPTIONS, getStartDateTime} from "../../lib/dayoptions";


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
        <View style={[styles.py_3]}>
            <View style={[styles.grid, styles.noWrap, styles.justifyContent]}>
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
    const {name, amount, percentage}: any = props.item;
    const index = props.index;
    return (

        <View style={{borderTopColor: '#f4f4f4', borderTopWidth: index === 0 ? 0 : 1}}>
            <View style={[styles.grid, styles.noWrap, styles.justifyContent, styles.p_3, {paddingHorizontal: 7,}]}>
                <View style={[styles.flexGrow]}>
                    <Paragraph style={[styles.paragraph]}>{name}</Paragraph>
                </View>
                <View style={{minWidth: 50}}>
                    <Paragraph
                        style={[styles.paragraph, styles.text_xs]}>{`${percentage ? percentage + '%' : ''}`}</Paragraph>
                </View>
                <View style={{minWidth: 80}}>
                    <Paragraph
                        style={[styles.paragraph, styles.bold, {textAlign: 'right'}]}>{toCurrency(amount)}</Paragraph>
                </View>
            </View>
        </View>

    )
}

const random = () => {
    return Math.floor(Math.random() * 100)
}

const Index = (props: any) => {

    const loopTime = 30;
    let sales: any = []
    for (let i = 0; i < loopTime; i++) {
        sales.push({date: i, amount: random(), label: random()})
    }

    const {navigation, companydetails: {currentuser, companies}}: any = props;
    const locationid = companies[currentuser].locationid

    const [filter, setFilter]: any = useState({...getStartDateTime(), locationid: locationid});

    useEffect(() => {

        let queryString = {...filter, locationid: locationid};

        /*requestApi({
            method: methods.get,
            action: actions.dashboard,
            queryString:queryString,
            companyname: current.company,
        }).then((response: any) => {
            if (response?.status === SUCCESS) {

            }
        })*/

    }, [filter, locationid])

    const data = {
        locations: [{
            name: 'Vidhyanagar',
            amount: random(),
            percentage: random(),
        },
            {
                name: 'Goa',
                amount: random(),
                percentage: random(),
            }],
        payments: [{
            name: 'Cash',
            amount: random(),
            percentage: random(),
        },
            {
                name: 'Card',
                amount: random(),
                percentage: random(),
            }],
        orderstatistics: [{
            name: 'Success Order',
            amount: random(),
        },
            {
                name: 'Cancelled',
                amount: random(),
            },
            {
                name: 'Complimentary',
                amount: random(),
            },
            {
                name: 'Table Turn Around Time',
                amount: random(),
            }],
        revenueleakage: [{
            name: 'Bills Modified',
            amount: random(),
        },
            {
                name: 'Bills Re-Printed',
                amount: random(),
            },
            {
                name: 'Waived Off',
                amount: random(),
            },
            {
                name: 'Cancelled KOTs',
                amount: random(),
            },
            {
                name: 'Modified KOTs',
                amount: random(),
            },
            {
                name: 'Not Used in Bills',
                amount: random(),
            }],
        topsellingsales: [{
            name: 'Exective Lunch',
            amount: random(),
            percentage: random(),
        },
            {
                name: 'Exective Dinner',
                amount: random(),
                percentage: random(),
            }],
        topsellingquantity: [{
            name: 'Exective Lunch',
            amount: random(),
            percentage: random(),
        },
            {
                name: 'Exective Dinner',
                amount: random(),
                percentage: random(),
            }],
        lowsellingsales: [{
            name: 'Exective Lunch',
            amount: random(),
            percentage: random(),
        },
            {
                name: 'Exective Dinner',
                amount: random(),
                percentage: random(),
            }],
        lowsellingquantity: [{
            name: 'Exective Lunch',
            amount: random(),
            percentage: random(),
        },
            {
                name: 'Exective Dinner',
                amount: random(),
                percentage: random(),
            }],
        salesdata: sales,
        salesDetails: [
            {
                name: 'Gross Sales',
                amount: random(),
            },
            {
                name: 'Returns',
                amount: random(),
            },
            {
                name: 'Discount & Comps',
                amount: random(),
            },
            {
                name: 'Net Sales',
                amount: random(),
            },
            {
                name: 'Tax',
                amount: random(),
            },
            {
                name: 'Tips (Non-case)',
                amount: random(),
            },
            {
                name: 'Gift card sales',
                amount: random(),
            },
            {
                name: 'Rounding',
                amount: random(),
            },
            {
                name: 'Total',
                amount: random(),
            },
        ]
    }


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
                    list={[DAY_OPTIONS.TODAY, DAY_OPTIONS.YESTERDAY, DAY_OPTIONS.THIS_MONTH, DAY_OPTIONS.THIS_QUARTER, DAY_OPTIONS.THIS_YEAR]}
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
        salesDetails
    } = data;

    return (
        <Container>
            <View style={[styles.pageContent]}>

                <ScrollView>

                    {<View>

                        <>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        {/*<Paragraph>{filter.value.startdate} To {filter.value.enddate}</Paragraph>*/}
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>All Locations
                                            Sales</Paragraph>
                                    </View>
                                    {
                                        locations.map((item: any, index: any) => {
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
                                    <View style={{marginLeft: -30, marginTop: -30}}>
                                        <VictoryChart domainPadding={10}>
                                            <VictoryBar
                                                labelComponent={<VictoryTooltip/>}
                                                singleQuadrantDomainPadding={{x: false}}
                                                style={{data: {fill: colors[0]}}}
                                                x="date"
                                                y="amount"
                                                data={salesdata}
                                            />
                                            <VictoryAxis crossAxis={false}/>
                                        </VictoryChart>
                                    </View>

                                    <View>
                                        {
                                            salesDetails.map((data: any, index: any) => {
                                                return (
                                                    <TableRow item={data} index={index}/>
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
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Payment
                                            Details</Paragraph>
                                    </View>

                                    {
                                        payments.map((item: any, index: any) => {
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
                                            orderstatistics.map((item: any, index: any) => {
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
                                    <View style={[styles.grid]}>
                                        {
                                            revenueleakage.map((item: any, index: any) => {
                                                return (
                                                    <ItemBox item={item} index={index + 6}/>
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
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Top Selling
                                            (Sales Wise)</Paragraph>
                                    </View>

                                    {
                                        topsellingsales.map((item: any, index: any) => {
                                            return (
                                                <TableRow item={item} index={index}/>
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>

                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Top Selling
                                            (Quantity Wise)</Paragraph>
                                    </View>

                                    {
                                        topsellingquantity.map((item: any, index: any) => {
                                            return (
                                                <TableRow item={item} index={index}/>
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>

                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Low Selling
                                            (Sales Wise)</Paragraph>
                                    </View>

                                    {
                                        lowsellingsales.map((item: any, index: any) => {
                                            return (
                                                <TableRow item={item} index={index}/>
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>

                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.caption, styles.mb_4]}>Low Selling
                                            (Quantity Wise)</Paragraph>
                                    </View>

                                    {
                                        lowsellingquantity.map((item: any, index: any) => {
                                            return (
                                                <TableRow item={item} index={index}/>
                                            )
                                        })
                                    }

                                </Card.Content>
                            </Card>
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









