import React, {memo} from "react";
import {ScrollView, View} from "react-native";
import {Card, TextInput as TI, withTheme} from "react-native-paper";
import {connect} from "react-redux";
import {Button, CheckBox, Container} from "../../components";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required, taskReminderListButton} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {putSettings} from "../../lib/ServerRequest/api";
import {getInit} from "../../lib/functions";
import {setNavigationOptions} from "../../lib/navigation_options";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const Index = (props: any) => {
    const {settingautomation, navigation,theme:{colors}} = props;

    const timeOptions = taskReminderListButton.map((opt:any)=>({label:opt,value:opt}))

    setNavigationOptions(navigation, "Automation",colors);

    const _onSubmit = (values: any) => {

        putSettings("settingautomation", values, true).then(() => {
            getInit(null, null, null, () => {
            }, "form", true)
        })

    }

    return <Container>

        <Form
            onSubmit={_onSubmit}
            initialValues={{
                ...settingautomation
            }}
            render={({handleSubmit, submitting, values, ...more}: any) => (
                <View style={[styles.pageContent]}>
                    <KeyboardScroll>
                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View>
                                    <Field name={"lowstockalert"}>
                                        {props => (<View style={{marginLeft: -25}}><CheckBox
                                            value={props.input.value}
                                            label={"Low Stock Alert"}
                                            onChange={(value: any) => {
                                                props.input.onChange(value);
                                            }}/></View>)}
                                    </Field>
                                    <View>
                                        <Field name="autoticketclosed" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value + ''}
                                                    label={'Auto Ticket Closed'}
                                                    inputtype={'textbox'}
                                                    keyboardType='numeric'
                                                    right={<TI.Affix text={'Days'}/>}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                    <View>
                                        <Field name="licenseexpirefirstreminder" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value + ''}
                                                    label={'License Expire First Reminder'}
                                                    inputtype={'textbox'}
                                                    keyboardType='numeric'
                                                    right={<TI.Affix text={'Days'}/>}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                    <View>
                                        <Field name="licenseexpiresecondreminder" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value + ''}
                                                    label={'License Expire Second Reminder'}
                                                    inputtype={'textbox'}
                                                    keyboardType='numeric'
                                                    right={<TI.Affix text={'Days'}/>}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                    <View>
                                        <Field name="licenseexpirethirdreminder" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value + ''}
                                                    label={'License Expire Third Reminder'}
                                                    inputtype={'textbox'}
                                                    keyboardType='numeric'
                                                    right={<TI.Affix text={'Days'}/>}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                    <View>
                                        <Field name="taskreminderbeforedue" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value + ''}
                                                    label={'Task Reminder Before Due'}
                                                    inputtype={'textbox'}
                                                    keyboardType='numeric'
                                                    right={<TI.Affix text={values?.taskreminderbeforedueperiod}/>}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                    <View>
                                        <View>
                                            <Field name="taskreminderbeforedueperiod" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Task Reminder Before Due Time'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Task Reminder Before Due Time"}
                                                        displaytype={'bottomlist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={timeOptions}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>
                                    </View>
                                    <View>
                                        <Field name="taskreminderafterdue" validate={required}>
                                            {props => (
                                                <InputField
                                                    {...props}
                                                    value={props.input.value + ''}
                                                    label={'Task Reminder After Due'}
                                                    inputtype={'textbox'}
                                                    keyboardType='numeric'
                                                    right={<TI.Affix text={values?.taskreminderafterdueperiod}/>}
                                                    onChange={props.input.onChange}
                                                />
                                            )}
                                        </Field>
                                    </View>
                                    <View>
                                        <View>
                                            <Field name="taskreminderafterdueperiod" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Task Reminder After Due Time'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Task Reminder After Due Time"}
                                                        displaytype={'bottomlist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={timeOptions}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </KeyboardScroll>
                    <KAccessoryView>
                        <View style={[styles.submitbutton]}>
                            <Button
                                disable={more.invalid} secondbutton={more.invalid}
                                onPress={() => handleSubmit(values)}>Save</Button>
                        </View>
                    </KAccessoryView>

                </View>
            )}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
    settingautomation: state?.appApiData.settings.settingautomation
})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));
