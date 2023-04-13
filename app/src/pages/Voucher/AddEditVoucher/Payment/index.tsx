import React, {Component} from 'react';
import {Platform, ScrollView, View,} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";

import {Button, Container, InputBox} from "../../../../components";

import {Card, Paragraph, TextInput as TI, Title, withTheme} from "react-native-paper";
import {
    clone,
    errorAlert,
    getCurrencySign,
    getCurrentCompanyDetails,
    getDefaultCurrency,
    log,
    toCurrency
} from "../../../../lib/functions";
import {apiUrl, auth, backButton, current, voucher} from "../../../../lib/setting";
import {setAlert, setLoader, setModal} from "../../../../lib/Store/actions/components";
import {Field, Form} from "react-final-form";
import {getFloatValue} from "../../../../lib/voucher_calc";
import {actions, jsonToQueryString} from "../../../../lib/ServerRequest";
import RNFetchBlob from "rn-fetch-blob";
import QRCode from "./QRCode"
import InputField from "../../../../components/InputField";
import Tooltip, {STEPS, TooltipContainer} from '../../../../components/Spotlight/Tooltip';

class Payment extends Component<any> {

    params: any;
    paymentmethod: any;


    paymentamount: any = voucher.data?.vouchertotaldisplay;
    payments: any = [];
    initdata: any;
    qrcode: any;
    isUpi: any = false;
    errorMessage: any;
    paidamount: any = 0;
    vouchertotaldisplay: any = voucher.data?.vouchertotaldisplay;

    //settings.location
    constructor(props: any) {
        super(props);
        const {route}: any = this.props;

        if (!voucher.data.paidamount) {
            this.paidamount = 0
        } else {
            if (!route.params.fromAddpayment) {
                this.paidamount = +voucher.data?.paidamount;
            }
        }

        this.state = {
            clickadd: false
        }


        Boolean(voucher.data?.receipt) && Object.keys(voucher.data?.receipt).map((key: any) => {
            let receipt = voucher.data.receipt[key];
            this.paidamount += +receipt.amount;
        })

        this.initdata = {
            paymentamount: this.vouchertotaldisplay - this.paidamount,
            paymentgateway: voucher.data.paymentgateway
        };
        this.params = route.params
    }

    validatePayment = () => {
        const {handleSubmit}: any = this.params;
        const {settings, route} = this.props;

        if (!route.params.fromAddpayment) {
            Boolean(voucher.data?.receipt) && Object.keys(voucher.data?.receipt).map((key: any) => {
                let receipt = voucher.data.receipt[key];
                this.payments.push({
                    name: receipt.payment,
                    paymentamount: receipt.amount,
                    paymentgateway: receipt.paymentmethodid,
                    referencetxnno: receipt?.referencedetail,
                    bankcharges: receipt?.bankcharges
                })
            })
        }


        if (!Boolean(this.payments.length)) {
            this.errorMessage = `Please add payment`;
            errorAlert(this.errorMessage);
        } else {

            voucher.data.payment = this.payments;

            let paymentgateways: any = [];
            const systemc = getDefaultCurrency();

            this.payments?.map((payment: any) => {

                const gatewayname: any = Object.keys(settings.paymentgateway[payment.paymentgateway]).filter((key) => key !== "settings");

                const name = settings.paymentgateway[payment.paymentgateway][gatewayname].find((a: any) => a.input === "displayname")

                paymentgateways = [
                    ...paymentgateways,
                    {
                        "gid": payment.paymentgateway,
                        "gatewayname": name.value,
                        "pay": payment.paymentamount,
                        "paysystem": getFloatValue(payment.paymentamount * (1 / voucher.data.vouchercurrencyrate), systemc.decimalplace),
                        "receipt": "",
                        "phone": "",
                        "otp": "",
                        referencetxnno: payment.referencetxnno,
                        bankcharges: payment.bankcharges,
                        "gatewaytype": gatewayname[0]
                    }
                ]
            })

            voucher.data.payments = [
                {
                    "remainingamount": 0,
                    "totalamount": this.vouchertotaldisplay,
                    paymentgateways
                }
            ];
            voucher.data.paidamount = this.paidamount;
            voucher.data.voucherdisplayid = voucher.data.voucherdisplayid+''
            handleSubmit();
        }

    }

    handleSubmit = (values: any) => {

    }

    addPayment = () => {
        const {setAlert, settings} = this.props;

        const gatewayname: any = Object.keys(settings.paymentgateway[this.initdata.paymentgateway])
            .filter((key) => key !== "settings");
        const name = settings.paymentgateway[this.initdata.paymentgateway][gatewayname].find((a: any) => a.input === "displayname")

        this.payments.push(clone({...this.initdata, name: name.value}));


        let total = 0;
        this.payments?.map((payment: any) => {
            total += +payment.paymentamount
        });
        total = this.vouchertotaldisplay - this.paidamount - total;

        if (total >= 0) {
            this.initdata.paymentamount = total;
        } else {
            this.payments.pop();
            errorAlert('Total amount mismatch');
        }

        !Boolean(this.initdata.paymentamount > 0) ? this.setState({clickadd: true}) : this.forceUpdate()
    }

