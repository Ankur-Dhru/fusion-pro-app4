import React, {Component} from 'react';
import {Appearance, Image, Platform, TouchableOpacity, View} from 'react-native';
import {styles} from "../../../theme";
import {v4 as uuidv4} from 'uuid';
import requestApi, {actions, jsonToQueryString, methods, SUCCESS} from "../../../lib/ServerRequest";
import {Button, CheckBox, Container, Menu, ProIcon} from "../../../components";
import {connect} from "react-redux";
import {Card, Divider, Paragraph, Text, Title, withTheme} from "react-native-paper";
import {Field, Form} from "react-final-form";
import {
    clone,
    downloadFile,
    errorAlert,
    getCurrentCompanyDetails,
    getDefaultCurrency,
    getIntraStateTax,
    groupErrorAlert,
    isEmpty,
    isPermissionAllow,
    log,
    setDecimal,
    storeData,
    updateComponent
} from "../../../lib/functions";
import moment from "moment";
import ClientDetail, {currencyRate} from "./Client/ClientDetail";
import VoucherDate from "./Dates";
import Custom from "./Custom";
import Notes from "./Custom/Notes";
import CartItems from "./Items/CartItems";
import InvoiceItems from "./Invoice/InvoiceItems";
import ExpenseItems from "./Expense/ExpenseItems";
import JournalItems from "./Journal/JournalItems";
import InventoryItems from "./Inventory/InventoryItems";
import CartSummary from "./Items/CartSummary";
import {
    resetVoucherItems,
    setCompany,
    setPendingInvoices,
    setVoucherItems,
    updateVoucherItems
} from "../../../lib/Store/actions/appApiData";
import {apiUrl, backButton, backupVoucher, chevronRight, current, voucher} from "../../../lib/setting";
import {ACCESS_TYPE, assignOption, composeValidators, options_itc, required, taxTypes} from "../../../lib/static"
import {setAlert, setDialog, setLoader, setModal, setPageSheet} from "../../../lib/Store/actions/components";
import ReceiptPayment from "./ReceiptPayment";
import Heading from "./Heading";
import InputField from "../../../components/InputField";
import FormLoader from "../../../components/ContentLoader/FormLoader";
import Ledger from "./Ledger";
import {CommonActions} from "@react-navigation/native";
import Estimate from "./Estimate";
import DeleteButton from "../../../components/Button/DeleteButton";
import Confirm from "react-native-actionsheet";
import ErrorGroup from "./ErrorGroup";
import withFocused from "../../../components/withFocused";
import {Align, Position} from "@stackbuilders/react-native-spotlight-tour";
import HintContainer from "../../../components/Spotlight/HintContainer";
import KeyboardScroll from '../../../components/KeyboardScroll';
import KAccessoryView from "../../../components/KAccessoryView";
import Tooltip, {STEPS, TooltipContainer} from "../../../components/Spotlight/Tooltip";
import {getProductData} from "../../../lib/voucher_calc";
import {regExpJson2} from "../../../lib/validation";
import JobAdvPayment from "./JobAdvPayment";
import {OnChange} from "react-final-form-listeners";


const colorScheme = Appearance.getColorScheme();

const getStepList = (type: any) => {
    let clientMessage = "Select Client";
    let productMessage = "Select Product";
    let submitMessage = "Submit";

    let stepList: any = [{
        alignTo: Align.SCREEN,
        position: Position.BOTTOM,
        render: (props: any) => <HintContainer message={clientMessage} {...props}/>
    }, {
        alignTo: Align.SCREEN,
        position: Position.BOTTOM,
        render: (props: any) => <HintContainer message={productMessage} {...props}/>
    }, {
        alignTo: Align.SCREEN,
        position: Position.TOP,
        render: (props: any) => <HintContainer message={submitMessage} {...props}/>
    }];

    return stepList
}


class VoucherView extends Component<any> {

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
    isOutsourcing: boolean = false;
    ActionSheet2: any;
    scrollRef: any
    navigationActive: boolean = false;
    spotRef: any
    isInward: boolean = false;
    isOutward: boolean = false;
    taskFields: any = [];
    child: any;
    assigneeRef: any;
    submitbuttonclick: any = false;

    constructor(props: any) {
        super(props);

        this.scrollRef = React.createRef();
        const {route, companydetails}: any = this.props;
        this.params = route.params;

        this.isOutsourcing = Boolean(this.params?.outsourcing)
        this.state = {editmode: true}
        this.moreReceiptRef = React.createRef();
        this.isShowReceipt = false;
        this.moreLedgerRef = React.createRef();
        this.isShowLedger = false;
        if (!this.isOutsourcing) {
            this.resetData()
        } else {
            this.setOutsourcingData()
        }
        let {init, ...data} = getCurrentCompanyDetails();

        this.ActionSheet2 = React.createRef()

        this.isInward = voucher.data.vouchertype === "inward";
        this.isOutward = voucher.data.vouchertype === "outward";


        if (voucher.data.vouchertype !== 'jobsheet') {
            voucher.type = {
                ...voucher.type,
                showbrand: true,
                showcustomernote: true,
                showattachment: true,
                showestimate: true,
                showmodel: true,
                showordertype: true,
                showpriority: true,
                showreporter: true,
                showtoc: true
            }
        }


    }

    setOutsourcingData = () => {
        const {vouchers, settings, updateVoucherItems, setPendingInvoices} = this.props;
        this.location = settings.location[voucher.data.locationid]?.locationname;
        this.title = voucher.type.label;
        this.subtitle = voucher.type.rightvouchertypename;
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
            paymentreceiptaccountid,
            isdisplaysign,
        } = vouchers[voucher?.type?.vouchertypeid];

        let currentdate = moment().format("YYYY-MM-DD");


        const {defaultcurrency, locationid, adminid, lastassettype}: any = getCurrentCompanyDetails();


        if (!this.params?.copy) {
            voucher.data.copyinvoice = '';
            //updateVoucherItems({});
        }


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
            account: paymentreceiptaccountid || 4,
            accountid: paymentreceiptaccountid || 4,
            isPaymentReceived: false,
            sendmail: isDefaultMail,
            vouchertypeid: voucher.type?.vouchertypeid,
            vouchertype: vouchert,
            vouchernotes: defaultcustomernotes || '',
            toc: defaultterms,
            isadjustment: isadjustment,
            adjustmentamount: 0,
            paymentgateway: settings.location[locationid].defaultpaymentgateway,
            advancepayment: '0',
            istds,
            istcs,
            adjustmenttype: 'qty',
            isdisplaysign:isdisplaysign,
            ...voucher.data.copyinvoice,
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

        this.state = {isloading: !Boolean(voucher.type?.voucherdisplayid)}

        this.title = voucher.type.label;
        this.subtitle = voucher.type.rightvouchertypename;

        this.location = settings.location[locationid]?.locationname;

        voucher.data.vouchertypeid = voucher.type.vouchertypeid;

        if (Boolean(voucher.settings.assettype)) {
            voucher.data = {
                ...voucher.data,
                reporter: parseInt(adminid),
                priority: "medium",
                warranty: "Paid",
            }
            if (lastassettype) {
                voucher.data = {
                    ...voucher.data,
                    assettype: lastassettype
                }
            }
        }
        setPendingInvoices('')
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {

        if (Boolean(nextProps.isFocused) && Boolean(this.navigationActive)) {
            this.navigationActive = false;
            voucher.data = backupVoucher.voucher.data;
            voucher.settings = backupVoucher.voucher.settings;
            voucher.type = backupVoucher.voucher.type;
            setTimeout(() => {
                this.getVoucherDetails(false);
            }, 500)
        }
    }

