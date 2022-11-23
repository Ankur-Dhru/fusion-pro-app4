import React, {Component} from 'react';
import {Linking, Platform, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Button, Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Card, Paragraph, TextInput as TI, Title, withTheme} from "react-native-paper";
import {getDefaultCurrency, getStateList, getThisYear, log} from "../../lib/functions";
import {Field, Form} from "react-final-form";

import {assignOption, defalut_payment_term, isEmail, required} from "../../lib/static";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {backButton} from "../../lib/setting";
import InputField from "../../components/InputField";
import FormLoader from "../../components/ContentLoader/FormLoader";
import KeyboardScroll from '../../components/KeyboardScroll'
import {store} from "../../App";
import {setClients, setVendors} from "../../lib/Store/actions/appApiData";
import KAccessoryView from '../../components/KAccessoryView';
import Tooltip, {STEPS, TooltipContainer} from "../../components/Spotlight/Tooltip";
import WalkThrough from "react-native-walkthrough-tooltip"
import TooltipContent from "../../components/Spotlight/TooltipContent";
import {isVisibleTooltip} from "../../lib/Store/store-service";


class AddEditClient extends Component<any> {

    refstate: any;
    title: any;
    initdata: any = {
        customertype: 'individual',
        clienttype: 0,
        status: 'active',
        firstname: '',
        lastname: '',
        company: '',
        country: '',
        paymentterm: 'date',
        clientconfig: {pricingtemplate: 'default', taxregtype: ['c']}
    }
    tempdisplayname: any;

    pricingtemplate: any = [];
    currency: any = [];
    country: any = [];
    statelist: any = [];
    paymentterms: any = [];
    taxtypelist: any = [];


    params: any;

    menuitems = [{label: 'Assets', value: 'Assets'}, {label: 'Statement', value: 'Statement'}]

    constructor(props: any) {
        super(props);
        const {route}: any = this.props;
        const {client}: any = route.params;
        this.params = route.params;

        let companyCurreny = getDefaultCurrency();

        this.refstate = React.createRef();

        this.initdata = {
            ...this.initdata,
            clienttype: this.params?.item?.vouchertypeid === '000-000-000' ? 0 : 1,
            country: props.settings.general.country,
            currency: companyCurreny.__key,
            displayname:this.params?.searchtext,
            state: props.settings.general.state, ...client
        }

        const defaultDateTime = getThisYear();
        this.state = {
            displaynames: [],
            moredetail: false,
            isLoading: !Boolean(this.initdata.clientid),
            editmode: !Boolean(client),
            filterDate: {
                enddate: defaultDateTime.enddate,
                startdate: defaultDateTime.startdate,
            }
        }

    }

    clickMenu = (menu: any) => {
        const {navigation, setAlert} = this.props;
        if (menu.value === 'Assets') {
            navigation.navigate('ListAssets', {
                menu: true,
                navigation: navigation,
                client: this.initdata
            });
        } else if (menu.value === 'Statement') {
            navigation.navigate('ListStatement', {
                menu: true,
                navigation: navigation,
                client: this.initdata
            });
        }

    }


    componentDidMount() {

        const {settings: {pricingtemplate, currency, paymentterms}, country} = this.props;

        this.getState(this.initdata.country);

        requestApi({
            method: methods.get,
            action: actions.gettaxregtype,
            loader: false,
            queryString: {country: this.initdata.country}
        }).then((result) => {
            this.taxtypelist = []
            if (!this.initdata.clientid) {
                this.initdata.clientconfig.taxregtype = []
                this.initdata.clientconfig.taxid = []
            }
            if (result.data) {
                this.taxtypelist = result.data;

                if (!this.initdata.clientid) {
                    this.taxtypelist && this.taxtypelist.map(({types}: any, index: any) => {

                        if (types) {
                            let findConsumer = Object.keys(types).find((d: any) => d === "c");

                            if (findConsumer) {
                                this.initdata.clientconfig.taxregtype[index] = findConsumer;
                            }
                        }
                    })
                }
            }

        })

        this.pricingtemplate = Object.keys(pricingtemplate).map((k) => assignOption(pricingtemplate[k].ptname, k));
        this.currency = Object.keys(currency).map((k) => assignOption(k, k));
        this.country = Object.keys(country).map((k) => assignOption(country[k].name, k));

        this.paymentterms = Object.keys(paymentterms).map((key: any) => {
            if (Boolean(paymentterms[key])) {
                return {label: paymentterms[key].termname, value: paymentterms[key].termdays}
            }
        }).filter((item: any) => {
            return Boolean(item)
        })
        this.paymentterms = [
            ...this.paymentterms,
            ...defalut_payment_term
        ]


        // const options_state = this.statelist && Object.keys(this.statelist).map((k) => assignOption(this.statelist[k].name, k))
    }

