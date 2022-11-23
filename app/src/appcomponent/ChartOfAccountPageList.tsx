import React, {Component} from "react";
import InputField from "../components/InputField";
import {connect} from "react-redux";

class ChartOfAccountPageList extends Component<any, any> {

    optionChartOfAccount: any = [];

    render() {
        this.optionChartOfAccount = [];
        const {accounttypes, chartofaccount, type, subtype, subtypelist, ...props} = this.props;

        let selectedType = accounttypes;
        if (type) {
            selectedType = {};
            selectedType[type] = accounttypes[type];
        }


        Object.keys(selectedType)
            .forEach((chartOfAccountType, index) => {


                let selectedSubType = selectedType[chartOfAccountType];
                if (subtype) {
                    selectedSubType = {}
                    selectedSubType[subtype] = selectedType[chartOfAccountType][subtype];
                }

                selectedSubType && Object.keys(selectedSubType)
                    .filter((chartOfSubAccountType) => {
                        if (subtypelist) {
                            return subtypelist.filter((a: any) => a === chartOfSubAccountType).length > 0;
                        }
                        return true;
                    })
                    .forEach((chartOfSubAccountType) => {


                        chartofaccount
                            .filter(({
                                         accountsubtype,
                                         accountstatus
                                     }: any) => Boolean(parseInt(accountstatus) === 1) && accountsubtype === chartOfSubAccountType)
                            .forEach(({accountid, accountname}: any) => {
                                //CHANGE_CODE_DATE: [FIX_SELECT_ISSUE - 01/05/2021] - set parseint for set defautl
                                // select after quickadd


                                this.optionChartOfAccount = [
                                    ...this.optionChartOfAccount,
                                    {
                                        label: accountname,
                                        value: parseInt(accountid),
                                    },
                                ]
                            })
                    })
            })

        return (
            <InputField
                {...props}
                list={this.optionChartOfAccount}
            />
        );
    }
}

const mapStateToProps = (state: any) => ({
    accounttypes: state.appApiData.settings.staticdata.accounttypes,
    chartofaccount: state.appApiData.settings.chartofaccount
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ChartOfAccountPageList);