    getVoucherDetails = (loader: boolean) => {
        const {updateVoucherItems, setPendingInvoices, navigation} = this.props
        this.menuitems = [{label: 'Preview', value: 'preview'}, {label: 'Download', value: 'download'}];
        requestApi({
            method: methods.get,
            action: actions.voucher,
            queryString: {voucherdisplayid: voucher.type.voucherdisplayid, vouchertype: voucher.type.vouchertypeid},
            loader,
            loadertype: 'form',
            showlog: false,
        }).then((result) => {

            try {

                if (result.status === SUCCESS) {

                    const {vouchercreatetime, date, tcsaccount, tcsamount, tdsaccount, tdsamount,signature} = result.data;

                    let time = moment(vouchercreatetime, 'hh:mm A').format('HH:mm');

                    const dates: any = `${date} ${time}`

                    let selectedtdstcs = voucher.data.selectedtdstcs;
                    if (Boolean(tcsaccount) && Boolean(parseFloat(tcsamount))) {
                        selectedtdstcs = "TCS"
                    } else if (Boolean(tdsaccount) && Boolean(parseFloat(tdsamount))) {
                        selectedtdstcs = "TDS"
                    }

                    const {voucheritems, voucherremarks, referencetype, reason, accountid, ...otherdata} = result.data;

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


                    voucher.data = {
                        ...voucher.data, ...otherdata,
                        new: false,
                        globaldiscountvalue: result.data?.voucherdiscount,
                        date: dates,
                        files: result.data?.voucherdata?.files,
                        reason: voucherremarks || referencetype,
                        adjustmenttype: referencetype,
                        account: accountid,
                        referencetype,
                        selectedtdstcs,
                        clientname: result.data.client,
                        duedate: result?.data?.voucherduedate
                    };

                    voucher.data = {
                        ...voucher.data,
                        vouchertotaldisplay: setDecimal(voucher.data.vouchertotaldisplay),
                        bankcharges: setDecimal(voucher.data.bankcharges),
                    };

                    if(Boolean(signature)){
                        voucher.data = {
                            ...voucher.data,
                            signature:`https://${signature}`,
                        };
                    }

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

                    if (!Boolean(this?.params?.doNotSetBackData)) {
                        backupVoucher.voucher = clone(voucher);
                    }


                    this.setState({isloading: true, editmode: false});


                }
            } catch (e) {
                log('e', e)
            }
        });
    }

    componentWillMount() {

        const {settings, start}: any = this.props;

        const {showestdate}: any = voucher.type;

        const isCountryIndia = settings.general.country === 'IN';
        const hasReversecharge: any = voucher.data.vouchertaxtype === 'exclusive';
        const {adminid, lastassettype}: any = getCurrentCompanyDetails();

        voucher.settings = {
            partyname: 'Client',
            addpayment: false,
            processstatus: false,
            addexpense: false,
            client: true,
            date: true,
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
            termscondition: true,
            billlist: false,
            reasonlist: false,
            reasontype: false,
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
            deleteapi: "voucher",
            editserial: false,
            groupValidation: false,
            spottype: "type1",
            partyaccount: false,
            p2p: false,
        }
        ////// INVOICE
        if (voucher.type.vouchertypeid === 'b152d626-b614-4736-8572-2ebd95e24173') {
            voucher.settings = {
                ...voucher.settings,
                addpayment: true,
                defaultclient: true,
                canChangeCLient: false,
                checkserialqnt: true,
                viewprofit: isPermissionAllow("canviewprofit"),
                editserial: true,
            }
        }

        ////// DELIVERY CHALLAN
        if (voucher.type.vouchertypeid === '6516aa72-876f-4d7e-a02f-4d0333dd855a') {
            voucher.settings = {
                ...voucher.settings,
                duedate: true,
                deliverystatus: true,
                canChangeCLient: true,
            }
        }

        ////// CREDIT NOTES
        else if (voucher.type.vouchertypeid === '8a2c1b35-1781-409c-820e-73e90821735f') {
            voucher.settings = {
                ...voucher.settings,
                duedate: false,
                datetitle: 'Credit Note Date',
                reasonlist: true,
                disableStockCheck: true,
                reasontype: 'creditnote',
                scanitem: true,
                invoicelist: true,
                placeofsupply: false,
                canChangeCLient: true,
            }
        }

        ////// DEBIT NOTES
        else if (voucher.type.vouchertypeid === 'ad7d5565-118f-4684-ae5e-9b158a8d84b8') {
            voucher.settings = {
                ...voucher.settings,
                duedate: false,
                datetitle: 'Debit Note Date',
                reasonlist: false,
                reasontype: 'debitnote',
                scanitem: false,
                billlist: true,
                partyname: 'Vendor',
                eligibleforitc: isCountryIndia,
                placeofsupply: false,
                canChangeCLient: true,
            }
        }

        ////// PAYMENT RECEIVE
        else if (voucher.type.vouchertypeid === 'be0e9672-a46e-4e91-a2bf-815530b22b43') {
            voucher.settings = {
                ...voucher.settings,
                invoiceitems: 'Invoices',
                cartitems: false,
                duedate: false,
                datetitle: 'Payment Date',
                paymentmethod: true,
                paymenttype: true,
                receivedamount: true,
                fullamount: true,
                bankchanges: true,
                taxtreatment: false,
                addressbook: false,
                canChangeCLient: false,
                buttonLabel: "Save Receipt",
                api: 'receipt',
                deleteapi: "receipt",
            }
        }

        ////// SALES ORDER
        else if (voucher.type.vouchertypeid === 'ec6da168-5659-4a2f-9896-6ef4c8598532') {
            voucher.settings = {...voucher.settings, scanitem: false, canChangeCLient: true,}
        }

        ////// ESTIMATE
        else if (voucher.type.vouchertypeid === 'd7310e31-acee-4cfc-aa4d-4935b150706b') {
            voucher.settings = {...voucher.settings, scanitem: false, processstatus: true, canChangeCLient: true,}
        }

        ////// BILL
        else if (voucher.type.vouchertypeid === '71e9cc99-f2d1-4b47-94ee-7aafd481e3c5') {
            voucher.settings = {
                ...voucher.settings,
                scanitem: false,
                partyname: 'Vendor',
                addserialmfd: true,
                eligibleforitc: isCountryIndia,
                reversecharge: hasReversecharge,
                canChangeCLient: true,
                outsourcing: false
            }
            if (Boolean(this.params?.outsourcing)) {
                voucher.settings = {
                    ...voucher.settings,
                    reversecharge: false,
                    hideDate: true,
                    outsourcing: true,
                    attachment: false,
                    outsourcingFields: true,
                    date: false
                }
            }
        }

        ////// PURCHASE ORDER
        else if (voucher.type.vouchertypeid === '210bf595-d2ee-4460-a378-c7ba86af4d53') {
            voucher.settings = {
                ...voucher.settings,
                scanitem: false,
                duedatetitle: 'Expected Delivery Date',
                partyname: 'Vendor',
                reversecharge: hasReversecharge,
                canChangeCLient: true,
            }
        }

        ////// PAYMENT MADE
        else if (voucher.type.vouchertypeid === 'c86a5524-30a4-4954-9303-1cf028f546a7') {
            voucher.settings = {
                ...voucher.settings,
                invoiceitems: 'Bills',
                cartitems: false,
                duedate: false,
                datetitle: 'Payment Date',
                paymentmethod: true,
                paymenttype: false,
                receivedamount: true,
                fullamount: true,
                bankchanges: false,
                scanitem: false,
                taxtreatment: false,
                partyname: 'Vendor',
                buttonLabel: "Save Payment",
                addressbook: false,
                canChangeCLient: false,
                api: 'payment',
                deleteapi: "payment",
            }
        }

        ////// EXPENSES
        else if (voucher.type.vouchertypeid === 'ba7f0f54-60da-4f07-b07b-8645632616ac') {
            voucher.settings = {
                ...voucher.settings,
                client: true,
                clientoptional: true,
                expenseitems: true,
                cartitems: false,
                duedate: false,
                paymentmethod: true,
                paymenttype: false,
                receivedamount: false,
                fullamount: false,
                bankchanges: false,
                scanitem: false,
                partyname: 'Vendor',
                placeofsupply: false,
                accountlist: true,
                reversecharge: hasReversecharge,
                addressbook: false,
                canChangeCLient: true,
                eligibleforitc: isCountryIndia,
                api: 'expense'
            }
        }

        ////// JOURNAL
        else if (voucher.type.vouchertypeid === '777d6a15-f01b-4d8d-8bf9-c6ae2c7e12a6') {
            voucher.settings = {
                ...voucher.settings,
                journalitems: true,
                duedate: false,
                cartitems: false,
                client: false,
                scanitem: false,
                addressbook: false,
                canChangeCLient: true,
                api: 'journal',
                taxtreatment: false,
                taxdisable: true,
                clientoptional: true,
            }
        }

        ////// PARTY TO PARTY
        else if (voucher.type.vouchertypeid === '2b0e95e5-b22c-4830-8a15-cb84b61255b6') {
            voucher.settings = {
                ...voucher.settings,
                p2p: true,
                journalitems: false,
                duedate: false,
                cartitems: false,
                client: false,
                scanitem: false,
                addressbook: false,
                canChangeCLient: true,
                api: 'journal',
                taxtreatment: false,
                taxdisable: true,
                clientoptional: true,
                partyaccount: true,

            }
            voucher.data = {
                ...voucher.data,
                invoiceitems: [
                    {},
                    {},
                ],
            }
        }

        ////// INVENTORY ADJUSTMENT
        else if (voucher.type.vouchertypeid === '75729cc6-32a5-4291-8097-eef6f508d442') {
            voucher.settings = {
                ...voucher.settings,
                inventoryitems: true,
                duedate: false,
                adjustment: true,
                reasonlist: true,
                reasontype: 'adjustment',
                cartitems: false,
                account: true,
                client: false,
                scanitem: false,
                attachment: false,
                notes: false,
                termscondition: false,
                enableedit: false,
                clientoptional: true,
                api: 'inventoryadjustment'
            }
        }

        ////// JOBSHEET
        else if (voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5') {
            voucher.settings = {
                ...voucher.settings,
                duedate: true,
                defaultclient: true,
                duedatetitle: 'Est. Delivery Date',
                adjustment: false,
                cartitems: true,
                hideDate: !showestdate,
                scanitem: false,
                attachment: true,
                attachmenticon: true,
                hideAttachmentLabel: true,
                notes: true,
                taxtreatment: false,
                placeofsupply: false,
                assettype: true,
                customfield: true,
                estimateAndPaymentLink: true,
                advancePayment: true,
                totalLabel: "Est. Total",
                groupValidation: true
            }
        }


        if ((!this.isOutsourcing && (voucher.settings.partyname === 'Vendor' || !voucher.settings.defaultclient) && !this.params?.copy)) {
            voucher.data = {...voucher.data, clientid: '', clientname: ''}
        }

        if (voucher.type.voucherdisplayid) {
            this.getVoucherDetails(true)
        } else {
            let editmode = true;
            if (Boolean(voucher.data.outsourcingdisplayid)) {
                editmode = false;
            }

            this.setState({isloading: true, editmode})
        }

        if (Boolean(voucher.settings.assettype)) {
            voucher.data = {
                ...voucher.data,
                reporter: parseInt(adminid),
                priority: "medium",
                warranty: "Paid",
            }
            if (lastassettype) {
                voucher.data = {
                    ...voucher.data,
                    assettype: lastassettype
                }
            }
        }

        if (voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5') {
            this.addDefaultProduct(0)
        }


        if (!isEmpty(settings.tickets)) {
            Object.values(settings.tickets)
                .filter((ticket: any) => Boolean(ticket?.tickettype === "task"))
                .forEach((ticket: any, index: number) => {
                    if (index === 0) {
                        if (!isEmpty(ticket.task_screens)) {
                            Object.values(ticket?.task_screens["default_screen"].tabs).map((tab: any) => {
                                if (!isEmpty(tab?.fieldsList)) {
                                    Object.values(tab?.fieldsList).forEach((field: any) => {
                                        if (regExpJson2?.uuidValidate.test(field.key) || regExpJson2?.uuidValidate.test(field.vouchertypeid2)) {
                                            this.taskFields.push(field);
                                        }
                                    })
                                }
                            })
                        }
                    }
                });
        }

    }

