import React, {memo, useEffect, useState} from "react";
import {Button, CheckBox, Container} from "../../components";
import {Card, Divider, Paragraph, TextInput as TI, withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../lib/navigation_options";
import {styles} from "../../theme";
import {Keyboard, ScrollView, View} from "react-native";
import {Field, Form} from "react-final-form";
import BottomSpace from "../../components/BottomSpace";
import {connect} from "react-redux";
import {SUCCESS} from "../../lib/ServerRequest";
import {getInit} from "../../lib/functions";
import {getPrintingTemplate, putSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import InputField from "../../components/InputField";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView";

const LocationPreferences = ({navigation, route,theme:{colors}, settings: {paymentgateway, itemgroup}}: any) => {


    const [printingTemplate, setPrintingTemplate] = useState([]);

    useEffect(() => {
        getPrintingTemplate().then((response: any) => {
            if (response.status === STATUS.SUCCESS) {
                let data: any = Object.values(response.data).map((t: any) => ({
                    ...t,
                    label: t.templatename,
                    value: t.ptid
                }));
                setPrintingTemplate(data);
            }
        })
    }, [])

    let paymentgateways: any = Object.keys(paymentgateway)
        .filter((c) => paymentgateway[c])
        .map((c) => {
            let key: any = Object.keys(paymentgateway[c])[0];
            if (key !== 'settings') {
                return {
                    value: c,
                    label: paymentgateway[c][key] && paymentgateway[c][key][0].value,
                    selected: route?.params?.locationData.selectedPaymentgateways?.includes(c)
                }
            }
            return true
        });


    const options = [
        {fieldName: "cantakeorder.delivery", label: "Delivery"},
        {fieldName: "cantakeorder.pickup", label: "Pickup"},
        {fieldName: "cantakeorder.qsr", label: "QSR"},
    ]

    setNavigationOptions(navigation, "Preferences",colors, route);

    const _onSubmit = (values: any) => {
        Keyboard.dismiss();

        let key = values?.locationid;

        let selectedGateways: any = [];

        paymentgateways
            .filter((pg: any) => pg.selected === true)
            .forEach((pg: any) => selectedGateways.push(pg.value));

        values.selectedPaymentgateways = selectedGateways;

        putSettings("location", [{key, "value": values}]).then((result) => {
            if (result.status === SUCCESS) {
                getInit(null, null, null, null, "form", true)
            }
        })

    }

    return <Container>
        <Form
            onSubmit={_onSubmit}
            initialValues={route?.params?.locationData}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <View style={[styles.pageContent]}>
                    <KeyboardScroll>
                        <Card style={[styles.card]}>
                            <Card.Content>

                                    <View><Paragraph style={[styles.paragraph, styles.caption]}>Accepting
                                        Orders</Paragraph></View>
                                    <View style={{marginLeft: -20}}>
                                        {
                                            options.map(({fieldName, label}: any) => {
                                                return <Field name={fieldName}>
                                                    {props => (
                                                        <><CheckBox
                                                            value={props.input.value}
                                                            label={label}
                                                            onChange={props.input.onChange}/>
                                                        </>
                                                    )}
                                                </Field>
                                            })
                                        }


                                    </View>

                            </Card.Content>
                        </Card>

                        <Card style={[styles.card]}>
                            <Card.Content>

                                    <View><Paragraph
                                        style={[styles.paragraph, styles.caption]}>Payment Gateways</Paragraph></View>
                                    <View style={{marginLeft: -20}}>
                                        {
                                            paymentgateways.map(({label, selected}: any, index: number) => {
                                                return <CheckBox
                                                    value={selected}
                                                    label={label}
                                                    onChange={(e: any) => {
                                                        paymentgateways[index].selected = e
                                                    }}/>
                                            })
                                        }
                                    </View>
                            </Card.Content>
                        </Card>

                        <Card style={[styles.card]}>
                            <Card.Content>

                                    <View>
                                        <Field name="invoiceduedays">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value + ''}
                                                    label={'Invoice Due Days'}
                                                    inputtype={'textbox'}
                                                    right={<TI.Affix text={'Days'}/>}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="defaultpaymentgateway">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Default Payment Gateway'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Default Payment Gateway"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={paymentgateways.filter((pg: any) => pg.selected)}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="printingtemplates.web">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Default Web Template'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Default Web Template"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={printingTemplate.filter((pt: any) => pt.type === 'Web')}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="printingtemplates.thermal">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Default Thermal Template'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Default Thermal Template"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={printingTemplate.filter((pt: any) => pt.type === 'Thermal')}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="mainproductgroupid">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Default Product Category'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select 'Default Product Category"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={Object.values(itemgroup).map((ig: any) => ({
                                                        label: ig.itemgroupname,
                                                        value: ig.itemgroupid
                                                    }))}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                            </Card.Content>
                        </Card>
                    </KeyboardScroll>
                    <KAccessoryView>
                        <View style={[styles.submitbutton]}>
                            <Button disable={more.invalid} secondbutton={more.invalid}    onPress={() => handleSubmit(values)}>Update </Button>
                        </View>
                    </KAccessoryView>
                </View>
            )}>
        </Form>
    </Container>
}


const mapStateToProps = (state: any) => ({
    settings: state?.appApiData.settings,
    settings2: state?.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(LocationPreferences)));


