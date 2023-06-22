import React, {Component} from "react";
import {Button, Container, Menu, ProIcon} from "../../../components";
import {setNavigationOptions} from "../../../lib/navigation_options";
import {Card, Paragraph, Title, withTheme} from "react-native-paper";
import {apiUrl, backupVoucher, current, update, voucher} from "../../../lib/setting";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../../theme";
import InputField from "../../../components/InputField";
import {ACCESS_TYPE, taxTypes} from "../../../lib/static";
import {Form} from "react-final-form";
import CartItems from "../AddEditVoucher/Items/CartItems";
import CartSummary from "../AddEditVoucher/Items/CartSummary";
import Notes from "../AddEditVoucher/Custom/Notes";
import {
    clone,
    downloadFile,
    errorAlert,
    getAssetData,
    getCurrentCompanyDetails,
    getRoleModuleList,
    getVoucherTypeData,
    isEmpty,
    log,
    setDecimal
} from "../../../lib/functions";
import moment from "moment";
import {
    resetVoucherItems,
    setPendingInvoices,
    setVoucherItems,
    updateVoucherItems
} from "../../../lib/Store/actions/appApiData";
import {setAlert, setDialog, setLoader, setModal, setPageSheet} from "../../../lib/Store/actions/components";
import {connect} from "react-redux";
import requestApi, {actions, jsonToQueryString, methods, SUCCESS} from "../../../lib/ServerRequest";
import ClientCard from "./ClientCard";
import AssetsCard from "./AssetsCard";
import TaskCard from "./TaskCard";
import ConsumableCard from "./ConsumableCard";
import {useIsFocused} from "@react-navigation/native";
import EstimateCard from "./EstimateCard";
import KeyboardScroll from "../../../components/KeyboardScroll";
import DeleteButton from "../../../components/Button/DeleteButton";
import {v4 as uuidv4} from 'uuid';
import {getProductData} from "../../../lib/voucher_calc";
import QRCode from "../AddEditVoucher/Payment/QRCode";
import Signature from "./Signature";
import CopyToInvoice from "./CopyToInvoice";

class EditJobsheet extends Component<any, any> {

    title: any;
    subtitle: any;
    location: any;
    vouchertype: any;
    voucherid: any = false;
    error: boolean = false;
    errorMessage: string = "";
    params: any;
    menuitems = [{label: 'Preview', value: 'preview'}, {label: 'Download', value: 'download'}]
    moreReceiptRef: any;
    isShowReceipt: any;
    moreLedgerRef: any;
    isShowLedger: any;
    currentTicket: any;
    priority_options: any = [];

    constructor(props: any) {
        super(props);

        const {route}: any = this.props;
        this.params = route.params;
        this.state = {editmode: true}
        this.moreReceiptRef = React.createRef();
        this.isShowReceipt = false;
        this.moreLedgerRef = React.createRef();
        this.isShowLedger = false;


        this.resetData()
    }

