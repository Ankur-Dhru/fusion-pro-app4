import {View} from "react-native";
import React from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required, STATUS} from "../../lib/static";
import InputField from "../../components/InputField";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {getCurrencyRate, putSettings} from "../../lib/ServerRequest/api";
import {SUCCESS} from "../../lib/ServerRequest";
import {getInit, isEmpty} from "../../lib/functions";
import {Card, withTheme} from "react-native-paper";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const CurrencyForm = (props: any) => {
    const {navigation, route, currencyStatic, currencyList, decimalcurrency, theme: {colors}}: any = props;
    const {currency} = route?.params;

    setNavigationOptions(navigation, "Add Currency", colors, route);

    let initData: any = {};

    if (Boolean(currency)) {
        initData = {
            ...currency,
            customdecimalplace:currency.customdecimalplace,
            oldcurrency: currency.currency,
            defaultcurrency: parseFloat(currency.rate) === 1
        }
    }

    const _onSubmit = (values: any) => {

        const {currency: c, oldcurrency, defaultcurrency, getrate, ...otherValues} = values

        let changeCurrency: any = [];

        if (parseFloat(values.rate) === 1) {
            if (currencyList) {
                Object.keys(currencyList).forEach((c) => {
                    if (currencyList[c] && parseFloat(currencyList[c].rate) === 1) {
                        changeCurrency = {
                            ...changeCurrency,
                            [c]: {
                                ...currencyList[c],
                                rate: "2"
                            }
                        }
                    }
                });
            }
        }


        changeCurrency = [{key: c, "value": {...otherValues, "__key": c, rate: values.rate.toString()}}];

        putSettings("currency", changeCurrency).then((result) => {
            if (result.status === SUCCESS) {
                getInit(null, null, null, () => {
                    navigation.goBack();
                }, "form", true)
            }
        })
    }

    return <Container>
        <Form
            onSubmit={_onSubmit}
            initialValues={initData}
            render={({handleSubmit, submitting, values, form, ...more}: any) => (
                <View style={[styles.pageContent]}>
                    <KeyboardScroll>
                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View>
                                    <View>
                                        <Field name="currency" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Currency'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Currency"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={Object.keys(currencyStatic)
                                                        .filter((value) => {
                                                            let addCurrency = Object.keys(currencyList);
                                                            if (!isEmpty(addCurrency) &&  Boolean(currency?.currency !== value)) {
                                                                return !Boolean(addCurrency.some((key: any) => key === value))
                                                            }
                                                            return true;
                                                        })
                                                        .map((value: any) => ({
                                                            label: currencyStatic[value],
                                                            value
                                                        }))}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                        form.change("decimalplace", decimalcurrency[value]);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    {
                                        !Boolean(initData?.defaultcurrency) && <View style={[{marginLeft: -25}]}>
                                            <CheckBox
                                                label={"Set Live Currency Rate"}
                                                onChange={(e: any) => {
                                                    if (e && values?.currency) {
                                                        getCurrencyRate(values.currency).then((response: any) => {
                                                            if (response.status === STATUS.SUCCESS && Boolean(response?.data)) {
                                                                form.change("rate", response.data.rate);
                                                                handleSubmit({...values, rate: response.data.rate})
                                                            }
                                                        })
                                                    }
                                                }}/>
                                        </View>
                                    }

                                    <View>
                                        <Field name="rate" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Rate'}
                                                    value={props.input.value}
                                                    inputtype={'textbox'}
                                                    disabled={Boolean(initData?.defaultcurrency)}
                                                    autoCapitalize={true}
                                                    keyboardType='numeric'
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value)
                                                    }}
                                                    description={Boolean(initData?.defaultcurrency) ? "Base Currency" : ""}
                                                />
                                            )}
                                        </Field>
                                    </View>


                                    <View>
                                        <Field name="customdecimalplace">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Custom Decimal'}
                                                    value={props.input.value}
                                                    inputtype={'textbox'}
                                                    autoCapitalize={true}
                                                    keyboardType='numeric'
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value)
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
                                onPress={() => handleSubmit(values)}>{Boolean(route?.params?.currency) ? "Update" : "Save"}</Button>
                        </View>
                    </KAccessoryView>
                </View>
            )}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
    decimalcurrency: state.appApiData.settings.staticdata.decimalcurrency,
    currencyStatic: state.appApiData.settings.staticdata.currency,
    currencyList: state?.appApiData.settings.currency
});

const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CurrencyForm));

