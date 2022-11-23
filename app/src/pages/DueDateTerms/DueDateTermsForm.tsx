import {ScrollView, View} from "react-native";
import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {Card, withTheme} from "react-native-paper";
import {putSettings} from "../../lib/ServerRequest/api";
import {SUCCESS} from "../../lib/ServerRequest";
import {getInit, log} from "../../lib/functions";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const DueDateTermsForm = (props: any) => {
    let {navigation, route, paymenttermsList,theme:{colors}}: any = props;
    const {term} = route?.params;
    let isNew = !Boolean(term);

    setNavigationOptions(navigation, "Add Due Date Terms",colors, route);

    let initData: any = {};

    if (Boolean(term)) {
        initData = {
            ...term,
            termdays: term.termdays.toString()
        }
    }


    const _onSubmit = (values: any) => {

        if (Boolean(values.termdefault)) {
            const findDefaultIndex: any = Object.keys(paymenttermsList)
                .filter((pt: any) => Boolean(paymenttermsList[pt]))
                .find((pt: any) => paymenttermsList[pt].termdefault);
            if (findDefaultIndex) {
                paymenttermsList[findDefaultIndex].termdefault = false
            }
        }

        paymenttermsList = {
            ...paymenttermsList,
            [values.termdays]: values
        }


        putSettings("paymentterms",paymenttermsList,true).then((result:any)=>{
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
            render={({handleSubmit, submitting, values, form,...more}: any) => {

                return (
                    <View style={[styles.pageContent]}>
                        <KeyboardScroll>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>

                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="termdefault">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Default`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="termname" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Term Name'}
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
                                            <Field name="termdays" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Number Of Days'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        keyboardType='numeric'
                                                        autoCapitalize={true}
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
    paymenttermsList: state?.appApiData.settings.paymentterms
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(DueDateTermsForm)));