    resetData = () => {

        const {vouchers, settings, updateVoucherItems, setPendingInvoices} = this.props;


        const {
            isDefaultPrint,
            defaulttaxtype,
            isDefaultMail,
            voucherroundoff,
            defaultdiscountaccount,
            discountplace,
            vouchertransitionaldiscount,
            voucherinlinediscount,
            canchangediscoutnaccount,
            vouchertype: vouchert,
            defaultcustomernotes,
            defaultterms,
            printtemplate,
            istds,
            istcs,
            isadjustment,
        } = vouchers[voucher.type.vouchertypeid];

        let currentdate = moment().format("YYYY-MM-DD");


        const {defaultcurrency, locationid, adminid}: any = getCurrentCompanyDetails();


        voucher.data = {
            new: true,
            ordertype: 'app',
            globaltax: [],
            files: [],
            clientid: '1',
            clientname: 'Walkin / Consumer',
            adjustmentlabel: "Adjustment",
            placeofsupply: "IN-GJ",
            currency: defaultcurrency,
            voucherprint: Boolean(isDefaultPrint) ? '1' : '0',
            voucherprofit: "",
            referenceid: "",
            deliverydate: "",
            deliverystatus: 'Open',
            deliverytime: "",
            companyid: 1,
            locationid: locationid,
            departmentid: "2",
            date: currentdate,
            duedate: currentdate,
            vouchercreatetime: moment().format("HH:mm:ss"),
            defaultdays: 0,
            staffid: parseInt(adminid),
            vouchertaxtype: Boolean(defaulttaxtype) ? defaulttaxtype : Object.keys(taxTypes)[0],
            vouchercurrencyrate: 1,
            referencetype: settings.location[locationid].defaultpaymentgateway,
            payment: settings.paymentgateway[settings.location[locationid].defaultpaymentgateway].settings.paymentmethod,
            voucherremarks: "",
            invoiceitems: [],
            voucheritem: [],
            roundoffselected: vouchert === 'inward' ? 'disable' : voucherroundoff,
            voucherdiscountplace: discountplace,
            vouchertransitionaldiscount: Boolean(vouchertransitionaldiscount) || vouchertransitionaldiscount === "1",
            voucherinlinediscountforitem: Boolean(voucherinlinediscount) || voucherinlinediscount === "1",
            canchangediscoutnaccount: Boolean(canchangediscoutnaccount) || canchangediscoutnaccount === "1",
            discountaccunt: defaultdiscountaccount,
            discounttype: "%",
            accountid: voucher.type.paymentreceiptaccountid || 4,
            isPaymentReceived: '0',
            sendmail: isDefaultMail,
            vouchertypeid: voucher.type.vouchertypeid,
            vouchertype: vouchert,
            vouchernotes: defaultcustomernotes || '',
            toc: defaultterms,
            isadjustment: isadjustment,
            adjustmentamount: 0,
            paymentgateway: settings.location[locationid].defaultpaymentgateway,
            advancepayment: '0',
            istds,
            istcs,
            ...voucher.data.copyinvoice,
        }

        if (Boolean(voucher.settings.assettype)) {
            voucher.data = {
                ...voucher.data,
                reporter: parseInt(adminid),
                priority: "medium",
                warranty: "Paid",
            }
        }


        if (istds || istcs) {
            if (istcs && !istds) {
                voucher.data.selectedtdstcs = "TCS";
            } else {
                voucher.data.selectedtdstcs = "TDS";
            }
        }
        if (printtemplate) {
            voucher.data.selectedtemplate = printtemplate;
        }

        let roleModuleList: any = getRoleModuleList();


        this.state = {isloading: !Boolean(voucher.type.voucherdisplayid)}

        this.title = voucher.type.label;
        this.subtitle = voucher.type.rightvouchertypename;

        this.location = settings.location[locationid]?.locationname;

        voucher.data.vouchertypeid = voucher.type.vouchertypeid;

        const purchaseVoucher = vouchers["71e9cc99-f2d1-4b47-94ee-7aafd481e3c5"];

        voucher.data = {
            ...voucher.data,
            outstanding: {
                globaltax: [],
                companyid: 1,
                departmentid: "2",
                date: currentdate,
                staffid: parseInt(adminid),
                locationid,
                vouchertypeid: purchaseVoucher?.vouchertypeid,
                voucherremarks: "",
                vouchernotes: "",
                vouchertaxtype: Boolean(purchaseVoucher?.defaulttaxtype) ? purchaseVoucher?.defaulttaxtype : Object.keys(taxTypes)[0],
                voucherprint: Boolean(purchaseVoucher?.isDefaultPrint) ? 1 : 0,
                referenceid: "",
                vouchercurrencyrate: 1,
                roundoffselected: purchaseVoucher?.voucherroundoff,
                istds: purchaseVoucher?.istds,
                istcs: purchaseVoucher?.istcs,
                outsourcingitems: []
            }
        }

        if (purchaseVoucher?.istds || purchaseVoucher?.istcs) {
            if (purchaseVoucher?.istcs && !purchaseVoucher?.istds) {
                voucher.data.outstanding.selectedtdstcs = "TCS";
            } else {
                voucher.data.outstanding.selectedtdstcs = "TDS";
            }
        }

        setPendingInvoices('')

    }