    addDefaultProduct = (index: number) => {
        if (Boolean(voucher?.type?.defaultproduct) && !isEmpty(voucher?.type?.defaultproduct)) {
            let defaultProductLength = voucher?.type?.defaultproduct.length
            const {setLoader}: any = this.props;
            if (index < defaultProductLength) {
                setLoader({
                    show: true,
                    type: "activity"
                })
                this.getItemDetails(voucher?.type?.defaultproduct[index]).then(() => {
                    this.addDefaultProduct(index + 1);
                });
            } else {
                setLoader({
                    show: false
                })
            }
        }
    }

    getItemDetails = (itemid: any) => {
        return new Promise((resolve, reject) => {
            const {setVoucherItems, loader}: any = this.props;


            requestApi({
                method: methods.get,
                action: actions.items,
                queryString: {itemid},
                showlog: true,
                loader: false
            }).then((result) => {
                if (result.status === SUCCESS) {
                    let data = result.data;

                    let productqntunitid;
                    let {
                        itemtaxgroupid,
                        itemunit,
                        units,
                        salesunit,
                        salesunits,
                        defaultitc,
                        itemhsncode,
                        itemtype
                    } = data;

                    let producttaxgroupid;

                    if (Boolean(itemtaxgroupid)) {
                        producttaxgroupid = itemtaxgroupid;
                    }

                    if (!this.isInward) {
                        if (Boolean(salesunit)) {
                            productqntunitid = salesunit;
                        }
                    } else {
                        if (Boolean(itemunit)) {
                            productqntunitid = itemunit;
                        }
                    }

                    let selectedITC = options_itc[0].value;
                    if (defaultitc) {
                        selectedITC = defaultitc;
                    }
                    let companyCurreny = getDefaultCurrency();

                    try {

                        let itemDetail: any = {
                            itemid,
                            retailconfig: '',
                            productqnt: 1,
                            productdisplayname: data.itemname,
                            itemname: data.itemname,
                            inventorytype: data.inventorytype,
                            identificationtype: data.identificationtype,
                            pricing: data.pricing,
                            productid: data.itemid,
                            itemunique: data.itemid,
                            defaulttaxgroupid: producttaxgroupid,
                            producttaxgroupid: (this.isOutward || this.isInward) ? getIntraStateTax(producttaxgroupid, voucher.data.placeofsupply, voucher.data.taxregtype) : producttaxgroupid,
                            productqntunitid,
                            itc: selectedITC,
                            hsn: itemhsncode,
                            itemtype: itemtype,
                            purchasecost: data.purchasecost,
                            serialno: [],
                        }


                        if (voucher.settings.api === 'expense') {
                            itemDetail.productratedisplay = currencyRate(voucher.data.currency) * itemDetail.productrate;
                            itemDetail.productrate = currencyRate(companyCurreny.__key) * itemDetail.productrate;
                        } else {
                            itemDetail = {
                                ...itemDetail,
                                ...getProductData(data, voucher.data.currency, companyCurreny.__key, undefined, undefined, this.isInward)
                            }
                        }

                        setVoucherItems(itemDetail);

                    } catch (e) {
                        log('e', e)
                    }
                }
                resolve({});
            });
        })
    }

