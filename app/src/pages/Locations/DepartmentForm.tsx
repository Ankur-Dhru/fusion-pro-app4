import React, {memo, useState} from "react";
import {ScrollView, View} from "react-native";
import {Button, Container} from "../../components";
import {styles} from "../../theme";
import {Field, Form} from "react-final-form";
import {required} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {putSettings} from "../../lib/ServerRequest/api";
import {SUCCESS} from "../../lib/ServerRequest";
import {getInit} from "../../lib/functions";
import {v4 as uuidv4} from "uuid";
import {setNavigationOptions} from "../../lib/navigation_options";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"
import {Card, withTheme} from "react-native-paper";

const DepartmentForm = ({navigation, route,theme:{colors}}: any) => {

    let {departmentList, locationData, department}: any = route?.params;

    const [initData, setInitData] = useState({
        name: "",
        type: "Warehouse",
        ...department
    })

    setNavigationOptions(navigation, "Add Department",colors, route);

    const typeList = ['Kitchen', 'Warehouse', 'Other'].map((t: any) => ({label: t, value: t}))

    const _onSubmit = (values: any) => {
        let departmentid = uuidv4();

        if (!departmentList) {
            departmentList = [];
        }

        if (Boolean(values?.departmentid)) {
            departmentList = departmentList.map((dept: any) => {
                if (dept.departmentid === values.departmentid) {
                    return {
                        ...dept,
                        ...values
                    }
                }
                return dept;
            })
        } else {
            departmentList = [
                ...departmentList,
                {departmentid, ...values}
            ]
        }

        putSettings("location", [{
            key: locationData?.locationid, "value": {
                ...locationData,
                departments: departmentList
            }
        }]).then((result) => {
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
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <View style={[styles.pageContent]}>
                    <KeyboardScroll>
                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View>
                                    <View>
                                        <Field name="name" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value + ''}
                                                    label={'Department name'}
                                                    inputtype={'textbox'}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                    <View>
                                        <Field name="type">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'type'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Ownership"}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={typeList}
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
                    <KAccessoryView>
                        <View style={[styles.submitbutton]}>
                            <Button
                                disable={more.invalid} secondbutton={more.invalid}
                                onPress={() => handleSubmit(values)}>{Boolean(department) ? "Update" : "Add"}</Button>
                        </View>
                    </KAccessoryView>
                </View>
            )}>
        </Form>
    </Container>
}

export default memo(withTheme(DepartmentForm))