    getVoucherDetails = (loader: boolean) => {
        this.menuitems = [{label: 'Preview', value: 'preview'}, {label: 'Download', value: 'download'}];
        const {updateVoucherItems, setPendingInvoices, navigation, ticketsList} = this.props
        const {editmode}: any = this.state;
        requestApi({
            method: methods.get,
            action: actions.voucher,
            queryString: {voucherdisplayid: voucher?.type?.voucherdisplayid, vouchertype: voucher?.type?.vouchertypeid},
            loader,
            loadertype: 'form',
            showlog: true,
        }).then((result) => {


            try {

                if (result.status === SUCCESS) {

                    this.currentTicket = ticketsList[result?.data?.tickettypeid]
                    const {
                        vouchercreatetime,
                        date,
                        tcsaccount,
                        tcsamount,
                        tdsaccount,
                        tdsamount,
                        accessories
                    } = result.data;

                    let time = moment(vouchercreatetime, 'hh:mm A').format('HH:mm');

                    const dates: any = `${date} ${time}`

                    let selectedtdstcs = voucher.data.selectedtdstcs;
                    if (Boolean(tcsaccount) && Boolean(parseFloat(tcsamount))) {
                        selectedtdstcs = "TCS"
                    } else if (Boolean(tdsaccount) && Boolean(parseFloat(tdsamount))) {
                        selectedtdstcs = "TDS"
                    }

                    const {
                        voucheritems, outsourcingdata,
                        outsourcingitems,
                        pickupdate,
                        deliverydate,
                        vendor,
                        outsourcinglocation,
                        outsourcingreferencetype, vendordetail, outsourcingdisplayid, outsourcingprefix, ...otherdata
                    } = result.data

                    Boolean(voucheritems) && Object.keys(voucheritems).forEach((voucheritemid) => {

                        let {voucheritemdata, taxdata, ...item} = voucheritems[voucheritemid];

                        voucher.data.voucheritems = {
                            ...voucher.data.voucheritems,
                            [voucheritemid]: {
                                voucheritemid,
                                ...voucheritemdata,
                                ...taxdata,
                                ...item,
                                hsn: item.hsn,
                                productratedisplay: setDecimal(item.productratedisplay)
                            }
                        }
                    })

                    if (!isEmpty(accessories)) {
                        voucher.data.accessories = accessories.join(",");
                    }

                    let outstanding: any = voucher.data.outstanding;
                    let outsoucingDataAvailable = false;
                    if (outsourcingdata) {
                        outstanding = {
                            ...outstanding,
                            ...outsourcingdata
                        }
                        outsoucingDataAvailable = true;
                    }
                    let outsourcingaddeditems: any = [];
                    if (outsourcingitems) {
                        outstanding.outsourcingitems = outsourcingitems;
                        outsourcingitems.forEach((items: any) => {
                            if (items?.itemdetail) {
                                outsourcingaddeditems.push(items?.itemdetail)
                            }
                        });
                    }
                    if (pickupdate) {
                        outstanding.pickupdate = pickupdate;
                    }
                    if (vendor) {
                        outstanding.vendor = vendor;
                    }
                    if (vendordetail) {
                        outstanding.vendordetail = vendordetail;
                    }
                    if (outsourcinglocation) {
                        outstanding.outsourcinglocation = outsourcinglocation;
                    }
                    if (deliverydate) {
                        outstanding.deliverydate = deliverydate;
                    }
                    if (outsourcingdisplayid) {
                        outstanding.outsourcingdisplayid = outsourcingdisplayid;
                    }
                    if (outsourcingprefix) {
                        outstanding.outsourcingprefix = outsourcingprefix;
                    }

                    if (outsourcingreferencetype) {
                        outstanding.outsourcingreferencetype = outsourcingreferencetype;
                    }


                    voucher.data = {
                        ...voucher.data,
                        ...otherdata,
                        new: false,
                        globaldiscountvalue: result.data?.voucherdiscount,
                        date: dates,
                        files: result.data?.voucherdata?.files,
                        selectedtdstcs,
                        clientname: result?.data?.client,
                        outstanding
                    };

                    voucher.data = {
                        ...voucher.data,
                        vouchertotaldisplay: setDecimal(voucher.data.vouchertotaldisplay),
                        bankcharges: setDecimal(voucher.data.bankcharges),
                    };

                    if (voucher.data.convertedid) {
                        voucher.settings.enableedit = false
                    }

                    if (voucher.data.clientid !== 1) {
                        this.menuitems.push({label: 'Email', value: 'email'});
                    }

                    this.menuitems.push({label: 'Print', value: 'print'});

                    //,{label:'Delete',value:'delete'}

                    this.title = '' + voucher.type.label;
                    this.subtitle = voucher.data.voucherprefix + '' + voucher.data.voucherdisplayid;

                    this.location = voucher.data.location;

                    updateVoucherItems(voucher.data.voucheritems);

                    if (voucher.data?.clientdetail) {
                        let {pendinginvoice, pendingbills, email} = voucher.data.clientdetail
                        voucher.data.email = email;
                        setPendingInvoices(clone(pendinginvoice || pendingbills))
                    }


                    // let appendData: any = {}
                    //
                    // const findId: any = Object.keys(voucher?.data?.clientasset).find((assetid: any) => assetid === voucher?.data?.assetid);
                    // const assetData: any = voucher?.data?.clientasset[findId];
                    //
                    //
                    // let data: any = {};
                    // if (!isEmpty(assetData?.data)) {
                    //     Object.keys(assetData?.data).forEach((key: any) => {
                    //         if (key !== "assetname" &&
                    //             key !== "basefield" &&
                    //             key !== "model" &&
                    //             key !== "brand") {
                    //             data[key] = assetData.data[key];
                    //         }
                    //     })
                    // }
                    //
                    //
                    // if (Boolean(voucher.settings.assettype)) {
                    //     appendData = {
                    //         ...appendData,
                    //         assetid: voucher.data?.assetid || 0,
                    //         assettype: assetData.assettype,
                    //         assetdata: {
                    //             assetname: assetData?.assetname,
                    //             brand: assetData?.brand,
                    //             model: assetData?.model,
                    //             basefield: assetData?.basefield,
                    //             data
                    //         },
                    //     }
                    // }

                    let appendData = getAssetData(voucher?.data?.clientasset, voucher?.data?.assetid)


                    voucher.data = {
                        ...voucher.data,
                        ...appendData,
                    };

                    if (!isEmpty(backupVoucher.voucher.data)) {
                        voucher.data.files = backupVoucher.voucher.data.files
                    }

                    backupVoucher.voucher = clone(voucher);
                    this.setState({isloading: true, editmode: false});


                }
            } catch (e) {
                log('e', e)
            }
        });
    }

