import React, {Component} from "react";
import {Platform, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, TextInput as TI, Title, withTheme} from "react-native-paper";
import {backButton, captchakey, current, isDevelopment} from "../../lib/setting";
import {Field, Form} from "react-final-form";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import InputField from "../../components/InputField";
import {composeValidators, isEmail, isValidPassword, matchPassword, required} from "../../lib/static";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";
import {log} from "../../lib/functions";

class Index extends Component<any> {

    _captchaRef: any;
    initdata: any;
    error: boolean = false;
    errorMessage: string = "";


    constructor(props: any) {
        super(props);
        this._captchaRef = React.createRef()

        this.state = {recaptcha: false, passwordVisible: true, passwordVisible2: true}

        this.initdata = isDevelopment ? {
            "email": "ankur9090_1@dhrusoft.com",
            "password": "Dhrunet1@",
            "cpassword": "Dhrunet1@",
            "mobile_number": "",
            "first_name": "",
            "last_name": "",
            "company_name": "",
            "address1": "",
            "address2": "",
            "country": "",
            "city": "",
            "state": "",
            "postcode": "",
            "g-recaptcha-response": ""
        } : {
            "email": "",
            "password": "",
            "cpassword": "",
            "mobile_number": "",
            "first_name": "",
            "last_name": "",
            "company_name": "",
            "address1": "",
            "address2": "",
            "country": "",
            "city": "",
            "state": "",
            "postcode": "",
            "g-recaptcha-response": ""
        }
        if (Boolean(current?.countrycode)) {
            this.initdata.country = current.countrycode;
        }
    }

    componentDidMount() {

    }


    handleSubmit = (value: any) => {
        this.props.navigation.navigate('SignupStep2', {initdata: value,updateInit:this.updateInit});
    }

    updateInit = (field:any) => {
        this.initdata = {...this.initdata,...field}
        this.forceUpdate()
    }

    setPasswordVisible = () => {
        const {passwordVisible}: any = this.state;
        this.setState({passwordVisible: !passwordVisible})
    }

    setPasswordVisible2 = () => {
        const {passwordVisible2}: any = this.state;
        this.setState({passwordVisible2: !passwordVisible2})
    }

    render() {

        const {navigation, theme: {colors}} = this.props;
        const {recaptcha, passwordVisible, passwordVisible2}: any = this.state;

        this.props.navigation.setOptions({
            headerTitle: `Create an account`,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Create an account'}</Title>,
            })
        }


        return (
            <Container surface={true}>

                <Form
                    onSubmit={this.handleSubmit}

                    initialValues={this.initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (


                        <View style={[styles.pageContent]}>

                            <KeyboardScroll>

                                <Card style={[styles.card]}>
                                    <Card.Content>


                                        <View>

                                            <Field name="email" validate={composeValidators(required, isEmail)}>
                                                {props => (
                                                    <>
                                                        <InputField
                                                            {...props}
                                                            label={'Email'}
                                                            value={props.input.value}
                                                            inputtype={'textbox'}
                                                            keyboardType={'email-address'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />

                                                    </>
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            <Field name="password"
                                                   validate={composeValidators(required, isValidPassword)}>
                                                {props => (
                                                    <InputField
                                                        label={'Password'}
                                                        {...props}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        secureTextEntry={passwordVisible}
                                                        right={<TI.Icon name={passwordVisible ? "eye" : "eye-off"}
                                                                        onPress={() => this.setPasswordVisible()}/>}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="cpassword"
                                                   validate={composeValidators(required, matchPassword(values.password))}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Confirm Password'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        secureTextEntry={passwordVisible2}
                                                        right={<TI.Icon name={passwordVisible2 ? "eye" : "eye-off"}
                                                                        onPress={() => this.setPasswordVisible2()}/>}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        {!recaptcha && <ReCaptchaV3
                                            ref={(ref) => this._captchaRef = ref}
                                            captchaDomain={'https://api.dhru.com'}
                                            siteKey={captchakey}
                                            onReceiveToken={(token: string) => {
                                                this.setState({recaptcha: token})
                                                values['g-recaptcha-response'] = token;
                                            }}
                                            action={""}
                                        />}

                                    </Card.Content>
                                </Card>

                            </KeyboardScroll>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        handleSubmit(values)
                                    }}>Continue</Button>
                                </View>
                            </KAccessoryView>

                        </View>

                    )}
                >

                </Form>

            </Container>
        );
    }
}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

//https://www.dhru.com/privacypolicy