    displayName = (field?: any, value?: any) => {

        let displaynames: any = [];
        if (field) {
            this.initdata[field] = value;
        }

        /*if (Boolean(this.initdata.lastname) || Boolean(this.initdata.firstname)) {
            displaynames.push({label:this.initdata.firstname + ' ' + this.initdata.lastname,value:this.initdata.firstname + ' ' + this.initdata.lastname});
        }
        if (Boolean(this.initdata.lastname) && Boolean(this.initdata.firstname)) {
            displaynames.push({label:this.initdata.lastname + ', ' + this.initdata.firstname,value:this.initdata.lastname + ', ' + this.initdata.firstname});
        }
        if (Boolean(this.initdata.company)) {
            displaynames.push({label:this.initdata.firstname + ' ' + this.initdata.lastname +' - '+ this.initdata.company,value:this.initdata.firstname + ' ' + this.initdata.lastname +' - '+ this.initdata.company});
        }
        if (this.tempdisplayname) {
            displaynames.push({label:this.tempdisplayname,value:this.tempdisplayname});
        }*/

        if (!Boolean(this.params.client)) {
            this.initdata.displayname = this.initdata.firstname + ' ' + this.initdata.lastname;
        }

        this.setState({displaynames: displaynames})
    }

    getState = (country: any) => {

        country && getStateList(country).then((result) => {
            this.statelist = [];
            if (result.data) {
                this.statelist = Object.keys(result.data).map((k) => assignOption(result.data[k].name, k));
                this.setState({isLoading: true})
            }
        });
    }

    handleSubmit = (values: any) => {

        requestApi({
            method: Boolean(this.initdata.clientid) ? methods.put : methods.post,
            action: actions.clients,
            body: values
        }).then((result) => {
            if (result.status === SUCCESS) {

                store.dispatch(setClients(''));
                store.dispatch(setVendors(''));

                this.props.navigation.goBack();

                if (Boolean(this.params.clientSelection)) {
                    this.params.clientSelection(result.data)
                } else if (Boolean(this.params.getClients)) {
                    this.params.getClients()
                } else if (Boolean(this.params.getClientDetail)) {
                    this.params.getClientDetail()
                }
            }
        });
    }


    render() {

        const {route, navigation, theme: {colors}}: any = this.props;
        const {client}: any = route.params;

        const {displaynames, moredetail, isLoading, editmode}: any = this.state;

        let type = 'Vendor';

        if (!Boolean(this.initdata?.customertype)) {
            this.initdata.customertype = 'individual'
        }

        this.initdata.phone = this.initdata?.phone?.replace('-', '')

        if (this.initdata.clienttype === 0) {
            type = 'Client';
        }
        let title = `Add ${type}`;
        if (Boolean(client)) {
            title = `${client.displayname}`;
        }

        let isCurrencyEditable = true;
        if (Boolean(this.initdata.clientid)) {
            isCurrencyEditable = Boolean(this.initdata.creditbalance === 0) &&
                Boolean(this.initdata.invoicebalance === 0) &&
                Boolean(this.initdata.totaloutstanding === 0)
        }

        navigation.setOptions({
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            /*headerRight: (props:any) =><>
                {Boolean(client) && <View style={[styles.grid,styles.middle]}>
                    <Title  onPress={() => {this.setState({editmode:!editmode})} }>
                        <ProIcon  name={editmode?'eye':'edit'}  size={16}  />
                    </Title>
                    <Menu menulist={this.menuitems} onPress={(value:any)=>this.clickMenu(value)}>
                        <ProIcon  name={'ellipsis-v'} align={'right'}  />
                    </Menu>
                </View>}</>*/
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{title}</Title>,
            })
        }

        if (!isLoading) {
            return <FormLoader/>
        }

        navigation.setOptions({
            headerTitle: title,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
        });


