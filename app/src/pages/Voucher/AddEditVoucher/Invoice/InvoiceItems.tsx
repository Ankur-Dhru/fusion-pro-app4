import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import {styles} from "../../../../theme";

import {Button, CheckBox, InputBox, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Paragraph, TextInput as TI, Divider, withTheme, Card} from "react-native-paper";


import {
    clone,
    getCurrencySign,
    log,
    objToArray,
    setDecimal,
    toCurrency,
    updateComponent
} from "../../../../lib/functions";
import EditInvoice from "./EditInvoice";
import {setPendingInvoices} from "../../../../lib/Store/actions/appApiData";
import moment from "moment";
import {getFloatValue} from "../../../../lib/voucher_calc";
import {voucher} from "../../../../lib/setting";
import {Field} from "react-final-form";
import InputField from "../../../../components/InputField";
import {getOutStandingOpening} from "../Client/ClientDetail";
import { required } from '../../../../lib/static';




class InvoiceItemsSummary extends Component<any> {

    initdata:any = {};

    total:any = '0';
    amountrefunded:any = '0';
    amountexcess:any = '0';
    invoiceitems:any=[];
    invoicesRef:any;
    isShowInvoices:any = false;

    constructor(props:any) {
        super(props);
        this.initdata = props.initdata
        this.state={
            showitems:false,
            bankcharges:voucher.data.bankcharges,
            advancepayment:Boolean(voucher.data.advancepayment === '1')
        }
        this.invoicesRef = React.createRef();
    }



    paidInvoices = (value?:any) => {

        const {setPendingInvoices,pendinginvoices}:any = this.props;
        const {bankcharges}:any = this.state;

        if(bankcharges){
            pendinginvoices && Object.keys(pendinginvoices).map((key:any)=>{
                pendinginvoices[key].productratedisplay = '0';
            })
        }
        else{
            let remaining:any =  0;
            if(voucher.data.receivedfullamount){
                remaining =  +value;
            }
            pendinginvoices && Object.keys(pendinginvoices).map((key:any)=>{
                const {vouchertotaldisplay,paidamountdisplay} = pendinginvoices[key];

                let  dueamount  = getFloatValue(vouchertotaldisplay) - getFloatValue(paidamountdisplay);

                if(remaining >= dueamount){
                    pendinginvoices[key].productratedisplay = dueamount;
                }
                else{
                    pendinginvoices[key].productratedisplay = (remaining >=0)?remaining:'0'
                }
                remaining = remaining - dueamount;
            })
        }
        setPendingInvoices(clone(pendinginvoices));
    }



    getItemData = (key: any, item: any) => {

        const {voucherdate,voucherprefix,voucherdisplayid,vouchertotal,paidamount,vouchertotaldisplay,paidamountdisplay,productratedisplay,voucheritemid,itemtype} = item;

        let total = getFloatValue(vouchertotal),
            paid = getFloatValue(paidamount),
            dueAmount = total - paid;

        let totaldisplay = getFloatValue(vouchertotaldisplay),
            paiddisplay = getFloatValue(paidamountdisplay),
            dueAmountDisplay = totaldisplay - paiddisplay;


        return {
            voucherrelatedid: key,
            voucherdate,
            voucherprefix,
            voucherdisplayid,
            vouchertotal,
            paidamount,
            vouchertotaldisplay,
            paidamountdisplay,
            dueAmount,
            dueAmountDisplay,
            productratedisplay:productratedisplay || 0,
            voucheritemid,
            itemtype,
            accountid:voucher.data.accountid
        }
    }


