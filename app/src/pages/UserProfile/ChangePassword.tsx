import React, {Component} from "react";
import {View, Image, Alert, Dimensions, Keyboard, Platform} from "react-native";
import {setDialog, setLoader} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container, InputBox} from "../../components";
import {Appbar, Paragraph, Surface, TextInput, Title, Text, Card, withTheme} from "react-native-paper";
import AppBar from "../../components/AppBar";
import {CheckConnectivity, errorAlert, log, retrieveData, storeData} from "../../lib/functions";
import {setCompany, setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {backButton, captchakey, defaultvalues, auth, loginUrl, nav} from "../../lib/setting";
import {firebase} from "@react-native-firebase/messaging";
import {store} from "../../App";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {Field, Form} from "react-final-form";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import ReCaptchaV3 from "@haskkor/react-native-recaptchav3";
import InputField from "../../components/InputField";
import Dropdown2 from "../../components/Dropdown2";
import {assignOption, countrylist} from "../../lib/static";
import KeyboardAvoidingView from "../../components/KeyboardAvoidingView"
import KeyboardScroll from "../../components/KeyboardScroll";

class Index extends Component<any> {

    initdata:any;
    constructor(props:any) {
        super(props);

        this.initdata = {
            "password": "",
            "new_password": "",
            "confirm_password": "",
        }
    }

    componentDidMount() {

    }

    handleSubmit = (values:any) => {
        Keyboard.dismiss();

        if(values.new_password !== values.confirm_password){
            errorAlert('The password confirmation does not march')
        }
        else {
            requestApi({
                method: methods.put,
                action: 'login',
                other: {url: loginUrl},
                body: values,
                showlog: true
            }).then((result) => {
                if (result.status === SUCCESS) {

                }
            });
        }
    }


    render() {

        const {navigation,theme:{colors}} = this.props;

        this.props.navigation.setOptions({
            headerTitle:`Change Password`,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Change Password'}</Title>,
            })
        }

        return (
            <Container surface>

                    <Form
                        onSubmit={this.handleSubmit}
                        initialValues={this.initdata}>
                        {propsValues => (
                            <View style={[styles.pageContent]}>
                            <KeyboardScroll>

                            <Card style={[styles.card]}>

                                <Card.Content>

                                <View>
                                    <Field name="password">
                                        {props => (
                                            <InputField
                                                label={'Old Password'}
                                                value={props.input.value}
                                                inputtype={'textbox'}
                                                secureTextEntry={true}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>


                                <View>
                                    <Field name="new_password">
                                        {props => (
                                            <InputField
                                                label={'New Password'}
                                                value={props.input.value}
                                                inputtype={'textbox'}
                                                secureTextEntry={true}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>


                                <View>
                                    <Field name="confirm_password">
                                        {props => (
                                            <InputField
                                                label={'Confirm Password'}
                                                value={props.input.value}
                                                inputtype={'textbox'}
                                                secureTextEntry={true}
                                                onSubmitEditing={(e:any) => {
                                                    this.handleSubmit(propsValues.values)
                                                }}
                                                returnKeyType={'go'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value)
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>

                                </Card.Content>
                            </Card>
                            </KeyboardScroll>

                                <View style={[styles.submitbutton]}>
                                    <Button      onPress={()=>{ this.handleSubmit(propsValues.values) }}>Save</Button>
                                </View>

                            </View>
                        )}
                    </Form>

            </Container>
        );
    }
}


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({
    setCompany: (company:any) => dispatch(setCompany(company)),
    setPreferences: (preferences:any) => dispatch(setPreferences(preferences)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

