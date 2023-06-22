import React, {Component} from "react";
import {ProIcon} from "../../../components";
import {Paragraph, withTheme} from "react-native-paper";
import {voucher} from "../../../lib/setting";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../../theme";
import {clone, errorAlert, getCurrentCompanyDetails, getVoucherTypeData, isEmpty} from "../../../lib/functions";
import requestApi, {actions, methods, SUCCESS} from "../../../lib/ServerRequest";
import {getProductData} from "../../../lib/voucher_calc";
import {updateVoucherItems} from "../../../lib/Store/actions/appApiData";
import {connect} from "react-redux";


class ConvertTo extends Component<any, any> {

    constructor(props: any) {
        super(props);

    }



    copyItemsForVoucher = (voucherid: any, label: any) => {
        const {navigation, vouchers, convertedto, updateVoucherItems, converteddisplayid, ticketstatus} = this.props;

        voucher.type = {...vouchers[voucherid], label: label, voucherid: ''}; /// get invoice voucher details
        voucher.data.copyinvoice = {
            ...voucher.data,
            voucherid: '',
            convertedto: voucher.data.voucherid,
            fromanothervoucher: true,
            voucherstatus: 'Unpaid',
            //isPaymentReceived: true, change for go to payment page
            isPaymentReceived: '0',
        };

        const {defaultcurrency}: any = getCurrentCompanyDetails();


        if (Boolean(voucher?.data?.voucheritems)) {
            updateVoucherItems({})
            let itemids: any = [];
            let voucheritemids: any = {}
            Object.keys(voucher.data.voucheritems).map((keys: any) => {
                let item = voucher.data.voucheritems[keys];
                voucheritemids[item.productid] = item;
                itemids.push(item.productid)
            });

            if (!isEmpty(voucher?.data?.products)) {
                voucher?.data?.products.map((item: any) => {
                    itemids.push(item.item)
                })
            }

            let copyitems: any = {};
            let itemidnumbers = itemids.join();
            this.checkStock(itemidnumbers).then((response: any) => {
                if (response) {

                    let error = false;
                    let errorMessage = "";
                    Object.keys(response).map((keys: any) => {
                        let item: any = response[keys];

                        let voucheritem = voucheritemids[keys];

                        if ((item.stockonhand > 0 && item.inventorytype === 'specificidentification') || item.inventorytype !== 'specificidentification') {
                            item = {
                                ...item,
                            }

                            item = {
                                ...item, ...getProductData(item, voucher.data.currency, defaultcurrency, item.productqnt, undefined, voucher.data.vouchertype === 'inward')
                            }
                            const counts: any = {};
                            itemids.forEach(function (x: any) {
                                counts[x] = (counts[x] || 0) + 1;
                            });


                            item = {
                                ...item,
                                productqnt: counts[item.itemid] || 1,
                                voucherid: '',
                                voucheritemid: '',
                                productdisplayname: item.itemname,
                                productid: item.itemid,
                                producttaxgroupid: item.itemtaxgroupid,
                                itemunique: item.itemid,
                                serial: item.serial ? [item.serial] : ''
                            }

                            if (Boolean(voucheritem)) {

                                item = {
                                    ...item,
                                    ...voucheritem,
                                    ...voucheritem.itemdetail,
                                    productqnt: item.productqnt + (+voucheritem.productqnt - 1)
                                }
                            }

                            copyitems[keys] = {...item, voucherid: '', voucheritemid: '',};

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


                    updateVoucherItems(clone(copyitems));

                }

            })
        }

        navigation.replace('AddEditVoucher', {
            screen: 'AddEditVoucher',
            copy: true
        });


    }

    checkStock = async (itemid: any) => {
        const {setAlert}: any = this.props
        return await requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {itemid: itemid, stockcheck: true, location: voucher.data.locationid, multiple: 1},
            showlog: true
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                return result.data
            }
        });
    }


    render() {


        const {navigation, theme:{colors},convertedto,outdisplayid,jobstatus, outprefix}: any = this.props;

        const isDone = (jobstatus === '11a7d9ae-48aa-4f85-b766-33403636dc07');

        return <>
            {isDone && <View>
                {!Boolean(outdisplayid) ? <TouchableOpacity onPress={() => {
                    this.copyItemsForVoucher('b152d626-b614-4736-8572-2ebd95e24173', 'Invoice')
                }}>
                    <View style={[styles.grid, styles.middle]}>
                        <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                            Copy to Invoice
                        </Paragraph>
                    </View>
                </TouchableOpacity> : <TouchableOpacity
                    style={[styles.grid, styles.right]}
                    onPress={() => {

                        voucher.type = getVoucherTypeData("vouchertypeid", "b152d626-b614-4736-8572-2ebd95e24173", outdisplayid, convertedto);

                        voucher.data = {};

                        navigation.navigate('AddEditVoucher', {
                            screen: 'AddEditVoucher',
                            outsourcing: false,
                            doNotSetBackData: true
                        });
                    }}>
                    <Paragraph style={[styles.paragraph, {
                        textAlign: 'right',
                        color: colors.secondary
                    }]}>{`Converted to ${outprefix} ${outdisplayid}`}</Paragraph>
                </TouchableOpacity>}
            </View>}
        </>;
    }
}


const mapStateToProps = (state: any) => ({
    vouchers: state.appApiData.settings.voucher,
})

const mapDispatchToProps = (dispatch: any) => ({
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ConvertTo));

