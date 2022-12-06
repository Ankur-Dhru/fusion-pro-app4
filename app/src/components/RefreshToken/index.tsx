import React,{Component} from "react";
import {connect} from "react-redux";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import {apiUrl, auth, captchakey, defaultvalues,  loginUrl, nav} from "../../lib/setting";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {Platform, View} from "react-native";
import {styles} from "../../theme";
import {ActivityIndicator, Paragraph} from "react-native-paper";
import {CheckConnectivity, errorAlert, log, storeData} from "../../lib/functions";
import {setDialog, setToken} from "../../lib/Store/actions/components";
import {setCompany} from "../../lib/Store/actions/appApiData";


class Index extends Component {
    _captchaRef:any;
    constructor(props:any){
        super(props);
        this._captchaRef = React.createRef();
    }


    handleSubmit = (token:any) => {

        const {companydetails,setToken,setCompany,token:{tempParams}}:any = this.props

        let user = companydetails && companydetails?.companies && companydetails?.companies[companydetails.currentuser];

      if(user) {
          if (user?.email && user?.password) {
              requestApi({
                  method: methods.post,
                  action: actions.login,
                  successalert:false,
                  other:{url:loginUrl},
                  body: {
                      email: user.email,
                      password: user.password,
                      "g-recaptcha-response": token,
                      stream: Platform.OS
                  },
              }).then((result) => {
                  if (result.status === SUCCESS) {
                      const {token} = result;

                      if(Boolean(token)) {
                          auth.token = token;

                          companydetails.token = token;
                          storeData('fusion-pro-app', companydetails).then((r: any) => {
                              setCompany({companydetails: companydetails});
                          });
                          CheckConnectivity()
                      }
                  }
                  setToken({visible: false})
              });
          } else {
              setToken({visible: false})
          }
      }
      else{
          nav.navigation.navigate('LoginStack',{
              screen: 'LoginStack',
          });
          setToken({visible: false});
      }
    }



    render() {

        const {token:{visible}}:any = this.props;

        if(!visible){
            return (<View></View>)
        }

        return (
            <View  style={styles.loader}>
                <View  style={[styles.screenCenter,styles.h_100,styles.transparent]}>
                    <View style={{borderRadius:50}}>
                        <ReCaptchaV3
                            ref={(ref) => this._captchaRef = ref}
                            captchaDomain={'https://api.dhru.com'}
                            siteKey={captchakey}
                            onReceiveToken={(token: string) => {
                                this.handleSubmit(token)
                            }}
                            action={""}
                        />
                        <ActivityIndicator style={styles.m_1} size='large' animating={true}   />
                    </View>
                </View>
            </View>
        );
    }

}

const mapStateToProps = (state:any) => ({
    token : state.components.token,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch:any) => ({
    setToken: (token:any) => dispatch(setToken(token)),
    setCompany: (company:any) => dispatch(setCompany(company)),
});
export default  connect(mapStateToProps,mapDispatchToProps)(Index);