    componentWillMount() {

        const {settings, vouchers}: any = this.props;

        const isCountryIndia = settings.general.country === 'IN';
        const hasReversecharge: any = voucher.data.vouchertaxtype === 'exclusive';


        voucher.settings = {
            partyname: 'Client',
            addpayment: false,
            processstatus: false,
            addexpense: false,
            client: true,
            accountlist: false,
            defaultclient: false,
            scanitem: true,
            deliverystatus: false,
            duedate: true,
            duedatetitle: 'Due Date',
            datetitle: 'Date',
            invoicelist: false,
            invoiceitems: false,
            expenseitems: false,
            voucheritems: false,
            cartitems: true,
            inventoryitems: false,
            addserialmfd: false,
            attachment: true,
            notes: true,
            billlist: false,
            reasonlist: false,
            account: false,
            adjustment: false,
            paymenttype: false,
            receivedamount: false,
            fullamount: false,
            bankchanges: false,
            paymentmethod: false,
            enableedit: true,
            eligibleforitc: false, // only for india and enable in bill and debit notes and expense
            taxtreatment: isCountryIndia, // true if client has india country,
            placeofsupply: true,
            reversecharge: false,
            viewledger: true,
            addressbook: true,
            assettype: false,
            customfield: false,
            api: 'voucher',
            canChangeCLient: true,
        }


        ////// JOBSHEET
        if (voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5') {
            voucher.settings = {
                ...voucher.settings,
                duedate: true,
                duedatetitle: 'Est. Delivery Date',
                adjustment: false,
                cartitems: true,
                scanitem: false,
                attachment: true,
                attachmenticon: true,
                hideAttachmentLabel: true,
                notes: true,
                taxtreatment: false,
                placeofsupply: false,
                assettype: true,
                customfield: true,
                totalLabel: "Est. Total"
            }
        }


        if ((voucher.settings.partyname === 'Vendor' || !voucher.settings.defaultclient) && !this.params?.copy) {
            voucher.data = {...voucher.data, clientid: '', clientname: ''}
        }

        if (voucher.type.voucherdisplayid) {
            this.getVoucherDetails(true)
        } else {
            this.setState({isloading: true, editmode: true})
        }


        const {staticdata}: any = settings
        staticdata.taskpriority && Object.keys(staticdata.taskpriority).map((key: any) => {
            let priority = staticdata.taskpriority[key];
            this.priority_options.push({label: priority, value: key})
        });


    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        if (nextProps.isFocused) {
            voucher.data = backupVoucher.voucher.data;
            voucher.settings = backupVoucher.voucher.settings;
            voucher.type = backupVoucher.voucher.type;
            setTimeout(() => {
                this.getVoucherDetails(false);
            }, 500)
        }
    }