        return (
            <Container>


                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{...this.initdata}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>


                            <KeyboardScroll>
                                <View>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <Field name="status">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Active'}
                                                        value={Boolean(props.input.value === 'active')}
                                                        inputtype={'switch'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value ? 'active' : 'inactive');
                                                        }}>
                                                    </InputField>
                                                )}
                                            </Field>

                                            <View>
                                                <Field name="customertype">
                                                    {props => {
                                                        return (<>
                                                            <InputField
                                                                label={'Client Type'}
                                                                divider={true}
                                                                displaytype={'bottomlist'}
                                                                inputtype={'dropdown'}
                                                                list={[{
                                                                    value: 'individual',
                                                                    label: 'Individual'
                                                                }, {value: 'company', label: 'Company'}]}
                                                                search={false}
                                                                listtype={'other'}
                                                                selectedValue={props.input.value}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        </>)
                                                    }}
                                                </Field>
                                            </View>
                                            <View>
                                                <WalkThrough
                                                    content={<TooltipContent showNext disabled={!Boolean(values.displayname)} message={`Enter ${type} Display Name`}/>}
                                                    isVisible={isVisibleTooltip(STEPS.ENTER_DISPLAY_NAME)}
                                                    arrowSize={{ width: 16, height: 16 }}
                                                >
                                                    <TooltipContainer stepOrder={STEPS.ENTER_DISPLAY_NAME}>
                                                        <Field name="displayname" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value}
                                                                    label={'Display Name'}
                                                                    returnKeyType={"next"}
                                                                    disabled={this.initdata.clientid === '1'}
                                                                    inputtype={'textbox'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </TooltipContainer>
                                                </WalkThrough>
                                            </View>
                                            <View>
                                                <Field name="email"
                                                       validate={(value) => Boolean(value) ? isEmail(value) : undefined}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Email'}
                                                            returnKeyType={"next"}
                                                            keyboardType={'email-address'}
                                                            inputtype={'textbox'}
                                                            right={<TI.Icon name={"email"}
                                                                            disabled={!Boolean(props?.input?.value)}
                                                                            onPress={() => {
                                                                                Linking.openURL(`mailto:${props.input.value}`)
                                                                            }}/>}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                            <View>
                                                <Field
                                                    name="phone"
                                                    /*validate={(value) => Boolean(value) ? minLength(10)(value) : undefined}*/>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Phone'}
                                                            returnKeyType={"next"}
                                                            keyboardType={'phone-pad'}
                                                            inputtype={'textbox'}
                                                            right={<TI.Icon name={"phone"}
                                                                            disabled={!Boolean(props?.input?.value)}
                                                                            onPress={() => {
                                                                                Linking.openURL(`tel:${props.input.value}`)
                                                                            }}/>}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>
                                            </View>

                                        </Card.Content>

                                    </Card>


                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <TouchableOpacity onPress={() => {
                                                    this.setState({moredetail: !moredetail})
                                                }} style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                    <Paragraph style={[styles.paragraph, styles.caption]}>
                                                        More Detail
                                                    </Paragraph>
                                                    <Paragraph>
                                                        <ProIcon name={!moredetail ? 'chevron-down' : 'chevron-up'}
                                                                 action_type={'text'} size={16}/>
                                                    </Paragraph>
                                                </TouchableOpacity>
                                            </View>

                                            {moredetail && <View>

                                                <View>
                                                    <View>
                                                        <Field name="firstname">
                                                            {props => (
                                                                <InputField
                                                                    value={props.input.value}
                                                                    label={'First Name'}
                                                                    inputtype={'textbox'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        this.displayName('firstname', value)
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>

                                                    </View>

                                                    <View>
                                                        <Field name="lastname">
                                                            {props => (
                                                                <InputField
                                                                    value={props.input.value}
                                                                    label={'Last Name'}
                                                                    inputtype={'textbox'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        this.displayName('lastname', value)
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>

                                                </View>

                                                <View>
                                                    <Field name="company">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'Company Name'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                    this.displayName('company', value)
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>


                                                <View>
                                                    <Field name="country">
                                                        {props => (
                                                            <>
                                                                <InputField
                                                                    label={'Country'}
                                                                    mode={'flat'}
                                                                    list={this.country || []}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        this.getState(value);
                                                                    }}>
                                                                </InputField>
                                                            </>
                                                        )}
                                                    </Field>
                                                </View>

                                                {Boolean(this.statelist?.length) && <View>
                                                    <Field name="state">
                                                        {props => (
                                                            <InputField
                                                                label={'State'}
                                                                mode={'flat'}
                                                                ref={this.refstate}
                                                                list={this.statelist || []}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>}


                                                <View>
                                                    <Field name="address1">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'Address 1'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View>
                                                    <Field name="address2">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'Address 2'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View>
                                                    <Field name="city">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
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
                                                    <Field name="pin">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'PIN'}
                                                                inputtype={'textbox'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>


                                                {
                                                    this.taxtypelist.map((taxtypes: any, index: any) => {
                                                        const {types} = taxtypes;

                                                        let typelist = Object.keys(types).map((k) => assignOption(types[k]?.name, k));

                                                        if (!Boolean(this.initdata?.clientconfig && this.initdata?.clientconfig?.taxregtype)) {
                                                            this.initdata.clientconfig = {
                                                                ...this.initdata.clientconfig,
                                                                taxregtype: [],
                                                                taxid: []
                                                            };
                                                        }

                                                        return (

                                                            <>

                                                                <View>
                                                                    <Field name={`clientconfig.taxregtype[${index}]`}>
                                                                        {props => (
                                                                            <>
                                                                                <InputField
                                                                                    label={`Tax Registration Type`}
                                                                                    mode={'flat'}
                                                                                    list={typelist}
                                                                                    value={props.input.value}
                                                                                    selectedValue={props.input.value}
                                                                                    displaytype={'bottomlist'}
                                                                                    inputtype={'dropdown'}
                                                                                    listtype={'other'}
                                                                                    onChange={(value: any) => {
                                                                                        props.input.onChange(value);
                                                                                        this.initdata.clientconfig.taxregtype[index] = value;
                                                                                        this.forceUpdate()
                                                                                    }}>
                                                                                </InputField>
                                                                            </>
                                                                        )}
                                                                    </Field>
                                                                </View>


                                                                <View>
                                                                    {
                                                                        this.initdata?.clientconfig?.taxregtype[index] &&
                                                                        types[this.initdata?.clientconfig?.taxregtype[index]]?.fields?.map(({
                                                                                                                                                name,
                                                                                                                                                required
                                                                                                                                            }: any, indexs: number) => {

                                                                            let defaultValue = this.initdata?.clientconfig?.taxid &&
                                                                                this.initdata?.clientconfig?.taxid[index] &&
                                                                                this.initdata?.clientconfig?.taxid[index][indexs];

                                                                            return (
                                                                                <View>
                                                                                    <Field
                                                                                        name={`clientconfig.taxid[${index}][${indexs}]`}
                                                                                        key={`${index}${indexs}`}>
                                                                                        {props => (
                                                                                            <InputField
                                                                                                value={'' + defaultValue ? defaultValue : ''}
                                                                                                label={`${name} ${required ? "*" : ""}`}
                                                                                                inputtype={'textbox'}
                                                                                                onChange={props.input.onChange}
                                                                                            />
                                                                                        )}
                                                                                    </Field>
                                                                                </View>)
                                                                        })
                                                                    }

                                                                </View>

                                                            </>

                                                        )
                                                    })
                                                }


                                                <View>
                                                    <Field name="paymentterm">
                                                        {props => (
                                                            <InputField
                                                                label={'Payment Term'}
                                                                mode={'flat'}
                                                                list={this.paymentterms || []}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value + '');
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>

                                                <View>
                                                    <Field name="currency">
                                                        {props => (
                                                            <InputField
                                                                label={'Currency'}
                                                                mode={'flat'}
                                                                list={this.currency}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'bottomlist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                editmode={isCurrencyEditable}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>

                                                {this.initdata.clienttype === 0 && <View>
                                                    <Field name="clientconfig.pricingtemplate">
                                                        {props => (
                                                            <InputField
                                                                label={'Pricing Template'}
                                                                mode={'flat'}
                                                                list={this.pricingtemplate}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'bottomlist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>
                                                </View>}

                                            </View>}

                                        </Card.Content>

                                    </Card>


                                </View>

                            </KeyboardScroll>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Tooltip
                                        message={`Save ${type}`}
                                        stepOrder={STEPS.ADD_CLIENT_VENDOR}
                                        delayTime={3000}
                                    >
                                        <TooltipContainer stepOrder={STEPS.ADD_CLIENT_VENDOR}>
                                            <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                                handleSubmit(values)
                                            }}>   {Boolean(client) ? 'Update' : 'Add'}  </Button>
                                        </TooltipContainer>
                                    </Tooltip>
                                </View>
                            </KAccessoryView>


                        </View>
                    )}
                >

                </Form>


            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    country: state.appApiData.settings.staticdata.country,
    language: state.appApiData.settings.staticdata.languages,
    walkthroughactiveStep: state.walkthrough?.activeStep
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddEditClient));


