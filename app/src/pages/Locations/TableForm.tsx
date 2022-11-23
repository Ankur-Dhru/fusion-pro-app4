import React, {memo, useState} from "react";
import {Button, Container} from "../../components";
import {ScrollView, View} from "react-native";
import {styles} from "../../theme";
import {Field, Form} from "react-final-form";
import BottomSpace from "../../components/BottomSpace";
import {required} from "../../lib/static";
import InputField from "../../components/InputField";
import {setNavigationOptions} from "../../lib/navigation_options";
import {putSettings} from "../../lib/ServerRequest/api";
import {SUCCESS} from "../../lib/ServerRequest";
import {getInit} from "../../lib/functions";
import {v4 as uuidv4} from "uuid";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"
import {Card, withTheme} from "react-native-paper";

const TableForm = ({navigation, route,theme:{colors}}: any) => {

    setNavigationOptions(navigation, "Add Table",colors, route);

    let {tableList, locationData, table}: any = route?.params;

    const [initData, setInitData] = useState({
        tablename: '',
        paxes: '',
        area: 'Default',
        ordertype: 'table',
        ...table
    })

    const areaList = ['Default'].map((t: any) => ({label: t, value: t}))

    const _onSubmit = (values:any) => {

        let tableid = uuidv4();

        if (!Boolean(tableList)){
            tableList =[];
        }

        if (Boolean(values?.tableid)){
            tableList  = tableList.map((t:any)=>{
                if (t.tableid === values.tableid){
                    return  {
                        ...t,
                        ...values
                    }
                }
                return t;
            })
        }else {
            tableList = [
                ...tableList,
                {tableid, ...values}
            ]
        }

        putSettings("location", [{
            key: locationData?.locationid, "value": {
                ...locationData,
                tables: tableList
            }
        }]).then((result) => {
            if (result.status === SUCCESS) {
                getInit(null, null, null, ()=>{
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
                                        <Field name="tablename" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Table Name'}
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
                                        <Field name="paxes" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Paxes'}
                                                    value={props.input.value}
                                                    inputtype={'textbox'}
                                                    autoCapitalize={true}
                                                    keyboardType='numeric'
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value)
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                    <View>
                                        <Field name="area">
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    label={'Area'}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Area"}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'dropdown'}
                                                    showlabel={false}
                                                    appbar={true}
                                                    search={false}
                                                    listtype={'other'}
                                                    list={areaList}
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
                                onPress={() => handleSubmit(values)}>{Boolean(table) ? "Update" : "Add"}</Button>
                        </View>
                    </KAccessoryView>
                </View>
            )}>
        </Form>
    </Container>
}

export default memo(withTheme(TableForm));
