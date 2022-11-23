import React, {Component} from 'react';
import {TouchableOpacity, View,} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";
import {Divider, Paragraph, withTheme} from "react-native-paper";

import {voucher} from "../../../../lib/setting";
import {getVoucherTypeData, toCurrency} from "../../../../lib/functions";

import moment from "moment";


class ReceiptPayment extends Component<any> {


    constructor(props: any) {
        super(props);
    }

    voucherDetail = (item: any) => {
        if (item.vouchertypeid) {
            const {navigation, vouchers, setNavigationActive}: any = this.props;
            voucher.type = {...item, ...vouchers[item.vouchertypeid]};
            setNavigationActive && setNavigationActive()
            voucher.type = getVoucherTypeData("vouchertypeid", item?.vouchertypeid, item?.voucherdisplayid);
            voucher.data = {};
            navigation.push('AddEditVoucher', {
                screen: 'AddEditVoucher',
                doNotSetBackData: true
            });
        }
    }


    render() {

        const {settings, theme: {colors}} = this.props;
        const dateformat: any = settings.general.dateformat;

        return (
            <View>

                {
                    Object.keys(voucher.data.receipt).map((key: any) => {
                        const obj = voucher.data.receipt[key];


                        return (
                            <View>
                                <View style={[styles.py_4]}>
                                    <View>

                                        <TouchableOpacity onPress={() => this.voucherDetail({
                                            voucherdisplayid: obj.voucherdisplayid,
                                            voucherid: obj.voucherid,
                                            vouchertypeid: obj.vouchertypeid
                                        })}>

                                            <View style={[styles.grid, styles.middle, styles.justifyContent]}>


                                                <View style={[styles.cell, styles.w_auto, {paddingLeft: 0}]}>
                                                    <Paragraph style={[styles.text_sm, styles.bold, styles.ellipse]}
                                                               numberOfLines={1}>{obj.voucherprefix}{obj.voucherdisplayid}</Paragraph>
                                                    <View style={[styles.middle, styles.row]}><Paragraph
                                                        style={[styles.text_xs]}>{moment(moment(obj.date, 'YYYY-MM-DD HH:mm:ii').toDate()).format(dateformat)}</Paragraph></View>
                                                </View>

                                                <View style={[styles.cell, {paddingRight: 0}]}>
                                                    <Paragraph style={[styles.text_sm, styles.textRight, styles.bold]}>
                                                        {toCurrency(obj.amount)}
                                                    </Paragraph>
                                                    <Paragraph style={[styles.text_xs, styles.textRight]}>
                                                        {obj.payment}
                                                    </Paragraph>
                                                </View>

                                            </View>


                                        </TouchableOpacity>

                                    </View>

                                </View>

                                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                            </View>
                        )

                    })
                }


            </View>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    vouchers: state.appApiData.settings.voucher,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ReceiptPayment));


