import React, {Component, useEffect, useState} from "react";
import {Keyboard, Platform, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Paragraph, Text, Title, withTheme} from "react-native-paper";
import {getAppType, retrieveData, storeData} from "../../lib/functions";
import {setCompany} from "../../lib/Store/actions/appApiData";
import {auth, backButton, current, defaultvalues, loginUrl, nav} from "../../lib/setting";
import {store} from "../../App";
import {TouchableOpacity} from "react-native-gesture-handler";
import {Field, Form} from "react-final-form";
import requestApi, {methods, SUCCESS} from "../../lib/ServerRequest";

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
import {checkLogin} from "./LoginDhruCom";


const Index = (props: any) => {

    const {route}: any = props;

    const initdata = {
        "code": "",
        ...route.params?.userdetail
    }

    const [number,setNumber] = useState(initdata.whatsapp_number)

    useEffect(()=>{

        requestApi({
            method: methods.get,
            action: 'verifywhatsapp',
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
            action: 'verifywhatsapp',
            other: {url: loginUrl},
            body: values,
            showlog: true
        }).then(async (result) => {
            if (result.status === SUCCESS) {

                getAppType().then((type: any) => {
                    if (type === "help") {
                        navigation.navigate('DashboardStack', {
                            screen: "SupportNavigator"
                        });
                    } else {
                        navigation.navigate('DashboardStack', {
                            screen: 'DashboardStack',
                            params: {
                                disableAddWorkspace: true,
                                index: defaultvalues.ticketdisplayid ? 2 : 0
                            }
                        });
                    }
                })

            }
        });
    }

    const resendCode = () => {
        Keyboard.dismiss();

        requestApi({
            method: methods.get,
            action: 'verifywhatsapp',
            other: {url: loginUrl},
        }).then((result) => {
            if (result.status === SUCCESS) {
                store.dispatch(setAlert({visible: true, message: result.message}))
            }
        });
    }

    const updateWhatsapp = (values: any) => {
        initdata.whatsapp_number =  values.whatsapp_number;
        setNumber(initdata.whatsapp_number)
    }

    const {navigation, theme: {colors}} = props;


    props.navigation.setOptions({
        headerTitle: `Verify Your Whatsapp Number`,
        headerLargeTitleStyle: {color: colors.inputbox},
        headerTitleStyle: {color: colors.inputbox},
        headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
    });

    if (Platform.OS === "android") {
        navigation.setOptions({
            headerCenter: () => <Title style={[styles.headertitle]}>{'Verify Your Whatsapp'}</Title>,
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
                                        <Paragraph style={[styles.paragraph]}>Your Registered Whatsapp Number </Paragraph>
                                        <View style={[styles.grid, styles.middle]}>
                                            <Paragraph>
                                                {number} -
                                            </Paragraph>
                                            <TouchableOpacity onPress={() => {
                                                navigation.navigate('ChangeWhatsapp',{initdata:initdata,updateWhatsapp:updateWhatsapp});

                                            }}>
                                                <Text style={[{color: colors.secondary}]}> Change Whatsapp Number </Text>
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