    reset = () => {
        const {settings} = this.props;
        const {locationid}: any = getCurrentCompanyDetails();

        this.payments = [];
        voucher.data.payments = '';
        this.initdata = {
            paymentamount: this.vouchertotaldisplay - this.paidamount,
            paymentgateway: settings.location[locationid].defaultpaymentgateway
        }
        this.setState({clickadd: false})
    }

    checkPaymentGateway = (gateway: any) => {
        this.isUpi = Boolean(this.getGatewayDetailByKey(gateway, 'upiid'));
        this.forceUpdate();
    }

    getQRCode = () => {
        const {setLoader, setModal}: any = this.props;
        const {paymentgateway, paymentamount, referencetxnno}: any = this.initdata;

        setLoader({show: true})
        const {companydetails}: any = this.props;
        let url = apiUrl(current.company) + actions.paymentgateway;
        url += jsonToQueryString({
            generateqr: 1,
            gateway: paymentgateway,
            amount: paymentamount,
            reference: referencetxnno
        });
        let headers: any = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + auth.token,
            'x-workspace': companydetails && companydetails.current
        };

        const configfb: any = {
            fileCache: true,
        }
        const configOptions: any = Platform.select({
            ios: {
                fileCache: configfb.fileCache,
                appendExt: 'png'
            },
            android: configfb,
        });


