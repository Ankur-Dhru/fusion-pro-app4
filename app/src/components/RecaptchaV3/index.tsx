import React,{Component} from "react";
import {connect} from "react-redux";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import {apiUrl, captchakey, google} from "../../lib/setting";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {Platform, View} from "react-native";
import {styles} from "../../theme";
import {ActivityIndicator, Paragraph} from "react-native-paper";
import {CheckConnectivity, log} from "../../lib/functions";
import {setDialog, setToken} from "../../lib/Store/actions/components";


class Index extends Component {
    _captchaRef:any;
    constructor(props:any){
        super(props);
        this._captchaRef = React.createRef();
    }


    receiveToken = (token:any) => {
        log('token',token);
    }



    render() {

        return (
            <ReCaptchaV3
                ref={(ref) => this._captchaRef = ref}
                captchaDomain={apiUrl("")}
                siteKey={captchakey}
                onReceiveToken={(token: string) => {
                    this.receiveToken(token)
                }}
                action={""}
            />
        );
    }

}

const mapStateToProps = (state:any) => ({
    visible : state.components.token.visible,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch:any) => ({
    setToken: (token:any) => dispatch(setToken(token)),
});
export default  connect(mapStateToProps,mapDispatchToProps)(Index);


