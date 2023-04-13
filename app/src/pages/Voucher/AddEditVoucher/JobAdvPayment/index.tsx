import React, {Component} from "react";
import {Platform, ScrollView, View} from "react-native";
import {Card, Paragraph, Surface, TextInput as TI, withTheme} from "react-native-paper";
import {Button, Container, InputBox} from "../../../../components";
import {styles} from "../../../../theme";
import InputField from "../../../../components/InputField";
import {setModal} from "../../../../lib/Store/actions/components";
import {connect} from "react-redux";
import {Field, Form} from "react-final-form";
import {apiUrl, auth, voucher} from "../../../../lib/setting";
import {
    clone,
    errorAlert,
    getCurrencySign,
    getCurrentCompanyDetails,
    getDefaultCurrency,
    log, objToArray,
    toCurrency
} from "../../../../lib/functions";
import {getFloatValue} from "../../../../lib/voucher_calc";
import {actions, jsonToQueryString} from "../../../../lib/ServerRequest";
import RNFetchBlob from "rn-fetch-blob";
import QRCode from "../Payment/QRCode";
import {setNavigationOptions} from "../../../../lib/navigation_options";
import KeyboardScroll from "../../../../components/KeyboardScroll";

class Index extends Component<any, any> {

    params: any;
    paymentmethod: any;


    paymentamount: any = voucher.data?.vouchertotaldisplay;
    payments: any = [];
    isPaymentReceived: any = '0'
    initdata: any;
    qrcode: any;
    isUpi: any = false;
    errorMessage: any;

    //settings.location
    constructor(props: any) {
        super(props);
        const {route}: any = this.props;

        if (!voucher.data.paidamount) {
            voucher.data.paidamount = 0
        }

        this.initdata = {
            paymentamount: voucher.data.vouchertotaldisplay - voucher.data?.paidamount,
            paymentgateway: voucher.data.paymentgateway,
            isPaymentReceived: '0',
        };

        this.state = {
            isPaymentReceived:false
        }

       // this.params = route.params
    }



    validatePayment = () => {
        const {handleSubmit}: any = this.props;
        const {settings} = this.props;

        if (!Boolean(this.payments.length)) {
            this.errorMessage = `Please add payment`;
            errorAlert(this.errorMessage);
        } else {

            voucher.data.payment = this.payments;

            let paymentgateways: any = [];
            const systemc = getDefaultCurrency();

            this.payments?.map((payment: any) => {

                const gatewayname: any = Object.keys(settings.paymentgateway[payment.paymentgateway])
                    .filter((key) => key !== "settings");
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
                    "totalamount": voucher.data.vouchertotaldisplay,
                    paymentgateways
                }
            ];
            handleSubmit()
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

        total = voucher.data.vouchertotaldisplay - voucher.data.paidamount - total;

        if (total >= 0) {
            //this.initdata.paymentamount = total;
            this.validatePayment()
        } else {
            this.payments.pop();
            errorAlert('Total amount mismatch');
        }
    }

    componentDidMount() {
        const {childref}:any = this.props;
        Boolean(childref) && childref(this);

    }



    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        this.initdata.paymentamount = (voucher.data.vouchertotaldisplay - voucher.data?.paidamount);
    }

    checkPaymentGateway = (gateway: any) => {
        this.isUpi = Boolean(this.getGatewayDetailByKey(gateway, 'upiid'));
        this.forceUpdate();
    }


    getGatewayDetailByKey = (key: any, value: any) => {
        const {settings} = this.props;
        const gatewayname: any = Object.keys(settings.paymentgateway[key]).filter((key) => key !== "settings");
        return settings.paymentgateway[key][gatewayname].find((a: any) => a.input === value)
    }