    addLineInMessage = () => {
        if (Boolean(this.errorMessage)) {
            this.errorMessage += "\n";
        }
    }

    validate = () => {


        const {navigation, setAlert, settings} = this.props;

        this.error = false;
        this.errorMessage = "";
        const {clientid, invoiceitems, vouchertotaldisplay, voucheritem, vouchertype} = voucher.data;


        if (Boolean(clientid === '') && !voucher.settings.clientoptional) {
            this.addLineInMessage();
            this.errorMessage += `Please Select ${voucher.settings.partyname}`;
        }


        if (voucher.settings.api === 'voucher') {
            if (Boolean(invoiceitems && invoiceitems.length <= 0)) {
                this.addLineInMessage();
                this.errorMessage += "Select at-least one product or service";
            } else {
                Object.keys(invoiceitems).map((keys: any) => {
                    let item = invoiceitems[keys];
                    if (!Boolean(item.producttaxgroupid) && !voucher.settings.taxdisable) {
                        this.addLineInMessage();
                        this.errorMessage += `Please Select tax for item ${item.productdisplayname}`;
                    }
                });
            }
        }

        if (Boolean(invoiceitems && invoiceitems.length <= 0) && (voucher.settings.api === 'inventoryadjustment')) {
            this.addLineInMessage();
            this.errorMessage += "Select at-least one product or service";
        }

        if (voucher.settings.api === 'expense') {
            if (Boolean(invoiceitems && invoiceitems.length <= 0)) {
                this.addLineInMessage();
                this.errorMessage += "At-least one item required";
            } else {
                Object.keys(invoiceitems).map((keys: any) => {
                    let item = invoiceitems[keys];
                    if (!Boolean(item.productratedisplay)) {
                        this.addLineInMessage();
                        this.errorMessage += `Item Amount Required`;
                    }
                });
            }
        }


        if (Boolean(voucher.settings.invoiceitems)) {
            if (Boolean(voucheritem && voucheritem.length <= 0) && !Boolean(voucher.data.advancepayment)) {
                this.addLineInMessage();
                this.errorMessage += voucher.settings.invoiceitems + " Item required";
            }
            if (voucher.data.totalexcessamountdisplay < 0) {
                this.addLineInMessage();
                this.errorMessage += "Excess amount received";
            }
        }

        if (Boolean(vouchertotaldisplay < 0)) {
            this.addLineInMessage();
            this.errorMessage += "Voucher amount should not negative";
        }


        voucher.settings.addserialmfd && voucher.data?.invoiceitems.map((item: any) => {
            if (item.identificationtype === 'manual' && !Boolean(item?.serialno?.length)) {
                this.addLineInMessage();
                this.errorMessage += "Serial no is required";
            }
        })


        if (vouchertype === "outward") {
            invoiceitems.forEach((item: any) => {

                if (voucher.data.scanitem) {
                    if (Boolean(item.identificationtype) && item.inventorytype === 'specificidentification') {
                        if (!Boolean(item.serial) || Boolean(item.serial.length < 1)) {
                            this.addLineInMessage();
                            this.errorMessage += "Please select serial no";
                        } else if (item.serial.length !== +item.productqnt) {
                            this.addLineInMessage();
                            this.errorMessage += `Please select ${item.productqnt} serial no`;
                        }
                    }
                }
                if (settings.general.country === 'IN' && (settings?.general?.taxregtype[0] === "grr" || settings?.general?.taxregtype[0] === "grc") && !Boolean(item.hsn)) {
                    this.addLineInMessage();
                    this.errorMessage += `Please Enter ${item.itemtype === 'service' ? 'SAC No.' : 'HSN Code'} for item ${item.productdisplayname}`;
                }
                if (!Boolean(item.producttaxgroupid)) {
                    this.addLineInMessage();
                    this.errorMessage += `Please Select Tax group for item ${item.productdisplayname}`;
                }
            })
        }

        this.error = Boolean(this.errorMessage)

        if (!this.error) {
            // || voucher.data.voucherstatus === 'Unpaid'


            if (Boolean(voucher.settings.assettype)) {

                if (voucher.data?.assignee) {
                    this.callVoucherApi();
                } else {
                    this.ActionSheet2?.show()
                }
            } else {
                this.callVoucherApi();
            }

        } else {
            errorAlert(this.errorMessage);
        }

    }

    updateOutsourcing = () => {
        const {navigation} = this.props
        requestApi({
            method: methods.get,
            action: actions.ticket,
            queryString: {
                ticketdisplayid: voucher.data.ticketdisplayid,
                tickettype: voucher.data.tickettypeid
            },
            loader: true,
        }).then((result) => {
            if (result.status === SUCCESS) {

                const {read, sub, custom, ...responseData} = result.data;

                let body = {
                    read: 1,
                    ...responseData
                };

                if (!isEmpty(sub)) {
                    let subtask = Object.keys(sub).map((subid: any) => ({subid, ...sub[subid]}));
                    body = {
                        ...body,
                        subtask
                    }
                }

                const {invoiceitems, ...voucherData} = voucher.data;


                if (voucher?.data?.pickup) {
                    let date = moment(voucher.data.pickupdate).format("YYYY-MM-DD");
                    let time = moment(voucher.data.pickuptime).format("HH:mm:ss");
                    voucherData.pickupdate = `${date} ${time}`

                }
                if (voucher?.data?.delivery) {
                    let date = moment(voucher.data.deliverydate).format("YYYY-MM-DD");
                    let time = moment(voucher.data.deliverytime).format("HH:mm:ss");
                    voucherData.deliverydate = `${date} ${time}`
                }

                let outsourcingdata = {
                    ...voucherData,
                    outsourcingitems: invoiceitems,
                    vendor: voucherData?.clientid,
                }

                body = {
                    ...body,
                    ...outsourcingdata,
                    outsourcingdata,
                }


                requestApi({
                    method: methods.put,
                    action: actions.ticket,
                    body,
                    showlog: true
                }).then((result) => {
                    if (result.status === SUCCESS) {
                        if (Boolean(outsourcingdata?.createexpense)) {
                            navigation.goBack();
                        }
                    }
                });
            }
        });
    }

