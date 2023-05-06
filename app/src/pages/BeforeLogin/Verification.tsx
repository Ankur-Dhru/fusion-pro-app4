import React, {Component} from "react";
import {View, Image, Alert, Dimensions, Keyboard, Platform, KeyboardAvoidingView, Linking} from "react-native";
import {setDialog, setLoader} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container, InputBox} from "../../components";
import {Appbar, Paragraph, Surface, TextInput, Title, Text, withTheme, Card} from "react-native-paper";
import AppBar from "../../components/AppBar";
import {CheckConnectivity, log, loginUser, retrieveData, storeData} from "../../lib/functions";
import {setCompany, setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {backButton, captchakey, defaultvalues, auth, loginUrl, nav, current} from "../../lib/setting";
import {store} from "../../App";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {Field, Form} from "react-final-form";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import InputField from "../../components/InputField";
import {CommonActions} from "@react-navigation/native";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";


class Index extends Component<any> {

    _captchaRef:any;
    initdata:any;
    constructor(props:any) {
        super(props);
        this._captchaRef = React.createRef();
        const {route}:any = this.props;

        this.initdata = {
            "code": "",
            ...route.params.userdetail
        }
    }

    componentDidMount() {

    }

    handleSubmit = (values:any) => {
        Keyboard.dismiss();

        requestApi({
            method: methods.post,
            action: 'verifyemail',
            other:{url:loginUrl},
            body:values,
            showlog:true
        }).then((result) => {
            if (result.status === SUCCESS) {
                current.user = '';
                current.company = '';
                current.clientid = this.initdata.clientid;
                let companydetail = {
                    token: auth.token,
                    firstname: this.initdata.firstname,
                    lastname: this.initdata.lastname,
                    username: this.initdata.firstname +' '+this.initdata.lastname,
                    email: this.initdata.email,
                    password: this.initdata.password,
                    companies:{},
                    gridview: true,
                    adminid: this.initdata.clientid,
                };
                store.dispatch(setCompany({companydetails: companydetail}));
                storeData('fusion-pro-app', companydetail).then((r: any) => {

                    nav.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'DashboardStack' },
                            ],
                        })
                    );
                })
            }
        });
    }

    resendCode = () => {
        Keyboard.dismiss();

        requestApi({
            method: methods.get,
            action: 'verifyemail',
            other:{url:loginUrl},
        }).then((result) => {
            if (result.status === SUCCESS) {

            }
        });
    }


    updateEmail = (email:any) => {
        this.initdata.email = email;
        this.forceUpdate()
    }


    render() {

        const {navigation,theme:{colors}} = this.props;


        this.props.navigation.setOptions({
            headerTitle:`Verify Your Email`,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Verify Your Email'}</Title>,
            })
        }



        return (
            <Container>

                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{ code:''}}>
                    {props => (

                        <View style={[styles.pageContent]}>

                            <KeyboardScroll>

                                <Card style={[styles.card]}>
                                    <Card.Content>

                                    <View>
                                        <Paragraph style={[styles.paragraph]}>Your Registered Email </Paragraph>
                                        <View style={[styles.grid,styles.middle]}>
                                            <Paragraph>
                                                {this.initdata.email} -
                                            </Paragraph>
                                            <TouchableOpacity onPress={()=>{
                                                this.props.navigation.navigate('ChangeEmail', {
                                                    screen: 'ChangeEmail',
                                                    updateEmail:this.updateEmail
                                                });
                                            }}>
                                                <Text style={[{color:colors.secondary}]}> Change Email </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                    <Field name="code">
                                        {props => (
                                            <InputField
                                                value={props.input.value}
                                                label={'Code'}
                                                autoFocus={true}
                                                keyboardType='numeric'
                                                inputtype={'textbox'}
                                                autoCapitalize='none'
                                                onSubmitEditing={(e:any) => {
                                                    this.handleSubmit(props.values)
                                                }}
                                                returnKeyType={'go'}
                                                onChange={props.input.onChange}
                                            />
                                        )}
                                    </Field>


                                    <View style={[styles.py_5,styles.middle,styles.mt_5]}>
                                        <TouchableOpacity onPress={()=>{
                                            this.resendCode()
                                        }}>
                                            <Text style={[{color:colors.secondary}]}> Resend Code</Text>
                                        </TouchableOpacity>
                                    </View>



                                    </Card.Content>
                                </Card>

                            </KeyboardScroll>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button      disabled={props.submitting || props.pristine}
                                                 onPress={() => { this.handleSubmit(props.values) }}> Verify  </Button>

                                </View>
                            </KAccessoryView>


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

});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));



