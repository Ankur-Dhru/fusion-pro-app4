import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";
import {Card, Divider, Paragraph, Text, Title, withTheme} from "react-native-paper";


import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {setPendingInvoices, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";
import {chevronRight, voucher} from "../../../../lib/setting";
import {
    clone,
    errorAlert,
    getDefaultCurrency,
    getIntraStateTax,
    getStateList,
    isStateVisible,
    log
} from "../../../../lib/functions";
import {getProductData} from "../../../../lib/voucher_calc";
import {setAlert} from "../../../../lib/Store/actions/components";
import InputField from "../../../../components/InputField";
import {Field} from "react-final-form";
import {assignOption} from "../../../../lib/static";
import {v4 as uuidv4} from "uuid";
import {store} from "../../../../App";
import {ProIcon} from "../../../../components";
import AssetType from "../AssetType";
import Tooltip, {STEPS, TooltipContainer} from "../../../../components/Spotlight/Tooltip";


export const currencyRate = (currencyName: any) => {
    const {currency} = store.getState().appApiData.settings;
    const rate = currency[currencyName].rate
    return parseFloat(rate);
}


export const getOutStandingOpening = (client: any) => {

    try {
        let outstandingopening = 0, outstandingopeningdisplay = 0, paidopening = 0, paidopeningdisplay = 0,
            dueOpeningAmount = 0, dueOpeningAmountDisplay = 0;
        if (+client?.outstandingopening > 0) {
            outstandingopening = client.outstandingopening;
            outstandingopeningdisplay = outstandingopening * currencyRate(client.currency)
        }

        if (+client?.paidopening) {
            paidopening = +client.paidopening;
            paidopeningdisplay = paidopening * currencyRate(client.currency)
        }

        dueOpeningAmount = outstandingopening - paidopening;
        dueOpeningAmountDisplay = outstandingopeningdisplay - paidopeningdisplay;

        return {
            outstandingopening,
            outstandingopeningdisplay,
            paidopening,
            paidopeningdisplay,
            dueOpeningAmount,
            dueOpeningAmountDisplay
        }
    } catch (e: any) {
        log('e', e)
    }


}

class VoucherView extends Component<any> {

    statelist: any = [];

    constructor(props: any) {
        super(props);
        const {placeofsupply}: any = voucher.settings;
        if (voucher.data?.clientdetail) {

            placeofsupply && this.getStates(voucher.data?.clientdetail?.country)
        }
        //// default load default client data
        this.getClientDetail({clientid: voucher.data.clientid}, false).then()


    }

    getStates = (country: any) => {
        getStateList(country).then((result) => {
            if (result.data) {
                this.statelist = Object.keys(result.data).map((k) => assignOption(result.data[k].name, k));
                this.forceUpdate()
            }
        });
    }


    handleClient = (values: any, gobackdisable?: any, loader?: any) => {

        const {settings, voucheritems, navigation, updateVoucherItems, selectClient, form, handleSubmit} = this.props;

        ////////// ONLY CLIENT SELECTION FOR JOURNAL //////////
        if (voucher?.settings?.api === 'journal') {
            selectClient(clone(values))
            this.forceUpdate()
            navigation.goBack();
            return
        }
        ////////// ONLY CLIENT SELECTION FOR JOURNAL //////////


        let companyCurreny = getDefaultCurrency();

        try {

            voucher.data = {
                ...voucher.data,
                ...values,
                clientname: values?.displayname,
                newclient: 1,
                placeofsupply: settings?.general?.state,
                vouchercurrencyrate: 1,
                clientid: values?.clientid,
                currency: companyCurreny.__key,
                client: {
                    phone: values?.phone,
                    displayname: values?.displayname,
                    clientid: values.clientid,
                    clienttype: voucher?.settings?.partyname === "Client" ? 0 : 1,
                }
            };

            log('voucheritems',voucheritems)

            this.getClientDetail(values, loader).then(() => {
                //navigation?.forceRefresh();
                //this.forceUpdate()

                log('voucher.settings.api',voucher.settings.api)

                /////// update voucher items like pricing, place of supply
                if (Boolean(voucheritems) && (voucher.settings.api === 'voucher' || voucher.settings.api === 'expense')) {
                    try {
                        let inout = (voucher.data.vouchertype === 'inward' || voucher.data.vouchertype === 'outward');
                        Object.keys(voucheritems).map((keys: any) => {

                            let item = voucheritems[keys];

                            if (voucher.data.voucherid) {
                                item.defaulttaxgroupid = item?.itemdetail?.itemtaxgroupid;
                                item = {...item, ...item.itemdetail}
                            }
                            let defaulttaxgroupid = item.defaulttaxgroupid;
                            let producttaxgroupid = item.producttaxgroupid;

                            item.producttaxgroupid = inout ? getIntraStateTax(defaulttaxgroupid ? defaulttaxgroupid : producttaxgroupid, voucher.data.placeofsupply, voucher.data.taxregtype) : defaulttaxgroupid ? defaulttaxgroupid : producttaxgroupid

                            item = {...item, ...getProductData(item, voucher.data.currency, companyCurreny.__key, item.productqnt, undefined, Boolean(voucher?.data?.vouchertype === 'inward'))}

                            /*if(voucher.settings.api === 'expense'){
                                item.productratedisplay = currencyRate(voucher.data.currency) * item.productrate;
                                item.productrate = currencyRate(companyCurreny.__key) * item.productrate;
                            }
                            else {

                            }*/

                            voucheritems[keys] = item;
                        });

                        updateVoucherItems(clone(voucheritems))
                    } catch (e) {
                        log('e', e)
                    }


                }


                if (Boolean(voucher.settings.assettype) && Boolean(voucher?.data?.assetid)) {

                    this.selectedAsset({
                        assetid: "0",
                        assettype: voucher?.data?.assettype,
                        basefield: voucher?.data?.basefield,
                        brand: voucher?.data?.brand,
                        model: voucher?.data?.model,
                        data: voucher?.data?.data,
                    }, gobackdisable)
                } else {
                    !Boolean(gobackdisable) && navigation.goBack();
                }
            });


        } catch (e) {
            log('e', e)
        }

    }

    getClientDetail = async (values: any, loader: any) => {

        try {
            const {setPendingInvoices, settings, setAlert, navigation} = this.props;
            const {placeofsupply}: any = voucher.settings;
            let queryString: any = {clientid: values.clientid, assets: 1}
            if (values.phone) {
                queryString = {...queryString, phone: values.phone.replace(/[^a-zA-Z0-9]/g, '')}
            }

            voucher.data.clientdetail = '';

            (Boolean(queryString.clientid) || Boolean(queryString.phone)) && await requestApi({
                method: methods.get,
                action: actions.clients,
                queryString: queryString,
                loader: loader,
                showlog: true
            }).then((result) => {
                if (result.status === SUCCESS && Boolean(result.data)) {

                    let clientdetail = result.data;


                    if (Boolean(clientdetail)) {
                        let currencyrate = settings?.currency[clientdetail?.currency]?.rate;
                        voucher.data = {
                            ...voucher.data,
                            currency: clientdetail.currency,
                            vouchercurrencyrate: currencyrate,
                            placeofsupply: clientdetail.state,
                            clientname: clientdetail.displayname,
                            clientid: clientdetail.clientid,
                            taxregtype: clientdetail.taxregtype,
                            phone: clientdetail.phone,
                            email: clientdetail.email,
                            newclient: 0,
                            assetslist: Boolean(clientdetail.assets),
                            client: {
                                phone: clientdetail.phone,
                                displayname: clientdetail.displayname,
                                clientid: clientdetail.clientid
                            },
                            clientdetail
                        };


                        const {fieldVisible} = isStateVisible(voucher.data?.clientdetail);
                        fieldVisible && clientdetail.country && placeofsupply && this.getStates(clientdetail.country);

                        let pendings: any = false;

                        ///////////create opening balance outstanding row /////////////
                        let {
                            outstandingopeningdate,
                            outstandingopening,
                            outstandingopeningdisplay,
                            paidopening,
                            paidopeningdisplay,
                            dueOpeningAmount,
                            dueOpeningAmountDisplay
                        }: any = getOutStandingOpening(clientdetail);


                        /////////// OPENING OUTSTANDING NOT LISTED IN CREDIT AND DEBIT NOTE
                        if (+clientdetail?.outstandingopening > 0 && +clientdetail?.outstandingopening > paidopening && !voucher.settings.reasonlist) {

                            const opening = {
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
                            pendings = {"0": opening}
                        }
                        ///////////create opening balance outstanding row /////////////

                        pendings = {
                            ...pendings,
                            ...clientdetail.pendinginvoice, ...clientdetail.pendingbills
                        }

                        /////////// CREDIT AND DEBIT NOTE MERGE INVOICE AND BILLS TO PENDING INOVICES AND PENDING BILLS
                        if (voucher.settings.reasonlist) {
                            pendings = {
                                ...pendings,
                                ...clientdetail.invoices, ...clientdetail.bills
                            }
                        }
                        /////////// CREDIT AND DEBIT NOTE MERGE INVOICE AND BILLS TO PENDING INOVICES AND PENDING BILLS

                        setPendingInvoices(clone(pendings))
                        if (Boolean(voucher.settings.invoiceitems) && !Boolean(Object.keys(pendings).length) && !Boolean(voucher.data.voucherid)) {
                            errorAlert('No any pending invoices found');
                        }
                    }
                } else {
                    const {fieldVisible} = isStateVisible();
                    fieldVisible && placeofsupply && this.getStates(settings.general.country);
                    setPendingInvoices('')
                }

            });
        } catch (e) {
            log('e', e)
        }


    }

    removeClient = () => {
        this.handleClient({clientid: 1, displayName: 'Walkin'}, true)
    }

    selectedAsset = (asset: any, gobackdisable?: any) => {
        const {form, handleSubmit, navigation, values} = this.props;


        if (handleSubmit) {

            let {globaltax, invoiceitems, voucheritems, outstanding, ...data} = voucher?.data;
            voucher.data = {
                ...voucher.data,
                assetid: "0",
                assettype: data.assettype,
                assetdata: data.assetdata,
            }
            handleSubmit(values);

        } else {
            let selectedAsset: any = {
                assetid: asset?.assetid,
                assettype: asset?.assettype,
                basefield: asset?.basefield,
                brand: asset?.brand,
                model: asset?.model,
                data: asset?.data,
            }
            form.change("assetid", asset?.assetid);
            form.change("assettype", asset?.assettype);
            form.change("assetname", asset?.basefield);
            form.change("basefield", asset?.basefield);
            form.change("brand", asset?.brand);
            form.change("model", asset?.model);
            form.change("data", asset?.data);
            voucher.data = {
                ...voucher.data,
                ...selectedAsset
            };
        }

        !Boolean(gobackdisable) && navigation.goBack();


    }

    render() {
        const {navigation, editmode, item, foritem, values} = this.props;
        const {colors} = this.props.theme;

        navigation.handleClient = this.handleClient

        const {fieldVisible, labelVisible, taxname} = isStateVisible(voucher.data?.clientdetail);
        const {taxtreatment, placeofsupply}: any = voucher.settings;

        return (

            <>

                <Card style={[styles.card]}>
                    <Card.Content style={{paddingBottom: 0}}>


                        <Tooltip
                            message={`Select ${voucher.settings.partyname}`}
                            stepOrder={STEPS.SELECT_CLIENT_VENDOR}
                        >
                            <TooltipContainer stepOrder={STEPS.SELECT_CLIENT_VENDOR}>
                                <View style={[styles.fieldspace]}>
                                    <TouchableOpacity onPress={() => {
                                        editmode ? navigation.navigate('ClientList', {
                                            handleClient: this.handleClient,
                                            title: 'Client List'
                                        }) : navigation.navigate('ClientOverview', {
                                            screen: 'ClientOverview',
                                            client: {
                                                clientid: voucher.data.clientid,
                                                displayname: voucher.data.client, ...voucher.data.client
                                            },
                                            item: {vouchertypeid: voucher.settings.partyname === 'Client' ? '000-000-000' : '111-111-111'},
                                        })
                                    }}>
                                        <View>
                                            <Text
                                                style={[styles.inputLabel, {color: colors.inputLabel}]}>{voucher.settings.partyname} Name</Text>
                                            <View style={[styles.grid, styles.middle, styles.justifyContent,]}>
                                                {!foritem && <View>
                                                    {(Boolean(voucher.data?.clientname)) && <Paragraph
                                                        style={[styles.paragraph, styles.text_sm, styles.bold]}>{voucher.data?.clientname}</Paragraph>}
                                                    {!Boolean(voucher.data?.clientname) && <Paragraph
                                                        style={[styles.paragraph, styles.text_sm, {color: `${colors.text}2d`}]}>Select {voucher.settings?.partyname}</Paragraph>}
                                                    {Boolean(voucher.data.phone) && Boolean(voucher?.data?.clientid?.toString() !== '1') &&
                                                        <Paragraph
                                                            style={[styles.paragraph, styles.muted]}>{voucher.data?.phone}</Paragraph>}
                                                </View>}
                                                {foritem && <View>
                                                    {(Boolean(item?.clientname)) && <Paragraph
                                                        style={[styles.paragraph, styles.text_sm, styles.bold]}>{item.clientname}</Paragraph>}
                                                    {!Boolean(item?.clientname) && !Boolean(item.clientname) &&
                                                        <Paragraph
                                                            style={[styles.paragraph, styles.text_sm, {color: `${colors.text}2d`}]}>Select {voucher.settings.partyname}</Paragraph>}
                                                </View>}
                                                <View style={[styles.ml_auto]}>
                                                    {(voucher?.data?.clientid?.toString() !== '1' && editmode && voucher.settings.partyname === 'Client') && Boolean(voucher.data?.clientname) &&
                                                        <TouchableOpacity
                                                            onPress={() => this.removeClient()}><Title><ProIcon
                                                            name={'circle-xmark'} color={styles.red.color}
                                                            size={16}/></Title></TouchableOpacity>}
                                                </View>
                                                <View>
                                                    <Title>
                                                        {chevronRight}
                                                    </Title>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>

                                </View>
                            </TooltipContainer>
                        </Tooltip>


                        {taxtreatment && <View style={[styles.grid, styles.justifyContent]}>
                            {(labelVisible || fieldVisible) && Boolean(taxname) && <View style={{width: '49%'}}>

                                <Field name={'taxname'}>
                                    {props => (
                                        <>
                                            <InputField
                                                label={'Tax Treatment'}
                                                mode={'flat'}
                                                value={taxname}
                                                editmode={false}
                                                inputtype={'textbox'}>
                                            </InputField>
                                        </>
                                    )}
                                </Field>

                            </View>}


                            {(fieldVisible) && placeofsupply && Boolean(this.statelist.length) &&
                                <View style={{width: '49%'}}>

                                    <Field name="voucher.data.placeofsupply">
                                        {props => (
                                            <>
                                                <InputField
                                                    label={'State (Place of supply)'}
                                                    mode={'flat'}
                                                    list={this.statelist}
                                                    value={voucher.data.placeofsupply}
                                                    selectedValue={voucher.data.placeofsupply}
                                                    key={uuidv4()}
                                                    editmode={editmode}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    listtype={'other'}
                                                    onChange={(value: any) => {
                                                        voucher.data.placeofsupply = value;
                                                        this.forceUpdate()
                                                    }}>
                                                </InputField>
                                            </>
                                        )}
                                    </Field>
                                </View>}

                        </View>}
                    </Card.Content>
                </Card>


                {Boolean(voucher.settings.assettype) && !Boolean(voucher.data.voucherid) &&
                    <>
                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View>
                                    {Boolean(voucher.data.clientid) && (voucher?.data?.clientid?.toString() !== '1') && voucher.data.assetslist &&
                                        <View style={[styles.mb_5]}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('ListAssets', {
                                                    screen: 'ListAssets',
                                                    client: {clientid: voucher.data.clientid},
                                                    fromJob: true,
                                                    selectedAsset: this.selectedAsset,
                                                    assetslist: true
                                                })}>
                                                <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                    <Paragraph
                                                        style={[styles.paragraph, styles.caption]}>{'Assets List'}</Paragraph>
                                                    {chevronRight}
                                                </View>
                                            </TouchableOpacity>
                                            <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                            {<Paragraph style={[styles.paragraph, styles.muted, styles.text_xs]}>select
                                                from asset list or create new after select asset type</Paragraph>}
                                        </View>}
                                </View>
                                <View>
                                    <AssetType navigation={navigation} editmode={editmode} values={values}/>
                                </View>
                            </Card.Content>
                        </Card>
                    </>
                }
            </>
        )
    }
}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    voucheritems: state.appApiData.voucheritems,

})
const mapDispatchToProps = (dispatch: any) => ({
    setPendingInvoices: (invoices: any) => dispatch(setPendingInvoices(invoices)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
    setAlert: (alert: any) => dispatch(setAlert(alert)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(VoucherView));


