import {ScrollView, View} from "react-native";
import React, {memo, useEffect} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required, STATUS} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {Card, Text, withTheme} from "react-native-paper";
import requestApi, {actions, methods} from "../../lib/ServerRequest";
import {v4 as uuidv4} from "uuid";
import {log} from "../../lib/functions";
import ChartOfAccountPageList from "../../appcomponent/ChartOfAccountPageList";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const PaymentMethodForm = (props: any) => {
    const {navigation, route, paymentmethodStatic, paymentmethodsList, chartofaccount,theme:{colors}}: any = props;
    const {payment} = route?.params;
    let isNew = !Boolean(payment);
    setNavigationOptions(navigation, "Add Payment Method",colors, route);

    let accountList: any = [];
    useEffect(() => {
        accountList = chartofaccount.map((data: any) => {
            return {
                ...data,
                label: data?.accountname,
                value: data?.accountid
            }
        });

    }, [])

    let initData: any = {}, lastSelectedGateway: any, customField: any = [];


    if (Boolean(payment)) {


        let customData: any = {};

        if (payment?.customfields) {
            payment?.customfields.map(({input, value}: any) => {
                customData[input] = value
            })
        }

        initData = {
            gatewayid: payment.gatewayid,
            gateway: payment.gateway,
            settings: {...payment?.settings, paymentaccount: payment.settings.paymentaccount.toString()},
            ...customData
        }
    }

    const _onSubmit = (values: any) => {

        let isNew = Boolean(values?.gatewayid);

        let fields: any = [];
        let gatewayfield: any = {};
        Object.keys(values).forEach((key) => {
            fields.push({input: key, value: values[key]});
        });

        gatewayfield[values.gateway] = fields;

        requestApi({
            method: isNew ? methods.put : methods.post,
            action: actions.paymentgateway,
            body: {
                gatewayid: isNew ? values?.gatewayid : uuidv4(),
                paymentmethod: values.settings.paymentmethod,
                paymentaccount: values.settings.paymentaccount,
                gatewayname: values.gateway,
                "gatewayfield": gatewayfield
            }
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                navigation.goBack();
            }
        })
    }

    return <Container>
        <Form
            onSubmit={_onSubmit}
            initialValues={initData}
            render={({handleSubmit, submitting, values, form,...more}: any) => {
                if (values?.gateway && lastSelectedGateway !== values?.gateway) {
                    lastSelectedGateway = values?.gateway;
                    customField = paymentmethodsList[values?.gateway]
                }

                return (
                    <View style={[styles.pageContent]}>
                        <KeyboardScroll>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>

                                        <View>
                                            {
                                                Boolean(values?.gatewayid) ?
                                                    <Field name={"gateway"}>
                                                        {props => (
                                                            <><InputField
                                                                {...props}
                                                                value={paymentmethodsList[props.input.value][0].value}
                                                                label={"Gateway"}
                                                                disabled={true}
                                                                inputtype={"textbox"}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                            </>
                                                        )}
                                                    </Field>

                                                    :  <Field name="gateway" validate={required}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Gateway'}
                                                                selectedValue={props.input.value}
                                                                selectedLabel={"Select Gateway"}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                showlabel={false}
                                                                appbar={true}
                                                                search={false}
                                                                editmode={!Boolean(values?.gatewayid)}
                                                                listtype={'other'}
                                                                list={Object.keys(paymentmethodsList)
                                                                    .filter((k) => {
                                                                        const checkDisplayNameAvailable = paymentmethodsList[k].find((p: any) => p.input === "displayname")
                                                                        return Boolean(checkDisplayNameAvailable);
                                                                    })
                                                                    .map((k) => {
                                                                        const a = paymentmethodsList[k].find((p: any) => p.input === "displayname");
                                                                        return {label: a.value, value: k}
                                                                    })}
                                                                onChange={(value: any) => {
                                                                    customField = [];
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                            }


                                        </View>

                                        {
                                            customField?.map((fieldObject: any, index: any) => {
                                                const {
                                                    type,
                                                    description,
                                                    name,
                                                    input,
                                                    value,
                                                    required: req,
                                                    options
                                                } = fieldObject;
                                                return <View key={index}>
                                                    {
                                                        type && <>

                                                            {
                                                                (type === "text" || type === "password" || type === "textarea") &&
                                                                <Field name={input}
                                                                       validate={req == "1" ? required : undefined}>
                                                                    {props => (
                                                                        <><InputField
                                                                            {...props}
                                                                            value={props.input.value}
                                                                            label={name}
                                                                            inputtype={type === "textarea" ? 'textarea' : 'textbox'}
                                                                            secureTextEntry={type === "password"}
                                                                            multiline={type === "textarea"}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value);
                                                                            }}
                                                                            description={description}
                                                                        />
                                                                        </>
                                                                    )}
                                                                </Field>
                                                            }

                                                            {
                                                                (type === "dropdown" || type === "radio" || type === 'checkbox') &&
                                                                <Field name={input}
                                                                       validate={req == "1" ? required : undefined}>
                                                                    {props => (
                                                                        <>
                                                                            <InputField
                                                                                {...props}
                                                                                label={name}
                                                                                mode={'flat'}
                                                                                list={options?.split(",")?.map((opt: any) => ({
                                                                                    label: opt,
                                                                                    value: opt
                                                                                }))}
                                                                                value={props.input.value}
                                                                                selectedValue={props.input.value}
                                                                                displaytype={'pagelist'}
                                                                                inputtype={'dropdown'}
                                                                                multiselect={type === 'checkbox'}
                                                                                listtype={'other'}
                                                                                description={description}
                                                                                onChange={(value: any) => {
                                                                                    props.input.onChange(value);
                                                                                }}>
                                                                            </InputField>
                                                                        </>

                                                                    )}
                                                                </Field>
                                                            }

                                                            {
                                                                type === 'checkboxgroup' && <Field name={input}>
                                                                    {props => (<View style={{marginLeft: -25}}><CheckBox
                                                                        value={props.input.value}
                                                                        label={name}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value);
                                                                        }}/></View>)}
                                                                </Field>
                                                            }


                                                        </>
                                                    }
                                                </View>
                                            })
                                        }

                                        <View>
                                            <Field name="settings.paymentmethod" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Payment Mode'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Payment Mode"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={paymentmethodStatic.map((pm: any) => ({
                                                            label: pm,
                                                            value: pm
                                                        }))}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="settings.paymentaccount" validate={required}>
                                                {props => (
                                                    <ChartOfAccountPageList
                                                        {...props}
                                                        label={'Payment Account'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Payment Account"}
                                                        displaytype={'pagelist'}
                                                        key={uuidv4()}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        type={'assets'}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={accountList}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>
                        </KeyboardScroll>
                        <KAccessoryView>
                            <View style={[styles.submitbutton]}>
                                <Button
                                    disable={more.invalid} secondbutton={more.invalid}
                                    onPress={() => handleSubmit(values)}>{Boolean(isNew) ? "Save" : "Update"}</Button>
                            </View>
                        </KAccessoryView>

                    </View>
                )
            }}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
    paymentmethodStatic: state.appApiData.settings.staticdata.paymentmethod,
    paymentmethodsList: state.appApiData.settings.paymentmethod,
    accounttypes: state.appApiData.settings.staticdata.accounttypes,
    chartofaccount: state.appApiData.settings.chartofaccount,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(PaymentMethodForm)));

