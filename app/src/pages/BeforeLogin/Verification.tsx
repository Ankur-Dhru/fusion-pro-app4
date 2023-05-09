import React, {Component, useEffect, useState} from "react";
import {Keyboard, Platform, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Paragraph, Text, Title, withTheme} from "react-native-paper";
import {storeData} from "../../lib/functions";
import {setCompany} from "../../lib/Store/actions/appApiData";
import {auth, backButton, current, loginUrl, nav} from "../../lib/setting";
import {store} from "../../App";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Field, Form} from "react-final-form";
import requestApi, {methods, SUCCESS} from "../../lib/ServerRequest";
import InputField from "../../components/InputField";
import {CommonActions} from "@react-navigation/native";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";
import {
    CodeField, Cursor,
    isLastFilledCell,
    MaskSymbol,
    useBlurOnFulfill,
    useClearByFocusCell
} from "react-native-confirmation-code-field";
import ResendCounting from "../../components/ResendCounting";
import {setAlert} from "../../lib/Store/actions/components";


const Index = (props: any) => {

    const _captchaRef = React.createRef();
    const {route}: any = props;

    const initdata = {
        "code": "",
        ...route.params.userdetail
    }

    const [email,setEmail] = useState(initdata.email)

    useEffect(()=>{

        requestApi({
            method: methods.get,
            action: 'verifyemail',
            other: {url: loginUrl},

            showlog: true
        }).then((result) => {
            if (result.status === SUCCESS) {
                store.dispatch(setAlert({visible: true, message: result.message}))
            }
        });


    },[])

    const handleSubmit = (values: any) => {
        Keyboard.dismiss();

        requestApi({
            method: methods.post,
            action: 'verifyemail',
            other: {url: loginUrl},
            body: values,
            showlog: true
        }).then(async (result) => {
            if (result.status === SUCCESS) {


                current.user = '';
                current.company = '';
                current.clientid = initdata.clientid;
                let companydetail = {
                    token: auth.token,
                    firstname: initdata.firstname,
                    lastname: initdata.lastname,
                    username: initdata.firstname + ' ' + initdata.lastname,
                    email: initdata.email,
                    password: initdata.password,
                    companies: {},
                    gridview: true,
                    adminid: initdata.clientid,
                };
                await store.dispatch(setCompany({companydetails: companydetail}));
                await storeData('fusion-pro-app', companydetail).then((r: any) => {})

                const {email_verified, mobile_verified,whatsapp_number, whatsapp_verified, phone_number_verified,workspaces} = initdata;
                if (!whatsapp_verified  && Boolean(whatsapp_number)) {
                    navigation.replace('WhatsappVerification',{userdetail:initdata});
                }
                else {
                    nav.navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {name: 'DashboardStack'},
                            ],
                        })
                    );
                }
            }
        });
    }

    const resendCode = () => {
        Keyboard.dismiss();

        requestApi({
            method: methods.get,
            action: 'verifyemail',
            other: {url: loginUrl},
        }).then((result) => {
            if (result.status === SUCCESS) {
                store.dispatch(setAlert({visible: true, message: result.message}))
            }
        });
    }

    const updateEmail = (email: any) => {
        initdata.email = email;
        setEmail(email)
    }

    const {navigation, theme: {colors}} = props;


    props.navigation.setOptions({
        headerTitle: `Verify Your Email`,
        headerLargeTitleStyle: {color: colors.inputbox},
        headerTitleStyle: {color: colors.inputbox},
        headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
    });

    if (Platform.OS === "android") {
        navigation.setOptions({
            headerCenter: () => <Title style={[styles.headertitle]}>{'Verify Your Email'}</Title>,
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
        <Container>

            <Form
                onSubmit={handleSubmit}
                initialValues={{code: ''}}>
                {props => (

                    <View style={[styles.pageContent]}>

                        <KeyboardScroll>

                            <Card style={[styles.card]}>
                                <Card.Content>

                                    <View>
                                        <Paragraph style={[styles.paragraph]}>Your Registered Email </Paragraph>
                                        <View style={[styles.grid, styles.middle]}>
                                            <Paragraph>
                                                {email} -
                                            </Paragraph>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('ChangeEmail', {
                                                    screen: 'ChangeEmail',
                                                    updateEmail: updateEmail
                                                });
                                            }}>
                                                <Text style={[{color: colors.secondary}]}> Change Email </Text>
                                            </TouchableOpacity>
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
                                        if(Boolean(value.length === 6)) {
                                            props.values.code = value
                                            handleSubmit(props.values)
                                        }
                                    }}> Verify </Button>

                            </View>
                        </KAccessoryView>


                    </View>

                )}
            </Form>

        </Container>
    );

}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));



