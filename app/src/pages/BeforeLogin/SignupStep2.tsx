import React, {Component} from "react";
import {Keyboard, Linking, Platform, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Paragraph, Text, TextInput as TI, Title, withTheme} from "react-native-paper";
import {clone, getCountryDialCode, log} from "../../lib/functions";
import {auth, backButton, loginUrl} from "../../lib/setting";
import {Field, Form} from "react-final-form";
import requestApi, {ERROR, methods, SUCCESS} from "../../lib/ServerRequest";
import InputField from "../../components/InputField";
import {composeValidators, countrylist, mustBeNumber, required} from "../../lib/static";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";

class Index extends Component<any> {


    initdata: any;
    error: boolean = false;
    errorMessage: string = "";

    constructor(props: any) {
        super(props);

        const {route:{params}}: any = this.props;

        this.initdata = clone(params.initdata)

        if (this.initdata.country) {
            let dialcode: any = getCountryDialCode(this.initdata.country);
            this.initdata.code = dialcode?.dial_code;
        }
    }

    componentWillMount() {

    }

    componentDidMount() {

    }


    handleSubmit = (values: any) => {

        Keyboard.dismiss();
        requestApi({
            method: methods.post,
            action: 'register',
            other: {url: loginUrl},
            body: values,
            showlog: true
        }).then((response) => {

            console.log('result',response)

            if (response.status === SUCCESS && response.token) {
                auth.token = response.token;
                this.props.navigation.replace('Verification', {
                    screen: 'Verification',
                    userdetail: {...response.data,password:this.initdata.password},
                });
            }
        });
    }


    render() {

        const {navigation,route:{params}, theme: {colors}} = this.props;

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
                                            <Field name="first_name" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'First Name'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            params.updateInit({first_name:value});
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
                                                            params.updateInit({last_name:value});
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="company_name">
                                                {props => (
                                                    <InputField
                                                        label={'Company Name'}
                                                        value={props.input.value}
                                                        autoCapitalize={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            params.updateInit({company_name:value});
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="country" validate={required}>
                                                {props => (

                                                    <InputField
                                                        {...props}
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
                                                            let dialcode: any = getCountryDialCode(value);
                                                            more.form.change("code", dialcode?.dial_code)
                                                            params.updateInit({country:value});
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            <Field name="mobile_number"
                                                   validate={composeValidators(required, mustBeNumber)}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Mobile'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        left={<TI.Affix text={values.code}/>}
                                                        keyboardType={'phone-pad'}
                                                        onChange={(value: any) => {
                                                            params.updateInit({mobile_number:value});
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                    </Card.Content>

                                </Card>

                                <View>

                                    <View>
                                        <Paragraph style={[styles.paragraph, styles.text_xs]}>By clicking Create
                                            account, you agree to Dhru's
                                            <Paragraph
                                                onPress={() => Linking.openURL('https://www.dhru.com/toc').catch((err) => console.error('An error occurred', err))}>
                                                <Text style={[styles.text_xs, {color: colors.secondary}]}> Terms of
                                                    Use </Text>
                                            </Paragraph>
                                            <Text> and </Text>
                                            <Paragraph
                                                onPress={() => Linking.openURL('https://www.dhru.com/privacypolicy').catch((err) => console.error('An error occurred', err))}>
                                                <Text style={[styles.text_xs, {color: colors.secondary}]}>Privacy
                                                    Policy </Text>
                                            </Paragraph>.
                                        </Paragraph>
                                    </View>
                                </View>

                            </KeyboardScroll>


                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        handleSubmit(values)
                                    }}>Register</Button>
                                </View>
                            </KAccessoryView>



                        </View>

                    )}/>

            </Container>
        );
    }
}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

//https://www.dhru.com/privacypolicy

