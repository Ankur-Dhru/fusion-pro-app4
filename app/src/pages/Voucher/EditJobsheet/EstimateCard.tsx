import React, {memo, useEffect, useState} from "react";
import {styles} from "../../../theme";
import {Card, Paragraph, Text} from "react-native-paper";
import {View} from "react-native";
import {chevronRight, voucher} from "../../../lib/setting";
import {clone, isEmpty, toCurrency} from "../../../lib/functions";
import {updateVoucherItems} from "../../../lib/Store/actions/appApiData";
import {connect} from "react-redux";

const EstimateCard = memo(({values, navigation, vouchers}: any) => {

    const [itemCount, setItemCount] = useState(0);
    useEffect(() => {
        setItemCount(voucher?.data?.products?.length);
    }, [values?.products])

    return <Card style={[styles.card, styles.middle, styles.justifyContent]} onPress={() => {

        const purchaseVoucher = vouchers["d7310e31-acee-4cfc-aa4d-4935b150706b"];

        voucher.type = {
            label: 'Estimate',
            type: 'type1',
            icon: 'clipboard-file-outline',
            screentype: 'sales',
            counter: 0,
            color: '#35d039',
            vouchertypeid: 'd7310e31-acee-4cfc-aa4d-4935b150706b',
            navigationid: "a9e957a5-43f9-4b1a-92e6-9d71b6634762",
            ...purchaseVoucher,
            voucherdisplayid: values.estimatedisplayid,
            voucherid: values.estimatetypeid
        };



        voucher.data = {};


        navigation.navigate('AddEditVoucher', {
            screen: 'AddEditVoucher',
            outsourcing: false,
            doNotSetBackData: true
        });
    }}>
        <Card.Content>
            <View style={[styles.grid, styles.justifyContent]}>
                <View>
                    <Text style={[styles.caption, styles.mb_2]}>{values.estimatedid}</Text>
                    <Text style={[styles.caption, styles.mb_2]}>Estimated Amount
                        : {toCurrency(values.estimatedamount)}</Text>
                </View>
                <View style={[styles.grid, styles.justifyContent]}>
                    <View style={[styles.badge, styles[values.estimatestatus],{padding:0}]}><Paragraph  style={[styles.paragraph,styles.text_xs, {color: 'white'}]}>  {values.estimatestatus}  </Paragraph></View>
                    {chevronRight}
                </View>

            </View>

        </Card.Content>
    </Card>
})

const mapStateToProps = (state: any) => ({
    vouchers: state.appApiData.settings.voucher,
})
const mapDispatchToProps = (dispatch: any) => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(EstimateCard);
