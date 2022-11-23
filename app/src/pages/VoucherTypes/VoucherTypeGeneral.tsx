import {ScrollView, View} from "react-native";
import React, {memo, useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {Card, Text, withTheme} from "react-native-paper";
import InputField from "../../components/InputField";
import {v4 as uuidv4} from "uuid";
import {getEmailTemplate, getNextVoucherNumber, getPrintingTemplate, putSettings} from "../../lib/ServerRequest/api";
import {required, STATUS} from "../../lib/static";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const VoucherTypeGeneral = (props: any) => {

    const [printTemplate, setPrintTemplate] = useState<any>([]);
    const [emailTemplate, setEmailTemplate] = useState<any>([]);
    const {navigation, route,theme:{colors}}: any = props;
    const {editData, _onSubmit} = route?.params;
    let isNew = !Boolean(editData);
    setNavigationOptions(navigation, "General",colors, route);

    let initData: any = {};

    if (Boolean(editData)) {
        initData = {
            ...editData,
            nextvouchernumber:editData.nextvouchernumber.toString()
        }
    }



    const loadPrintingTemplate = () => {
        getPrintingTemplate().then((response: any) => {
            if (response.status === STATUS.SUCCESS) {
                const data = Object.values(response.data)
                    .filter(({type}: any) => type === "Web" || type === "Inkject/Laser")
                    .map((t: any) => ({
                        ...t,
                        label: t.templatename,
                        value: t.ptid,
                    }));
                setPrintTemplate(data);
            }
        })
    }

    const loadEmailTemplate = () => {
        getEmailTemplate().then((response: any) => {
            if (response.status === STATUS.SUCCESS) {
                const data = Object.keys(response.data).map((t: any) => ({
                    label: response.data[t].templatename,
                    value: t
                }));
                setEmailTemplate(data);
            }
        })
    }

    useEffect(() => {
        loadPrintingTemplate();
        loadEmailTemplate();
    }, [])



    return <Container>
        <Form
            onSubmit={_onSubmit}
            initialValues={initData}
            render={({handleSubmit, submitting, values, form,...more}: any) => {
                return (
                    <View style={[styles.pageContent]}>
                        <KeyboardScroll>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <View>

                                            <Field name="accountstatus">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Active'}
                                                        value={props.input.value}
                                                        inputtype={'switch'}
                                                        onChange={(value:any) => {
                                                            props.input.onChange(value);
                                                        }}>
                                                    </InputField>

                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="vouchertypename">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Voucher Name'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        disabled={true}
                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="vouchertype">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Voucher Name'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        disabled={true}
                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                            form.change("voucherroundoff","disable")
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="vouchernumberprefix" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Voucher Prefix'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="nextvouchernumber">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Voucher Next Number'}
                                                        value={props.input.value}
                                                        key={uuidv4()}
                                                        inputtype={'textbox'}
                                                        disabled={true}

                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="canchangevouchernumber">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Can change voucher number`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="defaultterms">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Terms & Conditions'}
                                                        value={props.input.value}
                                                        inputtype={'textarea'}
                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="defaultcustomernotes">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Customer Notes'}
                                                        value={props.input.value}
                                                        inputtype={'textarea'}
                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="printtemplate">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Default Printing Template'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Default Printing Template"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        key={uuidv4()}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={printTemplate}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="mailtemplate">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Default Mail Template'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Default Mail Template"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        key={uuidv4()}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={emailTemplate}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="isDefaultPrint">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Default Print Enable`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>

                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="isDefaultMail">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Default Send Mail Enable`}
                                                        onChange={props.input.onChange}/>
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
    voucherTypeList: state?.appApiData.settings.staticdata.vouchertypes,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(VoucherTypeGeneral)));

