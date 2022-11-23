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

const TcsForm = (props: any) => {

    let {navigation, route, chartofaccount, tcsStaticList, tcsList,theme:{colors}}: any = props;
    let {editdata} = route?.params;
    let isNew = !Boolean(editdata)

    setNavigationOptions(navigation, "Add TCS",colors, route);

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

        setSectinList(Object.keys(tcsStaticList).map((k) => ({
            label: `${tcsStaticList[k].tax_specific_type_formatted} - ${tcsStaticList[k].tcs_name}`, value: k
        })))

    }, [])

    let initData: any = {};

    if (Boolean(editdata)) {
        initData = {
            ...editdata,
        }
    }

    const _onSubmit = (values: any) => {
        if (!Boolean(values.tcsid)) {
            values.tcsid = uuidv4()
        }

        if (!isEmpty(tcsList)) {
            tcsList = {}
        }
        tcsList[values.tcsid] = values;
        putSettings("tcs", tcsList, true).then((result) => {
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
                                            <Field name="tcssection" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Nature of Collection'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Nature of Collection"}
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
                                            <Field name="tcsname" validate={required}>
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
                                            <Field name="tcsrate" validate={required}>
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
                                            <Field name="tcspayableaccount" validate={required}>
                                                {props => (
                                                    <ChartOfAccountPageList
                                                        {...props}
                                                        label={'TCS Payable Account'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select TCS Payable Account"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        type={'liability'}
                                                        subtype={'Other Current Liability'}
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
                                            <Field name="tcsreceivableaccount" validate={required}>
                                                {props => (
                                                    <ChartOfAccountPageList
                                                        {...props}
                                                        label={'TCS Receivable Account'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select TCS Receivable Account"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        type={'assets'}
                                                        subtype={'Other Current Asset'}
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
    tcsList: state.appApiData.settings.tcs,
    tcsStaticList: state.appApiData.settings.staticdata.tcstax,
    chartofaccount: state.appApiData.settings.chartofaccount,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TcsForm)));
