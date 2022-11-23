import React, {Component} from "react";
import {Keyboard, Platform, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, TextInput as TI, Title, withTheme} from "react-native-paper";
import {setCompany, setPreferences} from "../../lib/Store/actions/appApiData";
import {backButton, captchakey, loginUrl} from "../../lib/setting";
import {Field, Form} from "react-final-form";
import requestApi, {methods, SUCCESS} from "../../lib/ServerRequest";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import InputField from "../../components/InputField";
import {countrylist, required} from "../../lib/static";
import FormLoader from "../../components/ContentLoader/FormLoader";
import KeyboardScroll from "../../components/KeyboardScroll";
import {getCountryDialCode} from "../../lib/functions";


class Index extends Component<any> {

    _captchaRef: any;
    initdata: any;

    constructor(props: any) {
        super(props);
        this._captchaRef = React.createRef()
        this.initdata = {
            "email": "",
            "password": "",
            "mobile_number": "",
            "first_name": "",
            "last_name": "",
            "company_name": "",
            "address1": "address1",
            "address2": "address2",
            "country": "IN",
            "city": "city",
            "state": "state",
            "postcode": "postcode",
            "g-recaptcha-response": ""
        }
        this.state = {isLoading: false}
    }

    componentDidMount() {
        requestApi({
            method: methods.get,
            action: 'profile',
            other: {url: loginUrl},
            alert: false,
            loadertype: 'form',
            showlog:true
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.initdata = {...this.initdata, ...result.data}
                this.setState({isLoading: true})
            }
        });
    }

    handleSubmit = (values: any) => {
        Keyboard.dismiss();

        requestApi({
            method: methods.put,
            action: 'profile',
            other: {url: loginUrl},
            body: values,
            showlog:true
        }).then((result) => {
            if (result.status === SUCCESS) {

            }
        });
    }


    render() {

        const {navigation, theme: {colors}} = this.props;
        const {isLoading}: any = this.state

        this.props.navigation.setOptions({
            headerTitle: `Edit Profile`,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Edit Profile'}</Title>,
            })
        }

        if (!isLoading) {
            return <FormLoader/>
        }

        if (Boolean(this?.initdata?.country) && !Boolean(this?.initdata?.code)) {
            let dialcode: any = getCountryDialCode(this.initdata.country);
            this.initdata.code = dialcode?.dial_code;
        }

        return (
            <Container>

                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={this.initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>

                                <Card style={[styles.card]}>

                                    <Card.Content>

                                        <View>
                                            <Field name="first_name" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'First Name'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="last_name" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Last Name'}
                                                        value={props.input.value}
                                                        autoCapitalize={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="company_name" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Company Name'}
                                                        value={props.input.value}
                                                        autoCapitalize={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="country">
                                                {props => (

                                                    <InputField
                                                        label={'Country'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={`Select Country`}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={countrylist}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="mobile_number">
                                                {props => (
                                                    <InputField
                                                        label={'Mobile'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        keyboardType={'phone-pad'}
                                                        left={<TI.Affix text={values.code}/>}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            <Field name="address1" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Address 1'}
                                                        value={props.input.value}
                                                        autoCapitalize={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            <Field name="address2">
                                                {props => (
                                                    <InputField
                                                        label={'Address 2'}
                                                        value={props.input.value}
                                                        autoCapitalize={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            <Field name="city" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'City'}
                                                        value={props.input.value}
                                                        autoCapitalize={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            <Field name="state" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'State'}
                                                        value={props.input.value}
                                                        autoCapitalize={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            <Field name="postcode" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Postcode'}
                                                        value={props.input.value}
                                                        autoCapitalize={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <ReCaptchaV3
                                            ref={(ref) => this._captchaRef = ref}
                                            captchaDomain={'https://api.dhru.com'}
                                            siteKey={captchakey}
                                            onReceiveToken={(token: string) => {
                                                values['g-recaptcha-response'] = token;
                                            }}
                                            action={""}
                                        />
                                    </Card.Content>

                                </Card>

                            </KeyboardScroll>

                            <View style={[styles.submitbutton]}>
                                <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                    handleSubmit(values)
                                }}>Save</Button>
                            </View>

                        </View>
                    )}
                >

                </Form>

            </Container>
        );
    }
}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    setCompany: (company: any) => dispatch(setCompany(company)),
    setPreferences: (preferences: any) => dispatch(setPreferences(preferences)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

