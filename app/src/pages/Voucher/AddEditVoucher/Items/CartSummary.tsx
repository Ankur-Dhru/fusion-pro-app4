import React, {Component} from 'react';
import {TouchableOpacity, View,} from 'react-native';
import {styles} from "../../../../theme";

import {ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Card, Divider, Paragraph, withTheme} from "react-native-paper";


import {clone, objectToArray, toCurrency, updateComponent} from "../../../../lib/functions";

import {chevronRight, voucher} from "../../../../lib/setting";
import {itemTotalCalculation} from "../../../../lib/voucher_calc";
import Adjustment from "./Adjustment";
import Discount from "./Discount";
import TdsTcs from "./TdsTcs";
import {expenseCalculation} from "../../../../lib/calculation_function";
import ViewProfit from "./ViewProfit";


class VoucherDate extends Component<any> {

    initdata: any = {adjustmentname: '', adjustmentamount: ''};
    toggleSummary1: any;
    toggleSummary2: any;
    toggleSummary3: any;
    toggle: any = false;

    constructor(props: any) {
        super(props);
        this.state = {
            showitems: false,
            showadjustment: false,
            showtdstcs: false,
            showdiscount: false,
            discountamount: 0,
            adjustmentamount: 0,
            tdstcs: voucher.data.selectedtdstcs,
            voucheritems: props.voucheritems,
            discounttype: voucher.data.discounttype
        }
        this.toggleSummary1 = React.createRef();
        this.toggleSummary2 = React.createRef()
        this.toggleSummary3 = React.createRef()
    }

    componentDidMount() {
        this.forceUpdate()
    }

    updateSummary = () => {
        this.forceUpdate()
    }

    updatetdstcs = (value: any) => {
        this.setState({tdstcs: value})
    }

    showAdjustment = (value: any) => {
        this.setState({showadjustment: value})
    }


