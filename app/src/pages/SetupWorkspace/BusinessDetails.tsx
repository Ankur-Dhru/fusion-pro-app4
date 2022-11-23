import React, {Component} from "react";
import {Keyboard, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {setCompany, setPreferences} from "../../lib/Store/actions/appApiData";
import {Field, Form} from "react-final-form";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import InputField from "../../components/InputField";
import {assignOption, required} from "../../lib/static";
import {setNavigationOptions} from "../../lib/navigation_options";
import {getInit, retrieveData} from "../../lib/functions";
import {v4 as uuidv4} from 'uuid';
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"
import {regExpJson2} from "../../lib/validation";


class Index extends Component<any> {

    initdata: any;
    error: boolean = false;
    errorMessage: string = "";
    alreadySetup: boolean = true;
    isNew: boolean = true;
    buttonLabel: string = "Next";
    industrytypes: any;

    constructor(props: any) {
        super(props);

        const {route, locations} = props;

        this.initdata = {
            "industrytype": "",
            "pin": "",
            "street1": "",
            "street2": "",
            "departments": [{type: "Other"}],
            "city": "",
        }

        this.alreadySetup = Boolean(route?.params?.alreadySetup);
        this.isNew = Boolean(route?.params?.isNew);

        if (this.alreadySetup) {
            this.buttonLabel = this.isNew ? "Save" : "Update";

            if (!this.isNew) {
                this.initdata = {
                    ...this.initdata,
                    ...route?.params?.locationData,
                }
            }
        }
    }

    componentWillMount() {
        retrieveData('fusion-pro-app').then((companydetail) => {
            this.industrytypes = companydetail.companies[companydetail.currentuser].init.staticdata.industrytypes
            this.forceUpdate()
        })
    }

    handleSubmit = (values: any) => {
        Keyboard.dismiss();

        let key = "06aa6e6d-a01b-43b5-849e-a1d84ba533ad"
        if (this.alreadySetup) {
            key = this.isNew ? uuidv4() : values?.locationid
        }

        requestApi({
            method: methods.put,
            action: actions.settings,
            body: {
                settingid: 'location',
                settingdata: [{key, "value": {...values, locationid: key}}]
            },
            showlog: false
        }).then((result) => {
            if (result.status === SUCCESS) {
                if (this.alreadySetup) {
                    getInit(null, null, null, () => {
                        if (this.isNew) {
                            this.props.navigation.goBack();
                        }
                    }, "form")
                } else {
                    this.props.navigation.navigate('CurrencyPreferences', {
                        screen: 'CurrencyPreferences',
                    });
                }
            }
        });
    }


    render() {

        const {navigation, route, theme: {colors}} = this.props;

        setNavigationOptions(navigation, "Business Details", colors, route)

        if (!Boolean(this.industrytypes)) {
            return <View></View>
        }

        const optionIndustryType = Object.keys(this.industrytypes).map((k) => assignOption(this.industrytypes[k].name, k));


        return (
            <Container>

                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={this.initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>

                                <Card style={[styles.card]}>

                                    <Card.Content>

                                        {
                                            !Boolean(this.alreadySetup) &&
                                            <Paragraph style={[styles.paragraph]}>Great! Now Setup Nature Of
                                                Business</Paragraph>
                                        }


                                        {
                                            this.alreadySetup && <View>
                                                <Field name="locationname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Location Name'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        }

                                        <View>
                                            <Field name="industrytype" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Industry'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Industry"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={optionIndustryType}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        {
                                            this.alreadySetup && <View>
                                                <Field name="ownership" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Ownership'}
                                                            selectedValue={props.input.value}
                                                            selectedLabel={"Select Ownership"}
                                                            displaytype={'bottomlist'}
                                                            inputtype={'dropdown'}
                                                            showlabel={false}
                                                            appbar={true}
                                                            search={false}
                                                            listtype={'other'}
                                                            list={[
                                                                {label: "Own", value: "own"},
                                                                {label: "Franchise", value: "franchise"}
                                                            ]}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        }


                                        <View>
                                            <Field name="street1" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Street 1'}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="street2">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Street 2'}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="city" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'City'}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            <Field name="pin" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        value={props.input.value + ""}
                                                        label={'Zip/Postal Code'}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            if (regExpJson2.alphaNumericSpace.test(value)) {
                                                                props.input.onChange(value);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        {
                                            this.alreadySetup && <View>
                                                <Field name="mobile">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Mobile'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="latitude">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Latitude'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>

                                                <Field name="longitude">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Longitude'}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        }

                                    </Card.Content>
                                </Card>


                            </KeyboardScroll>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        handleSubmit(values)
                                    }}>{this.buttonLabel}</Button>
                                </View>
                            </KAccessoryView>


                        </View>
                    )}
                >

                </Form>

            </Container>
        );
    }
}


const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = (dispatch: any) => ({
    setCompany: (company: any) => dispatch(setCompany(company)),
    setPreferences: (preferences: any) => dispatch(setPreferences(preferences)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

