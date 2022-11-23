import {ScrollView, View} from "react-native";
import React, {memo} from "react";
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
import {clone, isEmpty, log} from "../../lib/functions";
import KeyboardScroll from "../../components/KeyboardScroll";

const IntraStateTax = (props: any) => {
    let {navigation, route,theme:{colors}}: any = props;
    let {intraData, form, options_tax, stateList, stateTaxData} = route?.params;
    let isNew = !Boolean(intraData);

    setNavigationOptions(navigation, "Add Intra State Tax",colors, route);



    let initData: any = {};

    if (Boolean(intraData)) {
        initData = {
            ...intraData,
        }
    }


    const _onSubmit = ({key, ...values}: any) => {
        if (!key){
            key = uuidv4();
        }
        if (isEmpty(stateTaxData)){
            stateTaxData={};
        }

        if (!stateList[key]){
            stateTaxData[key]={};
        }
        stateTaxData[key]=values;

        form.change("statetax", clone(stateTaxData));
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
                                            <Field name="state" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'State'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select State"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        key={uuidv4()}
                                                        listtype={'other'}
                                                        list={Object.keys(stateList).map((s:any)=>({label:stateList[s].name, value:s}))}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="taxgroupid" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Tax Group'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Tax Group"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        key={uuidv4()}
                                                        listtype={'other'}
                                                        list={options_tax}
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

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(IntraStateTax)));

