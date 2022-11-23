import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {notes, required} from "../../lib/static";
import {Button, Container} from "../../components";
import {Field, Form} from "react-final-form";
import {ScrollView, View} from "react-native";
import {styles} from "../../theme";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {connect} from "react-redux";
import {Card, withTheme} from "react-native-paper";
import {clone, getInit} from "../../lib/functions";
import {v4 as uuidv4} from "uuid";
import {putSettings} from "../../lib/ServerRequest/api";
import {SUCCESS} from "../../lib/ServerRequest";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const ReasonForm = (props: any) => {
    const {navigation, route, reasonList,theme:{colors}}: any = props;
    const {reason, reasontype} = route?.params;
    let isNew = !Boolean(reason);
    setNavigationOptions(navigation, "Add Reason",colors, route);


    let initData: any = {reasontype};


    if (Boolean(reason)) {
        initData = {...reason}
    }

    const _onSubmit = (values: any) => {
        let reasons = clone(reasonList);

        if (!values.reasonid) {
            values.reasonid = uuidv4();
        }
        if (!Boolean(reasons)) {
            reasons = {};
        }
        if (!Boolean(reasons[values.reasontype])) {
            reasons[values.reasontype] = {};
        }
        reasons[values.reasontype][values.reasonid] = values.reasonname


        putSettings("reason", reasons, true).then((result) => {
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

                                        <View>

                                            <Field name={"reasontype"}>
                                                {props => (
                                                    <><InputField
                                                        {...props}
                                                        value={notes[values?.reasontype]}
                                                        label={"Reason Type"}
                                                        disabled={true}
                                                        inputtype={"textbox"}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                    </>
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="reasonname" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Reason Name'}
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
    reasonList: state?.appApiData.settings.reason
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(ReasonForm)));
