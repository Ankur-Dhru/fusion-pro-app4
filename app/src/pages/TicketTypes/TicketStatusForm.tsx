import {ScrollView, View} from "react-native";
import React from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {composeValidators, isHexCode, required} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {v4 as uuidv4} from 'uuid';
import {isEmpty} from "../../lib/functions";
import {putTickets} from "../../lib/ServerRequest/api";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"
import {Card, withTheme} from "react-native-paper";

const TicketStatusForm = (props: any) => {
    const {navigation, route, ticketStatusList, ticketsList,theme:{colors}}: any = props;
    const {editData, tickettypeid} = route?.params;
    let isNew = !Boolean(editData);
    setNavigationOptions(navigation, "Add Ticket Status",colors, route);

    let initData: any = {
        ticketstatusdisplay: true,
        ticketdefault: false,
        ticketstatuscolor: "#888888",
        system: false
    };

    if (Boolean(editData)) {
        initData = {
            ...editData,
        }
    }

    const _onSubmit = ({id, ...values}: any) => {

        let ticketData = ticketsList[tickettypeid];

        let ticketstatuslist: any = {};

        if (!isEmpty(ticketData.ticketstatuslist)) {
            ticketstatuslist = ticketData.ticketstatuslist
            if (values?.ticketdefault) {
                Object.keys(ticketData.ticketstatuslist).forEach((key: any) => {
                    ticketstatuslist[key] = {
                        ...ticketData.ticketstatuslist[key],
                        ticketdefault: false
                    }
                })
                values.ticketstatusdisplay =values?.ticketdefault;
            }
        }


        if (!Boolean(id)) {
            id = uuidv4();
        }
        if (!Boolean(ticketstatuslist[id])) {
            ticketstatuslist[id] = {}
        }
        ticketstatuslist[id] = values;

        ticketData = {...ticketData, ticketstatuslist};

        putTickets(tickettypeid, ticketData).then(() => {
            navigation.goBack();
        })
    }

    return <Container>
        <Form
            onSubmit={_onSubmit}
            initialValues={initData}
            render={({handleSubmit, submitting, values, form,...more}: any) => (
                <View style={[styles.pageContent]}>
                    <KeyboardScroll>
                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View>
                                    <View style={[{marginLeft: -25}]}>
                                        <Field name="ticketdefault">
                                            {props => (
                                                <CheckBox
                                                    value={props.input.value}
                                                    label={`Default`}
                                                    onChange={(value: any) => {
                                                        form.change("ticketstatusdisplay", value)
                                                        props.input.onChange(value);
                                                    }}/>
                                            )}
                                        </Field>
                                    </View>


                                    <View>
                                        <Field name="ticketstatusname" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Status Name'}
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
                                        <Field name="taskstatus" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Task Type'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Task Type"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    key={uuidv4()}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={Object.keys(ticketStatusList).map((key: any) => ({
                                                        value: key,
                                                        label: ticketStatusList[key]
                                                    }))}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="ticketstatuscolor" validate={composeValidators(required, isHexCode)}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Status Colour'}
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

                                    <View style={[{marginLeft: -25}]}>
                                        <Field name="ticketstatusdisplay">
                                            {props => (
                                                <CheckBox
                                                    value={props.input.value}
                                                    label={`Display`}
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
            )}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
    ticketsList: state?.appApiData.settings.tickets,
    ticketStatusList: state?.appApiData.settings.staticdata.ticketstatus,
});

const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TicketStatusForm));

