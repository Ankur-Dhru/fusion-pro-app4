import {ScrollView, View} from "react-native";
import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {Card, Text, withTheme} from "react-native-paper";
import InputField from "../../components/InputField";
import {v4 as uuidv4} from "uuid";
import {discountPlaceOption, required, roundOffOptions, taxTypes} from "../../lib/static";
import ChartOfAccountPageList from "../../appcomponent/ChartOfAccountPageList";
import KeyboardScroll from "../../components/KeyboardScroll";

const VoucherTypeAccounting = (props: any) => {
    const {navigation, route,theme:{colors}}: any = props;
    const {editData, _onSubmit} = route?.params;
    let isNew = !Boolean(editData);
    setNavigationOptions(navigation, "Accounting",colors, route);

    let initData: any = {};

    if (Boolean(editData)) {
        initData = {
            ...editData,
        }
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
                                            <Field name="defaulttaxtype">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Default Tax Type'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Default Tax Type"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        key={uuidv4()}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={Object.keys(taxTypes).map((tt: any) => ({
                                                            label: taxTypes[tt],
                                                            value: tt
                                                        }))}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>
                                        {
                                            Boolean(values.vouchertype !== "inward") ? <>
                                                <View>
                                                    <Field name="voucherroundoff">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Round Off Type'}
                                                                selectedValue={props.input.value}
                                                                selectedLabel={"Select Round Off Type"}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                showlabel={false}
                                                                key={uuidv4()}
                                                                appbar={true}
                                                                description={"Any number of digits after that number becomes zero"}
                                                                search={false}
                                                                listtype={'other'}
                                                                list={Object.keys(roundOffOptions).map((tt: any) => ({
                                                                    label: roundOffOptions[tt],
                                                                    value: tt
                                                                }))}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                {
                                                    values?.voucherroundoff !== 'disable' && <View>
                                                        <Field name="voucherroundoffaccount" validate={required}>
                                                            {props => (
                                                                <ChartOfAccountPageList
                                                                    {...props}
                                                                    type={'expense'}
                                                                    subtype={'Other Expense'}
                                                                    label={'Round Off Account'}
                                                                    selectedValue={props.input.value}
                                                                    selectedLabel={"Select Round Off Account"}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    showlabel={false}
                                                                    key={uuidv4()}
                                                                    appbar={true}
                                                                    description={"Any number of digits after that number becomes zero"}
                                                                    search={false}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>
                                                }
                                            </> : <View>
                                                <Text>Round off is not available for Inward voucher. Use Adjustment if needed.</Text>
                                            </View>
                                        }





                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="voucherinlinediscount">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Inline Discount`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>

                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="vouchertransitionaldiscount">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Transitional Discount`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>

                                        {
                                            Boolean(values?.vouchertransitionaldiscount) &&
                                            <>
                                                <View>
                                                    <Field name="defaultdiscountaccount" validate={required}>
                                                        {props => (
                                                            <ChartOfAccountPageList
                                                                {...props}
                                                                label={'Discount Account'}
                                                                selectedValue={props.input.value}
                                                                selectedLabel={"Select Discount Account"}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                showlabel={false}
                                                                key={uuidv4()}
                                                                description={"Reflect discounted amount in account"}
                                                                appbar={true}
                                                                search={false}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View>
                                                    <Field name="discountplace">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Discount Place'}
                                                                selectedValue={props.input.value}
                                                                selectedLabel={"Select Discount Place"}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                showlabel={false}
                                                                key={uuidv4()}
                                                                appbar={true}
                                                                search={false}
                                                                listtype={'other'}
                                                                list={Object.keys(discountPlaceOption).map((tt: any) => ({
                                                                    label: discountPlaceOption[tt],
                                                                    value: tt
                                                                }))}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View style={[{marginLeft: -25}]}>
                                                    <Field name="canchangediscoutnaccount">
                                                        {props => (
                                                            <CheckBox
                                                                value={props.input.value}
                                                                label={`Can Change Discount Account`}
                                                                onChange={props.input.onChange}/>
                                                        )}
                                                    </Field>
                                                </View>
                                            </>
                                        }

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
                )
            }}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(VoucherTypeAccounting)));

