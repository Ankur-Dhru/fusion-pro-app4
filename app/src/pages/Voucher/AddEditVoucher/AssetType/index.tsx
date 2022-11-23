import React, {Component} from "react";
import {connect} from "react-redux";
import AssetsForm from "../../../Clients/AssetsForm";
import {log, logData} from "../../../../lib/functions";

class Index extends Component<any, any> {

    constructor(props: any) {
        super(props);
    }


    render() {
        const {assettypeList, values, navigation} = this.props;



        return (
            <>
                <AssetsForm
                    values={values}
                    assettype={assettypeList}
                    navigation={navigation}
                    assetNameAfter={true}
                    isFieldVisibleAfterSelectType={true}
                    fromJob={true}
                    key={values?.assetid}
                    hideAssetName={true}
                />
            </>
        );
    }
}


const mapStateToProps = (state: any) => ({
    assettypeList: state?.appApiData.settings.assettype
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(Index);

