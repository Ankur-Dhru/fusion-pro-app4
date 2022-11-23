import {ScrollView, View} from "react-native";
import React, {useState} from "react";
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
import {Card, withTheme} from "react-native-paper";

const KanbanForm = (props: any) => {
    const {navigation, route, ticketStatusList, ticketsList,theme:{colors}}: any = props;
    const {editData, tickettypeid} = route?.params;
    let isNew = !Boolean(editData);
    setNavigationOptions(navigation, "Add Status",colors, route);

    let initData: any = {
        ossystem: false,
        osdefault: false,
        osstatuscolor:"#000000"
    };

    if (Boolean(editData)) {
        initData = {
            ...editData,
        }
    }

    const _onSubmit = ({id, ...values}: any) => {

        let ticketData = ticketsList[tickettypeid];

        let outsourcingstatuslist: any = {};

        if (!isEmpty(ticketData.outsourcingstatuslist)) {
            outsourcingstatuslist = ticketData.outsourcingstatuslist

            if (values?.osdefault) {
                Object.keys(ticketData.outsourcingstatuslist).forEach((key: any) => {
                    outsourcingstatuslist[key] = {
                        ...ticketData.outsourcingstatuslist[key],
                        osdefault: false
                    }
                })
            }
        }


        if (!Boolean(id)) {
            id = uuidv4();
        }
        if (!Boolean(outsourcingstatuslist[id])) {
            outsourcingstatuslist[id] = {}
        }
        outsourcingstatuslist[id] = {
            key: id,
            ...values,
        };

        ticketData = {...ticketData, outsourcingstatuslist};

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
                                        <Field name="osdefault">
                                            {props => (
                                                <CheckBox
                                                    value={props.input.value}
                                                    label={`Default`}
                                                    onChange={props.input.onChange}/>
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="osstatusname" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Column Name'}
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
                                        <Field name="osstatuscolor" validate={composeValidators(required, isHexCode)}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Colour'}
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
                    <View style={[styles.submitbutton]}>
                        <Button
                            disable={more.invalid} secondbutton={more.invalid}
                            onPress={() => handleSubmit(values)}>{Boolean(isNew) ? "Save" : "Update"}</Button>
                    </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(KanbanForm));

