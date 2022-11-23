import React, {memo, useEffect, useState} from "react";
import {styles} from "../../../theme";
import {Card, Paragraph, Text} from "react-native-paper";
import {View} from "react-native";
import ListNavRightIcon from "../../../components/ListNavRightIcon";
import {options_place} from "../../../lib/static";
import {connect} from "react-redux";
import {chevronRight, voucher} from "../../../lib/setting";
import {clone, isEmpty, log, setDecimal} from "../../../lib/functions";
import {updateVoucherItems} from "../../../lib/Store/actions/appApiData";

const OutSourcingDataCard = memo(({values, tickets, navigation, vouchers, updateVoucherItems}: any) => {

    const [outSourcingData, setOutSourcingData] = useState<any>({});

    useEffect(() => {
        if (values.outstanding) {
            let vendorDetails = values.outstanding?.vendordetail;
            let outsourcingdata = values.outstanding;

            let outsourcinglocation = options_place.find(({value}: any) => value === outsourcingdata?.outsourcinglocation);
            let outsourcingstatuslist = tickets[values?.tickettypeid]?.outsourcingstatuslist;
            let outsourcingItemCount = outsourcingdata?.outsourcingitems?.length || 0;

            let outsourcingstatus;
            if (outsourcingdata?.outsourcingstatus) {
                outsourcingstatus = outsourcingstatuslist[outsourcingdata?.outsourcingstatus]?.osstatusname
            }

            setOutSourcingData({
                vendorname: vendorDetails?.displayname,
                outsourcinglocation: outsourcinglocation?.text,
                outsourcingstatus,
                outsourcingItemCount,
                delivery: Boolean(outsourcingdata?.delivery),
                pickup: Boolean(outsourcingdata?.pickup)
            })
        }
    }, [values.outstanding]);

    return <Card
        style={[styles.card]}
        onPress={() => {

            const purchaseVoucher = vouchers["71e9cc99-f2d1-4b47-94ee-7aafd481e3c5"];

            voucher.type = {
                type: 'type2',
                icon: 'cart-outline',
                screentype: 'purchase',
                counter: 0,
                color: '#8472e9',
                vouchertypeid: '71e9cc99-f2d1-4b47-94ee-7aafd481e3c5',
                navigationid: "9594488a-d2b2-4af0-a12b-0fc0f2c48fbe",
                ...purchaseVoucher,
                label: 'Outsourcing',
                rightvouchertypename: "Outsourcing",
            };

            const {outstanding, tickettypeid, ticketdisplayid, assetid, assettype, assetdata} = voucher?.data;
            if (outstanding){
                const {outsourcingitems, vendorname, vendor, vendordetail, ...otherData} = outstanding;

                let invoiceitems = [];
                voucher.data.voucheritems = {}

                if (!isEmpty(outsourcingitems)) {
                    invoiceitems = clone(outsourcingitems);

                    Boolean(invoiceitems) && invoiceitems.map((item:any) => {
                        voucher.data.voucheritems = {
                            ...voucher.data.voucheritems,
                            [item.itemunique]: item
                        }
                    })
                }

                updateVoucherItems(voucher.data.voucheritems);

                voucher.data = clone({
                    ...otherData,
                    clientid: vendor,
                    clientname: vendorname,
                    clientdetail: vendordetail,
                    invoiceitems,
                });
            }

            voucher.data = clone({
                ...voucher.data,
                tickettypeid,
                ticketdisplayid,
                assetid,
                assettype,
                assetdata
            });


            navigation.navigate('AddEditVoucher', {
                screen: 'AddEditVoucher',
                outsourcing: true
            });
        }}
    >
        <Card.Content>
            {
                Boolean(values?.outstanding?.vendor) && <Text
                    style={[styles.caption]}>Outsourcing</Text>
            }
            {
                <View style={[styles.grid,styles.middle, styles.justifyContent]}>
                    <View>
                        {
                            Boolean(values?.outstanding?.vendor) ?  <View>
                                {/*<Text>Vendor Name</Text>*/}
                                <Paragraph style={[styles.paragraph,styles.bold]}>{outSourcingData?.vendorname}</Paragraph>
                                <Text>{outSourcingData?.outsourcinglocation} - {outSourcingData?.outsourcingstatus}</Text>
                            </View> :  <Text style={[styles.caption]}>+ Outsourcing</Text>
                        }
                    </View>

                    <View style={[styles.grid, styles.justifyContent,styles.middle]}>
                        {
                            Boolean(values?.outstanding?.vendor) && <>
                                <ListNavRightIcon name={Boolean(outSourcingData?.delivery) ? "badge-check" : Boolean(outSourcingData?.pickup) ? "clock" : "hourglass-start"}/>
                                <View style={[styles.badge]}><Paragraph style={[styles.paragraph,{color:'white'}]}>{outSourcingData?.outsourcingItemCount}</Paragraph></View>
                            </>
                        }
                        {chevronRight}
                    </View>

                </View>
            }

        </Card.Content>
    </Card>
});

const mapStateToProps = (state: any) => ({
    tickets: state?.appApiData.settings.tickets,
    vouchers: state.appApiData.settings.voucher,
})
const mapDispatchToProps = (dispatch: any) => ({
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});


export default connect(mapStateToProps, mapDispatchToProps)(OutSourcingDataCard);

