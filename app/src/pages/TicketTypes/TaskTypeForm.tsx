import {ScrollView, View} from "react-native";
import React, {useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {Button, Container} from "../../components";
import {connect} from "react-redux";
import {v4 as uuidv4} from 'uuid';
import {isEmpty} from "../../lib/functions";
import {putTickets} from "../../lib/ServerRequest/api";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Card, withTheme} from "react-native-paper";

const TaskTypeForm = (props: any) => {
    const {navigation, route, ticketStatusList, ticketsList,theme:{colors}}: any = props;
    const {editData, tickettypeid} = route?.params;
    let isNew = !Boolean(editData);
    setNavigationOptions(navigation, "Add Ticket Status",colors, route);
    const [screenOptions, setScreenOptions] = useState<any>([])

    useEffect(() => {
        let ticketData = ticketsList[tickettypeid];

        if (!isEmpty(ticketData.task_screens)) {
            setScreenOptions(Object.values(ticketData.task_screens)
                .map(({screen_key, screen_name}: any) => ({label: screen_name, value: screen_key})))
        }
    }, [])

    let initData: any = {
        task_type_icon: "fad fa-square-check"
    };

    if (Boolean(editData)) {
        initData = {
            ...editData,
        }
    }

    const _onSubmit = ({id, ...values}: any) => {


        let ticketData = ticketsList[tickettypeid];

        let task_types: any = {};

        if (!isEmpty(ticketData.task_types)) {
            task_types = ticketData.task_types
        }

        if (!Boolean(id)) {
            id = uuidv4();
        }
        if (!Boolean(task_types[id])) {
            task_types[id] = {}
        }
        task_types[id] = {type_key: id, ...values};

        ticketData = {...ticketData, task_types};

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

                                    <View>
                                        <Field name="task_type_name" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Task Type'}
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
                                        <Field name="create_screen" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Create Screen'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Create Screen"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    key={uuidv4()}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={screenOptions}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="edit_screen" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'View / Edit'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select View / Edit"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    key={uuidv4()}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={screenOptions}
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
            )}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
    ticketsList: state?.appApiData.settings.tickets,
    ticketStatusList: state?.appApiData.settings.staticdata.ticketstatus,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TaskTypeForm));

