import {ScrollView, View} from "react-native";
import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import BottomSpace from "../../components/BottomSpace";
import {Button, Container} from "../../components";
import {connect} from "react-redux";
import {Card, withTheme} from "react-native-paper";
import InputField from "../../components/InputField";
import {required} from "../../lib/static";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const TicketTypeGeneral = (props: any) => {

    const {navigation, route,theme:{colors}}: any = props;
    const {editData, _onSubmit} = route?.params;
    let isNew = !Boolean(editData);
    setNavigationOptions(navigation, "General",colors, route);

    let initData: any = {};

    if (Boolean(editData)) {
        initData = {
            ...editData,
            nextticketnumber: editData.nextticketnumber.toString()
        }
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
                                            <Field name="tickettypename">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Ticket Name'}
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
                                            <Field name="tickettype">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Ticket Type'}
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
                                            <Field name="ticketnumberprefix" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Ticket Prefix'}
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

                                        {
                                            values.tickettype == "kot" && <View>
                                                <Field name="nextticketnumber" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Ticket Next Number'}
                                                            value={props.input.value}
                                                            inputtype={'textbox'}
                                                            disabled={true}
                                                            autoCapitalize={true}
                                                            description={"Auto-generating ticket numbers can save your time."}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        }
                                        {
                                            values.tickettype == "task" && <View>
                                                <Field name="ticketnumbersubprefix" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Sub Task Prefix'}
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
                                        }

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

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypeGeneral)));