    render() {

        const {tdstcs, showtdstcs, showadjustment}: any = this.state;

        const {voucheritems, settings, editmode, companydetails, navigation, theme: {colors}}: any = this.props;

        let currentcompany = companydetails.companies[companydetails.currentuser];

        let clientcurrency = voucher.data.currency;
        let companycurrency = currentcompany?.defaultcurrency?.__key;


        if (voucher.settings.api === 'expense') {

            //////// SET QNT 1 TO CALCULATE EXPENSE SUMMARY
            Object.keys(voucheritems).map((key: any) => {
                voucheritems[key].productqnt = 1
            })

            let clientDecimal = settings.currency?.[clientcurrency]?.decimalplace,
                companyDecimal = settings.currency?.[companycurrency]?.decimalplace;

            if (Boolean(clientDecimal)) {
                companyDecimal = clientDecimal;
            }

            voucher.data = expenseCalculation({
                    ...voucher.data,
                    invoiceitems: objectToArray(clone(voucheritems))
                },
                null,
                null,
                clientcurrency,
                companycurrency,
                clientDecimal,
                companyDecimal,
                false,
                false)

        } else {


            voucher.data = itemTotalCalculation({
                    ...voucher.data,
                    invoiceitems: objectToArray(clone(voucheritems))
                },
                settings.tds,
                settings.tcs,
                clientcurrency,
                companycurrency,
                settings.currency?.[clientcurrency]?.decimalplace,
                settings.currency?.[companycurrency]?.decimalplace,
                false,
                false)
        }


        return (
            <View>
                {Boolean(voucher.data?.invoiceitems.length) &&
                    <Card style={[styles.card]}>
                        <Card.Content style={{paddingBottom: 0}}>
                            <View>

                                {
                                    Boolean(voucher.data?.voucherinlinediscountdisplay) &&
                                    <View style={[styles.fieldspace, {display: 'none'}]} ref={this.toggleSummary1}>
                                        <View style={[styles.row, styles.justifyContent]}>
                                            <View style={[styles.cell, styles.w_auto]}><Paragraph
                                                style={[styles.paragraph, styles.paragraph, styles.head]}>Total Inline
                                                Discount</Paragraph></View>
                                            <View style={[styles.cell, {paddingRight: 0}]}><Paragraph
                                                style={[styles.paragraph, styles.paragraph, styles.textRight, styles.text_xs]}>- {toCurrency(voucher.data.voucherinlinediscountdisplay)}</Paragraph></View>
                                        </View>
                                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                    </View>
                                }

                                <TouchableOpacity style={[styles.row, styles.justifyContent, styles.fieldspace,]}
                                                  onPress={() => {
                                                      this.toggle = !this.toggle;
                                                      updateComponent(this.toggleSummary1, 'display', this.toggle ? 'flex' : 'none');
                                                      updateComponent(this.toggleSummary2, 'display', this.toggle ? 'flex' : 'none')
                                                      updateComponent(this.toggleSummary3, 'display', this.toggle ? 'flex' : 'none')
                                                  }}>

                                    <View style={[styles.cell, styles.w_auto]}>
                                        <View style={[styles.grid, styles.middle]}>
                                            <Paragraph style={[styles.paragraph, styles.text_sm]}>Subtotal </Paragraph>
                                            <ProIcon name={`chevron-${this.toggle ? 'up' : 'down'}`} size={12}/>
                                        </View>
                                    </View>
                                    <View style={[styles.cell, {paddingRight: 0}]}><Paragraph
                                        style={[styles.paragraph, styles.textRight, styles.text_sm, styles.bold]}>{toCurrency((voucher.data?.vouchersubtotaldisplay - (voucher.data.voucherinlinediscountdisplay || 0)) + '')}</Paragraph></View>

                                </TouchableOpacity>

                                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>

                                <View ref={this.toggleSummary2} style={[{display: 'none'}]}>

                                    <Discount updateSummary={this.updateSummary} editmode={editmode}/>


                                    {Boolean(voucher.data?.globaltax) &&
                                        <View style={[styles.fieldspace, {marginTop: 15}]}>


                                            <View><Paragraph
                                                style={[styles.paragraph, styles.text_xs]}>{voucher.data.vouchertaxtype === 'exclusive' ? 'Exclusive of Tax' : 'Inclusive of Tax'}</Paragraph></View>

                                            {Boolean(voucher.data.reversecharge) && <View>
                                                <Paragraph style={[styles.paragraph, {color: styles.red.color}]}>Reverse
                                                    Charge</Paragraph>
                                            </View>}

                                            <View>
                                                {
                                                    voucher.data?.globaltax?.map((tax: any) => {
                                                        return <View
                                                            style={[styles.row, styles.justifyContent, {marginBottom: 0}]}>
                                                            <Paragraph
                                                                style={[styles.text_xs, voucher.data.reversecharge && {color: styles.red.color}]}>{tax?.taxname} ({tax?.taxpercentage}%
                                                                on {toCurrency(tax?.taxableratedisplay)})</Paragraph>
                                                            <Paragraph
                                                                style={[styles.paragraph, styles.textRight, styles.text_xs, {paddingRight: 0,}, voucher.data.reversecharge && {color: styles.red.color}]}>{toCurrency(tax?.taxpricedisplay || '0')}</Paragraph>
                                                        </View>
                                                    })
                                                }
                                            </View>


                                        </View>}


                                    {voucher.data.isadjustment && tdstcs === 'TCS' && <>

                                        <Adjustment updateSummary={this.updateSummary} showadjustment={showadjustment}
                                                    showAdjustment={this.showAdjustment} editmode={editmode}/>
                                    </>}


                                    <TdsTcs updateSummary={this.updateSummary} updatetdstcs={this.updatetdstcs}
                                            editmode={editmode}/>

                                    {voucher.data.isadjustment && tdstcs === 'TDS' && <>
                                        <Adjustment updateSummary={this.updateSummary} showadjustment={showadjustment}
                                                    showAdjustment={this.showAdjustment} editmode={editmode}/>
                                    </>}

                                    <View>
                                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>

                                        <View style={[styles.grid, styles.middle, styles.fieldspace, {marginTop: 12}]}>
                                            <View style={[styles.cell, styles.w_auto]}><Paragraph
                                                style={[styles.paragraph, styles.paragraph, styles.text_xs]}>Round
                                                Off</Paragraph></View>
                                            <View style={[styles.cell, {paddingRight: 0}]}><Paragraph
                                                style={[styles.paragraph, styles.textRight, styles.text_xs]}>{toCurrency(voucher.data?.voucherroundoffdisplay || '0')}</Paragraph></View>
                                        </View>
                                    </View>

                                    <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>

                                </View>

                                <View style={[styles.grid, styles.middle, styles.fieldspace, {marginTop: 12}]}>
                                    <View style={[styles.cell, styles.w_auto]}><Paragraph
                                        style={[styles.paragraph, styles.head, styles.text_sm]}>{voucher?.settings?.totalLabel || "Total"}</Paragraph></View>
                                    <View style={[styles.cell, {paddingRight: 0}]}><Paragraph
                                        style={[styles.paragraph, styles.textRight, styles.bold, styles.text_sm]}>{toCurrency(voucher.data?.vouchertotaldisplay || '0')}</Paragraph></View>
                                </View>

                                <View style={[{display: 'none'}]} ref={this.toggleSummary3}>
                                    <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                    {
                                        (Boolean(voucher.data.voucherid) &&
                                            Boolean(voucher.settings.viewprofit)) &&
                                        <ViewProfit voucherid={voucher?.data?.voucherid}/>
                                    }

                                </View>


                            </View>
                        </Card.Content>
                    </Card>
                }


                {companycurrency !== voucher.data.currency && <>

                    <View>

                        <Card style={[styles.card]}>
                            <Card.Content style={{paddingBottom: 0}}>

                                <TouchableOpacity onPress={() => {
                                    navigation.push('ExchangeCurrencyRate', {
                                        screen: 'ExchangeCurrencyRate',
                                        editmode: editmode,
                                    })
                                }}>

                                    <View>

                                        <View style={[styles.row, styles.justifyContent]}>
                                            <Paragraph style={[styles.paragraph, styles.cell, styles.head]}>Base
                                                Currency</Paragraph>
                                            <View style={[styles.cell, {paddingRight: 0}]}>
                                                <View style={[styles.grid, styles.middle]}>
                                                    <Paragraph style={[styles.paragraph, styles.text_sm]}>
                                                        {toCurrency(voucher.data.vouchertotal, companycurrency)}
                                                    </Paragraph>
                                                    {chevronRight}
                                                </View>
                                            </View>
                                        </View>

                                        <Divider
                                            style={[styles.divider, styles.hide, {borderBottomColor: colors.divider}]}/>
                                    </View>

                                </TouchableOpacity>

                            </Card.Content>
                        </Card>

                    </View>

                    <Divider style={[styles.divider, styles.hide, styles.hide, {borderBottomColor: colors.divider}]}/>

                </>}


            </View>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    companydetails: state.appApiData.companydetails,
    chartofaccount: state.appApiData.settings.chartofaccount,
    voucheritems: state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(VoucherDate));


