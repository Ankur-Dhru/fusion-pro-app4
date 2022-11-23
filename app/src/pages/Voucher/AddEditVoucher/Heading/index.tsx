import React, {Component} from 'react';
import {TouchableOpacity, View,} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";

import {ProIcon} from "../../../../components";
import {Paragraph, withTheme} from "react-native-paper";
import {nav, voucher} from "../../../../lib/setting";

import moment from "moment";
import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {clone, errorAlert, getCurrentCompanyDetails, getVoucherTypeData} from "../../../../lib/functions";
import {getProductData} from "../../../../lib/voucher_calc";
import {updateVoucherItems} from "../../../../lib/Store/actions/appApiData";
import {setAlert} from "../../../../lib/Store/actions/components";


class Heading extends Component<any> {

    constructor(props: any) {
        super(props);
    }

    updateProcessstatus = (action: any) => {
        const {navigation, setAlert} = this.props;
        if (action === 'manualapproval') {
            requestApi({
                method: methods.put,
                action: actions.estimate,
                queryString: {estimateid: voucher.data.voucherid},
            }).then((result: any) => {
                if (result.status === SUCCESS) {
                    nav.navigation.getVouchers(true, true)
                    navigation.goBack()
                }
            });
        } else {
            if (voucher.data.email) {
                requestApi({
                    method: methods.post,
                    action: actions.email,
                    body: {voucherid: voucher.data.voucherid, clientid: voucher.data.clientid},
                }).then((result: any) => {
                    if (result.status === SUCCESS) {
                        nav.navigation.getVouchers(true, true)
                        navigation.goBack()
                    }
                });
            } else {
                errorAlert('Email id not set');
            }
        }
    }

    copytoInvoice = (voucherid: any, label: any) => {
        const {navigation, vouchers} = this.props;
        voucher.data.date = moment(voucher.data.date).format(`YYYY-MM-DD`)
        requestApi({
            method: methods.put,
            action: actions.voucher,
            queryString: {convertotinvoice: true},
            body: voucher.data
        }).then((result: any) => {
            if (result.status === SUCCESS) {

                ///////// REDIRECT TO NEW GENERATED INVOICE ///////
                /*let voucherdisplayid = result.data.voucherid
                voucher.type={...vouchers[voucherid],label: label,voucherdisplayid:voucherdisplayid};
                navigation.replace('AddEditVoucher', {
                    screen: 'AddEditVoucher',
                });*/
                ///////// REDIRECT TO NEW GENERATED INVOICE ///////
                navigation.goBack()
            }
        });
    }

