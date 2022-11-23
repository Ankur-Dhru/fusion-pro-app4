import {View} from "react-native";
import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {isEmail, onlyDigitOneDecimal, required, unitTypes} from "../../lib/static";
import InputField from "../../components/InputField";
import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {v4 as uuidv4} from "uuid";
import {Card, withTheme} from "react-native-paper";
import {putSettings} from "../../lib/ServerRequest/api";
import {SUCCESS} from "../../lib/ServerRequest";
import {clone, getInit, log} from "../../lib/functions";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const UnitForm = (props: any) => {
    const {navigation, route, unitsStatic, unitList, theme: {colors}}: any = props;
    const {unit} = route?.params;
    let isNew = !Boolean(unit);
    let lastUnitType: any = undefined, lastUnitCode: any = undefined;
    let unitCodeList: any = [], relatedUnitCodeList: any = [];
    setNavigationOptions(navigation, "Add Unit", colors, route);

    let initData: any = {};

    if (Boolean(unit)) {
        initData = {
            ...unit
        }
    }

    const changeToAllNumeric = (unitsList: any, unitcode: any, relatedunit: any, isdecimal: boolean = false) => {
        Object.keys(unitsList).forEach((unitKey: any) => {
            let currentUnit = unitsList[unitKey];
            if (isdecimal !== currentUnit.isdecimal) {
                if (unitcode && currentUnit?.relatedunit && unitcode === currentUnit?.relatedunit) {
                    unitsList[unitKey].isdecimal = Boolean(isdecimal);
                    unitsList = changeToAllNumeric(unitsList, currentUnit?.unitcode, currentUnit?.relatedunit, isdecimal)
                }
                if (relatedunit && currentUnit?.unitcode && relatedunit === currentUnit?.unitcode) {
                    unitsList[unitKey].isdecimal = Boolean(isdecimal);
                    unitsList = changeToAllNumeric(unitsList, currentUnit?.unitcode, currentUnit?.relatedunit, isdecimal)
                }
            }
        })
        return unitsList;
    }

    const _onSubmit = (values: any) => {
        if (!Boolean(values?.unitid)) {
            values.unitid = uuidv4();
        }
        let newUnitList = clone(unitList);

        newUnitList[values.unitid] = values;

        newUnitList = changeToAllNumeric(newUnitList, values?.unitcode, values?.relatedunit, values?.isdecimal);


        putSettings("unit", newUnitList, true).then((result) => {
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
            render={({handleSubmit, submitting, values, form, ...more}: any) => {


                if (Boolean(values?.unittype) && Boolean(lastUnitType !== values?.unittype)) {
                    lastUnitType = values?.unittype;
                    unitCodeList = Object.keys(unitsStatic)
                        .filter((unit: any) => unitsStatic[unit]?.type === values?.unittype)
                        .map((unit: any) => {
                            let label = unit;
                            if (unitsStatic[unit]?.name) {
                                label += ` (${unitsStatic[unit].name})`
                            }
                            return {label, value: unit}
                        })
                }

                if (Boolean(values?.unitcode) && Boolean(lastUnitCode !== values?.unitcode)) {
                    lastUnitCode = values?.unitcode;
                    relatedUnitCodeList = Object.keys(unitsStatic)
                        .filter((unit: any) => unitsStatic[unit]?.type === values?.unittype && values?.unitcode !== unit)
                        .map((unit: any) => {
                            let label = unit;
                            if (unitsStatic[unit]?.name) {
                                label += ` (${unitsStatic[unit].name})`
                            }
                            return {label, value: unit}
                        })
                }

                return (
                    <View style={[styles.pageContent]}>
                        <KeyboardScroll>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>

                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="default">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Default`}
                                                        onChange={props.input.onChange}/>
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="unitname" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Unit Name'}
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
                                            <Field name="unittype" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Unit Type'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Unit Type"}
                                                        displaytype={'bottomlist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={unitTypes.map((type: any) => ({
                                                            label: type,
                                                            value: type
                                                        }))}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                            form.change("unitcode", "");
                                                            form.change("relatedunit", "");
                                                            unitCodeList = [];
                                                            relatedUnitCodeList = [];
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="unitcode" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Unit Code'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Unit Code"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        key={uuidv4()}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={unitCodeList}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="relatedunit">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Related Unit'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Related Unit"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        key={uuidv4()}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={relatedUnitCodeList}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        {
                                            Boolean(values?.relatedunit) && <View>
                                                <Field name="unitrate" validate={(value) => Boolean(value) ? onlyDigitOneDecimal(value) : undefined}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Unit Rate'}
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
                                        }

                                        <View style={[{marginLeft: -25}]}>
                                            <Field name="isdecimal">
                                                {props => (
                                                    <CheckBox
                                                        value={props.input.value}
                                                        label={`Treat as Decimal`}
                                                        onChange={props.input.onChange}/>
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
                                    onPress={() => handleSubmit(values)}>{Boolean(isNew) ? "Save" : "Update"}</Button>
                            </View>
                        </KAccessoryView>

                    </View>
                )
            }}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
    unitsStatic: state.appApiData.settings.staticdata.units,
    unitList: state?.appApiData.settings.unit
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(UnitForm)));

