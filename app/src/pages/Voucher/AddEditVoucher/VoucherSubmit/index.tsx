import React, {Component} from "react";
import {voucher} from "../../../../lib/setting";
import {View} from "react-native";
import {styles} from "../../../../theme";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {withTheme} from "react-native-paper";
import {Button} from "../../../../components";
import {resetVoucherItems, setPendingInvoices, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";
import {setAlert, setDialog, setLoader, setModal} from "../../../../lib/Store/actions/components";
import {connect} from "react-redux";
import Confirm from "react-native-actionsheet";
import {groupErrorAlert, log} from "../../../../lib/functions";
import KAccessoryView from "../../../../components/KAccessoryView";
import {copilot} from "react-native-copilot";

class Index extends Component<any, any> {

    ActionSheet2: any;

    constructor(props: any) {
        super(props);
        this.ActionSheet2 = React.createRef()
    }

    _submit = () => {
        const {openModel, more, values, handleSubmit, theme: {colors}} = this.props;
        let appendData: any = {}
        voucher.data.reseterror = false;
        if (Boolean(voucher.settings.assettype)) {
            appendData = {
                ...appendData,
                assetid: values?.assetid || 0,
                assettype: values.assettype,
                assetdata: {
                    assetname: values?.assetname || values?.basefield,
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

        if (voucher.settings.groupValidation) {
            groupErrorAlert(more);
        }
        handleSubmit(values);
    }

    render() {
        const {
            openModel,
            more,
            values,
            handleSubmit,
            theme: {colors},
            companydetails,
            vouchers,
            settings,
            ...other
        } = this.props;


        return (
            <View>
                <Confirm
                    title={"Confirm"}
                    message={"Are you sure want to continue without Assignee ?"}
                    ref={o2 => this.ActionSheet2 = o2}
                    options={['Yes', 'No']}
                    cancelButtonIndex={0}
                    destructiveButtonIndex={0}
                    onPress={(index: any) => {
                        if (index === 0) {
                            this._submit();
                        }
                    }}
                />

                <KAccessoryView>
                    <View  style={[styles.submitbutton]}>
                        <Button
                            disable={more.invalid}
                            secondbutton={more.invalid}
                            onPress={() => {
                                this._submit();
                            }}>
                            {
                                Boolean(voucher.data.voucherid) ?
                                    'Update' :
                                    voucher.settings.addpayment ?
                                        'Proceed to Payment' :
                                        Boolean(voucher?.type?.vouchertype === "receipt" || voucher?.type?.vouchertype === "payment") ? voucher?.settings?.buttonLabel : `Generate ${voucher.type.label}`
                            }
                        </Button>
                    </View>

                </KAccessoryView>


            </View>
        );
    }
}

const mapStateToProps = (state: any) => ({
    companydetails: state.appApiData.companydetails,
    vouchers: state.appApiData.settings.voucher,
    settings: state.appApiData.settings,
    preferences: state.appApiData.preferences,
    voucheritems: state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch: any) => ({
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
    setPendingInvoices: (invoices: any) => dispatch(setPendingInvoices(invoices)),
    setAlert: (alert: any) => dispatch(setAlert(alert)),
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setLoader: (loader: any) => dispatch(setLoader(loader)),
    resetVoucherItems: () => dispatch(resetVoucherItems()),
    setModal: (dialog: any) => dispatch(setModal(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(copilot({verticalOffset: 50})(Index)));