    render() {
        const {handleSubmit,voucheritems}: any = this.props;
        const {settings,settings:{tickets}, navigation,theme:{colors}} = this.props;



        let ticketsettings:any = Object.values(tickets).filter((item:any)=>{
            return item.tickettype === 'task'
        })

        const allowsignature:any = ticketsettings?.[0]?.allowsignature


        this.paymentmethod = Boolean(settings.paymentgateway) && Object.keys(settings.paymentgateway).map((key: any) => {
            const b: any = this.getGatewayDetailByKey(key, 'displayname');
            return {label: b.value, value: key}
        });


        //setNavigationOptions(navigation, "",colors)

        return (
            <>

                {Boolean(objToArray(voucheritems).length > 0) &&  <Card style={[styles.card]}>
                    <Card.Content  style={[styles.cardContent]}>

                        <Form
                            onSubmit={this.handleSubmit}
                            initialValues={{...this.initdata}}>
                            {propsValues => (
                                <View>
                                    <View>
                                        <View>

                                            {allowsignature &&   <View style={[styles.grid,styles.center,styles.justifyContent,styles.noWrap,{marginTop:5}]}>

                                                <View>
                                                    <Paragraph style={[styles.paragraph]}>Digital Signature required</Paragraph>
                                                    <Paragraph style={[styles.paragraph]}>to complete this task</Paragraph>
                                                </View>

                                                <View>
                                                    <Field name="signaturerequired">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={''}
                                                                value={Boolean(voucher.data.signaturerequired == '1') }
                                                                inputtype={'switch'}
                                                                onChange={(value: any) => {
                                                                    let v = value ? 1 : 0;
                                                                    voucher.data.signaturerequired = v;
                                                                    props.input.onChange(v);
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>
                                            </View>}


                                            <View style={[styles.grid,styles.center,styles.justifyContent]}>
                                                <Paragraph style={[styles.paragraph]}>Receive Advance Payment</Paragraph>
                                                <View>
                                                    <Field name="isPaymentReceived">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={''}
                                                                value={Boolean(voucher.data.isPaymentReceived == '1') }
                                                                inputtype={'switch'}
                                                                onChange={(value: any) => {
                                                                    let v = value ? 1 : 0;
                                                                    props.input.onChange(v);
                                                                    voucher.data.isPaymentReceived = v;
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>
                                            </View>

                                            {
                                                Boolean(voucher.data.isPaymentReceived == '1')   && <>
                                                    <Paragraph style={[styles.paragraph, styles.mb_10, {
                                                        fontSize: 25,
                                                        height: 40,
                                                        paddingTop: 20,
                                                        fontWeight: 'bold'
                                                    }]}>{voucher?.settings?.totalLabel || "Total"} : {toCurrency(voucher.data.vouchertotaldisplay - voucher.data.paidamount)}</Paragraph>


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
                                                                        value={props.input.value}
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
                                                                                value={this.initdata.paymentamount+''}
                                                                                label={'Amount'}
                                                                                inputtype={'textbox'}
                                                                                keyboardType='numeric'
                                                                                left={<TI.Affix text={getCurrencySign()}/>}
                                                                                onChange={(value: any) => {
                                                                                    props.input.onChange(value);
                                                                                    this.initdata.paymentamount = value;
                                                                                    //this.forceUpdate()
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

                                                    <View>
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
                                                </>
                                            }
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Form>

                    </Card.Content>
                </Card> }

                {/*<View style={[styles.pageContent]}>

                <KeyboardScroll>

                </KeyboardScroll>

                    <View style={[styles.submitbutton]}>

                        <Button onPress={() => {
                            if (voucher.data.isPaymentReceived == '1') {
                                this.addPayment();
                            } else {
                                this.payments = [];
                                voucher.data.payments = '';
                                handleSubmit();
                            }
                        }}> {`Generate ${voucher.type.label}`} </Button>
                    </View>

                </View>*/}

            </>
        )
    }
}

const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    voucheritems: state.appApiData.voucheritems,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({
    setModal: (dialog: any) => dispatch(setModal(dialog)),

});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