    handleSubmit = () => {

        console.log('handle sumbit')

        if (this.isOutsourcing) {
            this.updateOutsourcing();
        } else {

            const {navigation, companydetails, setCompany, preferences: {printpreviewdisable}} = this.props;

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
            //delete voucher.data?.invoiceitems;
            voucher.data?.invoiceitems.map((item: any) => {
                delete item.itemdetail;
                delete item.settings;
            })


            if (Boolean(voucher.data?.voucheritems)) {
                Object.keys(voucher.data?.voucheritems).map((key: any) => {
                    delete voucher.data?.voucheritems[key].itemdetail
                })
            }

            if (!voucher.data?.assettype) {
                delete voucher.data.assetdata;
            }
            /////// remove extra json ///////

            if (voucher.data?.assettype) {
                companydetails.companies[companydetails.currentuser]['lastassettype'] = voucher.data?.assettype;
                storeData('fusion-pro-app', companydetails).then((r: any) => {
                    setCompany(companydetails);
                });
            }

            if (Boolean(voucher.data?.voucherdisplayid)) {
                voucher.data.voucherdisplayid = voucher.data.voucherdisplayid.toString();
            }

            try {


                requestApi({
                    method: Boolean(voucher?.data?.voucherid) ? methods.put : methods.post,
                    action: voucher.settings.api,
                    body: {...voucher.data, debug: 1},
                    showlog: true
                }).then((result) => {
                    if (result.status === SUCCESS) {
                        voucher.data.voucherid = result.data.voucherid;
                        if (voucher.settings.inventoryitems || printpreviewdisable) {
                            navigation?.comeback();
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 1,
                                    routes: [
                                        {name: 'ClientArea'},
                                        {name: 'AddEditVoucher'},
                                    ],
                                })
                            );
                        } else if ((!Boolean(voucher.data?.voucherstatus) || voucher.data?.voucherstatus === 'Unpaid')) {
                            this.getPrintingData()
                        }
                    }
                });
            } catch (e) {
                log('e', e)
            }


        }
    }

    callVoucherApi = () => {
        const {navigation} = this.props;

        if ((!Boolean(voucher.data.voucherstatus) || !Boolean(voucher.data.voucherid)) && voucher.settings.addpayment) {
            navigation.push('Payment', {
                screen: 'Payment',
                handleSubmit: this.handleSubmit,
                navigation: navigation
            })
        }/* else if (Boolean(voucher.settings.advancePayment)) {
            navigation.push('AdvancedPayment', {
                screen: 'AdvancedPayment',
                handleSubmit: this.handleSubmit,
                navigation: navigation
            })
        }*/ else {
            this.handleSubmit()
        }
    }

    getPrintingData = (options?: any) => {
        try {
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
        } catch (e) {
            log('e', e)
        }

    }

    deleteVoucher = () => {
        const {navigation, setDialog} = this.props;

        requestApi({
            method: methods.delete,
            action: voucher.settings.deleteapi,
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

    comeBack = () => {
        const {resetVoucherItems} = this.props
        if (!this.isOutsourcing) {
            this.resetData();
        }
        resetVoucherItems();
        this.setState({editmode: false})
    }

    forceRefresh = () => {
        this.forceUpdate()
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
                    this.deleteVoucher()
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

    downloadPDF = async () => {
        let url = apiUrl(current.company) + actions.download + jsonToQueryString({
            type: "pdf",
            voucherid: voucher.data.voucherid,
            printingtemplate: voucher.data.selectedtemplate
        });
        await downloadFile({url: url, filename: `Voucher_${voucher.data.voucherid}`})
    }

    _openModel = (component: any) => {
        const {setModal} = this.props;
        setModal({
            visible: true,
            fullView: true,
            component
        });
    }

    setSubmitData = (values: any, callback: any) => {

        let appendData: any = {}

        ;


        if (Boolean(voucher.settings.assettype)) {
            appendData = {
                ...appendData,
                assetid: values?.assetid || 0,
                assettype: values.assettype,
                assetdata: {
                    assetname: values?.assetname || values?.basefield || Boolean(values?.brand) ? values.brand : '' + ' ' + Boolean(values?.model) ? values.model : '',
                    brand: values?.brand,
                    model: values?.model,
                    basefield: values?.basefield,
                    ...values?.data
                },
                reporter: values?.reporter,
                priority: values?.priority,
                warranty: values?.warranty,
                taskdescription: values?.taskdescription,
                accessories: values?.accessories,
            }
            if (Boolean(values?.assignee)) {
                appendData = {
                    ...appendData,
                    assignee: values?.assignee,
                }
            }
        }


        voucher.data = {...voucher.data, ...appendData}
        if (Boolean(voucher.settings.outsourcing)) {
            voucher.data = {...voucher.data, data: values.data}
        }

        this.submitbuttonclick = true;

        log('this.submitbuttonclick', this.submitbuttonclick + '')

        callback(values);
    }

    _setNavigationActive = () => {
        this.navigationActive = true;
    }

    _submit = (handleSubmit: any, values: any, more: any) => {

        const {openModel, theme: {colors}} = this.props;
        let appendData: any = {}
        voucher.data.reseterror = false;
        if (Boolean(voucher.settings.assettype)) {
            appendData = {
                ...appendData,
                assetid: values?.assetid || 0,
                assettype: values.assettype,
                assetdata: {
                    assetname: values?.assetname || values?.basefield || Boolean(values?.brand) ? values.brand : '' + ' ' + Boolean(values?.model) ? values.model : '',
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
        if (Boolean(voucher.settings.outsourcing)) {
            voucher.data = {...voucher.data, data: values.data, createexpense: false}
        }

        if (voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5') {
            voucher.data = {...voucher.data, taskdata: values.taskdata}
        }

        if (voucher.data?.taskdescription) {
            voucher.data.taskdescription = voucher.data.taskdescription.toString();
        }
        if (voucher.settings.groupValidation) {
            groupErrorAlert(more);
        }
        handleSubmit(values);
    }


    render() {

        const {isloading, editmode}: any = this.state;
        const {datetitle, assettype}: any = voucher.settings;
        const {date} = voucher.data;


        const {navigation, settings, setDialog, preferences, theme: {colors}} = this.props;

        const {showestimate, showreporter}: any = voucher.type;
        const option_accounts = settings.chartofaccount.map((account: any) => assignOption(account.accountname, account.accountid));
        navigation.comeback = this.comeBack;
        navigation.forceRefresh = this.forceRefresh;

        let options_staff: any = [];

        if (Boolean(assettype)) {
            if (settings.staff) {
                options_staff = Object.values(settings.staff).filter((stf: any) => {
                    return !stf.support
                }).map((stf: any) => assignOption(stf.username, stf.adminid))
            }
        }

        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) => <>
                <View style={[styles.grid, styles.middle]}>
                    {Boolean(voucher.data.voucherid) && <>
                        {Boolean(voucher.settings.enableedit) && Boolean(voucher?.type?.accessType) && Boolean(voucher?.type?.accessType[ACCESS_TYPE.UPDATE]) &&
                            <Title onPress={() => {
                                this.setState({editmode: !editmode})
                            }}>
                                <ProIcon name={editmode ? 'eye' : 'pen-to-square'} size={16}/>
                            </Title>}
                        {!voucher.settings.inventoryitems &&
                            <Menu menulist={this.menuitems} onPress={(value: any) => this.clickMenu(value)}>
                                <ProIcon name={'ellipsis-vertical'} align={'right'}/>
                            </Menu>}
                    </>}
                </View>
            </>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{this.subtitle}</Title>,
            })
        }


        if (!isloading) {
            return <FormLoader/>
        }

        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerTitle: this.subtitle,
        });


        /////////// BIND CLIENT CAN NOT CHANGE ON PAID PARTIAL PAID AND PAYMENT MADE AND RECEIPT
        const canChangeClient = ((voucher.settings.canChangeCLient) || !Boolean(voucher.data.voucherid) || (!voucher.settings.canChangeCLient && voucher.data.voucherstatus === 'Unpaid'));


        return (
            <Container>

                <Confirm
                    title={"Confirm"}
                    message={"Are you sure you want to continue without Assignee?"}
                    ref={o2 => this.ActionSheet2 = o2}
                    options={['Yes', 'No']}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={0}
                    onPress={(index: any) => {
                        if (index === 0) {
                            this.callVoucherApi();
                        } else if (index === 1) {
                            this.assigneeRef.props.onPress()
                        }
                    }}
                />

                <Form
                    onSubmit={this.validate}
                    initialValues={{...voucher.data}}
                    render={({handleSubmit, submitting, values, ...more}: any) => {
                        const {initialValues, form, errors, ...data} = more;

                        return (
                            <View style={[styles.h_100]}>
                                <KeyboardScroll ref={this.scrollRef} keyboardShouldPersistTaps='handled'>
                                    <View>
                                        {
                                            (Boolean(voucher.data.voucherid) || Boolean(this.isOutsourcing)) &&
                                            <Heading
                                                navigation={navigation}
                                                handleSubmit={this.handleSubmit}
                                                isOutsourcing={this.isOutsourcing}
                                                setNavigationActive={this._setNavigationActive}
                                                outsourcingDelivery={Boolean(values.delivery)}
                                                onSubmit={() => {
                                                    voucher.data = {
                                                        ...voucher.data,
                                                        data: values.data,
                                                        createexpense: true
                                                    }
                                                    handleSubmit(values)
                                                }}
                                            />
                                        }
                                        <View style={[styles.pageContent]}>
                                            {
                                                voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5' &&
                                                <ErrorGroup {...more} scrollRef={this.scrollRef}/>
                                            }


                                            <Card style={[styles.card]}>
                                                <Card.Content style={{paddingBottom: 0}}>
                                                    <View
                                                        style={[styles.grid, styles.justifyContent, styles.middle]}>
                                                        <View style={{width: '50%'}}>
                                                            <View style={[styles.fieldspace]}>
                                                                <Text style={[styles.inputLabel]}>Location</Text>
                                                                <View
                                                                    style={[styles.row, styles.justifyContent, {marginBottom: 5}]}>
                                                                    <Paragraph
                                                                        style={[styles.paragraph]}>{this.location}</Paragraph>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        {
                                                            Boolean(voucher?.settings?.date) &&
                                                            <View style={{width: '50%'}}>

                                                                <InputField
                                                                    label={datetitle}
                                                                    divider={false}
                                                                    displaytype={'bottomlist'}
                                                                    inputtype={'datepicker'}
                                                                    mode={'date'}
                                                                    dueterm={false}
                                                                    editmode={editmode}
                                                                    selectedValue={date}
                                                                    onChange={(value: any) => {
                                                                        voucher.data.date = value;
                                                                        voucher.data.duedate = value;
                                                                        more.form.change("date", value);
                                                                    }}
                                                                />
                                                            </View>

                                                        }

                                                    </View>
                                                </Card.Content>
                                            </Card>

                                            {
                                                Boolean(voucher.settings.p2p) && <Card style={[styles.card]}>
                                                    <Card.Content style={{paddingBottom: 0}}>
                                                        <View>

                                                            <Field name="accountid" validate={composeValidators(required)}>
                                                                {props => (
                                                                    <>
                                                                        <InputField
                                                                            {...props}
                                                                            label={'Account'}
                                                                            divider={true}
                                                                            displaytype={'pagelist'}
                                                                            inputtype={'dropdown'}
                                                                            list={option_accounts}
                                                                            search={false}
                                                                            listtype={'other'}
                                                                            selectedValue={props.input.value}
                                                                            onChange={(value: any, obj: any) => {
                                                                            }}
                                                                        />
                                                                    </>
                                                                )}
                                                            </Field>

                                                            <Field name="amount" validate={composeValidators(required)}>
                                                                {props => (
                                                                    <>
                                                                        <InputField
                                                                            {...props}
                                                                            label={"Amount"}
                                                                            inputtype={'textbox'}
                                                                            validateWithError={true}
                                                                            keyboardType='numeric'
                                                                        />
                                                                    </>
                                                                )}
                                                            </Field>

                                                            <OnChange
                                                                name={`amount`}>
                                                                {(current, previous) => {
                                                                    if (Boolean(current)) {
                                                                        form.change(`invoiceitems[0].amount`, current);
                                                                        form.change(`invoiceitems[0].type`, "credit");
                                                                        form.change(`invoiceitems[1].amount`, current);
                                                                        form.change(`invoiceitems[1].type`, "debit");
                                                                    }
                                                                }}
                                                            </OnChange>
                                                        </View>
                                                    </Card.Content>
                                                </Card>
                                            }

                                            {
                                                Boolean(voucher.settings.p2p) && <>
                                                    {
                                                        values.invoiceitems.map((item: any, index: number) => {
                                                            return <Card style={[styles.card]}>
                                                                <Card.Content style={{paddingBottom: 0}}>
                                                                    <View>
                                                                        <ClientDetail
                                                                            selectClient={(client: any) => {
                                                                                form.change(`invoiceitems[${index}].clientid`, client.clientid);
                                                                                form.change(`invoiceitems[${index}].clientname`, client.displayname);
                                                                            }}
                                                                            item={item}
                                                                            foritem={true}
                                                                            editmode={true}
                                                                            navigation={navigation}/>


                                                                        <View
                                                                            style={[styles.grid, styles.justifyContent, styles.middle]}>
                                                                            <View style={{width: '50%'}}>
                                                                                <Field name={`invoiceitems[${index}].type`}
                                                                                       validate={composeValidators(required)}>
                                                                                    {props => {
                                                                                        const isCredit = Boolean(values.invoiceitems[index]?.type == "credit");
                                                                                        const isDebit = Boolean(values.invoiceitems[index]?.type == "debit");
                                                                                        return <View
                                                                                            style={[styles.grid, styles.middle]}>
                                                                                            <View
                                                                                                style={[{marginRight: 8}]}>
                                                                                                <Button
                                                                                                    compact={true}
                                                                                                    onPress={() => {
                                                                                                        form.change(`invoiceitems[${index}].type`, "credit");
                                                                                                        let nextIndex = index ? 0 : 1
                                                                                                        form.change(`invoiceitems[${nextIndex}].type`, "debit");
                                                                                                    }}
                                                                                                    more={{backgroundColor: isCredit ? "#29A745" : "#ccc"}}
                                                                                                >Credit</Button>
                                                                                            </View>
                                                                                            <View>
                                                                                                <Button
                                                                                                    onPress={() => {
                                                                                                        form.change(`invoiceitems[${index}].type`, "debit");
                                                                                                        let nextIndex = index ? 0 : 1
                                                                                                        form.change(`invoiceitems[${nextIndex}].type`, "credit");
                                                                                                    }}
                                                                                                    more={{backgroundColor: isDebit ? "#a72929" : "#ccc"}}
                                                                                                    compact={true}>debit</Button>
                                                                                            </View>
                                                                                        </View>
                                                                                    }}
                                                                                </Field>
                                                                            </View>
                                                                            <View style={{width: '50%'}}>

                                                                                <Field
                                                                                    name={`invoiceitems[${index}].amount`}
                                                                                    validate={composeValidators(required)}>
                                                                                    {props => (
                                                                                        <>
                                                                                            <InputField
                                                                                                {...props}
                                                                                                label={"Amount"}
                                                                                                disabled={true}
                                                                                                inputtype={'textbox'}
                                                                                                validateWithError={true}
                                                                                                keyboardType='numeric'
                                                                                            />
                                                                                        </>
                                                                                    )}
                                                                                </Field>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </Card.Content>
                                                            </Card>
                                                        })
                                                    }
                                                </>
                                            }

                                            {Boolean(voucher.settings.client) &&
                                                <ClientDetail editmode={editmode && canChangeClient} values={values}
                                                              navigation={navigation} form={more.form}/>}

                                            {
                                                !Boolean(voucher?.settings?.hideDate) &&
                                                <VoucherDate navigation={navigation} editmode={editmode}
                                                             key={uuidv4()}
                                                             minimumDate={voucher?.data?.date}
                                                             showDays={true} showTodayTomorrow={true}/>
                                            }

                                            <Custom navigation={navigation} editmode={editmode} form={more.form}
                                                    values={values}/>

                                            {voucher.settings.cartitems && <>
                                                <Tooltip
                                                    message={`Select Product Or Service`}
                                                    stepOrder={STEPS.SELECT_PRODUCT_OR_SERVICE}
                                                >
                                                    <TooltipContainer stepOrder={STEPS.SELECT_PRODUCT_OR_SERVICE}>
                                                        <Card style={[styles.card]}>
                                                            <Card.Content style={{paddingBottom: 0}}>
                                                                <CartItems
                                                                    navigation={navigation}
                                                                    validate={() => {
                                                                        this.setSubmitData(values, (values: any) => {
                                                                            if (voucher.settings.groupValidation) {
                                                                                groupErrorAlert(more);
                                                                            }
                                                                            more.invalid && navigation.goBack()
                                                                            handleSubmit(values)
                                                                        })
                                                                    }}
                                                                    editmode={editmode}/>
                                                            </Card.Content>
                                                        </Card>
                                                    </TooltipContainer>
                                                </Tooltip>
                                                <CartSummary editmode={editmode} navigation={navigation}/>
                                            </>}

                                            {Boolean(voucher.settings.invoiceitems) &&
                                                <InvoiceItems navigation={navigation} validate={this.validate}
                                                              editmode={editmode}/>
                                            }

                                            {voucher.settings.expenseitems && <>
                                                <Card style={[styles.card]}>
                                                    <Card.Content style={{paddingBottom: 0}}>
                                                        <ExpenseItems navigation={navigation}
                                                                      validate={this.validate}
                                                                      editmode={editmode}/>
                                                    </Card.Content>
                                                </Card>
                                                <CartSummary editmode={editmode} navigation={navigation}/></>}

                                            {voucher.settings.journalitems &&
                                                <Card style={[styles.card]}>
                                                    <Card.Content style={{paddingBottom: 0}}>
                                                        <JournalItems navigation={navigation}
                                                                      validate={this.validate}
                                                                      editmode={editmode}/>
                                                    </Card.Content>
                                                </Card>
                                            }

                                            {voucher.settings.inventoryitems &&
                                                <Card style={[styles.card]}>
                                                    <Card.Content style={{paddingBottom: 0}}>
                                                        <InventoryItems navigation={navigation}
                                                                        validate={this.validate}
                                                                        editmode={editmode}/>
                                                    </Card.Content>
                                                </Card>
                                            }


                                            <Notes navigation={navigation} editmode={editmode}/>


                                            {(!Boolean(voucher.data.voucherstatus) || voucher.data.voucherstatus === 'Unpaid') && Boolean(voucher.data.voucherid) ?
                                                <View>
                                                </View> : <View>
                                                    {Boolean(voucher.data.receipt) && <>

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

                                                                <View style={{display: 'none'}}
                                                                      ref={this.moreReceiptRef}>
                                                                    <Divider
                                                                        style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                                                    <ReceiptPayment navigation={navigation}
                                                                                    setNavigationActive={this._setNavigationActive}/>
                                                                </View>
                                                            </Card.Content>
                                                        </Card>
                                                    </>}
                                                </View>}


                                            {Boolean(voucher.data?.ledger?.row) && voucher.settings.viewledger &&
                                                <View>
                                                    <Card style={[styles.card]}>
                                                        <Card.Content>
                                                            <View>
                                                                <TouchableOpacity onPress={() => {
                                                                    this.isShowLedger = !this.isShowLedger;
                                                                    updateComponent(this.moreLedgerRef, 'display', this.isShowLedger ? 'flex' : 'none')
                                                                }}>

                                                                    <View
                                                                        style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                                        <Paragraph
                                                                            style={[styles.paragraph, styles.caption]}>
                                                                            Journal Entries
                                                                        </Paragraph>
                                                                        <ProIcon name={`chevron-down`} size={16}/>
                                                                    </View>

                                                                </TouchableOpacity>
                                                                <View style={{display: 'none'}}
                                                                      ref={this.moreLedgerRef}>
                                                                    <Divider
                                                                        style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                                                    <Ledger/>
                                                                </View>
                                                            </View>
                                                        </Card.Content>
                                                    </Card>
                                                </View>}

                                            {
                                                (Boolean(assettype) && Boolean(values?.assettype)) &&
                                                <Card style={[styles.card]}>
                                                    <Card.Content style={{paddingBottom: 0}}>
                                                        <View>
                                                            {showreporter && <View>
                                                                <Field name="reporter">
                                                                    {props => (
                                                                        <InputField
                                                                            label={'Reporter'}
                                                                            mode={'flat'}
                                                                            editmode={editmode}
                                                                            hideDivider={true}
                                                                            morestyle={styles.voucherDropdown}
                                                                            list={options_staff}
                                                                            value={props.input.value}
                                                                            selectedValue={props.input.value}
                                                                            selectedLabel={"Select Reporter"}
                                                                            displaytype={'pagelist'}
                                                                            inputtype={'dropdown'}
                                                                            listtype={'staff'}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value);
                                                                            }}>
                                                                        </InputField>
                                                                    )}
                                                                </Field>
                                                            </View>}

                                                            <View>
                                                                <Field name="assignee">
                                                                    {props => (
                                                                        <InputField
                                                                            customRef={(ref: any) => {
                                                                                this.assigneeRef = ref
                                                                            }}
                                                                            label={'Assign To'}
                                                                            mode={'flat'}
                                                                            editmode={editmode}
                                                                            hideDivider={true}
                                                                            morestyle={styles.voucherDropdown}
                                                                            list={options_staff}
                                                                            value={props.input.value}
                                                                            selectedValue={props.input.value}
                                                                            selectedLabel={"Select Assign To"}
                                                                            displaytype={'pagelist'}
                                                                            inputtype={'dropdown'}
                                                                            listtype={'staff'}
                                                                            onChange={(value: any) => {

                                                                                voucher.data.assignee = value;
                                                                                props.input.onChange(value);

                                                                                log('this.submitbuttonclick', this.submitbuttonclick + '')
                                                                                if (this.submitbuttonclick) {
                                                                                    this.validate();
                                                                                }


                                                                            }}>
                                                                        </InputField>
                                                                    )}
                                                                </Field>
                                                            </View>
                                                        </View>
                                                    </Card.Content>
                                                </Card>
                                            }

                                            {voucher.settings.attachment && !Boolean(voucher.settings.assettype) && <>
                                                <View>
                                                    {<View>
                                                        <InputField
                                                            label={'Add Attachment'}
                                                            divider={true}
                                                            editmode={editmode}
                                                            onChange={(value: any) => {
                                                                this.forceUpdate()
                                                            }}
                                                            inputtype={'attachment'}
                                                            navigation={navigation}
                                                        />
                                                    </View>}
                                                </View>
                                            </>}


                                            {voucher?.data?.isdisplaysign  && <>
                                                <View>
                                                    {<View>
                                                        <InputField
                                                            label={'Customer Signature'}
                                                            editmode={editmode}
                                                            inputtype={'signature'}
                                                            navigation={navigation}
                                                        />
                                                    </View>}
                                                </View>
                                            </>}


                                            {
                                                Boolean(voucher?.settings?.estimateAndPaymentLink) && showestimate &&
                                                <Card style={[styles.card]}
                                                      onPress={() => this._openModel(() => <Estimate
                                                          form={more.form} values={values}
                                                          navigation={navigation}/>)}>
                                                    <Card.Content>
                                                        <View
                                                            style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                            <Paragraph
                                                                style={[styles.paragraph, styles.caption]}> Create
                                                                Estimate </Paragraph>
                                                            <View
                                                                style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                                {values.estimate === '1' && <Paragraph
                                                                    style={[styles.paragraph]}> {values.estimateapproval === '0' ? 'Client approval required' : 'Pre-approved'} </Paragraph>}
                                                                {chevronRight}
                                                            </View>
                                                        </View>
                                                    </Card.Content>
                                                </Card>
                                            }


                                            {voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5' &&
                                                <JobAdvPayment key={uuidv4()} handleSubmit={handleSubmit}
                                                               childref={(ref: any) => {
                                                                   if (Boolean(ref)) {
                                                                       this.child = ref
                                                                   }
                                                               }}/>}


                                            {Boolean(this.taskFields.length > 0) && <Card style={[styles.card]}>
                                                <Card.Content>
                                                    {
                                                        this.taskFields
                                                            .map(({
                                                                      type,
                                                                      key,
                                                                      input,
                                                                      required: req,
                                                                      options,
                                                                      displayname: name
                                                                  }: any, index: any) => {
                                                                let fieldname = `taskdata[${key}]`;

                                                                return <View key={index}>
                                                                    {
                                                                        type && <>
                                                                            {
                                                                                (input !== "imei" && (type === "text" || type === "password" || type === "textarea")) &&
                                                                                <Field name={fieldname}
                                                                                       validate={req ? (props: any) => required(props, name) : undefined}>
                                                                                    {props => (
                                                                                        <><InputField
                                                                                            {...props}
                                                                                            value={props.input.value}
                                                                                            label={name}
                                                                                            inputtype={type === "textarea" ? 'textarea' : 'textbox'}
                                                                                            secureTextEntry={type === "password"}
                                                                                            multiline={type === "textarea"}
                                                                                            onChange={(value: any) => {
                                                                                                props.input.onChange(value);
                                                                                            }}
                                                                                        />
                                                                                        </>
                                                                                    )}
                                                                                </Field>
                                                                            }

                                                                            {
                                                                                (input === "imei") &&
                                                                                <Field name={fieldname}
                                                                                       validate={req ? (props: any) => required(props, name) : undefined}>
                                                                                    {props => (
                                                                                        <><InputField
                                                                                            {...props}
                                                                                            value={props.input.value}
                                                                                            label={name}
                                                                                            inputtype={'scan'}
                                                                                            navigation={navigation}
                                                                                            onChange={(value: any) => {
                                                                                                props.input.onChange(value);
                                                                                            }}
                                                                                        />
                                                                                        </>
                                                                                    )}
                                                                                </Field>
                                                                            }

                                                                            {
                                                                                (type === "dropdown" || type === "radio" || type === 'checkbox') &&
                                                                                <Field name={fieldname}
                                                                                       validate={req ? (props: any) => required(props, name) : undefined}>
                                                                                    {props => (
                                                                                        <>
                                                                                            <InputField
                                                                                                {...props}
                                                                                                label={name}
                                                                                                mode={'flat'}
                                                                                                list={Object.values(options).map((t: any) => assignOption(t, t))}
                                                                                                value={props.input.value}
                                                                                                selectedValue={props.input.value}
                                                                                                displaytype={'pagelist'}
                                                                                                inputtype={'dropdown'}
                                                                                                multiselect={type === 'checkbox'}
                                                                                                listtype={'other'}
                                                                                                onChange={(value: any) => {
                                                                                                    props.input.onChange(value);
                                                                                                }}>
                                                                                            </InputField>
                                                                                        </>
                                                                                    )}
                                                                                </Field>
                                                                            }

                                                                            {
                                                                                type === 'checkboxgroup' &&
                                                                                <Field name={fieldname}>
                                                                                    {props => (<View
                                                                                        style={{marginLeft: -25}}><CheckBox
                                                                                        value={props.input.value}
                                                                                        label={name}
                                                                                        onChange={(value: any) => {
                                                                                            props.input.onChange(value);
                                                                                        }}/></View>)}
                                                                                </Field>
                                                                            }


                                                                        </>
                                                                    }
                                                                </View>
                                                            })
                                                    }
                                                </Card.Content>
                                            </Card>}


                                            {editmode && Boolean(voucher.data.voucherid) && Boolean(voucher?.type?.accessType) && Boolean(voucher?.type?.accessType[ACCESS_TYPE.DELETE]) &&
                                                <DeleteButton
                                                    title={'Delete this Voucher?'}
                                                    message={'Deleting permanently erases the voucher, including all payments'}
                                                    onPress={(index: any) => {
                                                        if (index === 0) {
                                                            this.deleteVoucher()
                                                        }
                                                    }}
                                                />}

                                        </View>
                                    </View>
                                </KeyboardScroll>


                                {editmode && <View style={[styles.px_5, styles.mb_4]}>


                                    <KAccessoryView>
                                        <View style={[styles.submitbutton]}>
                                            <Tooltip
                                                message={`Proceed to Payment`}
                                                stepOrder={STEPS.SAVE_INVOICE}>
                                                <TooltipContainer stepOrder={STEPS.SAVE_INVOICE}>
                                                    <Button
                                                        disable={more.invalid}
                                                        secondbutton={more.invalid}

                                                        onPress={() => {
                                                            this.submitbuttonclick = true;
                                                            if (voucher.data.isPaymentReceived == '1') {
                                                                console.log('id')
                                                                this.child?.addPayment();
                                                            } else {
                                                                console.log('else')
                                                                voucher.data.payments = '';
                                                                this._submit(handleSubmit, values, more);
                                                            }
                                                        }}

                                                        /*onPress={() => {
                                                            this._submit(handleSubmit, values, more);
                                                        }}*/

                                                    >
                                                        {
                                                            Boolean(voucher.data.voucherid) ?
                                                                'Update' :
                                                                voucher.settings.addpayment ?
                                                                    'Proceed to Payment' :
                                                                    Boolean(voucher?.type?.vouchertype === "receipt" || voucher?.type?.vouchertype === "payment") ? voucher?.settings?.buttonLabel : `Generate ${voucher.type.label}`
                                                        }
                                                    </Button>
                                                </TooltipContainer>
                                            </Tooltip>
                                        </View>
                                    </KAccessoryView>


                                </View>}

                            </View>
                        )
                    }
                    }
                >

                </Form>


            </Container>

        )
    }

}

const mapStateToProps = (state: any) => ({
    companydetails: state.appApiData.companydetails,
    vouchers: state.appApiData.settings.voucher,
    settings: state.appApiData.settings,
    preferences: state.appApiData.preferences,
})

const mapDispatchToProps = (dispatch: any) => ({
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
    setPendingInvoices: (invoices: any) => dispatch(setPendingInvoices(invoices)),
    setAlert: (alert: any) => dispatch(setAlert(alert)),
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setLoader: (loader: any) => dispatch(setLoader(loader)),
    resetVoucherItems: () => dispatch(resetVoucherItems()),
    setModal: (dialog: any) => dispatch(setModal(dialog)),
    setPageSheet: (page: any) => dispatch(setPageSheet(page)),
    setCompany: (company: any) => dispatch(setCompany({companydetails: company})),
    setVoucherItems: (items: any) => dispatch(setVoucherItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withFocused(VoucherView)));


