import React, {Component} from "react";
import {Keyboard, Platform, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Card, Title, withTheme} from "react-native-paper";
import {errorAlert, getStateList, log} from "../../lib/functions";
import {setCompany, setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {backButton, current, voucher} from "../../lib/setting";
import {Field, Form} from "react-final-form";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import InputField from "../../components/InputField";
import {assignOption, countrylist, dateformats, months, required} from "../../lib/static";
import {v4 as uuidv4} from 'uuid';
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

class Index extends Component<any, any> {

    _captchaRef: any;
    initdata: any;
    error: boolean = false;
    errorMessage: string = "";
    update: boolean = false;

    constructor(props: any) {
        super(props);
        this._captchaRef = React.createRef();
        voucher.data.files = [];
        this.state = {
            statelist: [],
            taxtypelist: [],
        }

        this.update = props?.route?.params?.update;

        this.initdata = {
            "legalname": "",
            "country": "",
            "state": "",
            "taxregtype": [],
            "taxid": [],
            "financialfirstmonth": "",
            "date_format": "",
            "countryname": "",
        }
        if (Boolean(current?.countrycode)) {
            this.initdata.country = current.countrycode
        }

        if (this.update) {

            const {
                legalname,
                country,
                state,
                taxregtype,
                taxid,
                financialfirstmonth,
                date_format,
                countryname,
                statename,
                linklogo
            } = props?.general;


            this.initdata = {
                ...this.initdata,
                legalname,
                country,
                state,
                statename,
                taxregtype,
                financialfirstmonth,
                date_format,
                countryname
            }
            if (linklogo) {
                voucher.data.files[0] = linklogo
            }


            let newTaxID: any = [];
            if (Boolean(taxid)) {
                taxid?.forEach((t: any) => {
                    if (t) {
                        newTaxID.push([t])
                    }
                })
                this.initdata = {
                    ...this.initdata,
                    taxid: [taxid]
                }
            }
        }
        if (this?.initdata?.country) {
            this.getStateAndTaxType(this?.initdata?.country);
        }
    }

    componentDidMount() {

    }


    getStateAndTaxType(country: any, reset?: boolean) {
        let queryString = {country};
        getStateList(country).then((result) => {
            if (result.data) {
                this.setState({
                    statelist: Object.keys(result.data).map((k: any) => assignOption(result.data[k].name, k))
                })
            }
        });

        requestApi({
            method: methods.get,
            action: actions.gettaxregtype,
            queryString,
            showlog: true
        }).then((result) => {
            if (result.data) {
                this.setState({
                    taxtypelist: result.data
                })
            } else {
                this.setState({
                    taxtypelist: []
                })
            }
        })

        if (Boolean(reset)) {
            this.initdata.taxregtype = [];
            this.initdata.taxid = [];
        }

    }


    validate = (values: any) => {

        try {

            this.error = false;
            this.errorMessage = "";

            const {taxtypelist} = this.state;
            let taxes: any = []
            this.initdata.taxid.map((tax: any) => {
                tax.map((t: any) => {
                    taxes.push(t)
                })
            })

            values = {
                ...values,
                taxregtype: this.initdata.taxregtype,
                taxid: taxes,
                defaultcountry: values.country,
            }


            const {taxregtype, taxid} = values;

            let taxRegCount = taxtypelist?.length;
            let selectedTaxRegCount = taxregtype?.length;

            if (selectedTaxRegCount < taxRegCount) {
                this.addLineInMessage();
                this.errorMessage += `Please Select ${taxRegCount == 1 ? "" : "All "}Tax Registration Type`;
            }

            if (selectedTaxRegCount > 0) {
                taxregtype.forEach((key: any, index: any) => {
                    if (Boolean(key) && !Boolean(taxid[index])) {

                        taxtypelist[index]?.types[key]?.fields.map((field: any) => {
                            if (field.required) {
                                this.addLineInMessage();
                                this.errorMessage += `Please Enter ${field.name}`;
                            }
                        })
                    }
                })
            }


            this.error = Boolean(this.errorMessage)

            if (!this.error) {
                this.handleSubmit(values)
            } else {
                errorAlert(this.errorMessage);
            }
        } catch (e) {
            log('e', e)
        }

    }

    addLineInMessage = () => {
        if (Boolean(this.errorMessage)) {
            this.errorMessage += "\n";
        }
    }

    handleSubmit = (values: any) => {

        try {
            values = {
                ...values,
                linklogo: voucher?.data?.files[0]
            }
            let settings: any = []
            Object.keys(values).map((keys: any) => {
                settings.push({key: keys, value: values[keys]})
            })


            Keyboard.dismiss();

            requestApi({
                method: methods.put,
                action: actions.settings,
                body: {'settingid': 'general', 'settingdata': settings},
                showlog: true
            }).then((result) => {
                if (result.status === SUCCESS) {
                    if (!this.update) {
                        this.props.navigation.navigate('BusinessDetails', {
                            screen: 'BusinessDetails',
                        });
                    } else {
                        this.props.setSettings({
                            ...this.props.settings,
                            general: values
                        })
                    }
                }
            });
        } catch (e) {
            log('e', e)
        }


    }


    render() {

        const {navigation, dateformat, theme: {colors}} = this.props;
        const {statelist, taxtypelist}: any = this.state;

        let i = 0;

        const optionsDateFormat = dateformat?.map((k: any) => assignOption(k, k));


        this.props.navigation.setOptions({
            headerTitle: `Organization Profile`,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Organization Profile'}</Title>,
            })
        }

        return (
            <Container>

                <Form
                    onSubmit={this.validate}
                    initialValues={this.initdata}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>

                                <Card style={[styles.card]}>

                                    <Card.Content>

                                        {/*<Paragraph style={[styles.paragraph]}>Let's get started by setting up your company
                                        profile</Paragraph>*/}

                                        <View>
                                            <Field name="legalname" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Legal/Organization Name'}
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

                                    </Card.Content>
                                </Card>


                                {
                                    this.update && <View>
                                        <Card style={[styles.card]}>

                                            <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                                                <InputField
                                                    label={'Upload A New Logo'}
                                                    divider={true}
                                                    inputtype={'attachment'}
                                                    singleImage={true}
                                                    navigation={navigation}
                                                    onChange={(data: any) => {
                                                        log("PICK", data);
                                                    }}
                                                />
                                            </Card.Content>
                                        </Card>
                                    </View>
                                }

                                <Card style={[styles.card]}>

                                    <Card.Content>
                                        <View>
                                            <Field name="country" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Business Location (Country)'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={`Select Country`}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={countrylist}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                            this.getStateAndTaxType(value, true)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View>
                                            {Boolean(statelist) && <Field name="state" validate={required}>
                                                {props => (
                                                    <>
                                                        <InputField
                                                            {...props}
                                                            label={'State'}
                                                            selectedValue={props.input.value}
                                                            selectedLabel={`Select State`}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            showlabel={false}
                                                            appbar={true}
                                                            key={uuidv4()}
                                                            search={false}
                                                            listtype={'other'}
                                                            list={statelist}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </Field>}
                                        </View>


                                        <View>
                                            <Field name="financialfirstmonth" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Start of Financial Year From'}
                                                        selectedValue={props.input.value}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        selectedLabel={`Select Financial Year`}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={months}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            <Field name="date_format" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Date Format'}
                                                        selectedValue={props.input.value}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        selectedLabel={`Select Date Format`}
                                                        showlabel={false}
                                                        appbar={true}
                                                        key={uuidv4()}
                                                        search={false}
                                                        listtype={'other'}
                                                        list={dateformats}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                        <View>
                                            {
                                                (Boolean(values.country) && Boolean(taxtypelist)) &&
                                                taxtypelist.map(({name, types}: any, index: any) => {
                                                    return (
                                                        <>

                                                            <InputField
                                                                selectedValue={this.initdata.taxregtype[index]}
                                                                label={'Tax Registration Type'}
                                                                displaytype={'pagelist'}
                                                                selectedLabel={"Select Tax Registration Type"}
                                                                inputtype={'dropdown'}
                                                                showlabel={false}
                                                                appbar={true}
                                                                search={false}
                                                                key={uuidv4()}
                                                                listtype={'other'}
                                                                list={Object.keys(types).filter((k) => types[k].company).map((k) => assignOption(types[k].name, k))}
                                                                onChange={(value: any) => {
                                                                    this.initdata.taxregtype[index] = value;
                                                                    this.forceUpdate()
                                                                }}
                                                            />

                                                            {
                                                                this.initdata.taxregtype[index] &&
                                                                types[this.initdata.taxregtype[index]]?.fields?.map(
                                                                    ({name, required: req}: any, k: number) => {
                                                                        let value;

                                                                        if (this.initdata?.taxid[index] && this.initdata?.taxid[index][k]) {
                                                                            value = this.initdata?.taxid[index][k]
                                                                        }

                                                                        return <>

                                                                            <InputField
                                                                                value={value}
                                                                                label={name}
                                                                                inputtype={'textbox'}
                                                                                onChange={(value: any) => {
                                                                                    if (!Boolean(this.initdata.taxid[index])) {
                                                                                        this.initdata.taxid[index] = []
                                                                                    }
                                                                                    this.initdata.taxid[index][k] = value;
                                                                                    this.forceUpdate()
                                                                                }}
                                                                            />

                                                                        </>
                                                                    })
                                                            }
                                                        </>
                                                    )
                                                })
                                            }


                                        </View>
                                    </Card.Content>
                                </Card>


                            </KeyboardScroll>
                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        handleSubmit(values)
                                    }}>{this.update ? "Save" : "Next"}</Button>
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


const mapStateToProps = (state: any) => {
    return {
        dateformat: state.appApiData?.settings?.staticdata?.dateformats,
        general: state?.appApiData?.settings?.general,
        settings: state?.appApiData?.settings,
    }
}
const mapDispatchToProps = (dispatch: any) => ({
    setCompany: (company: any) => dispatch(setCompany(company)),
    setPreferences: (preferences: any) => dispatch(setPreferences(preferences)),
    setSettings: (settings: any) => dispatch(setSettings(settings))
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