    checkStock = async (itemid: any) => {
        const {setAlert}: any = this.props
        return await requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {itemid: itemid, stockcheck: true, location: voucher.data.locationid, multiple: 1},
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                return result.data
            }
        });
    }

    copyItemsForVoucher = (voucherid: any, label: any) => {
        const {navigation, vouchers, voucheritems, updateVoucherItems, setAlert} = this.props;

        voucher.type = {...vouchers[voucherid], label: label, voucherid: ''}; /// get invoice voucher details
        voucher.data.copyinvoice = {
            ...voucher.data,
            voucherid: '',
            convertedto: voucher.data.voucherid,
            fromanothervoucher: true,
        };

        const {defaultcurrency}: any = getCurrentCompanyDetails();

        if (Boolean(voucheritems)) {
            updateVoucherItems({})
            let itemids: any = [];
            let voucheritemids: any = {}
            Object.keys(voucheritems).map((keys: any) => {
                let item = voucheritems[keys];
                voucheritemids[item.productid] = item;
                itemids.push(item.productid)
            });
            itemids = itemids.join();

            this.checkStock(itemids).then((response: any) => {
                if (response) {
                    let copyitems: any = {};
                    let error = false;
                    let errorMessage = "";
                    Object.keys(response).map((keys: any) => {
                        let item: any = response[keys];
                        let voucheritem = voucheritemids[keys];

                        if ((item.stockonhand > 0 && item.inventorytype === 'specificidentification') || item.inventorytype !== 'specificidentification') {
                            item = {
                                ...voucheritem, ...voucheritem.itemdetail,
                                productqnt: 1,
                                voucherid: '',
                                voucheritemid: '',
                                serial: item.serial ? [item.serial] : ''
                            }
                            item = {...item, ...getProductData(item, voucher.data.currency, defaultcurrency, item.productqnt, undefined, voucher.data.vouchertype === 'inward')}
                            copyitems[keys] = item;
                        } else {
                            if (Boolean(errorMessage)) {
                                errorMessage += '\n';
                            }
                            error = true;
                            errorMessage += item.itemname + ' :  Not enough Qnt';
                        }
                    })
                    if (error) {
                        errorAlert(errorMessage);
                    }
                    updateVoucherItems(clone(copyitems))
                }
            })
        }

        navigation.replace('AddEditVoucher', {
            screen: 'AddEditVoucher',
            copy: true
        });

    }

    voucherDetail = (vouchertypeid:any,voucherdisplayid: any) => {
        const {navigation, setNavigationActive}: any = this.props;

        setNavigationActive && setNavigationActive()
        voucher.type = getVoucherTypeData("vouchertypeid", vouchertypeid, voucherdisplayid);
        voucher.data = {};
        navigation.push('AddEditVoucher', {
            screen: 'AddEditVoucher',
            doNotSetBackData: true
        });
    }

    render() {

        const {
            navigation,
            settings,
            handleSubmit,
            theme: {colors},
            isOutsourcing,
            outsourcingDelivery,
            onSubmit,
            setNavigationActive
        } = this.props;
        const dateformat: any = settings.general.dateformat;


        return (
            <View style={[styles.px_5, {backgroundColor: colors.surface}]}>
                {/* Estimate enable copy to invoice */}
                {Boolean(voucher.settings.processstatus) && <View>
                    <View style={[styles.row, styles.middle]}>
                        <View style={[styles.cell, styles.badge, styles[voucher.data.processstatus]]}><Paragraph
                            style={[styles.paragraph, {color: 'white'}]}>  {voucher.data.processstatus}</Paragraph></View>
                        <View style={[styles.w_auto]}></View>
                        {voucher.data.processstatus === 'Waiting' ? <View style={[styles.cell, {paddingRight: 0}]}>
                            <TouchableOpacity onPress={() => {
                                this.updateProcessstatus('requestforapproval')
                            }}>
                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.orange.color} name={'check'}/>
                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.orange]}>
                                        Request for Approval
                                    </Paragraph>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.updateProcessstatus('manualapproval')
                            }}>
                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.green.color} name={'check'}/>
                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                        Manual Approval
                                    </Paragraph>
                                </View>
                            </TouchableOpacity>
                        </View> : <View>
                            {!Boolean(voucher.data.convertedid) ? <TouchableOpacity onPress={() => {
                                this.copyItemsForVoucher('b152d626-b614-4736-8572-2ebd95e24173', 'Invoice')
                            }}>
                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.green.color} name={'copy'}/>
                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                        Copy to Invoice
                                    </Paragraph>
                                </View>
                            </TouchableOpacity> : <View>
                                <TouchableOpacity onPress={()=>this.voucherDetail('b152d626-b614-4736-8572-2ebd95e24173',voucher.data.converteddisplayid)}>
                                    <Paragraph style={[styles.paragraph, {color:colors.secondary}]}>{`Converted to ${voucher.data.convertedid}`}</Paragraph>
                                </TouchableOpacity>
                            </View>}
                            <View style={[styles.grid, styles.right]}><Paragraph
                                style={[styles.paragraph, styles.text_xs]}>Approved
                                By {voucher.data.approvedby}</Paragraph></View>
                        </View>}
                    </View>
                </View>}
                {/* invoice enable payment */}
                {Boolean(voucher.settings.addpayment) && <View>
                    <View style={[styles.row, styles.middle]}>
                        <View style={[styles.cell, styles.badge, styles[voucher.data.voucherstatus]]}><Paragraph
                            style={[styles.paragraph, {color: 'white'}]}>    {voucher.data.voucherstatus} </Paragraph></View>
                        <View style={[styles.w_auto]}></View>
                        <View style={[styles.cell, styles.middle, {paddingRight: 0}]}>
                            {voucher.data.voucherstatus === 'Unpaid' ? <TouchableOpacity onPress={() => {
                                navigation.push('Payment', {
                                    screen: 'Payment',
                                    handleSubmit: handleSubmit,
                                    navigation: navigation,
                                    fromAddpayment:true
                                })
                            }}>
                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.green.color} name={'circle-plus'}/>
                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                        Add payment
                                    </Paragraph>
                                </View>
                            </TouchableOpacity> : <View style={[styles.grid, styles.right]}><Paragraph
                                style={[styles.paragraph, styles.text_sm]}>Paid
                                on {moment(moment(voucher.data.paiddate, 'YYYY-MM-DD HH:mm:ii').toDate()).format(`${dateformat} HH:mm`)}</Paragraph></View>}
                        </View>
                    </View>
                </View>}
                {/* Delivery challan enable copy to invoice */}
                {Boolean(voucher.settings.deliverystatus) && <View>
                    <View style={[styles.row, styles.middle]}>
                        <View
                            style={[styles.cell, styles.paragraph, styles.badge, styles[voucher.data.deliverystatus]]}><Paragraph
                            style={[{color: 'white'}]}>   {voucher.data.deliverystatus} </Paragraph></View>
                        <View style={[styles.w_auto]}></View>
                        {voucher.data.deliverystatus === 'Delivered' && <View style={[styles.cell, {paddingRight: 0}]}>
                            {!Boolean(voucher.data.convertedid) ?
                                <TouchableOpacity style={[styles.row, styles.middle]} onPress={() => {
                                    this.copytoInvoice('b152d626-b614-4736-8572-2ebd95e24173', 'Invoice')
                                }}>
                                    <View style={[styles.grid, styles.middle]}>
                                        <ProIcon color={styles.green.color} name={'copy'}/>
                                        <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                            Copy to Invoice
                                        </Paragraph>
                                    </View>
                                </TouchableOpacity> : <View style={[styles.grid, styles.right]}>
                                    <TouchableOpacity onPress={()=>this.voucherDetail('b152d626-b614-4736-8572-2ebd95e24173',voucher.data.converteddisplayid)}>
                                        <Paragraph style={[styles.paragraph, {color:colors.secondary}]}>{`Converted to ${voucher.data.convertedid}`}</Paragraph>
                                    </TouchableOpacity>
                                </View>}
                        </View>}
                    </View>
                </View>}
                {/* sales order enable copy to invoice */}
                {voucher.type.vouchertypeid === 'ec6da168-5659-4a2f-9896-6ef4c8598532' && <View>
                    <View style={[styles.row, styles.middle]}>
                        <View style={[styles.w_auto]}></View>
                        {voucher.data.voucherid && <View style={[styles.cell, {paddingRight: 0}]}>
                            {!Boolean(voucher.data.convertedid) ? <TouchableOpacity onPress={() => {
                                this.copyItemsForVoucher('b152d626-b614-4736-8572-2ebd95e24173', 'Invoice')
                            }}>
                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.green.color} name={'copy'}/>
                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                        Copy to Invoice
                                    </Paragraph>
                                </View>
                            </TouchableOpacity> : <View style={[styles.grid, styles.right]}>
                                <TouchableOpacity onPress={()=>this.voucherDetail('b152d626-b614-4736-8572-2ebd95e24173',voucher.data.converteddisplayid)}>
                                    <Paragraph style={[styles.paragraph, {color:colors.secondary}]}>{`Converted to ${voucher.data.convertedid}`}</Paragraph>
                                </TouchableOpacity>
                            </View>}
                        </View>}
                    </View>
                </View>}
                {/* purchase order enable copy to bill */}
                {voucher.type.vouchertypeid === '210bf595-d2ee-4460-a378-c7ba86af4d53' && <View>
                    <View style={[styles.row, styles.middle]}>
                        <View style={[styles.w_auto]}></View>
                        {voucher.data.voucherid && <View style={[styles.cell, {paddingRight: 0}]}>
                            {!Boolean(voucher.data.convertedid) ? <TouchableOpacity onPress={() => {
                                this.copyItemsForVoucher('71e9cc99-f2d1-4b47-94ee-7aafd481e3c5', 'Bill')
                            }}>
                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.green.color} name={'copy'}/>
                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                        Copy to Bill
                                    </Paragraph>
                                </View>
                            </TouchableOpacity> : <View style={[styles.grid, styles.right]}>
                                <TouchableOpacity onPress={()=>this.voucherDetail('71e9cc99-f2d1-4b47-94ee-7aafd481e3c5',voucher.data.converteddisplayid)}>
                                    <Paragraph style={[styles.paragraph, {color:colors.secondary}]}>{`Converted to ${voucher.data.convertedid}`}</Paragraph>
                                </TouchableOpacity>

                            </View>}
                        </View>}
                    </View>
                </View>}
                {/* invoice enable payment */}
                {(voucher.type.vouchertypeid === '71e9cc99-f2d1-4b47-94ee-7aafd481e3c5' && !Boolean(isOutsourcing)) &&
                    <View>
                        {<View>
                            <View style={[styles.row, styles.middle]}>
                                <View style={[styles.cell, styles.badge, styles[voucher.data.voucherstatus]]}><Paragraph
                                    style={[styles.paragraph, {color: 'white'}]}>    {voucher.data.voucherstatus} </Paragraph></View>
                                <View style={[styles.w_auto]}></View>
                                <View style={[styles.cell, styles.middle, {paddingRight: 0}]}>
                                    {voucher.data.voucherstatus === 'Paid' &&
                                        <View style={[styles.grid, styles.right]}><Paragraph
                                            style={[styles.paragraph, styles.text_sm]}>Paid
                                            on {moment(moment(voucher.data.paiddate, 'YYYY-MM-DD HH:mm:ii').toDate()).format(`${dateformat} HH:mm`)}</Paragraph></View>}
                                </View>
                            </View>
                        </View>}
                    </View>}
                {/* purchase order enable copy to bill */}
                {(Boolean(isOutsourcing) && Boolean(outsourcingDelivery)) && <View>
                    <View style={[styles.row, styles.middle]}>
                        <View style={[styles.w_auto]}></View>
                        <View style={[styles.cell, {paddingRight: 0}]}>
                            {!Boolean(voucher.data.outsourcingdisplayid) ? <TouchableOpacity onPress={onSubmit}>
                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.green.color} name={'copy'}/>
                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                        Create Purchase / Bill
                                    </Paragraph>
                                </View>
                            </TouchableOpacity> : <View style={[styles.grid, styles.right]}>
                                <Paragraph
                                    style={[styles.paragraph, {textAlign: 'right'}]}>{`Purchase / Bill : ${voucher.data.outsourcingprefix}${voucher.data.outsourcingdisplayid}`}</Paragraph>
                            </View>}
                        </View>
                    </View>
                </View>}
            </View>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    vouchers: state.appApiData.settings.voucher,
    voucheritems: state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch: any) => ({
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
    setAlert: (alert: any) => dispatch(setAlert(alert)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Heading));