    render() {

        const {advancepayment,bankcharges}:any = this.state;

        const {navigation,settings,editmode,pendinginvoices,theme:{colors}}:any = this.props;

        let invoiceitems:any = {}

        ///// EDIT VOUCHER SET ITEM BY RELATED ID IN ROOT
        if(voucher.data.voucherid){
            let invoices:any = voucher.data.voucheritems
            Boolean(invoices) && Object.keys(invoices).map((key:any)=>{
                let data:any = invoices[key];

                ////////// OPENING OUTSTANDING IN EDIT MODE ////////
                if (data.refid === "opening") {
                    let {outstandingopeningdate,outstandingopening,outstandingopeningdisplay,paidopening,paidopeningdisplay,dueOpeningAmount,dueOpeningAmountDisplay}:any = getOutStandingOpening(voucher.data.clientdetail);
                    data = {
                         ...data,
                        dueAmount: dueOpeningAmount,
                        dueAmountDisplay: dueOpeningAmountDisplay,
                        itemtype: "opening",
                        paidamount: paidopening,
                        paidamountdisplay: paidopeningdisplay,
                        voucherdate: outstandingopeningdate,
                        voucherdisplayid: "Customer opening balance",
                        voucherrelatedid: "0",
                        vouchertotal: outstandingopening,
                        vouchertotaldisplay: outstandingopeningdisplay
                    }
                }
                ////////// OPENING OUTSTANDING IN EDIT MODE ////////


                const relatedid = data?.voucherrelatedid;
                if(relatedid) {
                    invoiceitems[relatedid] = {...data,...data?.paidinvoices, ...data?.paidbills}
                    if(Boolean(pendinginvoices && pendinginvoices[relatedid])){
                        invoiceitems[relatedid] = {
                            ...invoiceitems[relatedid],
                            ...pendinginvoices[relatedid]
                        }
                    }
                }
            });
        }

        /////// UNPAID INVOICES APPLY OTHER VOUCHER SETTINGS LIKE ACCOUNTID, RATE, DIPLAY RATE
        if (pendinginvoices) {
            Object.keys(pendinginvoices).forEach((key, index) => {
                pendinginvoices[key] = this.getItemData(key, pendinginvoices[key])
            })
        }

        /////////// MERGE PAID AND UNPAID INVOICES
        invoiceitems = {
            ...pendinginvoices,
            ...invoiceitems,
        }

        const {paymenttype,receivedamount,bankchanges,partyname}:any = voucher.settings;
        const dateformat:any = settings.general.dateformat;
        let totaldue = 0;
        invoiceitems && Object.keys(invoiceitems).map((key:any)=>{
            let invoice = invoiceitems[key];
            totaldue += (invoice.vouchertotaldisplay-invoice.paidamountdisplay);
        })



        //////// DISPLAY ITEMS
        this.invoiceitems = objToArray(clone(invoiceitems));


        //////// CREATE JSON VOUCHERITEM FOR SAVE
        let voucheritem: any = [];
        if (pendinginvoices) {
            this.invoiceitems.map((item:any,key:any)=>{
                if(Boolean(item.productratedisplay>0)){
                    voucheritem.push(item)
                }
            })
        }
        voucher.data.voucheritem = voucheritem;



        //////////// RECEIVE AND MADE PAYMENT ITEM SUMMARY
        let data = voucher.data;

        let totalpaymentamount = 0,
            totalpaymentamountdisplay = 0,
            vouchertotaldisplay = getFloatValue(data?.vouchertotaldisplay || 0),
            mainCurrencyRate = (1 / data.vouchercurrencyrate),
            vouchertotal = getFloatValue(vouchertotaldisplay * mainCurrencyRate);


        if (data.voucheritem) {
            let onlyOneReceipt = Boolean(data.bankcharges) || data.taxregtype === "o";
            let onePaidComplete = false;
            data.voucheritem = data.voucheritem.map((item: any) => {

                    let {productratedisplay} = item;
                    if (onlyOneReceipt && onePaidComplete) {
                        productratedisplay = 0;
                        item.productratedisplay = productratedisplay || 0;
                    }
                    if (!onePaidComplete){
                        onePaidComplete = Boolean(productratedisplay);
                    }

                    item.productrate = (productratedisplay * mainCurrencyRate) || 0;

                    const paymentamountdisplay = getFloatValue(productratedisplay || 0);
                    const paymentamount = getFloatValue(item.productrate);

                    totalpaymentamountdisplay += paymentamountdisplay;
                    totalpaymentamount += paymentamount;

                    return clone(item);

            })
        }


        data.totalpaymentamountdisplay = totalpaymentamountdisplay;
        data.totalpaymentamount = totalpaymentamount;

        data.totalamountuseforpaymentdisplay = totalpaymentamountdisplay;
        data.totalamountuseforpayment = totalpaymentamount;

        data.totalexcessamountdisplay = vouchertotaldisplay - totalpaymentamountdisplay;
        data.totalexcessamount = vouchertotal - totalpaymentamount;

        data.vouchertotal = vouchertotal;



        return (
            <>
                {Boolean(voucher.data.clientname) && <>

                    <Card style={[styles.card]}>
                        <Card.Content>

                            <View>
                        {paymenttype && <Field name="advancepayment">
                            {props => {
                                return (<><InputField
                                    label={'Payment Type'}
                                    mode={'flat'}
                                    editmode={editmode}
                                    hideDivider={true}
                                    morestyle={styles.voucherDropdown}
                                    list={[{label: 'Invoice Payment',value: '0'},{label: 'Advance Payment',value: '1'}]}
                                    value={props.input.value}
                                    selectedValue={props.input.value}
                                    displaytype={'bottomlist'}
                                    inputtype={'dropdown'}
                                    listtype={'other'}
                                    onChange={(value: any) => {
                                        props.input.onChange(value);
                                        voucher.data.advancepayment = value;
                                        this.setState({advancepayment:value === '1'})
                                    }}>
                                </InputField>
                                </>)
                            }}
                        </Field>}



                        {receivedamount && <View>
                            <View>
                                {!Boolean(voucher.data.receivedfullamount) ? <Field name="vouchertotaldisplay" validate={required}>
                                    {props => {
                                        return (<><InputField
                                            {...props}
                                            value={props.input.value}
                                            label={`${voucher.settings.partyname === 'Vendor' ? 'Pay' : 'Receive'} Amount`}
                                            disabled={!editmode}
                                            inputtype={'textbox'}
                                            autoFocus={false}
                                            keyboardType='numeric'
                                            left={<TI.Affix text={getCurrencySign()}/>}
                                            onChange={(value:any)=> {props.input.onChange(value); voucher.data.vouchertotaldisplay= value; this.paidInvoices(value)}}
                                        />
                                        </>)
                                    }}
                                </Field> : <View   style={[styles.fieldspace]}>
                                    <Text style={[styles.inputLabel,{color:colors.inputbox}]}>{`${voucher.settings.partyname === 'Vendor' ? 'Pay' : 'Receive'} Amount`}</Text>
                                    <View style={[styles.grid,styles.justifyContent,{marginBottom:5}]}>
                                        <Paragraph   style={[styles.paragraph]}>{toCurrency(voucher.data.vouchertotaldisplay)}</Paragraph>
                                    </View>
                                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                                </View>}



                            </View>
                            <View>
                                <Field name="receivedfullamount">
                                    {props => {
                                        return (<><View style={{marginLeft:-25}}><CheckBox
                                            value={props.input.value}
                                            editmode={editmode}
                                            label={'Received Full Amount'}
                                            onChange={(value: any) => {
                                                voucher.data.vouchertotaldisplay = value?totaldue:'0';
                                                voucher.data.receivedfullamount= value;
                                                this.paidInvoices(value?totaldue:0)
                                                props.input.onChange(value);
                                            }}/></View>
                                        </>)
                                    }}
                                </Field>



                            </View>

                            <View>
                                {!advancepayment && Boolean(this.invoiceitems.length) && Boolean(totaldue) && !voucher.data.voucherid && <Paragraph style={[styles.paragraph,styles.red,{textAlign:'right'}]}>Total Due : {toCurrency(totaldue)}</Paragraph>}
                            </View>
                        </View>}

                        {bankchanges &&  <View>
                            <View>
                                <View>
                                    <Field name="bankcharges">
                                        {props =>  {
                                            return (<InputField
                                                value={props.input.value || '0'}
                                                label={`Bank Charges (if any)`}
                                                disabled={!editmode}
                                                autoFocus={false}
                                                inputtype={'textbox'}
                                                keyboardType='numeric'
                                                left={<TI.Affix text={getCurrencySign()} />}
                                                onChange={(value:any)=>{
                                                    props.input.onChange(value);
                                                    voucher.data.bankcharges = value;
                                                    this.setState({bankcharges: Boolean(value>0)},()=>this.paidInvoices())
                                                }}
                                            />)
                                        }}
                                    </Field>
                                </View>
                            </View>
                        </View> }

                    </View>

                        </Card.Content>
                    </Card>

                    {!advancepayment && <>

                        <Card style={[styles.card]}>
                            <Card.Content>

                                <View>
                                    {Boolean(this.invoiceitems && this.invoiceitems.length) && <><View>
                                        <TouchableOpacity onPress={() => {
                                            this.isShowInvoices = !this.isShowInvoices;
                                            updateComponent(this.invoicesRef, 'display', this.isShowInvoices ? 'flex' : 'none')
                                        }}>

                                            <View
                                                style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                <Paragraph
                                                    style={[styles.paragraph, styles.caption]}>
                                                    {this.invoiceitems && this.invoiceitems.length} {voucher.settings.invoiceitems}
                                                </Paragraph>
                                                <ProIcon name={`chevron-down`} size={16}/>
                                            </View>

                                        </TouchableOpacity>


                                    </View>
                                        </> }
                                </View>

                                <View style={[{display:'none'}]} ref={this.invoicesRef}>
                                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                                    {
                                        Boolean(this.invoiceitems) &&   this.invoiceitems.map((invoice:any,key:any)=>{

                                            return(
                                                <View style={[styles.py_4]} key={key}>

                                                    <TouchableOpacity  onPress={()=> {
                                                        // @ts-ignore
                                                        let disabled = bankcharges && Boolean(pendinginvoices && objToArray(pendinginvoices).some((someItem: any) => Boolean(someItem.productratedisplay>0)) && !Boolean(invoice.productratedisplay>0));
                                                        if(editmode && !disabled) {
                                                            navigation.navigate('EditInvoice', {
                                                                screen: EditInvoice,
                                                                invoice: invoice,
                                                                key: invoice.voucherrelatedid,
                                                            })
                                                        }
                                                    }}
                                                                       style={[styles.pb_4]}>
                                                        <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                                            <Paragraph style={[styles.text_sm,styles.bold]}>{invoice.voucherprefix}{invoice.voucherdisplayid}</Paragraph>
                                                            <Paragraph style={[styles.text_sm,styles.bold]}>{moment(invoice.voucherdate).format(dateformat)}</Paragraph>
                                                        </View>
                                                        <View>
                                                            <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                                                <View>
                                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>Total</Paragraph>
                                                                </View>
                                                                <View>
                                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>{toCurrency(parseFloat(invoice.vouchertotaldisplay))}</Paragraph>
                                                                </View>
                                                            </View>
                                                            <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                                                <View>
                                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>Paid</Paragraph>
                                                                </View>
                                                                <View>
                                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>{toCurrency(parseFloat(invoice.paidamountdisplay) || '0')}</Paragraph>
                                                                </View>
                                                            </View>
                                                            <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                                                <View>
                                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs]}>Due</Paragraph>
                                                                </View>
                                                                <View>
                                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs,styles.red]}>{toCurrency((invoice.vouchertotaldisplay-invoice.paidamountdisplay) || '0')}</Paragraph>
                                                                </View>
                                                            </View>
                                                            {Boolean(parseFloat(invoice.productratedisplay)) &&  <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                                                <View>
                                                                    <Paragraph style={[styles.paragraph,styles.muted, styles.text_xs,styles.bold]}>Receive</Paragraph>
                                                                </View>
                                                                <View>
                                                                    <Paragraph style={[styles.paragraph,styles.text_xs,styles.green,styles.bold]}>{toCurrency(parseFloat(invoice.productratedisplay))}</Paragraph>
                                                                </View>
                                                            </View>}
                                                        </View>
                                                    </TouchableOpacity>
                                                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                                                </View>
                                            )
                                        })
                                    }
                                </View>