        RNFetchBlob.config(configOptions)
            .fetch('GET', url, headers)
            .then((result: any) => {

                this.qrcode = result.data;
                setModal({title: 'QR Code', visible: true, component: () => <QRCode qrcode={this.qrcode}/>})
                setLoader({show: false})
            })
            .catch((e) => {
                setLoader({show: false})
                log('error', e)
            });
    }


    getGatewayDetailByKey = (key: any, value: any) => {
        const {settings} = this.props;
        const gatewayname: any = Object.keys(settings.paymentgateway[key]).filter((key) => key !== "settings");
        return settings.paymentgateway[key][gatewayname].find((a: any) => a.input === value)
    }

    render() {

        const {handleSubmit}: any = this.params;
        const {settings, navigation, theme: {colors}} = this.props;
        const {clickadd}: any = this.state;

        this.paymentmethod = Boolean(settings.paymentgateway) && Object.keys(settings.paymentgateway).map((key: any) => {
            const b: any = this.getGatewayDetailByKey(key, 'displayname');
            return {label: b.value, value: key}
        });

        navigation.setOptions({
            headerTitle: 'Payment',
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
        });


        return (
            <Container>

                <View style={[styles.pageContent]}>


                    <ScrollView keyboardShouldPersistTaps='handled'>

                        <Form
                            onSubmit={this.handleSubmit}
                            initialValues={{...this.initdata}}>
                            {propsValues => (
                                <View>

                                    {<Card style={[styles.card]}>
                                        <Card.Content>

                                            <View style={[styles.grid, styles.middle, styles.center]}>
                                                {Boolean(this.vouchertotaldisplay - this.paidamount) && <View>
                                                    <Paragraph
                                                        style={[styles.paragraph, styles.head, {textAlign: 'center'}]}>Due
                                                        Amount</Paragraph>
                                                    <Paragraph style={[styles.paragraph, styles.mb_10, styles.red, {
                                                        textAlign: 'center',
                                                        fontSize: 25,
                                                        height: 40,
                                                        paddingTop: 20,
                                                        fontWeight: 'bold'
                                                    }]}>{voucher?.settings?.totalLabel || "Total"} :  {toCurrency(this.vouchertotaldisplay - this.paidamount)}</Paragraph>
                                                </View>}


                                                {Boolean(this.paidamount) && <View style={[{marginLeft: 30}]}>
                                                    <Paragraph
                                                        style={[styles.paragraph, styles.head, {textAlign: 'center'}]}>Advance
                                                        Pay</Paragraph>
                                                    <Paragraph style={[styles.paragraph, styles.mb_10, styles.green, {
                                                        textAlign: 'center',
                                                        fontSize: 25,
                                                        height: 40,
                                                        paddingTop: 20,
                                                        fontWeight: 'bold'
                                                    }]}>{toCurrency(this.paidamount)}</Paragraph>
                                                </View>}
                                            </View>


                                            {!clickadd && <>
                                                <View>
                                                    <Field name="paymentgateway">
                                                        {props => {
                                                            return (
                                                                <InputField
                                                                    {...props}
                                                                    label={'Payment Method'}
                                                                    divider={true}
                                                                    displaytype={'bottomlist'}
                                                                    inputtype={'dropdown'}
                                                                    list={this.paymentmethod}
                                                                    search={false}
                                                                    listtype={'other'}
                                                                    selectedValue={props.input.value}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        this.initdata.paymentgateway = value;
                                                                        this.checkPaymentGateway(value)
                                                                    }}
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                </View>


                                                <View>
                                                    <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                        <View style={[styles.w_auto]}>

                                                            <Field name="paymentamount">
                                                                {props => {
                                                                    return (
                                                                        <InputField
                                                                            {...props}
                                                                            value={props.input.value + ''}
                                                                            label={'Amount'}
                                                                            inputtype={'textbox'}
                                                                            keyboardType='numeric'
                                                                            left={<TI.Affix text={getCurrencySign()}/>}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value);
                                                                                this.initdata.paymentamount = value;
                                                                                this.forceUpdate()
                                                                            }}
                                                                        />
                                                                    )
                                                                }}
                                                            </Field>

                                                        </View>
                                                        <View style={[styles.w_auto, styles.ml_2]}>
                                                            <Field name="bankcharges">
                                                                {props => {
                                                                    return (
                                                                        <InputField
                                                                            value={'' + props.input.value}
                                                                            label={'Bank Charges'}
                                                                            autoFocus={false}
                                                                            inputtype={'textbox'}
                                                                            keyboardType='numeric'
                                                                            left={<TI.Affix text={getCurrencySign()}/>}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value);
                                                                                this.initdata.bankcharges = value;
                                                                            }}
                                                                        />
                                                                    )
                                                                }}
                                                            </Field>
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={[styles.mb_5]}>
                                                    <Field name="referencetxnno">
                                                        {props => {
                                                            return (
                                                                <InputBox
                                                                    value={props.input.value}
                                                                    label={'Reference'}
                                                                    dense={false}
                                                                    autoFocus={false}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        this.initdata.referencetxnno = value;
                                                                    }}
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                </View>


                                                <View>
                                                    <Tooltip
                                                        message={`Add Payment`}
                                                        stepOrder={STEPS.ADD_PAYMENT}
                                                    >
                                                        <TooltipContainer stepOrder={STEPS.ADD_PAYMENT}>
                                                            <Button disabled={!Boolean(this.initdata.paymentamount)}
                                                                    onPress={() => {
                                                                        this.addPayment()
                                                                    }} secondbutton={true}>Add</Button>
                                                        </TooltipContainer>
                                                    </Tooltip>

                                                </View>
                                            </>}


                                        </Card.Content>
                                    </Card>}


                                    {Boolean(this.payments.length) && <>

                                        <Card style={[styles.card]}>
                                            <Card.Content>


                                                <View>
                                                    {this.payments?.map((payment: any) => {
                                                        return (
                                                            <View style={[styles.grid, styles.justifyContent]}>
                                                                <View>
                                                                    <Paragraph> {payment.name} </Paragraph>
                                                                    <Paragraph
                                                                        style={[styles.paragraph, styles.muted, styles.text_xs]}>{payment.referencetxnno ? payment.referencetxnno : ''} </Paragraph>
                                                                </View>
                                                                <View>
                                                                    <Paragraph
                                                                        style={[styles.paragraph,]}>{toCurrency(payment.paymentamount)}</Paragraph>
                                                                    {<Paragraph
                                                                        style={[styles.paragraph, styles.muted, styles.text_xs, {textAlign: 'right'}]}> {Boolean(payment.bankcharges) && toCurrency(payment.bankcharges)}</Paragraph>}
                                                                </View>
                                                            </View>)
                                                    })}
                                                </View>


                                                <View style={[styles.grid, styles.justifyContent]}>
                                                    <View>

                                                    </View>
                                                    <View>
                                                        <Button compact={true} secondbutton={true} onPress={() => {
                                                            this.reset();
                                                        }}>
                                                            Reset
                                                        </Button>
                                                    </View>
                                                </View>


                                            </Card.Content>
                                        </Card>

                                    </>}


                                </View>
                            )}

                        </Form>

                    </ScrollView>


                    <View>

                        <View style={[styles.submitbutton]}>

                            {this.isUpi &&
                                <View style={[styles.py_4]}><Button secondbutton={true} onPress={() => {
                                    this.getQRCode()
                                }}> Show QR Code </Button></View>}

                            {!Boolean(voucher.data.voucherid) && !Boolean(voucher.data?.receipt) &&
                                <View style={[styles.mb_5]}>
                                    <Button secondbutton={true} onPress={() => {
                                        this.payments = [];
                                        voucher.data.payments = '';
                                        handleSubmit();
                                    }}> Skip Payment </Button>
                                </View>}

                            <Tooltip
                                message={`Generate ${voucher.type.label}`}
                                stepOrder={STEPS.GENERATE_INVOICE}
                            >
                                <TooltipContainer stepOrder={STEPS.GENERATE_INVOICE}>
                                    <Button onPress={() => {
                                        this.validatePayment()
                                    }}> {voucher.data.voucherid ? 'Save' : `Generate ${voucher.type.label}`} </Button>
                                </TooltipContainer>
                            </Tooltip>

                        </View>

                    </View>

                </View>

            </Container>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({
    setAlert: (alert: any) => dispatch(setAlert(alert)),
    setModal: (modal: any) => dispatch(setModal(modal)),
    setLoader: (loader: any) => dispatch(setLoader(loader))
});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Payment));


