import {ScrollView, View} from "react-native";
import React, {memo, useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {Button, Container} from "../../components";
import {connect} from "react-redux";
import {Card, withTheme} from "react-native-paper";
import {v4 as uuidv4} from "uuid";
import ChartOfAccountPageList from "../../appcomponent/ChartOfAccountPageList";
import {isEmpty} from "../../lib/functions";
import KeyboardScroll from "../../components/KeyboardScroll";

const TaxesForm = (props: any) => {
    let {navigation, route, chartofaccount,theme:{colors}}: any = props;
    let {taxdata, form, taxTypes, allTax} = route?.params;
    const [accountList, setAccountList] = useState([])
    let isNew = !Boolean(taxdata);

    useEffect(() => {
        let data = chartofaccount.map((data: any) => {
            return {
                ...data,
                label: data?.accountname,
                value: data?.accountid
            }
        });

        setAccountList(data)

    }, [])


    setNavigationOptions(navigation, "Add tax",colors, route);

    let initData: any = {};

    if (Boolean(taxdata)) {
        initData = {
            ...taxdata,
            taxpercentage : taxdata.taxpercentage.toString()
        }
    }


    const _onSubmit = (values: any) => {
        if (isEmpty(allTax)){
            allTax=[];
        }
        if (!Boolean(values?.taxid)){
            values.taxid =uuidv4();
            allTax=[
                ...allTax,
                {...values}
            ]
        }else {
            allTax = allTax?.map((d:any)=>{
                if (d.taxid === values.taxid){
                    return {...d, ...values}
                }
                return d;
            })
        }

        form.change("taxes", allTax);
        navigation.goBack();
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
                                            <Field name="taxname" validate={required}>
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
                                            <Field name="taxpercentage" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Tax Percentage'}
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
                                            <Field name="taxtype" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Tax Type'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Tax Type"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={Object.keys(taxTypes).map((t: any) => ({
                                                            label: taxTypes[t],
                                                            value: t
                                                        }))}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="accountinward" validate={required}>
                                                {props => (
                                                    <ChartOfAccountPageList
                                                        {...props}
                                                        label={'Account Inward'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Account Inward"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
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
                                            <Field name="accountoutward" validate={required}>
                                                {props => (
                                                    <ChartOfAccountPageList
                                                        {...props}
                                                        label={'Account Outward'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Account Outward"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
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
    chartofaccount: state.appApiData.settings.chartofaccount,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TaxesForm)));

