import {ScrollView, View} from "react-native";
import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {Card, withTheme} from "react-native-paper";
import InputField from "../../components/InputField";
import {v4 as uuidv4} from "uuid";
import {resetTickets, roundOffOptions, ticketAssignType} from "../../lib/static";
import KeyboardScroll from "../../components/KeyboardScroll";

const TicketTypeSettings = (props: any) => {

    const {navigation, route,theme:{colors}}: any = props;
    const {editData, _onSubmit} = route?.params;
    let isNew = !Boolean(editData);
    setNavigationOptions(navigation, "General",colors, route);

    let initData: any = {};

    if (Boolean(editData)) {
        initData = {
            ...editData,
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
                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="isclientrequired">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Client Required`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="assigntype">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Assign  Type'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Assign  Type"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        key={uuidv4()}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={ticketAssignType.map((tt: any) => ({label:tt, value:tt.toLowerCase()}))}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="resetticketid">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Assign  Type'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Assign  Type"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        key={uuidv4()}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={resetTickets.map((tt: any) => ({label:tt, value:tt.toLowerCase()}))}
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
                        <View style={[styles.submitbutton]}>
                            <Button
                                disable={more.invalid} secondbutton={more.invalid}
                                onPress={() => handleSubmit(values)}>{Boolean(isNew) ? "Save" : "Update"}</Button>
                        </View>
                    </View>
                )
            }}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypeSettings)));

