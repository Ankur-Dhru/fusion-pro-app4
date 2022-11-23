import React, {Component, memo} from "react";
import {assignOption, required} from "../../lib/static";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {loginUrl} from "../../lib/setting";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Button, Container} from "../../components";
import {Field, Form} from "react-final-form";
import {View} from "react-native";
import {styles} from "../../theme";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Card, Paragraph, withTheme} from "react-native-paper";
import InputField from "../../components/InputField";
import {connect} from "react-redux";
import {OnChange} from "react-final-form-listeners";

class LoginCredential extends Component<any, any> {

    constructor(props: any) {
        super(props);
        const {route, hosting_urls} = this.props;
        const hosting_options = Object.keys(hosting_urls).map((hu) => assignOption(hosting_urls[hu].name, hu));
        this.state = {
            initialValues: {
                hosting_url: "",
                hosting_user: "",
                hosting_pass: "",
                admin_htaccess_user: "",
                admin_htaccess_pass: "",
                admin_user: "",
                admin_pass: "",
                extrainfo: "",
                hostvalue:""
            },
            hosting_options,
        }
    }


    _onSubmit = (values: any) => {
        const {navigation, route} = this.props;
        requestApi({
            method: methods.put,
            action: actions.product,
            other: {url: loginUrl},
            body: {
                login_details: values,
                product_id: route?.params?.product_id
            },
            showlog: true
        }).then((response: any) => {
            if (response.status == SUCCESS) {
                navigation.goBack();
            }
        })
    }

    render() {
        const {navigation, route, hosting_urls,theme:{colors}} = this.props;
        const {initialValues, hosting_options} = this.state;

        setNavigationOptions(navigation, "Login Credential",colors)
        return (
            <Container>
                <Form
                    onSubmit={this._onSubmit}
                    initialValues={initialValues}
                    render={({handleSubmit, submitting, values, form, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>
                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <Paragraph
                                            style={[styles.caption, styles.paragraph]}>{route?.params?.prodcut}</Paragraph>
                                        <Paragraph>{route?.params?.license_key}</Paragraph>
                                    </Card.Content>
                                </Card>
                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <Paragraph style={[styles.caption, styles.paragraph]}>Hosting</Paragraph>
                                        <View>
                                            <View>
                                                <Field name="hostvalue" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Hosting'}
                                                            selectedValue={props.input.value}
                                                            selectedLabel={"Select Hosting"}
                                                            displaytype={'bottomlist'}
                                                            inputtype={'dropdown'}
                                                            showlabel={false}
                                                            appbar={true}
                                                            search={false}
                                                            listtype={'other'}
                                                            list={hosting_options}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <OnChange name={"hostvalue"}>
                                                {(current) => {
                                                    form.change("hosting_url", hosting_urls[current]?.login_url)
                                                }}
                                            </OnChange>

                                            {
                                                Boolean(values?.hostvalue == "other") && <View>
                                                    <Field name="hosting_url">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                label={'Specify Other'}
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
                                            }


                                            <View>
                                                <Field name="hosting_user">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Hosting Username'}
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
                                                <Field name="hosting_pass">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Hosting Password'}
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
                                        </View>
                                    </Card.Content>
                                </Card>

                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <Paragraph style={[styles.caption, styles.paragraph]}>Admin First Login /
                                            Htaccess</Paragraph>
                                        <View>
                                            <View>
                                                <Field name="admin_htaccess_user">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Username'}
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
                                                <Field name="admin_htaccess_pass">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Password'}
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
                                        </View>
                                    </Card.Content>
                                </Card>

                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <Paragraph style={[styles.caption, styles.paragraph]}>Admin/Backend
                                            Login</Paragraph>
                                        <View>

                                            <View>
                                                <Field name="admin_user">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Username'}
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
                                                <Field name="admin_pass">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Password'}
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
                                                <Field name="extrainfo">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Extra notes'}
                                                            value={props.input.value}
                                                            inputtype={'textarea'}
                                                            autoCapitalize={true}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                            description={"Extra notes, like ssh port, server IP, domain registrant access or specify any other login credentials"}
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
                                    onPress={() => handleSubmit(values)}>Create</Button>
                            </View>
                        </View>
                    )}>
                </Form>

            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({
    hosting_urls: state.rootAppData.static.hosting_urls,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(LoginCredential)));