    validate = () => {

    }

    forceRefresh = () => {
        this.forceUpdate()
    }

    handleSubmit = () => {
        const {navigation} = this.props;

        voucher.data.date = moment(voucher.data.date).format('YYYY-MM-DD');

        if (Boolean(voucher.settings.invoiceitems)) {

            ////// CHANGE DATE FORMATE FOR RECEIPT VOUCHER
            let time = moment(voucher.data.vouchercreatetime, 'hh:mm A').format('HH:mm:ss');
            voucher.data.date = voucher.data.date + ' ' + time;

            ///////// IF ADVANCE PAYMENT
            if (voucher.data?.advancepayment) {
                voucher.data.totalamountuseforpayment = voucher.data.vouchertotal = voucher.data.vouchertotaldisplay;
            }
        }

        /////// remove extra json ///////
        delete voucher.data?.clientdetail;
        voucher.data?.invoiceitems.map((item: any) => {
            delete item.itemdetail
        })
        if (Boolean(voucher.data?.voucheritems)) {
            Object.keys(voucher.data?.voucheritems).map((key: any) => {
                delete voucher.data?.voucheritems[key].itemdetail
            })
        }
        /////// remove extra json ///////
        if (voucher.data?.taskdescription) {
            voucher.data.taskdescription = voucher.data.taskdescription.toString();
        }

        try {



            const {outstanding, ...body} = voucher.data;
            if (Boolean(body?.voucherdisplayid)) {
                body.voucherdisplayid = body.voucherdisplayid.toString();
            }

            requestApi({
                method: Boolean(voucher.data.voucherid) ? methods.put : methods.post,
                action: voucher.settings.api,
                body: {debug: 1, ...body},
                showlog: true
            }).then((result) => {

                if (result.status === SUCCESS) {

                    update.required = false;
                    voucher.data.voucherid = result.data.voucherid;

                    this.params.getVouchers(true, true).then((r: any) => {
                        navigation.goBack()
                    })


                }
            });
        } catch (e) {
            log('e', e)
        }

    }

    getPrintingData = (options?: any) => {
        const {navigation} = this.props;
        requestApi({
            method: methods.get,
            action: actions.printing,
            alert: false,
            queryString: {printingtemplate: voucher.data.selectedtemplate, voucherid: voucher.data.voucherid},
            loader: true,
            showlog: true,

        }).then((response: any) => {
            if (response.status === SUCCESS && response?.data?.data) {
                navigation.navigate('Print', {
                    data: response?.data?.data,
                    downloadPDF: this.downloadPDF,
                    filename: `Voucher_${voucher.data.voucherid}`,
                    navigation: navigation,
                    ...options
                });
            }
        });
    }

    downloadPDF = async () => {
        let url = apiUrl(current.company) + actions.download + jsonToQueryString({
            type: "pdf",
            voucherid: voucher.data.voucherid,
            printingtemplate: voucher.data.selectedtemplate
        });
        await downloadFile({url: url, filename: `Voucher_${voucher.data.voucherid}`})
    }

    clickMenu = (menu: any) => {
        if (menu.value === 'preview') {
            this.getPrintingData({menu: true})
        } else if (menu.value === 'print') {
            this.getPrintingData({menu: true, autoprint: true,})
        } else if (menu.value === 'download') {
            this.downloadPDF().then(r => {
            });
        } else if (menu.value === 'delete') {
            const {setDialog}: any = this.props;
            setDialog({
                title: 'Confirmation',
                visible: true,
                component: () => <Paragraph style={[styles.paragraph,]}>Are you sure want to delete?</Paragraph>,
                actionButton: () => <Button mode={'contained'} onPress={() => {
                    // this.deleteVoucher()
                }}>OK</Button>
            })
        } else if (menu.value === 'email') {
            if (voucher.data.email) {
                requestApi({
                    method: methods.post,
                    action: actions.email,
                    body: {clientid: voucher.data.clientid, voucherid: voucher.data.voucherid}
                }).then((result) => {
                    if (result.status === SUCCESS) {

                    }
                });
            } else {
                errorAlert('Please set Email ID for the client profile.');
            }
        }
    }

