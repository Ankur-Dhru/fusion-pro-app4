import React, {Component} from "react";
import {View} from "react-native";
import {Button} from "../../components";
import {styles} from "../../theme";
import Tooltip from "react-native-walkthrough-tooltip";
import {Card, Text} from "react-native-paper";
import InputField from "../../components/InputField";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Field, Form} from "react-final-form";
import {required} from "../../lib/static";
import KAccessoryView from "../../components/KAccessoryView";

class Index extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            activeStep: 0
        }
    }


    render() {
        const {activeStep} = this.state;
        return (
            <View style={[styles.m_3]}>

                <Button onPress={() => {
                    this.setState({activeStep: 3})
                }}>Start</Button>


                <Form
                    onSubmit={() => {
                    }}
                    initialValues={{}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>
                                <View>
                                    <Tooltip
                                        content={<Text>Step One</Text>}
                                        isVisible={Boolean(1 === activeStep)}
                                        placement={"bottom"}
                                        onClose={() => {

                                        }}
                                    >
                                        <View style={[{width: "100%"}]}>
                                            <View style={[styles.m_5]}>
                                                <Button onPress={() => {
                                                    this.setState({activeStep: 3})
                                                }}>Step One</Button>
                                            </View>
                                        </View>
                                    </Tooltip>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>

                                    <Tooltip
                                        content={<Text>Step One</Text>}
                                        isVisible={Boolean(3 === activeStep)}
                                        placement={"top"}
                                        useReactNativeModal={false}
                                        onClose={() => {

                                        }}
                                    >
                                        <View style={[{width: "100%"}]}>

                                            <Card style={[styles.card]}>
                                                <Card.Content>
                                                    <View>
                                                        <Field name="displayname" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value}
                                                                    label={'Display Tooltip'}
                                                                    returnKeyType={"next"}
                                                                    inputtype={'textbox'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>
                                                </Card.Content>
                                            </Card>
                                        </View>
                                    </Tooltip>

                                    <Tooltip
                                        content={<Text>Step One</Text>}
                                        isVisible={Boolean(2 === activeStep)}
                                        placement={"top"}
                                        useReactNativeModal={false}
                                        backgroundStyle={{
                                            position: "absolute",
                                            left: -25
                                        }}
                                        onClose={() => {

                                        }}
                                    >
                                        <View style={[{width: "100%"}]}>

                                            <Card style={[styles.card]}>
                                                <Card.Content>
                                                    <View>
                                                        <Field name="country">
                                                            {props => (
                                                                <>
                                                                    <InputField
                                                                        label={'Country'}
                                                                        mode={'flat'}
                                                                        list={[]}
                                                                        value={props.input.value}
                                                                        selectedValue={props.input.value}
                                                                        displaytype={'pagelist'}
                                                                        inputtype={'dropdown'}
                                                                        listtype={'other'}
                                                                        onChange={(value: any) => {
                                                                        }}>
                                                                    </InputField>
                                                                </>
                                                            )}
                                                        </Field>
                                                    </View>
                                                </Card.Content>
                                            </Card>
                                        </View>
                                    </Tooltip>

                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>

                                </View>
                            </KeyboardScroll>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        handleSubmit(values)
                                    }}> Add </Button>
                                </View>
                            </KAccessoryView>
                        </View>
                    )}
                >

                </Form>
            </View>
        );
    }
}

export default Index;
