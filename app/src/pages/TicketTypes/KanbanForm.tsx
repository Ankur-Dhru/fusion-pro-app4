import {ScrollView, View} from "react-native";
import React, {useEffect, useState} from "react";
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
    setNavigationOptions(navigation, "Add Ticket Status",colors, route);

    const [options, setOptions] = useState<any>([]);

    useEffect(() => {
        if (tickettypeid) {
            let data = ticketsList[tickettypeid];
            if (!isEmpty(data.ticketstatuslist)) {
                let listData = Object.keys(data.ticketstatuslist)
                    .filter((id) => {
                        if (Boolean(id)) {
                            return !Object.values(data?.kanbanstatuslist).some(({taskstatus}: any) => {
                                if (Boolean(editData)) {
                                    return editData.taskstatus !== taskstatus && id == taskstatus
                                }
                                return id == taskstatus
                            })
                        }
                        return false
                    })
                    .map((id) => ({value: id, label: data.ticketstatuslist[id].ticketstatusname}));
                setOptions(listData)
            }
        }
    }, [ticketsList])

    let initData: any = {
        columncolur: "#000000",
        system: false,
        kanbandisplay: false
    };

    if (Boolean(editData)) {
        initData = {
            ...editData,
        }
    }

    const _onSubmit = ({id, ...values}: any) => {

        let ticketData = ticketsList[tickettypeid];
        let sort = 100000;

        let kanbanstatuslist: any = {};

        if (!isEmpty(ticketData.kanbanstatuslist)) {
            kanbanstatuslist = ticketData.kanbanstatuslist
            sort = Object.values(ticketData.kanbanstatuslist).length +1
        }


        if (!Boolean(id)) {
            id = uuidv4();
        }
        if (!Boolean(kanbanstatuslist[id])) {
            kanbanstatuslist[id] = {}
        }
        kanbanstatuslist[id] = {
            key: id,
            ...values,
            sort
        };

        ticketData = {...ticketData, kanbanstatuslist};

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
                                        <Field name="columnname" validate={required}>
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
                                        <Field name="taskstatus" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Task Status'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Task Status"}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    key={uuidv4()}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={options}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>

                                    <View>
                                        <Field name="columncolur" validate={composeValidators(required, isHexCode)}>
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

                                    <View style={[{marginLeft: -25}]}>
                                        <Field name="kanbandisplay">
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

