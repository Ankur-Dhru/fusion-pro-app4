import React, {Component} from "react";
import {Image, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Paragraph, Surface} from "react-native-paper";
import {getInit, isEmpty, log, retrieveData, setSpotLight, STORE_KEY_SPOTLIGHT} from "../../lib/functions";
import {setCompany, setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {captchakey, current, defaultvalues, nav, spotlight} from "../../lib/setting";
import {firebase} from "@react-native-firebase/messaging";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import {loginProcess} from "../BeforeLogin/LoginDhruCom";
import {Button} from "../../components";
import {setDialog} from "../../lib/Store/actions/components";


// @ts-ignore
import PushNotification from "react-native-push-notification";
import DeviceCountry from "react-native-device-country";
import {CommonActions} from "@react-navigation/native";


class Index extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {show: true, value: new Date(), recaptcha: false, email: "", password: ""}

        retrieveData(STORE_KEY_SPOTLIGHT).then((data: any) => {
            if (isEmpty(data)) {
                setSpotLight(spotlight)
            } else {
                spotlight.one = Boolean(data.one)
                spotlight.two = Boolean(data.two)
            }
        })
    }

    /*    navigator:any;

        setTopLevelNavigator = (navigatorRef:any) => {
            this.navigator = navigatorRef;
        }

        navigate = (routeName:any, params:any) => {
            this.navigator.dispatch(
                NavigationActions.navigate({
                    routeName,
                    params,
                })
            );
        }*/

    async componentDidMount() {

        await this.createNotificationListeners();
        //CheckConnectivity()


        /*PushNotification.configure({
            onNotification: function(notification:any) {
                const { data } = notification;
                this.navigate('Screen', { notificationData: data });
            }
        });*/

        DeviceCountry.getCountryCode().then((result: any) => {
            if (Boolean(result?.code)) {
                current.countrycode = result.code.toString().toUpperCase();
            }
        });



    }

    async createNotificationListeners() {

        const {navigation, setDialog}: any = this.props;
        /////// IN BACKGROUND
        firebase.messaging().onNotificationOpenedApp((remoteMessage: any) => {
            log(
                'onNotificationOpenedApp',
                remoteMessage,
            );
            const {title, body, data}: any = remoteMessage;

            if (current.company !== data.workspace_id) {

                setDialog({
                    title: 'Confirmation',
                    visible: true,
                    component: () => <Paragraph
                        style={[styles.paragraph,]}>{`System restart required, Are you sure want to switch ${data.workspace_id} Workspace ?`}</Paragraph>,
                    actionButton: () => <Button mode={'contained'} onPress={() => {
                        retrieveData('fusion-pro-app').then((companydetails: any) => {
                            setDialog({visible: false,})
                            current.company = data.workspace_id
                            current.user = Object.keys(companydetails?.companies).find((key: any) => companydetails?.companies[key]?.company === current?.company);
                            getInit(null, null, null, () => {
                                defaultvalues.ticketdisplayid = data.ticketdisplayid;
                                navigation.navigate("Task")
                            }, "form", true)
                        })
                    }}>Yes</Button>
                })


            } else {
                defaultvalues.ticketdisplayid = data.ticketdisplayid;

                navigation.navigate("Task")
                //log("defaultvalues", remoteMessage)
            }
        });


        firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
            log('Message handled in the background!', remoteMessage);
        });


        // Check whether an initial notification is available // FORGROUND
        firebase.messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    log(
                        'getInitialNotification Check whether an initial notification is available',
                        remoteMessage,
                    );
                    const {title, body, data}: any = remoteMessage;
                    defaultvalues.ticketdisplayid = data.ticketdisplayid
                    navigation.navigate("Task")
                    //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
                }
            });

        // If your app is closed
        const notificationOpen = await firebase.messaging().getInitialNotification();

        if (notificationOpen) {
            log('getInitialNotification:If your app is closed');
        }

        // For data only payload in foreground
        firebase.messaging().onMessage((message) => {
            //process data message
            log("Message", JSON.stringify(message));
            log("compantdata", current.company);
        });
    }

    async componentWillMount() {


        const {setPreferences}: any = this.props;

        await retrieveData('fusion-pro-app-preferences').then((data: any) => {
            data = {
                printpreviewdisable:false,
                ...data,
            }
            setPreferences(data);
        });

        const {navigation}: any = this.props;
        nav.navigation = navigation;

        await retrieveData('fusion-pro-app').then((companydetails: any) => {




            if (companydetails?.token === 'logout') {
                navigation.navigate('LoginStack', {
                    screen: 'LoginStack',
                });
            } else if (Boolean(companydetails) && Boolean(companydetails.token)) {

                const {token, license_token, currentuser, email, password}: any = companydetails;

                if (email && password) {


                    loginProcess({"g-recaptcha-response": "g-recaptcha-response-gjgjh-kjkljkl-mjbkjhkj-bbkj", email, password}, navigation, () => {})
                    // this.setState({
                    //     recaptcha: true,
                    //     email, password
                    // })
                } else {
                    navigation.navigate('LoginStack', {
                        screen: 'LoginStack',
                    });
                }
            } else {

                navigation.navigate('GettingStarted', {
                    screen: 'GettingStarted',
                });
            }
        });
    }


    render() {

        const {email, password, recaptcha} = this.state;
        const {navigation}: any = this.props;

        return (
            <Surface>
                <View style={[styles.center, styles.h_100, styles.middle]}>
                    <Image
                        style={[{width: 150, height: 150}]}
                        source={require('../../assets/dhru-logo-22.png')}
                    />
                    {
                        Boolean(recaptcha) && <ReCaptchaV3
                            captchaDomain={'https://api.dhru.com'}
                            siteKey={captchakey}
                            onReceiveToken={async (token: string) => {
                                if (Boolean(email) && Boolean(password)) {
                                    await loginProcess({"g-recaptcha-response": "g-recaptcha-response-gjgjh-kjkljkl-mjbkjhkj-bbkj", email, password}, navigation, () => {})
                                }
                            }}
                            action={""}
                        />
                    }

                </View>
            </Surface>
        );
    }
}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    setCompany: (company: any) => dispatch(setCompany(company)),
    setSettings: (settings: any) => dispatch(setSettings(settings)),
    setPreferences: (preferences: any) => dispatch(setPreferences(preferences)),
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),

});
export default connect(mapStateToProps, mapDispatchToProps)(Index);
