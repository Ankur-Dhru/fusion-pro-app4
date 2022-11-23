import {ScrollView, TouchableOpacity, View} from "react-native";
import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {Card, Text, withTheme} from "react-native-paper";
import {isEmpty, log} from "../../lib/functions";
import {v4 as uuidv4} from "uuid";
import Tags from "react-native-tags";
import {putTickets} from "../../lib/ServerRequest/api";
import KeyboardScroll from "../../components/KeyboardScroll";

const AssetsFieldForm = (props: any) => {
    let {navigation, route, customFieldList, ticketsList,theme:{colors}}: any = props;
    let {fieldData, key, form, base, customfield, fromTask, tickettypeid} = route?.params;
    let isNew = !Boolean(fieldData);


    setNavigationOptions(navigation, "Add Assets Field",colors, route);

    let initData: any = {
        base: Boolean(base),
        required: Boolean(base)
    };
    if (fromTask) {
        initData = {
            required: false,
            encrypted: false,
            isValidateWithRegEx: false
        }
    }

    if (Boolean(fieldData)) {
        initData = {
            ...fieldData
        }
    }


    const _onSubmit = (values: any) => {
        if (fromTask) {
            let {id, ...postData} = values;
            let ticketData = ticketsList[tickettypeid];

            let outsourcingcustomfield: any = {};

            if (!isEmpty(ticketData.outsourcingcustomfield)) {
                outsourcingcustomfield = ticketData.outsourcingcustomfield
            }


            if (!Boolean(id)) {
                id = uuidv4();
            }
            if (!Boolean(outsourcingcustomfield[id])) {
                outsourcingcustomfield[id] = {}
            }
            outsourcingcustomfield[id] = {
                key: id,
                ...postData,
            };

            ticketData = {...ticketData, outsourcingcustomfield};

            putTickets(tickettypeid, ticketData).then(() => {
                navigation.goBack();
            })
        } else {
            if (!Boolean(key)) {
                key = uuidv4();
            }

            if (values.base) {
                Object.keys(customfield).forEach((cf: any) => {
                    if (Boolean(customfield[cf]?.base)) {
                        customfield[cf].base = false;
                    }
                })
            }

            if (!Boolean(customfield[key])) {
                customfield[key] = {};
            }

            customfield = {
                ...customfield,
                [key]: values
            }

            form.change("customfield", customfield);
            navigation.goBack();
        }

    }

    const canBaseField = (rowvalue: any) => {
        return !["checkbox", "radio", "checkboxgroup"].some((type: any) => type === rowvalue?.input);
    }

    const visibleOptions = (rowvalue: any) => {
        return ["checkbox", "radio", "dropdown"].some((type: any) => type === rowvalue?.type);
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
                                            <Field name={fromTask ? "name" : "input"} validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Input Type'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Input Type"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={customFieldList.map((cf: any) => ({
                                                            ...cf,
                                                            label: cf.name,
                                                            value: cf.input
                                                        }))}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                            const findField = customFieldList.find((cf: any) => cf.input == value)
                                                            form.change("type", findField.type)
                                                            if (fromTask) {
                                                                form.change("isValidateWithRegEx", false)
                                                                form.change("validatewithregex", "")
                                                            } else {
                                                                if (!canBaseField({input: value})) {
                                                                    form.change("base", false)
                                                                }
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        {
                                            canBaseField(values) && !Boolean(fromTask) &&
                                            <View style={[{marginLeft: -25}]}>
                                                <Field name="base">
                                                    {props => (
                                                        <CheckBox
                                                            value={props.input.value}
                                                            label={`Base Field`}
                                                            onChange={(value: any) => {
                                                                form.change("required", value)
                                                                props.input.onChange(value);
                                                            }}/>
                                                    )}
                                                </Field>
                                            </View>
                                        }


                                        <View>
                                            <Field name={fromTask ? "displayname" : 'name'} validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={fromTask ? "Display Name" : 'Name'}
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
                                            !Boolean(fromTask) && <View>
                                                <Field name="description">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Description'}
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
                                        }

                                        {
                                            visibleOptions(values) && <View>
                                                <Field name="options">
                                                    {props => (
                                                        <InputField
                                                            label={'Options'}
                                                            mode={'flat'}
                                                            divider={false}
                                                            defaultValue={props.input.value}
                                                            displaytype={'tags'}
                                                            key={uuidv4()}
                                                            inputtype={'tags'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}>
                                                        </InputField>
                                                    )}
                                                </Field>

                                            </View>
                                        }


                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="required">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Required`}
                                                        key={uuidv4()}
                                                        editmode={!Boolean(values.base)}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>

                                        {
                                            Boolean(fromTask) && <>
                                                <View style={[{marginLeft: -25}]}>
                                                    <Field name="encrypted">
                                                        {props => (
                                                            <CheckBox
                                                                value={props.input.value}
                                                                label={`Encrypted`}
                                                                key={uuidv4()}
                                                                editmode={!Boolean(values.base)}
                                                                onChange={props.input.onChange}/>
                                                        )}
                                                    </Field>
                                                </View>

                                                {
                                                    (values.name === "text" ||
                                                        values.name === "textarea" ||
                                                        values.name === "password") &&
                                                    <View style={[{marginLeft: -25}]}>
                                                        <Field name="isValidateWithRegEx">
                                                            {props => (
                                                                <CheckBox
                                                                    value={props.input.value}
                                                                    label={`Validate With RegEx (Regular Expression)`}
                                                                    key={uuidv4()}
                                                                    editmode={!Boolean(values.base)}
                                                                    onChange={props.input.onChange}/>
                                                            )}
                                                        </Field>
                                                    </View>
                                                }


                                                {
                                                    Boolean(values.isValidateWithRegEx) &&
                                                    <View>
                                                        <Field name="validatewithregex" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    label={'RegEx (Regular Expression)'}
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
                                            </>
                                        }
                                    </View>
                                </Card.Content>
                            </Card>
                        </KeyboardScroll>
                        <View style={[styles.submitbutton]}>
                            <Button
                                disable={more.invalid} secondbutton={more.invalid}
                                onPress={() => handleSubmit(values)}>{Boolean(isNew) ? "Add" : "Update"}</Button>
                        </View>
                    </View>
                )
            }}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
    ticketsList: state?.appApiData.settings.tickets,
    customFieldList: state?.appApiData.settings.staticdata.customfield,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(AssetsFieldForm)));

