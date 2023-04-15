import React, {Component} from 'react';
import {Image, Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {
    CheckConnectivity,
    clone,
    findObject,
    getAppType,
    getInit,
    isEmpty,
    log,
    retrieveData,
    storeData
} from "../../lib/functions";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {Button, Container, InputBox} from "../../components";
import {setCompany, setSettings} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";
import {Field, Form} from "react-final-form";

import {Paragraph, Text, TextInput as TI, Title, withTheme} from "react-native-paper";

import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';

import {auth, backButton, captchakey, current, defaultvalues, isDevelopment, loginUrl} from "../../lib/setting";
import {setAlert} from "../../lib/Store/actions/components";
import {store} from "../../App";
import {composeValidators, isEmail, required} from "../../lib/static";
import KeyboardScroll from "../../components/KeyboardScroll";
import {login} from "../../lib/Store/actions/authentication";
import { getUniqueId, getManufacturer } from 'react-native-device-info';

export const loginProcess = async (values: any, navigation: any, callback: any) => {

    await retrieveData('fusion-pro-app').then((companydetail) => {

        try {


            let currentcompany: any = {};
            if (companydetail?.companies) {
                currentcompany = companydetail?.companies[companydetail?.currentuser];
            }

            let storecurrentname: any = '';
            let storecurrentuser: any = '';

            if (currentcompany?.email === values.email) {
                storecurrentname = companydetail.current;
                storecurrentuser = companydetail.currentuser;
            } else {
                companydetail = {companies: {}, gridview: true}
            }

            values.email = values.email.trim();
            values.deviceid = 'asdfadsf';
            values.t = getUniqueId; /// unique device id for notification


            requestApi({
                method: methods.post,
                action: actions.login,
                successalert: false,
                other: {url: loginUrl, fromlogin: true},
                body: values,
                showlog: false
            }).then(async (result) => {
                if (result.status === SUCCESS) {


                    const {
                        token,
                        license_token,
                        data: {clientid, firstname, lastname, email, workspaces, email_verified, password}
                    } = result;

                    auth.token = token;

                    store.dispatch(login(result));

                    CheckConnectivity()

                    if (!email_verified) {
                        navigation.replace('Verification', {
                            screen: 'Verification',
                            userdetail: {...result.data, email: values.email, password: values.password},
                            email: values.email,
                            password: values.password,
                        });
                    } else {

                        let companies: any = {};

                        if (!isEmpty(companydetail.companies) && !isEmpty(workspaces)) {
                            Object.keys(clone(companydetail.companies)).forEach((key: any) => {
                                let cData = companydetail.companies[key];
                                if (workspaces.some(({name}: any) => name === cData.company)) {
                                    companies[key] = cData;
                                }
                            })
                        }


                        companydetail = {
                            ...companydetail,
                            token: token,
                            firstname: firstname,
                            lastname: lastname,
                            email: values.email,
                            password: values.password,
                            companies
                        };

                        if (Boolean(workspaces.length)) {

                            let activeworkspaces: any = findObject(workspaces, 'status', 'Active');

                            let {name, status}: any = activeworkspaces[0];

                            if (companydetail.current) {
                                name = companydetail.current
                            }

                            let currentuser = name + '-' + clientid;

                            current.user = currentuser;
                            current.company = name;
                            current.clientid = clientid;

                            companydetail = {
                                ...companydetail,
                                currentuser: storecurrentuser || currentuser,
                                current: storecurrentname || name,
                                userid: clientid
                            };


                            activeworkspaces.map((workspace: any) => {
                                const {name, status}: any = workspace;
                                let currentcompany = name + '-' + clientid;

                                if (!Object.keys(companydetail.companies).includes(currentcompany)) {
                                    companydetail.companies[currentcompany] = {
                                        company: name,
                                        status: status,
                                        firstname: firstname,
                                        lastname: lastname,
                                        email: email,
                                        password: values.password,
                                        locationid: '',
                                        defaultcurrency: '',
                                        locations: '',
                                        'services': [],
                                        'clients': [],
                                        vendors: [],
                                    }
                                }
                            });
                        }


                        if (Boolean(companydetail.companies[companydetail.currentuser])) {
                            if (Boolean(companydetail.companies[companydetail.currentuser].init)) {
                                store.dispatch(setSettings(companydetail.companies[companydetail.currentuser].init));
                            }
                        }

                        storeData('fusion-pro-app', companydetail).then(async (r: any) => {

                            await getInit(companydetail)

                            if (!Boolean(companydetail.companies[companydetail.currentuser]?.init)) {
                                await getInit(companydetail)
                            }

                            store.dispatch(setCompany({companydetails: companydetail}));




                            getAppType().then((type: any) => {
                                if (type === "help") {
                                    navigation.navigate('DashboardStack', {
                                        screen: "SupportNavigator"
                                    });
                                } else {
                                    navigation.navigate('DashboardStack', {
                                        screen: 'DashboardStack',
                                        params: {
                                            disableAddWorkspace: true,
                                            index: defaultvalues.ticketdisplayid ? 2 : 0
                                        }
                                    });
                                }
                            })

                        });
                    }


                } else {
                    callback()
                    // this.setState({recaptcha: false})
                    //this.forceUpdate()
                }
            });

        } catch (e) {
            log('e', e)
        }

    })

}


class LoginView extends Component<any> {


    _captchaRef: any;
    initdata: any = isDevelopment ? {
        email: 'dhruerp@dhrusoft.com',
        password: 'asdf@9090',
    } : {
        email: '',
        password: ''
    };

    clickButton: any = false;
    params: any;
    submit: any = false;

    constructor(props: any) {
        super(props);
        this.state = {
            initialize: false,
            recaptcha: true,
            passwordVisible: true
        }
        this._captchaRef = React.createRef();


        this.initdata = {
            ...this.initdata,
            "g-recaptcha-response":"g-recaptcha-response-gjgjdsd-kjkljkl-mjbkjhkj-bbkj"
        }
    }


    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {

    }


    getLocations = async (name: any, callback: any) => {

        await requestApi({
            method: methods.get,
            action: actions.init,
            companyname: name,
            queryString: {stream: Platform.OS, device_token: auth.device_token},
        }).then((result) => {
            if (result.status === SUCCESS) {
                callback(result)
            }
        });
    }


    handleSubmit = async (values: any) => {
        Keyboard.dismiss();

        await loginProcess(values, this.props.navigation, () => {
            this.setState({recaptcha: false})
        })

    }

    setPasswordVisible = () => {
        const {passwordVisible}: any = this.state;
        this.setState({passwordVisible: !passwordVisible})
    }

    render() {

        let {navigation}: any = this.props;
        const {email, password} = this.initdata;
        const {recaptcha, passwordVisible}: any = this.state;

        const {colors} = this.props.theme;

        this.props.navigation.setOptions({
            headerTitle: ``,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{}</Title>,
            })
        }



        // @ts-ignore
        return (
            <Container surface={true}>

                <Form
                    onSubmit={this.handleSubmit}

                    initialValues={this.initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent,]}>

                            <KeyboardScroll>
                                <View style={[styles.px_6]}>

                                    <View style={[styles.px_6]}>

                                        <View style={[styles.middle, {marginBottom: 30}]}>
                                            <Image
                                                style={[{width: 80, height: 80}]}
                                                source={require('../../assets/dhru-logo-22.png')}
                                            />
                                            <Title style={[styles.mt_5]}>Login with email </Title>
                                            <Text>account.dhru.com</Text>
                                        </View>

                                        <View style={[styles.py_5]}>
                                            <View style={[styles.mb_5]}>
                                                <Field name="email" validate={composeValidators(required, isEmail)}>
                                                    {props => (
                                                        <InputBox
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Email'}
                                                            autoFocus={false}
                                                            autoCapitalize='none'
                                                            keyboardType='email-address'
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View style={[styles.mb_5]}>
                                                <Field name="password" validate={required}>
                                                    {props => (
                                                        <InputBox
                                                            value={props.input.value}
                                                            label={'Password'}
                                                            secureTextEntry={passwordVisible}
                                                            onSubmitEditing={(e: any) => {
                                                                this.handleSubmit(values)
                                                            }}
                                                            returnKeyType={'go'}
                                                            autoCapitalize='none'
                                                            right={<TI.Icon name={passwordVisible ? "eye" : "eye-off"}
                                                                            onPress={() => this.setPasswordVisible()}/>}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>


                                            {!recaptcha && <View>
                                                <Field name="g-recaptcha-response" validate={required}>
                                                    {props => (
                                                        <ReCaptchaV3
                                                            ref={(ref) => this._captchaRef = ref}
                                                            captchaDomain={'https://api.dhru.com'}
                                                            siteKey={captchakey}
                                                            onReceiveToken={(token: string) => {
                                                                this.setState({recaptcha: token})
                                                                values['g-recaptcha-response'] = token;
                                                            }}
                                                            action={""}
                                                        />
                                                    )}
                                                </Field>
                                            </View>}

                                            <View style={[styles.center, styles.p_6]}>
                                                <TouchableOpacity onPress={() => {
                                                    navigation.navigate('ResetPassword', {
                                                        screen: 'ResetPassword',
                                                    });
                                                }}><Paragraph style={[styles.paragraph, styles.title, {
                                                    fontSize: 15,
                                                    color: colors.secondary
                                                }]}>
                                                    Reset your password
                                                </Paragraph></TouchableOpacity>
                                            </View>
                                        </View>


                                        <View style={[styles.center, styles.p_6]}>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('SignupStep1', {
                                                    screen: 'SignupStep1',
                                                });
                                            }}><Paragraph style={[styles.title, {fontSize: 15}]}>
                                                Don't have an account?
                                                <Text
                                                    style={[{color: colors.secondary}]}> Signup</Text>
                                            </Paragraph></TouchableOpacity>
                                        </View>


                                    </View>
                                </View>
                            </KeyboardScroll>


                            <View style={[styles.submitbutton]}>
                                <Button disable={more.invalid} secondbutton={more.invalid}
                                        onPress={() => {

                                            handleSubmit(values)
                                        }}> Login
                                </Button>
                            </View>


                        </View>
                    )}
                >

                </Form>


            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = (dispatch: any) => ({
    setSettings: (settings: any) => dispatch(setSettings(settings)),
    setCompany: (company: any) => dispatch(setCompany(company)),
    login: (auth: any) => dispatch(login(auth)),
    setAlert: (alert: any) => dispatch(setAlert(alert)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(LoginView));


//this._captchaRef.refreshToken()
