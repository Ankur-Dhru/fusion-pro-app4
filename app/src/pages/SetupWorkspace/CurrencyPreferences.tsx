import React, {Component} from "react";
import {View, Image, Alert, Dimensions, Keyboard, Platform, KeyboardAvoidingView, Linking} from "react-native";
import {setDialog, setLoader} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container, InputBox} from "../../components";
import {Appbar, Paragraph, Surface, TextInput, Title, Text, withTheme, Card} from "react-native-paper";
import AppBar from "../../components/AppBar";
import {CheckConnectivity, errorAlert, getStateList, log, retrieveData, storeData} from "../../lib/functions";
import {setCompany, setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {backButton, captchakey, defaultvalues, auth, loginUrl, nav, current} from "../../lib/setting";
import {firebase} from "@react-native-firebase/messaging";
import {store} from "../../App";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {Field, Form} from "react-final-form";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import InputField from "../../components/InputField";
import Dropdown2 from "../../components/Dropdown2";
import {assignOption, countrylist, months, required} from "../../lib/static";
import BottomSpace from "../../components/BottomSpace";
import {CommonActions} from "@react-navigation/native";
import KeyboardScroll from "../../components/KeyboardScroll";


class Index extends Component<any> {

    initdata:any;
    error:any;
    errorMessage:any;
    decimalcurrency:any;
    currency:any;

    constructor(props:any) {
        super(props);


        this.initdata = {
            "currency": "",
        }
    }

    componentWillMount() {
        retrieveData('fusion-pro-app').then((companydetail) => {
            this.decimalcurrency = companydetail.companies[companydetail.currentuser].init.staticdata.decimalcurrency;
            this.currency = companydetail.companies[companydetail.currentuser].init.staticdata.currency;
            this.forceUpdate()
        })
    }



    handleSubmit = (values:any) => {
        Keyboard.dismiss();



        requestApi({
            method: methods.put,
            action: actions.settings,
            body:{settingid:'currency',settingdata:[{"key":values.currency,"value":{rate: '1',__key: values.currency,decimalplace: this.decimalcurrency[values.currency]}}]},
            showlog:false
        }).then((result) => {
            if (result.status === SUCCESS) {

                retrieveData('fusion-pro-app').then((companydetails:any)=> {



                    companydetails.current = current.company;
                    companydetails.currentuser = current.user;


                    companydetails.companies[current.user] = {
                        firstname: companydetails.firstname,
                        lastname: companydetails.lastname,
                        email: companydetails.email,
                        password: companydetails.password,
                        adminid: companydetails.adminid,
                        username:companydetails.firstname + ' ' + companydetails.lastname,
                        locationid: '',
                        company:current.company,
                        defaultcurrency: '',
                        locations: '',
                        'services': [],
                        'clients': [],
                        vendors: [],
                    }

                    setCompany({companydetails: companydetails});

                    storeData('fusion-pro-app', companydetails).then(async (r: any) => {
                        CheckConnectivity()
                        nav.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [
                                    { name: 'DashboardStack' },
                                ],
                            })
                        );
                    });
                })
            }
        });
    }


    render() {

        const {navigation,theme:{colors}} = this.props;

        if(!Boolean(this.currency)){
            return <View></View>
        }

        const currency_options = Object.keys(this.currency).map((c: any) => assignOption(this.currency[c], c))

        this.props.navigation.setOptions({
            headerTitle:`Currency Preferences`,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Currency Preferences'}</Title>,
            })
        }

        return (
            <Container>

                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={this.initdata}
                    render={({ handleSubmit, submitting, values, ...more}:any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>

                                <Card style={[styles.card]}>

                                    <Card.Content>

                                    <Paragraph style={[styles.paragraph]}>Select your base currency and you can start revolutionising
                                        your Business with DHRU</Paragraph>



                                    <View>
                                        <Field name="currency" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Currency'}
                                                    selectedValue={props.input.value}
                                                    selectLabel={'Select Currency'}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={currency_options}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>

                                        <Paragraph style={[styles.paragraph,styles.red]}>You can't change your base currency after finish.</Paragraph>
                                    </View>

                                    </Card.Content>

                                </Card>

                            </KeyboardScroll>


                            <View style={[styles.submitbutton]}>
                                <Button   disable={more.invalid} secondbutton={more.invalid}     onPress={()=>{ handleSubmit(values) }}>Finish</Button>
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

const mapDispatchToProps = (dispatch:any) => ({
    setCompany: (company:any) => dispatch(setCompany(company)),
    setPreferences: (preferences:any) => dispatch(setPreferences(preferences)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