                            </Card.Content>
                        </Card>

                        {Boolean(data.voucheritem && data.voucheritem.length) &&  <View>

                            <Card style={[styles.card]}>
                                <Card.Content style={{paddingBottom:0}}>

                                    <View style={[styles.pb_4]}>

                                <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                    <View><Paragraph style={[styles.paragraph,styles.text_xs]}>Total</Paragraph></View>
                                    <View><Paragraph
                                        style={[styles.paragraph,styles.textRight,styles.text_xs]}>{toCurrency(data.totalpaymentamountdisplay || '0')}</Paragraph></View>
                                </View>

                                <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                    <View><Paragraph style={[styles.paragraph,styles.text_xs]}>Amount Paid</Paragraph></View>
                                    <View><Paragraph
                                        style={[styles.paragraph,styles.textRight,styles.text_xs]}>{toCurrency(data.vouchertotaldisplay || '0')}</Paragraph></View>
                                </View>

                                <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                    <View><Paragraph style={[styles.paragraph,styles.text_xs]}>Amount used for payments</Paragraph></View>
                                    <View><Paragraph
                                        style={[styles.paragraph,styles.textRight,styles.text_xs]}>{toCurrency(data.totalamountuseforpaymentdisplay || '0')}</Paragraph></View>
                                </View>

                                <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                    <View><Paragraph style={[styles.paragraph,styles.text_xs]}>Amount Refunded</Paragraph></View>
                                    <View><Paragraph
                                        style={[styles.paragraph,styles.textRight,styles.text_xs]}>{toCurrency(this.amountrefunded || '0')}</Paragraph></View>
                                </View>

                                <View style={[styles.grid,styles.middle,styles.justifyContent]}>
                                    <View><Paragraph style={[styles.paragraph,styles.text_xs]}>Amount in excess</Paragraph></View>
                                    <View><Paragraph
                                        style={[styles.paragraph,styles.textRight,styles.text_xs]}>{toCurrency(data.totalexcessamountdisplay || '0')}</Paragraph></View>
                                </View>



                            </View>

                                </Card.Content>
                            </Card>

                            <Divider style={[styles.divider,styles.hide,{borderBottomColor:colors.divider}]}/>

                        </View> }
                    </>}

                </>}

            </>
        )
    }

}



const mapStateToProps = (state:any) => ({
    pendinginvoices:state.appApiData.pendinginvoices,
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({
    setPendingInvoices: (invoices:any) => dispatch(setPendingInvoices(invoices)),
});


export default connect(mapStateToProps,mapDispatchToProps)(withTheme(InvoiceItemsSummary));


