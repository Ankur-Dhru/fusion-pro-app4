import React, {Component} from "react";
import {View, Image, Alert, Dimensions, Keyboard, Platform, KeyboardAvoidingView, Linking} from "react-native";
import {setDialog, setLoader} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container, InputBox} from "../../components";
import {Appbar, Paragraph, Surface, TextInput, Title, Text, withTheme, Card} from "react-native-paper";
import AppBar from "../../components/AppBar";
import {CheckConnectivity, log, retrieveData, storeData} from "../../lib/functions";
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
import BottomSpace from "../../components/BottomSpace";
import {CommonActions} from "@react-navigation/native";
import KeyboardScroll from "../../components/KeyboardScroll";


class Index extends Component<any> {

    _captchaRef:any;
    initdata:any;
    updateEmail:any;

    constructor(props:any) {
        super(props);
        this._captchaRef = React.createRef()
        this.initdata = {
            "new_email": "",
        }

        log('props.route.params',props.route.params)
        this.updateEmail = props.route.params.updateEmail
    }

    componentDidMount() {

    }

    handleSubmit = (values:any) => {
        Keyboard.dismiss();

        requestApi({
            method: methods.put,
            action: 'verifyemail',
            other:{url:loginUrl},
            body:values,
            showlog:false,
        }).then((result) => {
            if (result.status === SUCCESS) {
                this.updateEmail(values.new_email)
                this.props.navigation.goBack();
            }

        });
    }


    render() {

        const {navigation,theme:{colors}}:any = this.props;

        this.props.navigation.setOptions({
            headerTitle:`New Email`,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'New Email'}</Title>,
            })
        }


        return (
            <Container>

                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{ new_email:''}}>
                    {props => (

                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>

                                <Card style={[styles.card]}>

                                    <Card.Content>

                                    <Field name="new_email">
                                        {props => (
                                            <InputBox
                                                value={props.input.value}
                                                label={'Email'}
                                                autoFocus={true}
                                                autoCapitalize='none'
                                                onSubmitEditing={(e:any) => {
                                                    this.handleSubmit(props.values)
                                                }}
                                                returnKeyType={'go'}
                                                onChange={props.input.onChange}
                                            />
                                        )}
                                    </Field>

                                    </Card.Content>

                                </Card>

                            </KeyboardScroll>

                            <View style={[styles.submitbutton]}>
                                <Button      disabled={props.submitting || props.pristine}
                                             onPress={() => { this.handleSubmit(props.values) }}> Update  </Button>

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


