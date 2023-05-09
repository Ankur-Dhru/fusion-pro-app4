import React, {Component, useEffect, useState} from "react";
import {View, Image, Alert, Dimensions, Keyboard, Platform, KeyboardAvoidingView, Linking} from "react-native";
import {setDialog, setLoader} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container, InputBox} from "../../components";
import {Appbar, Paragraph, Surface, TextInput, Title, Text, withTheme, Card, RadioButton} from "react-native-paper";
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
import {checkLogin, loginProcess} from "./LoginDhruCom";
import {CodeField, Cursor, isLastFilledCell, MaskSymbol, useBlurOnFulfill, useClearByFocusCell} from "react-native-confirmation-code-field";
import ResendCounting from "../../components/ResendCounting";


const Index = (props: any) => {

    const {route}:any = props;

    const initdata = {
        "otp": "",
        "g-recaptcha-response": 'g-recaptcha-response-gjgjh-kjkljkl-mjbkjhkj-bbkj',
        ...route?.params?.userdetail
    }

    const [channel, setChannel] = React.useState('email');

    const {email,whatsapp,temp_token} = initdata;


    const handleSubmit = (values:any) => {

        Keyboard.dismiss();

        requestApi({
            method: methods.post,
            action: 'login',
            other:{url:loginUrl},
            body:{
                'deviceid':"asdfadsf",
                'email':initdata.email,
                'g-recaptcha-response':"g-recaptcha-response-gjgjh-kjkljkl-mjbkjhkj-bbkj",
                'otp':values.otp,
                'password':initdata.password
            },
            showlog:true
        }).then((result) => {

            if (result.status === SUCCESS) {


                  retrieveData('fusion-pro-app').then((companydetail) => {

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

                    checkLogin(result, props.navigation, values, companydetail, storecurrentuser, storecurrentname)
                })




                /*current.user = '';
                current.company = '';
                current.clientid = initdata.clientid;
                let companydetail = {
                    token: auth.token,
                    firstname: initdata.firstname,
                    lastname: initdata.lastname,
                    username: initdata.firstname +' '+initdata.lastname,
                    email: initdata.email,
                    password: initdata.password,
                    companies:{},
                    gridview: true,
                    adminid: initdata.clientid,
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
                })*/


            }
        });
    }

    const resendCode = () => {
        Keyboard.dismiss();

        requestApi({
            method: methods.get,
            action: 'login',
            queryString:{'channel':channel},
            other:{url:loginUrl,token:temp_token},
        }).then((result) => {
            if (result.status === SUCCESS) {

            }
        });
    }


    const {navigation,theme:{colors}} = props;


    props.navigation.setOptions({
        headerShown:true,
        headerTitle:`Verify OTP`,
        headerLargeTitleStyle:{color:colors.inputbox},
        headerTitleStyle:{color:colors.inputbox},
        headerLeft:()=><></>
    });

    if(Platform.OS === "android") {
        navigation.setOptions({
            headerCenter: () => <Title style={[styles.headertitle]}>{'Verify OTP'}</Title>,
        })
    }

    const [value, setValue]:any = useState("")
    const ref = useBlurOnFulfill({value, cellCount: 6});
    const [props1, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });


    useEffect(() => {
        setTimeout(async () => {
            if (value.length === 6) {
                console.log('value',value)
            }
        }, 200)
    }, [value]);


    const renderCell = ({index, symbol, isFocused}:any) => {
        let textChild = null;

        if (symbol) {
            textChild = (
                <MaskSymbol
                    maskSymbol="*️"
                    isLastFilledCell={isLastFilledCell({index, value})}>
                    {symbol}
                </MaskSymbol>
            );
        } else if (isFocused) {
            textChild = <Cursor />;
        }

        return (
            <Text
                key={index}
                style={[styles.cellBox, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {textChild}
            </Text>
        );
    };



    return (
        <Container  surface={true}>

            <Form
                onSubmit={handleSubmit}
                initialValues={initdata}>
                {props => (

                    <View style={[styles.pageContent]}>

                        <KeyboardScroll>

                            <Card style={[styles.card]}>
                                <Card.Content>

                                    <View>
                                        <Paragraph style={[styles.paragraph,styles.muted]}>OTP Required,  OTP send your registered email.</Paragraph>
                                        <View>

                                            <RadioButton.Group onValueChange={value => setChannel(value)} value={channel}>
                                                <RadioButton.Item label={email} status={'checked'} position={'trailing'} mode={'android'} value="email" />
                                                {Boolean(whatsapp) &&  <RadioButton.Item label={whatsapp} position={'trailing'} mode={'android'}  value="whatsapp" />}
                                            </RadioButton.Group>

                                        </View>
                                    </View>




                                    <View style={[styles.flex,styles.middle]}>
                                        <CodeField
                                            ref={ref}
                                            {...props1}
                                            value={value}
                                            onChangeText={setValue}
                                            cellCount={6}
                                            autoFocus={true}
                                            rootStyle={styles.codeFieldRoot}
                                            keyboardType="number-pad"
                                            textContentType="oneTimeCode"
                                            renderCell={renderCell}
                                        />
                                    </View>

                                    <View>
                                        <ResendCounting onResendOTP={resendCode}/>
                                    </View>







                                </Card.Content>
                            </Card>

                        </KeyboardScroll>

                        <KAccessoryView>
                            <View style={[styles.submitbutton]}>
                                <Button
                                     onPress={() => {
                                         if(Boolean(value.length == 6)) {
                                             props.values.otp = value
                                             handleSubmit(props.values)
                                         }
                                     }}> Verify  </Button>

                            </View>
                        </KAccessoryView>


                    </View>

                )}
            </Form>

        </Container>
    );
}


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));



