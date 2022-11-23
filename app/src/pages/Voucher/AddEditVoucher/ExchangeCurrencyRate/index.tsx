import React, {Component} from 'react';
import {Platform, View,} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";

import {Button, Container, InputBox} from "../../../../components";
import {Paragraph, TextInput as TI, Title} from "react-native-paper";
import {getCurrencySign, getCurrentCompanyDetails, toCurrency} from "../../../../lib/functions";
import {backButton, voucher} from "../../../../lib/setting";
import {updateVoucherItems} from "../../../../lib/Store/actions/appApiData";


class ExchangeRate extends Component<any> {

    params: any;

    constructor(props: any) {
        super(props);
        const {route}: any = this.props;
        this.params = route.params

    }

    updateCurrencyRate = () => {
        const {voucheritems, updateVoucherItems}: any = this.props;

        if (Boolean(voucheritems)) {
            Object.keys(voucheritems).map((keys: any) => {
                let item = voucheritems[keys];
                item.productrate = item.productratedisplay / voucher.data.vouchercurrencyrate;
                voucheritems[keys] = item;
            });
            updateVoucherItems(voucheritems)
        }

        const {navigation}: any = this.props;
        navigation.goBack()

    }


    render() {

        const {navigation,}: any = this.props;

        navigation.setOptions({
            headerTitle: 'Exchange Currency Rate',
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{`Exchange Currency Rate`}</Title>,
            })
        }


        const {defaultcurrency}: any = getCurrentCompanyDetails();

        return (
            <Container surface={true}>

                <Paragraph style={[styles.head,{textAlign:'center'}]}>Exchange Rate</Paragraph>
                <Paragraph style={[styles.mb_10,{textAlign:'center',fontSize:25,height:40,paddingTop:20,fontWeight:'bold'}]}>{toCurrency(1,defaultcurrency)} =  {voucher.data.vouchercurrencyrate}</Paragraph>


                <View style={[styles.px_6, styles.mt_5, styles.mb_5]}>
                    <InputBox
                        defaultValue={voucher.data.vouchercurrencyrate}
                        label={'Exchange Rate'}
                        keyboardType='numeric'
                        left={<TI.Affix text={getCurrencySign()}/>}
                        onChange={(value: any) => {
                            voucher.data.vouchercurrencyrate = value
                        }}
                    />
                </View>


                {this.params.editmode && <View style={[styles.px_6, {marginBottom: 20, marginTop: 10}]}>
                    <Button onPress={() => {
                        this.updateCurrencyRate()
                    }}> Update </Button>
                </View>}

            </Container>
        )
    }

}


const mapStateToProps = (state: any) => ({
    voucheritems: state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch: any) => ({
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});


export default connect(mapStateToProps, mapDispatchToProps)(ExchangeRate);


