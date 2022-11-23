import React, {memo, useEffect, useState} from "react";
import {ScrollView, View} from "react-native";
import {Card, withTheme} from "react-native-paper";
import {connect} from "react-redux";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required} from "../../lib/static";
import InputField from "../../components/InputField";
import {v4 as uuidv4} from "uuid";
import BottomSpace from "../../components/BottomSpace";
import {Button, Container} from "../../components";
import {getInit, isEmpty} from "../../lib/functions";
import {putSettings} from "../../lib/ServerRequest/api";
import {SUCCESS} from "../../lib/ServerRequest";
import ChartOfAccountPageList from "../../appcomponent/ChartOfAccountPageList";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const TdsForm = (props: any) => {

    let {navigation, route, chartofaccount, tdsStaticList,theme:{colors}, tdsList}: any = props;
    let {editdata} = route?.params;
    let isNew = !Boolean(editdata)

    setNavigationOptions(navigation, "Add TDS",colors, route);

    const [accountList, setAccountList] = useState([]);
    const [sectionList, setSectinList] = useState<any>([]);

    useEffect(() => {
        let data = chartofaccount.map((data: any) => {
            return {
                ...data,
                label: data?.accountname,
                value: data?.accountid
            }
        });

        setAccountList(data);

        setSectinList(Object.keys(tdsStaticList).map((k) => ({
            label: `${tdsStaticList[k].tax_specific_type} - ${tdsStaticList[k].tds_name}`, value: k
        })))

    }, [])

    let initData: any = {};

    if (Boolean(editdata)) {
        initData = {
            ...editdata,
        }
    }

    const _onSubmit = (values: any) => {
        if (!Boolean(values.tdsid)) {
            values.tdsid = uuidv4()
        }

        if (!isEmpty(tdsList)) {
            tdsList = {}
        }
        tdsList[values.tdsid] = values;
        putSettings("tds", tdsList, true).then((result) => {
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
                                            <Field name="tdssection" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'TDS Section'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select TDS Section"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        key={uuidv4()}
                                                        listtype={'other'}
                                                        list={sectionList}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="tdsname" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Tax Name'}
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
                                            <Field name="tdsrate" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Rate (%)'}
                                                        value={props.input.value}
                                                        inputtype={'textbox'}
                                                        keyboardType='numeric'
                                                        autoCapitalize={true}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="tdspayableaccount" validate={required}>
                                                {props => (
                                                    <ChartOfAccountPageList
                                                        {...props}
                                                        label={'TDS Payable Account'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select TDS Payable Account"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        type={'liability'}
                                                        subtype={'Other Current Liability'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        key={uuidv4()}
                                                        listtype={'other'}
                                                        list={accountList}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="tdsreceivableaccount" validate={required}>
                                                {props => (
                                                    <ChartOfAccountPageList
                                                        {...props}
                                                        label={'TDS Receivable Account'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select TDS Receivable Account"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        type={'assets'}
                                                        subtype={'Other Current Asset'}
                                                        key={uuidv4()}
                                                        listtype={'other'}
                                                        list={accountList}
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
                                    onPress={() => handleSubmit(values)}>{Boolean(isNew) ? "Add" : "Update"}</Button>
                            </View>
                        </KAccessoryView>

                    </View>
                )
            }}>
        </Form>
    </Container>
}
const mapStateToProps = (state: any) => ({
    tdsList: state.appApiData.settings.tds,
    tdsStaticList: state.appApiData.settings.staticdata.tdstax,
    chartofaccount: state.appApiData.settings.chartofaccount,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TdsForm)));