    deleteVoucher = () => {
        const {navigation, setDialog} = this.props;
        requestApi({
            method: methods.delete,
            action: actions.voucher,
            body: {voucherid: voucher.data.voucherid},
            showlog: false
        }).then((result) => {
            setDialog({visible: false});
            if (result.status === SUCCESS) {
                navigation.goBack();
                this.params.getVouchers && this.params.getVouchers(true, true)
            }
        });
    }


    setVoucherData = (values: any) => {
        let appendData: any = {}

        if (Boolean(voucher.settings.assettype)) {
            appendData = {
                ...appendData,
                assetid: values?.assetid || 0,
                assettype: values.assettype,
                assetdata: {
                    assetname: values?.assetname,
                    brand: values?.brand,
                    model: values?.model,
                    basefield: values?.basefield,
                    ...values?.data
                },
                assignee: values?.assignee,
                reporter: values?.reporter,
                priority: values?.priority,
                warranty: values?.warranty,
                taskdescription: values?.taskdescription,
                accessories: values?.accessories,
            }
        }

        voucher.data = {...voucher.data, ...appendData}
    }

    render() {

        const {navigation, settings, theme: {colors}, vouchers,setModal}: any = this.props;
        const {isloading, editmode}: any = this.state;


        navigation.forceRefresh = this.forceRefresh;
        let title = `${voucher?.type?.vouchernumberprefix}${voucher?.type?.voucherdisplayid ? voucher?.type?.voucherdisplayid : ''}`;
        if (isloading && Boolean(voucher?.data?.voucherprefix)) {
            title = `${voucher?.data?.voucherprefix}${voucher?.data?.voucherdisplayid}`;
        }

        setNavigationOptions(navigation, title, colors);

        const isDone = voucher.data?.voucherstatus === '11a7d9ae-48aa-4f85-b766-33403636dc07';
        const isConverted = Boolean(voucher.data.convertedid) && isDone


        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerRight: (props: any) => <>
                <View style={[styles.grid, {marginTop: 8}]}>
                    {Boolean(voucher.data.voucherid) && <>
                        {!isConverted && Boolean(voucher?.type?.accessType) && Boolean(voucher?.type?.accessType[ACCESS_TYPE.UPDATE]) &&
                            <Title onPress={() => {
                                this.setState({editmode: !editmode})
                            }}>
                                <ProIcon name={editmode ? 'eye' : 'pen-to-square'} size={16}/>
                            </Title>}
                            <Menu menulist={this.menuitems} onPress={(value: any) => {
                                this.clickMenu(value)
                            }}>
                                <ProIcon name={'ellipsis-vertical'} align={'right'}/>
                            </Menu>
                    </>}
                </View>
            </>
        });

        return <Container>
            <Form
                onSubmit={this.handleSubmit}
                initialValues={{...voucher.data}}
                render={({handleSubmit, submitting, values, ...more}: any) => {


                    console.log('voucher.data',voucher.data)

                    let status = "";
                    let color = "";
                    let visibleTask = Boolean(values?.tickettypeid) && Boolean(values?.ticketdisplayid);

                    let ticketstatus_options: any = [];
                    if (!isEmpty(this.currentTicket) && values.voucherstatus) {
                        status = this.currentTicket?.ticketstatuslist[values?.voucherstatus]?.ticketstatusname;
                        color = this.currentTicket?.ticketstatuslist[values?.voucherstatus]?.ticketstatuscolor;

                        ticketstatus_options = Object.keys(this.currentTicket?.ticketstatuslist).map((key: any) => {
                            let status = this.currentTicket?.ticketstatuslist[key];
                            return status.ticketstatusdisplay ? {
                                label: status.ticketstatusname,
                                value: key,
                                color: status.ticketstatuscolor
                            } : false
                        }).filter((value: any) => {
                            return Boolean(value)
                        });
                    }


                    return <View style={[styles.h_100]}>
                        <KeyboardScroll>

                            <View
                                style={[styles.p_5, {backgroundColor: colors.surface}]}>
                                <View style={[styles.grid, styles.justifyContent,]}>
                                    <View>
                                        {
                                            Boolean(visibleTask) && <InputField
                                                removeSpace={true}
                                                label={'Status'}
                                                displaytype={'bottomlist'}
                                                inputtype={'dropdown'}
                                                render={() => <View
                                                    style={[styles.paragraph, styles.badge, {backgroundColor: color}]}>
                                                    <Paragraph style={{
                                                        paddingRight: 5,
                                                        textTransform: 'capitalize',
                                                        color: 'white'
                                                    }}>  {status} <ProIcon name={'chevron-down'}
                                                                           action_type={'text'}
                                                                           color={'white'}
                                                                           size={12}/></Paragraph>
                                                </View>}
                                                list={ticketstatus_options}
                                                search={false}
                                                key={uuidv4()}
                                                listtype={'task_status'}
                                                selectedValue={values.voucherstatus}
                                                onChange={(v: any) => {
                                                    if (!isConverted) {
                                                        voucher.data.voucherstatus = v;
                                                        voucher.data.taskstatus = v;

                                                        if(voucher.data.signaturerequired && v === '11a7d9ae-48aa-4f85-b766-33403636dc07'){ // status is done
                                                            setModal({title: 'Signature', visible: true, component: () => <Signature setVoucherData={this.setVoucherData} values={values} handleSubmit={this.handleSubmit} />})
                                                        }
                                                        else {
                                                            this.setVoucherData(values);
                                                            this.handleSubmit();
                                                            this.forceUpdate();
                                                        }
                                                    }
                                                }}
                                            />
                                        }
                                    </View>


                                     <CopyToInvoice navigation={navigation} key={uuidv4()} jobstatus={voucher.data.voucherstatus} outprefix={'#INV-'}   outdisplayid={voucher.data.converteddisplayid} convertedto={voucher.data.convertedto}  />


                                    <View>

                                        <InputField
                                            removeSpace={true}
                                            label={'Priority'}
                                            displaytype={'bottomlist'}
                                            inputtype={'dropdown'}
                                            render={() =>
                                                <View
                                                    style={[styles.paragraph, styles.badge, styles[`badge${voucher.data.priority}`]]}>
                                                    <Paragraph style={{
                                                        paddingRight: 5,
                                                        textTransform: 'capitalize',
                                                        color: 'white'
                                                    }}> {voucher.data.priority} <ProIcon name={'chevron-down'}
                                                                                         action_type={'text'}
                                                                                         color={'white'}
                                                                                         size={12}/></Paragraph>
                                                </View>
                                            }
                                            list={this.priority_options}
                                            search={false}
                                            key={uuidv4()}
                                            listtype={'priority'}
                                            selectedValue={values.priority}
                                            onChange={(v: any) => {
                                                if (!isConverted) {
                                                    voucher.data.priority = v;
                                                    values.priority = v;
                                                    this.setVoucherData(values);
                                                    this.handleSubmit()
                                                    this.forceUpdate();
                                                }
                                            }}
                                        />

                                    </View>

                                </View>


                            </View>

                            <View style={[styles.pageContent]}>


                                <ClientCard navigation={navigation} settings={settings}
                                            editModeClient={Boolean(editmode)}
                                            handleSubmit={this.handleSubmit}
                                            editmode={Boolean(editmode)} values={values}
                                            form={more.form}/>

                                <AssetsCard navigation={navigation} editmode={Boolean(editmode)} values={values}/>

                                {
                                    Boolean(values.estimatedid) &&
                                    <EstimateCard navigation={navigation} values={values}/>
                                }

                                {
                                    Boolean(visibleTask) &&
                                    <TaskCard navigation={navigation} values={values}/>
                                }

                                <ConsumableCard navigation={navigation} values={values} isDone={isDone}/>

                                {/*{*/}
                                {/*    Boolean(visibleTask) &&*/}
                                {/*    <OutSourcingDataCard navigation={navigation} values={values}/>*/}
                                {/*}*/}

                                {voucher.settings?.cartitems && <>
                                    <Card style={[styles.card]}>
                                        <Card.Content style={{paddingBottom: 0}}>
                                            <CartItems navigation={navigation} validate={() => {
                                                this.setVoucherData(values);
                                                this.handleSubmit()
                                            }} editmode={editmode}/>
                                        </Card.Content>
                                    </Card>
                                    <CartSummary editmode={editmode} navigation={navigation}/>
                                </>}


                                <Notes navigation={navigation} editmode={editmode} handleSubmit={() => {
                                    this.setVoucherData(values);
                                    this.handleSubmit()
                                }}/>


                                {/*{(!Boolean(voucher.data.voucherstatus) || voucher.data.voucherstatus === 'Unpaid') && Boolean(voucher.data.voucherid) ?
                                    <View>
                                    </View> : <View>
                                        {!isEmpty(voucher.data.receipt) && <>

                                            <Card style={[styles.card]}>
                                                <Card.Content>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.isShowReceipt = !this.isShowReceipt;
                                                            updateComponent(this.moreReceiptRef, 'display', this.isShowReceipt ? 'flex' : 'none')
                                                        }}>

                                                        <View
                                                            style={[styles.grid, styles.justifyContent, styles.middle]}>
                                                            <Paragraph
                                                                style={[styles.paragraph, styles.caption]}>
                                                                Receipts
                                                            </Paragraph>
                                                            <ProIcon name={`chevron-down`} size={16}/>
                                                        </View>

                                                    </TouchableOpacity>

                                                    <View style={{display: 'none'}} ref={this.moreReceiptRef}>
                                                        <Divider
                                                            style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                                        <ReceiptPayment/>
                                                    </View>
                                                </Card.Content>
                                            </Card>
                                        </>}
                                    </View>}*/}


                                {voucher?.settings?.attachment && <>
                                    <View>
                                        {<View>
                                            <InputField
                                                label={'Add Attachment'}
                                                divider={true}
                                                editmode={!!editmode}
                                                onChange={(value: any) => {
                                                    this.forceUpdate()
                                                }}
                                                inputtype={'attachment'}
                                                navigation={navigation}
                                            />
                                        </View>}
                                    </View>
                                </>}


                                {editmode && Boolean(voucher?.data?.voucherid) && Boolean(voucher?.type?.accessType) && Boolean(voucher?.type?.accessType[ACCESS_TYPE.DELETE]) &&
                                    <View style={[styles.mb_10, styles.mt_5]}>
                                        <View>
                                            <DeleteButton
                                                title={'Delete this Voucher?'}
                                                message={'Deleting permanently erases the voucher, including all payments'}
                                                onPress={(index: any) => {
                                                    if (index === 0) {
                                                        this.deleteVoucher()
                                                    }
                                                }}
                                            />
                                        </View>
                                    </View>}

                            </View>


                        </KeyboardScroll>


                        {editmode && <View style={[styles.submitbutton, styles.p_5]}>
                            <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                this.setVoucherData(values);
                                handleSubmit(values);
                            }}> {`Update Jobsheet`} </Button>
                        </View>}


                    </View>
                }}>
            </Form>
        </Container>;
    }
}

const mapStateToProps = (state: any) => ({
    companydetails: state.appApiData.companydetails,
    vouchers: state.appApiData.settings.voucher,
    settings: state.appApiData.settings,
    preferences: state.appApiData.preferences,
    ticketsList: state?.appApiData.settings.tickets,
})

const mapDispatchToProps = (dispatch: any) => ({
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
    setVoucherItems: (items: any) => dispatch(setVoucherItems(items)),
    setPendingInvoices: (invoices: any) => dispatch(setPendingInvoices(invoices)),
    setAlert: (alert: any) => dispatch(setAlert(alert)),
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setLoader: (loader: any) => dispatch(setLoader(loader)),
    setModal:(page:any) => dispatch(setModal(page)),
    resetVoucherItems: () => dispatch(resetVoucherItems()),
});

const JobComponent = connect(mapStateToProps, mapDispatchToProps)(withTheme(EditJobsheet));

export default function (props: any) {
    const isFocused = useIsFocused();

    return <JobComponent {...props} isFocused={isFocused}/>;
}
