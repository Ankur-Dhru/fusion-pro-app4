import React, {Component, memo} from "react";
import {View} from "react-native";
import {Button, Container} from "../../../components";
import {styles} from "../../../theme";
import {voucher} from "../../../lib/setting";
import {withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../../lib/navigation_options";
import AssetsForm from "../../Clients/AssetsForm";
import {Form} from "react-final-form";
import {getRoleModuleList, log} from "../../../lib/functions";
import {connect} from "react-redux";
import moment from "moment";
import requestApi, {methods, SUCCESS} from "../../../lib/ServerRequest";
import KeyboardScroll from "../../../components/KeyboardScroll";
import {PERMISSION_NAME} from "../../../lib/role_data";

class EditAssets extends Component<any, any> {

    constructor(props: any) {
        super(props);

        let role = {};
        let roleModuleList: any = getRoleModuleList();

        if (roleModuleList[PERMISSION_NAME.ASSET]) {
            role = roleModuleList[PERMISSION_NAME.ASSET];
        }

        this.state = {
            role
        }
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

        try {

            const {outsourcing, ...postdata} = voucher.data;

            requestApi({
                method: Boolean(voucher.data.voucherid) ? methods.put : methods.post,
                action: voucher.settings.api,
                body: postdata,
                showlog: true
            }).then((result) => {
                if (result.status === SUCCESS) {
                    voucher.data.voucherid = result.data.voucherid;
                }
            });
        } catch (e) {
            log('e', e)
        }
    }

    render() {

        const {navigation, route, assettypeList, theme: {colors}} = this.props;
        const {role} = this.state;
        const {editData, setEditAssetData, editmode} = route.params;

        setNavigationOptions(navigation, "Assets", colors);

        return (
            <Container>
                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{
                        ...editData
                    }}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>

                                <View>

                                    <AssetsForm
                                        assetNameAfter={true}
                                        isFieldVisibleAfterSelectType={true}
                                        navigation={navigation}
                                        assettype={assettypeList}
                                        values={values}
                                        fromJob={true}
                                        doNotUpdateAssetType={!Boolean(role?.update)}
                                        fromEditJob={true}
                                        key={values?.assetid}
                                        hideAssetName={true}
                                    />
                                </View>
                            </KeyboardScroll>


                            {(Boolean(editmode)) && <View style={[styles.submitbutton]}>
                                <Button
                                    disable={more.invalid}
                                    secondbutton={more.invalid}
                                    onPress={() => {

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
                                            }
                                        }

                                        //setEditAssetData(appendData)

                                        voucher.data = {...voucher.data, ...appendData}
                                        handleSubmit(values);

                                    }}> {Boolean(voucher.data.voucherid) ? 'Update' : voucher.settings.addpayment ? 'Proceed to Payment' : `Generate ${voucher.type.label}`} </Button>
                            </View>}
                        </View>


                    )}/>

            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({
    assettypeList: state?.appApiData.settings.assettype
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(memo(withTheme(EditAssets)));
