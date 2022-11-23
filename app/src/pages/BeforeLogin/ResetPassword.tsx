import React, {Component} from 'react';
import {Image, Keyboard, Platform, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {Button, Container, InputBox} from "../../components";
import {setCompany, setSettings} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";
import {Field, Form} from "react-final-form";

import {Paragraph, Text, Title, withTheme} from "react-native-paper";

import ReCaptchaV3 from '@haskkor/react-native-recaptchav3';

import {auth, backButton, captchakey, isDevelopment, loginUrl} from "../../lib/setting";
import {setAlert} from "../../lib/Store/actions/components";
import {composeValidators, isEmail, required} from "../../lib/static";
import KeyboardScroll from "../../components/KeyboardScroll";

class LoginView extends Component<any> {


    _captchaRef: any;
    initdata: any = isDevelopment ? {email: 'ankur90905@dhrusoft.com', password: 'Dhrunet1!'} : {
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
            recaptcha: false,
            passwordVisible: true,
            message: "",
        }
        this._captchaRef = React.createRef();
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

        requestApi({
            method: methods.post,
            action: actions.forgotpassword,
            successalert: false,
            other: {url: loginUrl, fromlogin: true},
            body: values,
            showlog: true
        }).then((result) => {
            if (result.status === SUCCESS && Boolean(result.message)) {
                this.setState({message: result.message})
            }
        });
    }

    setPasswordVisible = () => {
        const {passwordVisible}: any = this.state;
        this.setState({passwordVisible: !passwordVisible})
    }

    render() {

        let {navigation}: any = this.props;
        const {email, password} = this.initdata;
        const {recaptcha, passwordVisible, message}: any = this.state;

        const {colors} = this.props.theme;

        this.props.navigation.setOptions({
            headerTitle: ``,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
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
                                            <Title style={[styles.mt_5]}>Reset your password</Title>
                                            <Text>account.dhru.com</Text>
                                        </View>

                                        {
                                            Boolean(message) ? <>
                                                <Text>{message}</Text>
                                            </> : <>
                                                <View style={[styles.py_5]}>
                                                    <View style={[styles.mb_5]}>
                                                        <Field name="email"
                                                               validate={composeValidators(required, isEmail)}>
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
                                                </View>
                                            </>
                                        }
                                        {/*<View style={[styles.center, styles.p_6]}>
                                            <TouchableOpacity onPress={() => {
                                                navigation.goBack()
                                            }}><Paragraph style={[styles.title, {fontSize: 15}]}>
                                                <Text
                                                    style={[styles.bold, {color: colors.secondary}]}>Back To Login</Text>
                                            </Paragraph></TouchableOpacity>
                                        </View>*/}

                                    </View>
                                </View>
                            </KeyboardScroll>
                            {
                                !Boolean(message) && <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid}
                                            onPress={() => {
                                                handleSubmit(values)
                                            }}> Send
                                    </Button>
                                </View>
                            }
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
    setAlert: (alert: any) => dispatch(setAlert(alert)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(LoginView));
