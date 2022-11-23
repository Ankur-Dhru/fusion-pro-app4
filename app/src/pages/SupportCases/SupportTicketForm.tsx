import React, {Component, memo} from "react";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Button, Container} from "../../components";
import {styles} from "../../theme";
import {View} from "react-native";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Field, Form} from "react-final-form";
import {assignOption, required} from "../../lib/static";
import InputField from "../../components/InputField";
import {connect} from "react-redux";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {loginUrl, voucher} from "../../lib/setting";
import {base64Encode, isEmpty, log} from "../../lib/functions";

class SupportTicketForm extends Component<any, any> {

    constructor(props: any) {
        super(props);
        voucher.data = [];
        const {route, support_priority} = this.props;
        const priorityOption = Object.keys(support_priority).map((k) => assignOption(k, k));
        this.state = {
            initialValues: {
                category: route?.params?.key,
                product_id: route?.params?.product_id,
                priority: priorityOption[0].value
            },
            priorityOption,
        }
    }


    _onSubmit = (values: any) => {
        const {navigation, route} = this.props;

        if (!isEmpty(voucher.data.files)) {
            values.attachments = voucher.data.files
        }

        requestApi({
            method: methods.post,
            action: actions.support,
            other: {url: loginUrl},
            body: {
                ...values,
                subject: base64Encode(values?.subject),
                text: base64Encode(values?.text)
            },
            showlog: true ,
            doNotReplaceProtocol:true
        }).then((response: any) => {
            if (response.status == SUCCESS) {
                voucher.data = [];
                navigation.navigate("TicketCreated", {data: response.data, ...route.params})
            }
        })
    }

    render() {
        const {navigation, route,theme:{colors}} = this.props;
        const {initialValues, priorityOption} = this.state;

        setNavigationOptions(navigation, "Support Request",colors, route)
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
                                        <Paragraph style={[styles.caption, styles.paragraph]}>{route?.params?.header}</Paragraph>
                                        {
                                            Boolean(route?.params?.subheader) && <Paragraph>{route?.params?.subheader}</Paragraph>
                                        }

                                        <View>
                                            <View>
                                                <Field name="subject" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Subject'}
                                                            value={props.input.value}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                            description={"Brief summary of the question or issue (Max 150 characters)"}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View>
                                                <Field name="priority" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Priority'}
                                                            selectedValue={props.input.value}
                                                            selectedLabel={"Select Priority"}
                                                            displaytype={'bottomlist'}
                                                            inputtype={'dropdown'}
                                                            showlabel={false}
                                                            appbar={true}
                                                            search={false}
                                                            listtype={'other'}
                                                            list={priorityOption}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View>
                                                <Field name="text" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Description'}
                                                            value={props.input.value}
                                                            inputtype={'textarea'}
                                                            autoCapitalize={true}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                            description={"Detailed account of the question or issue (Max 2500 characters)"}
                                                        />
                                                    )}
                                                </Field>
                                            </View>


                                        </View>
                                    </Card.Content>
                                </Card>

                                <View>
                                    {<View>
                                        <InputField
                                            label={'Add Attachment'}
                                            divider={true}
                                            onChange={(value:any)=>{
                                                this.forceUpdate()
                                            }}
                                            inputtype={'attachment'}
                                            navigation={navigation}
                                            doNotReplaceProtocol={true}
                                        />
                                    </View>}
                                </View>

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
    staticProducts: state.rootAppData.static?.products,
    support_priority: state.rootAppData.static.support_priority,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(SupportTicketForm)));


