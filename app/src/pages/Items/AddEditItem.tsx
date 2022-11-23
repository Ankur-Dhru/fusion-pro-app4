import React, {Component} from 'react';
import {Platform, TouchableOpacity, View,} from 'react-native';
import {styles} from "../../theme";

import {Button, CheckBox, Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Card, Divider, Paragraph, TextInput as TI, Title, withTheme,} from "react-native-paper";
import {findObject, getCurrencySign, log, updateComponent} from "../../lib/functions";
import {Field, Form} from "react-final-form";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {
    assignOption,
    composeValidators,
    inventoryOption,
    mustBeNumber,
    options_itc,
    pricing,
    required
} from "../../lib/static";
import {setAlert, setModal} from "../../lib/Store/actions/components";
import {backButton, nav, voucher} from "../../lib/setting";
import FormLoader from "../../components/ContentLoader/FormLoader";
import InputField from '../../components/InputField';
import {v4 as uuidv4} from "uuid";
import KeyboardScroll from "../../components/KeyboardScroll";
import {store} from "../../App";
import {setItems} from "../../lib/Store/actions/appApiData";
import KAccessoryView from '../../components/KAccessoryView';
import {isVisibleTooltip, setActiveStepNumber} from "../../lib/Store/store-service";

import WalkThrough from "react-native-walkthrough-tooltip"
import TooltipContent from "../../components/Spotlight/TooltipContent";
import Tooltip, {STEPS, TooltipContainer} from '../../components/Spotlight/Tooltip';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

class AddEdititem extends Component<any> {

    title: any = 'Add Item';
    advanceRef: any;
    isShow: any = false;

    initdata: any = {
        allowmultipleorders: "1",
        defaultitc: "",
        inventoryaccount: 45,
        inventorytype: "fifo",
        inwardaccount: 63,
        isaddon: 0,
        pricing: pricing,
        itemconfig: [],
        itemdepartmentid: '',
        itemgroupid: "5f2dd580-eae2-46a4-b136-bc5c3cb180c6",
        itemhsncode: '',
        itemname: "",
        itemstatus: "active",
        itemtaxgroupid: "9da54644-3581-45a3-ae2f-dbdc72a4af3a",
        itemtype: "product",
        itemunit: "9c2ecc81-d201-4353-8fbc-7b9d61e0afb4",
        longinfo: "",
        notifyqntreorder: "1",
        openingunit: "",
        outwardaccount: 13,
        preventstock: "1",
        pricingtype: "onetime",
        privatekey: "",
        publickey: "",
        retail: "1",
        retailconfig: "",
        salesunit: "9c2ecc81-d201-4353-8fbc-7b9d61e0afb4",
        sellingcost: '',
        mrp:'',
        shortinfo: "",
        trackinventory: '1',
        identificationtype: 'auto',
        warrantyperiod: "day",
        warrantytoclient: false,
    }

    params: any;

    isTypeProduct: any;
    isTypeService: any;
    isTypeLicensing: any;
    error = false;
    errorMessage = "";
    onlyForRegistered: any;
    onlyForIndia: any;
    itemTypeConfig: any;

    option_salesunit: any = [];
    scrollRef: any
    fromSpotlight: boolean = false;
    defaultitemgroup:any = ''

    constructor(props: any) {
        super(props);
        this.state = {showitems: false,};

        const {route, itemtypes, itemgroups}: any = this.props;
        const {item}: any = route.params;

        this.params = route.params;

        if (Boolean(item.itemid)) {
            this.title = `${item.itemname}`;
            this.initdata = {...this.initdata, ...item}
        }

        this.state = {isLoading: !Boolean(item.itemid), itemgroups: itemgroups}

        this.isTypeProduct = this.initdata.itemtype === 'product';
        this.isTypeService = this.initdata.itemtype === 'service';
        this.isTypeLicensing = this.initdata.itemtype === 'licensing';
        this.itemTypeConfig = itemtypes[this.initdata.itemtype] && itemtypes[this.initdata.itemtype].config;

        const option_itemgroups = Object.keys(itemgroups).map((k) => assignOption(itemgroups[k].itemgroupname, k));

        if(Boolean(option_itemgroups) && Boolean(option_itemgroups[0])) {
            this.initdata.itemgroupid = option_itemgroups[0]?.value;
        }

        this.advanceRef = React.createRef()
        this.scrollRef = React.createRef<KeyboardAwareScrollView>();
        this.fromSpotlight = Boolean(voucher?.type?.fromSpotlight);

        this.initdata.itemname = Boolean(this.params.searchtext)?this.params.searchtext:'';

    }

    handleSubmit = (values: any) => {

        values.trackinventory = Boolean(values.trackinventory) ? 1 : 0

        requestApi({
            method: Boolean(this.initdata.itemid) ? methods.put : methods.post,
            action: actions.items,
            body: values
        }).then((result) => {

            if (result.status === SUCCESS) {
                this.props.navigation.goBack()
                if (Boolean(this.params.getItemDetails)) {
                    this.params.getItemDetails(result.data)
                } else if (Boolean(this.params.getItems)) {
                    store.dispatch(setItems(''));
                    this.params.getItems()
                }


            }
        });
    }

    componentWillMount() {
        if (Boolean(this.params.item.itemid)) {
            this.getItemDetails().then(() => {
                this.setState({isLoading: true})
            });
        }
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {

    }

    getItemDetails = async () => {
        const {itemtypes}: any = this.props;
        await requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {itemid: this.params.item.itemid},
            loader: false,
            loadertype: 'form'
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.initdata = {...this.initdata, ...result.data}
                this.isTypeProduct = this.initdata.itemtype === 'product';
                this.isTypeService = this.initdata.itemtype === 'service';
                this.isTypeLicensing = this.initdata.itemtype === 'licensing';
                this.itemTypeConfig = itemtypes[this.initdata.itemtype] && itemtypes[this.initdata.itemtype].config;
                this.initdata.trackinventory = Boolean(this.initdata.trackinventory === '1');
            }
        });
    }

    addGroup = () => {
        const {setModal}: any = this.props
        setModal({visible: false})
        nav.navigation.navigate('AddEditCategory');
    }

    saveGroup = (data: any, key: any) => {
        const {itemgroups}: any = this.state;
        this.initdata = {
            ...this.initdata,
            itemgroupid: key
        }
        this.setState({itemgroups: {...itemgroups, ...data}})
    }

    render() {


        const {route, navigation, walkthroughactiveStep,settings,companydetails}: any = this.props;
        const {currentuser, companies} = companydetails;

        const {colors}: any = this.props.theme;

        const {showitems, isLoading, itemgroups}: any = this.state;

        const {
            itemtypes,
            unit,
            tax,
            general,
            chartofaccount,
        } = this.props;

        const options_itemtypes = Object.keys(itemtypes).filter((k: any) => {
            return k === 'product' || k === 'licensing' || k === "service"
        }).map((k) => assignOption(itemtypes[k].description, k, '', '', (k === 'product' || k === 'licensing' || k === "service") ? false : true));
        const option_inventory = Object.keys(inventoryOption).filter((k: any) => {
            return k === 'specificidentification' || k === 'fifo'
        }).map((k) => assignOption(inventoryOption[k].name, k, '', '', inventoryOption[k].disabled));
        const option_itemgroups = Object.keys(itemgroups).map((k) => assignOption(itemgroups[k].itemgroupname, k));

        const option_units = Object.keys(unit).map((k) => assignOption(`${unit[k].unitname} (${unit[k].unitcode})`, k));




        const option_taxes = tax && Object.values(tax).map((t: any) => assignOption(t.taxgroupname, t.taxgroupid));
        let defaultTax:any = Object.values(tax).filter((t:any)=>{
            return t.defaulttax
        })
        this.initdata.itemtaxgroupid =  defaultTax[0]?.taxgroupid || option_taxes[0].value;


        if (Boolean(this.initdata.itemunit)) {
            let unittype = unit[this.initdata.itemunit] && unit[this.initdata.itemunit].unittype;
            this.option_salesunit = Object.values(unit)
                .filter((a: any) => Boolean(a) && a.unittype === unittype)
                .map((a: any) => assignOption(`${a.unitname} (${a.unitcode})`, a.unitid))
        }

        this.onlyForRegistered = false, this.onlyForIndia = general.country === 'IN';
        if (general?.taxregtype[0] === "grr" || general?.taxregtype[0] === "grc") {
            this.onlyForRegistered = true;
        }

        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{this.title}</Title>,
            })
        }

        if (!isLoading) {
            return <FormLoader/>
        }

        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerTitle: this.title,
        });

        nav.saveGroup = this.saveGroup;

        let trackInventoryMessage = "Select Stock Valuation Method Specific" +
            " Identification For Serial Item Or FIFO";

        if (voucher?.type?.spotkey === "fifo") {
            trackInventoryMessage = "Select FIFO Valuation Method"
        }else if (voucher?.type?.spotkey === "specificidentification"){
            trackInventoryMessage = "Select Specific Identification Valuation Method"
        }

        const locationid = companydetails.companies[currentuser].locationid;
        const isRetailIndustry = settings.location[locationid].industrytype === 'retail';


        return (
            <Container>

                {/*<AppBar  back={true} isModal={false} title={this.title} navigation={navigation}>

                </AppBar>*/}


                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{...this.initdata}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <KeyboardScroll
                                scrollEnabled={true}
                                scrollRef={this.scrollRef}
                                onScroll={(props: any) => {

                                    let step = walkthroughactiveStep === STEPS.SELECT_TAX_RATE;
                                    if (this.onlyForRegistered) {
                                        step = walkthroughactiveStep === STEPS.SELECT_ITC
                                    }
                                    if (walkthroughactiveStep === STEPS.ENTER_SELLING_PRICE || step) {
                                        setActiveStepNumber();
                                    }
                                }}>
                                <View>
                                    <View>
                                        <View>
                                            <Card style={[styles.card]}>
                                                <Card.Content style={{paddingBottom: 0}}>
                                                    <Paragraph style={[styles.paragraph, styles.caption]}>
                                                        Basic
                                                    </Paragraph>

                                                    <View>
                                                        <Field name="itemtype">
                                                            {props => (
                                                                <InputField
                                                                    label={'Item Type'}
                                                                    mode={'flat'}
                                                                    list={options_itemtypes}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);

                                                                        this.isTypeProduct = value === 'product'
                                                                        this.isTypeService = value === 'service'
                                                                        this.isTypeLicensing = value === 'licensing'

                                                                        if (this.isTypeProduct) {
                                                                            if (!Boolean(values.inventoryaccount)) {
                                                                                const defaultInward = findObject(chartofaccount, "accountname", "Inventory Asset");
                                                                                values.inventoryaccount = defaultInward.accountid;
                                                                            }
                                                                        }
                                                                        this.itemTypeConfig = itemtypes[value] && itemtypes[value].config;


                                                                    }}>
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>


                                                    <View>
                                                        <WalkThrough
                                                            arrowSize={{width: 16, height: 16}}
                                                            content={<TooltipContent showNext
                                                                                     nextNumber={this.onlyForIndia ? STEPS.ENTER_HSN_CODE : STEPS.ENTER_SELLING_PRICE}
                                                                                     disabled={!Boolean(values.itemname)}
                                                                                     message={"Enter Product Or" +
                                                                                         " Service Name"}/>}
                                                            isVisible={isVisibleTooltip(STEPS.ENTER_PRODUCT_NAME)}
                                                        >
                                                            <TooltipContainer stepOrder={STEPS.ENTER_PRODUCT_NAME}>
                                                                <Field name="itemname" validate={required}>
                                                                    {props => (
                                                                        <InputField
                                                                            {...props}
                                                                            value={props.input.value}
                                                                            label={'Name'}
                                                                            inputtype={'textbox'}
                                                                            onChange={props.input.onChange}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </TooltipContainer>
                                                        </WalkThrough>
                                                    </View>

                                                    <Field name="otherlanguagename">
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'Other Language Name'}
                                                                inputtype={'textbox'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>

                                                    <Field name="itemgroupid">
                                                        {props => (
                                                            <><InputField
                                                                label={'Category'}
                                                                mode={'flat'}
                                                                key={uuidv4()}
                                                                list={option_itemgroups}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                addItem={<TouchableOpacity
                                                                    onPress={() => this.addGroup()}><Title
                                                                    style={[styles.px_6]}><ProIcon
                                                                    name={'plus'}/></Title></TouchableOpacity>}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}>
                                                            </InputField></>
                                                        )}
                                                    </Field>


                                                    {this.onlyForIndia &&
                                                        <WalkThrough
                                                            arrowSize={{width: 16, height: 16}}
                                                            content={<TooltipContent showNext
                                                                                     disabled={!Boolean(values.itemhsncode)}
                                                                                     message={"Enter Product HSN" +
                                                                                         " Code"}/>}
                                                            isVisible={isVisibleTooltip(STEPS.ENTER_HSN_CODE)}
                                                        >
                                                            <TooltipContainer stepOrder={STEPS.ENTER_HSN_CODE}>
                                                                <Field name="itemhsncode"
                                                                       validate={this.onlyForRegistered ? composeValidators(required, mustBeNumber) : undefined}>
                                                                    {props => (
                                                                        <InputField
                                                                            {...props}
                                                                            value={props.input.value}
                                                                            keyboardType='numeric'
                                                                            label={`${this.isTypeService ? "SAC" : "HSN"} Code `}
                                                                            onChange={props.input.onChange}
                                                                            inputtype={'textbox'}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </TooltipContainer>
                                                        </WalkThrough>

                                                    }

                                                    {
                                                        Array.isArray(this.itemTypeConfig) && this.itemTypeConfig.map((configObject: any, index: any) => {
                                                            if (!Boolean(this.initdata.itemconfig)) {
                                                                this.initdata.itemconfig = []
                                                            }
                                                            if (!Boolean(this.initdata.itemconfig[index])) {
                                                                this.initdata.itemconfig[index] = {value: ''}
                                                            }
                                                            const {
                                                                type,
                                                                name,
                                                                options,
                                                                description,
                                                                required: req
                                                            } = configObject;

                                                            return <View key={index}>
                                                                {
                                                                    type && <>
                                                                        {
                                                                            (type === "text" || type === "password" || type === "textarea") &&
                                                                            <Field name={name}
                                                                                   validate={req ? required : undefined}>
                                                                                {props => (
                                                                                    <><InputField
                                                                                        {...props}
                                                                                        value={this.initdata.itemconfig[index].value}
                                                                                        label={name}
                                                                                        inputtype={'textbox'}
                                                                                        secureTextEntry={type === "password"}
                                                                                        multiline={type === "textarea"}
                                                                                        onChange={(value: any) => {
                                                                                            props.input.onChange(value);
                                                                                            this.initdata.itemconfig[index].value = value
                                                                                        }}
                                                                                    />
                                                                                        <Paragraph
                                                                                            style={[styles.paragraph, styles.text_xs]}>{description}</Paragraph>
                                                                                    </>
                                                                                )}
                                                                            </Field>
                                                                        }

                                                                        {
                                                                            type === "dropdown" &&
                                                                            <Field name={name}
                                                                                   validate={req ? required : undefined}>
                                                                                {props => (
                                                                                    <>
                                                                                        <InputField
                                                                                            {...props}
                                                                                            label={name}
                                                                                            mode={'flat'}
                                                                                            list={Object.values(options).map((t: any) => assignOption(t, t))}
                                                                                            value={this.initdata.itemconfig[index].value}
                                                                                            selectedValue={props.input.value}
                                                                                            displaytype={'pagelist'}
                                                                                            inputtype={'dropdown'}
                                                                                            listtype={'other'}
                                                                                            onChange={(value: any) => {
                                                                                                props.input.onChange(value);
                                                                                                this.initdata.itemconfig[index].value = value
                                                                                            }}>
                                                                                        </InputField>
                                                                                        <Paragraph
                                                                                            style={[styles.paragraph, styles.text_xs]}>{description}</Paragraph>
                                                                                    </>

                                                                                )}
                                                                            </Field>
                                                                        }

                                                                        {
                                                                            type === 'checkbox' && <Field name={name}>
                                                                                {props => (
                                                                                    <><CheckBox
                                                                                        value={Boolean(this.initdata.itemconfig[index].value)}
                                                                                        label={name} onChange={(value: any) => {
                                                                                        values.itemconfig[index].value = value;
                                                                                    }}/>
                                                                                    </>
                                                                                )}
                                                                            </Field>
                                                                        }
                                                                    </>
                                                                }
                                                            </View>

                                                        })
                                                    }


                                                    {this.onlyForIndia && this.isTypeProduct && isRetailIndustry && <View>
                                                        <Field name="mrp" validate={composeValidators(mustBeNumber)}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value}
                                                                    label={'MRP'}
                                                                    keyboardType='numeric'
                                                                    inputtype={'textbox'}
                                                                    left={<TI.Affix text={getCurrencySign()}/>}
                                                                    onChange={props.input.onChange}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>}

                                                    <View>
                                                        <WalkThrough
                                                            arrowSize={{width: 16, height: 16}}
                                                            content={<TooltipContent showNext
                                                                                     onNexPress={() => {
                                                                                         this.scrollRef.current.scrollToPosition(0, 400, false);
                                                                                     }}
                                                                                     disabled={!Boolean(values?.pricing?.price?.default[0]?.onetime?.baseprice)}
                                                                                     message={"Enter Selling Price"}/>}
                                                            isVisible={isVisibleTooltip(STEPS.ENTER_SELLING_PRICE)}
                                                        >
                                                            <TooltipContainer stepOrder={STEPS.ENTER_SELLING_PRICE}>
                                                                <Field name="pricing.price.default[0].onetime.baseprice"
                                                                       validate={composeValidators(required, mustBeNumber)}>
                                                                    {props => (
                                                                        <InputField
                                                                            {...props}
                                                                            value={props.input.value}
                                                                            label={'Selling Price  '}
                                                                            keyboardType='numeric'
                                                                            inputtype={'textbox'}
                                                                            left={<TI.Affix text={getCurrencySign()}/>}
                                                                            onChange={props.input.onChange}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </TooltipContainer>
                                                        </WalkThrough>

                                                    </View>

                                                </Card.Content>
                                            </Card>

                                            {this.isTypeProduct && <View>


                                                <Card style={[styles.card]}>
                                                    <Card.Content style={{paddingBottom: 0}}>

                                                        <Paragraph style={[styles.paragraph, styles.caption]}>
                                                            Unit
                                                        </Paragraph>

                                                        <Field name="itemunit" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    label={'Purchase Unit'}
                                                                    mode={'flat'}
                                                                    list={option_units}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                        this.initdata.itemunit = value;
                                                                        if (Boolean(this.initdata.itemunit)) {
                                                                            let unittype = unit[this.initdata.itemunit] && unit[this.initdata.itemunit].unittype;
                                                                            this.option_salesunit = Object.values(unit)
                                                                                .filter((a: any) => Boolean(a) && a.unittype === unittype)
                                                                                .map((a: any) => assignOption(`${a.unitname} (${a.unitcode})`, a.unitid))
                                                                        }
                                                                    }}>
                                                                </InputField>
                                                            )}
                                                        </Field>

                                                        <View>
                                                            <Field name="salesunit" validate={required}>
                                                                {props => (
                                                                    <>
                                                                        <InputField
                                                                            {...props}
                                                                            label={'Sales Unit'}
                                                                            mode={'flat'}
                                                                            list={this.option_salesunit}
                                                                            value={props.input.value}
                                                                            selectedValue={props.input.value}
                                                                            displaytype={'pagelist'}
                                                                            inputtype={'dropdown'}
                                                                            listtype={'other'}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value)
                                                                            }}>
                                                                        </InputField>
                                                                    </>

                                                                )}
                                                            </Field>
                                                        </View>

                                                    </Card.Content>
                                                </Card>

                                            </View>}

                                            <Card style={[styles.card]}>
                                                <Card.Content style={{paddingBottom: 0}}>

                                                    <Paragraph style={[styles.paragraph, styles.caption]}>
                                                        Tax Detail
                                                    </Paragraph>

                                                    <View>
                                                        <WalkThrough
                                                            arrowSize={{width: 16, height: 16}}
                                                            content={<TooltipContent
                                                                message={"Select Product Tax Rate"}/>}
                                                            isVisible={isVisibleTooltip(STEPS.SELECT_TAX_RATE)}
                                                        >
                                                            <TooltipContainer stepOrder={STEPS.SELECT_TAX_RATE}>
                                                                <Field name="itemtaxgroupid" validate={required}>
                                                                    {props => (
                                                                        <>
                                                                            <InputField
                                                                                {...props}
                                                                                label={'Tax Rate'}
                                                                                mode={'flat'}
                                                                                list={option_taxes}
                                                                                value={props.input.value}
                                                                                selectedValue={props.input.value}
                                                                                displaytype={'pagelist'}
                                                                                inputtype={'dropdown'}
                                                                                listtype={'other'}
                                                                                onChange={(value: any) => {
                                                                                    props.input.onChange(value)
                                                                                    setActiveStepNumber(this.onlyForRegistered ? STEPS.SELECT_ITC : STEPS.SELECT_INVENTORY_TYPE)
                                                                                }}>
                                                                            </InputField>
                                                                        </>
                                                                    )}
                                                                </Field>
                                                            </TooltipContainer>
                                                        </WalkThrough>

                                                    </View>


                                                    {this.onlyForIndia && this.onlyForRegistered && <View>
                                                        <WalkThrough
                                                            arrowSize={{width: 16, height: 16}}
                                                            content={<TooltipContent
                                                                message={"Select Input Tax Credit Selection"}/>}
                                                            isVisible={isVisibleTooltip(STEPS.SELECT_ITC)}
                                                        >
                                                            <TooltipContainer stepOrder={STEPS.SELECT_ITC}>
                                                                <Field name="defaultitc"
                                                                       validate={this.onlyForRegistered ? required : undefined}>
                                                                    {props => (
                                                                        <>
                                                                            <InputField
                                                                                {...props}
                                                                                label={`Default ITC (Input Tax Credit) Selection`}
                                                                                list={options_itc}
                                                                                mode={'flat'}
                                                                                value={props.input.value}
                                                                                selectedValue={props.input.value}
                                                                                displaytype={'pagelist'}
                                                                                inputtype={'dropdown'}
                                                                                listtype={'other'}
                                                                                onChange={(value: any) => {
                                                                                    props.input.onChange(value)

                                                                                    this.scrollRef.current.scrollToPosition(0, 600, false);

                                                                                }}>
                                                                            </InputField>
                                                                        </>
                                                                    )}
                                                                </Field>
                                                            </TooltipContainer>
                                                        </WalkThrough>
                                                    </View>}
                                                </Card.Content>
                                            </Card>

                                            <Card style={[styles.card]}>
                                                <Card.Content style={{paddingBottom: 0}}>

                                                    <Paragraph style={[styles.paragraph, styles.caption]}>
                                                        Inword / Outward Account
                                                    </Paragraph>
                                                    <View>
                                                        <Field name="outwardaccount">
                                                            {props => (
                                                                <InputField
                                                                    label={'Outward Account'}
                                                                    mode={'flat'}
                                                                    list={chartofaccount.filter((account: any) => {
                                                                        return account.accounttype === 'income'
                                                                    }).map((t: any) => assignOption(t.accountname, t.accountid))}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value)
                                                                    }}>
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>


                                                    <View>
                                                        <Field name="inwardaccount">
                                                            {props => (
                                                                <InputField
                                                                    label={'Inward Account '}
                                                                    mode={'flat'}
                                                                    list={chartofaccount.filter((account: any) => {
                                                                        return account.accounttype === 'expense'
                                                                    }).map((t: any) => assignOption(t.accountname, t.accountid))}
                                                                    value={props.input.value}
                                                                    selectedValue={props.input.value}
                                                                    displaytype={'pagelist'}
                                                                    inputtype={'dropdown'}
                                                                    listtype={'other'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value)
                                                                    }}>
                                                                </InputField>
                                                            )}
                                                        </Field>
                                                    </View>
                                                </Card.Content>
                                            </Card>

                                            {this.isTypeProduct && <Card style={[styles.card]}>
                                                <Card.Content style={{paddingBottom: 0}}>

                                                    <Paragraph style={[styles.paragraph, styles.caption]}>
                                                        Inventory
                                                    </Paragraph>

                                                    {<View style={[styles.fieldspace]}>
                                                        <Field name={'trackinventory'}>
                                                            {props => (<View style={{
                                                                marginLeft: -25,
                                                                marginTop: -10,
                                                                marginBottom: 5
                                                            }}><CheckBox
                                                                value={props.input.value}
                                                                label={'Track Inventory for this item'}
                                                                onChange={(value: any) => {
                                                                    props.input.onChange(value);
                                                                }}/></View>)}
                                                        </Field>
                                                        <Divider
                                                            style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                                    </View>}


                                                    {<>

                                                        {Boolean(values.trackinventory) && <View>
                                                            <WalkThrough
                                                                arrowSize={{width: 16, height: 16}}
                                                                content={<TooltipContent
                                                                    message={trackInventoryMessage}/>}
                                                                isVisible={isVisibleTooltip(STEPS.SELECT_INVENTORY_TYPE)}
                                                            >
                                                                <TooltipContainer
                                                                    stepOrder={STEPS.SELECT_INVENTORY_TYPE}>
                                                                    <Field name="inventorytype">
                                                                        {props => (
                                                                            <InputField
                                                                                label={'Stock Valuation Method '}
                                                                                mode={'flat'}
                                                                                list={option_inventory}
                                                                                value={props.input.value}
                                                                                selectedValue={props.input.value}
                                                                                displaytype={'pagelist'}
                                                                                inputtype={'dropdown'}
                                                                                listtype={'other'}
                                                                                onChange={(value: any) => {
                                                                                    props.input.onChange(value);
                                                                                    setActiveStepNumber();
                                                                                }}>
                                                                            </InputField>
                                                                        )}
                                                                    </Field>
                                                                </TooltipContainer>
                                                            </WalkThrough>
                                                        </View>}


                                                        {values.inventorytype === 'specificidentification' && <View>
                                                            <Field name="identificationtype" validate={required}>
                                                                {props => (
                                                                    <InputField
                                                                        label={'Unique serial number'}
                                                                        mode={'flat'}
                                                                        list={[{
                                                                            label: 'Auto',
                                                                            value: 'auto'
                                                                        }, {
                                                                            label: 'Manual',
                                                                            value: 'manual'
                                                                        }, {
                                                                            label: 'Ask On Place',
                                                                            value: 'askonplace'
                                                                        }]}
                                                                        value={props.input.value}
                                                                        selectedValue={props.input.value}
                                                                        displaytype={'pagelist'}
                                                                        inputtype={'dropdown'}
                                                                        listtype={'other'}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value)
                                                                        }}>
                                                                    </InputField>
                                                                )}
                                                            </Field>
                                                        </View>}


                                                        <View>
                                                            <Field name="inventoryaccount">
                                                                {props => (
                                                                    <InputField
                                                                        label={'Inventory Account  '}
                                                                        mode={'flat'}
                                                                        list={chartofaccount.filter((account: any) => {
                                                                            return account.accounttype === 'assets' && account.accountsubtype === 'Stock'
                                                                        }).map((t: any) => assignOption(t.accountname, t.accountid))}
                                                                        value={props.input.value}
                                                                        selectedValue={props.input.value}
                                                                        displaytype={'pagelist'}
                                                                        inputtype={'dropdown'}
                                                                        listtype={'other'}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value)
                                                                        }}>
                                                                    </InputField>
                                                                )}
                                                            </Field>
                                                        </View>

                                                    </>}
                                                </Card.Content>
                                            </Card>}

                                            <Card style={[styles.card]}>
                                                <Card.Content>


                                                    <TouchableOpacity
                                                        style={[styles.grid, styles.middle, styles.justifyContent]}
                                                        onPress={() => {
                                                            this.isShow = !this.isShow;
                                                            updateComponent(this.advanceRef, 'display', this.isShow ? 'flex' : 'none')
                                                        }}>
                                                        <Paragraph style={[styles.paragraph, styles.caption]}>
                                                            Advance
                                                        </Paragraph>
                                                        <Paragraph>
                                                            <ProIcon name={!this.isShow ? 'chevron-down' : 'chevron-up'}
                                                                     action_type={'text'} size={16}/>
                                                        </Paragraph>
                                                    </TouchableOpacity>

                                                    <View style={[{display: 'none'}]} ref={this.advanceRef}>

                                                        <View>
                                                            <Field name="uniqueproductcode">
                                                                {props => (
                                                                    <InputField
                                                                        value={props.input.value}
                                                                        label={'SKU'}
                                                                        inputtype={'textbox'}
                                                                        onChange={props.input.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </View>

                                                        {!this.isTypeService && <View>
                                                            <Field name="purchasecost">
                                                                {props => (
                                                                    <InputField
                                                                        value={props.input.value}
                                                                        label={'Cost Price'}
                                                                        keyboardType='numeric'
                                                                        inputtype={'textbox'}
                                                                        left={<TI.Affix text={getCurrencySign()}/>}
                                                                        onChange={props.input.onChange}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </View>}


                                                        {values.inventorytype === 'fifo' && <>


                                                            <View>
                                                                <Field name="openingunitamount">
                                                                    {props => (
                                                                        <InputField
                                                                            value={props.input.value}
                                                                            label={'Opening Stock'}
                                                                            keyboardType='numeric'
                                                                            inputtype={'textbox'}
                                                                            onChange={props.input.onChange}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </View>


                                                            <View>
                                                                <Field name="openingstockrate">
                                                                    {props => (
                                                                        <InputField
                                                                            value={props.input.value}
                                                                            keyboardType='numeric'
                                                                            left={<TI.Affix text={getCurrencySign()}/>}
                                                                            label={'Opening Stock rate per unit'}
                                                                            inputtype={'textbox'}
                                                                            onChange={props.input.onChange}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </View>

                                                        </>}

                                                    </View>

                                                </Card.Content>
                                            </Card>

                                        </View>
                                    </View>
                                </View>
                            </KeyboardScroll>
                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Tooltip
                                        message={`Save Product`}
                                        stepOrder={STEPS.ADD_PRODUCT}
                                        delayTime={3000}
                                        allowNext={!Boolean(more.invalid)}
                                    >
                                        <TooltipContainer stepOrder={STEPS.ADD_PRODUCT}>
                                            <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                                handleSubmit(values)
                                            }}>   {Boolean(this.initdata.itemid) ? 'Update' : 'Add'} </Button>
                                        </TooltipContainer>
                                    </Tooltip>
                                </View>
                            </KAccessoryView>
                        </View>
                    )}
                />


            </Container>
        )
    }

}

const mapStateToProps = (state: any) => ({
    itemtypes: state.appApiData.settings.staticdata.itemtype,
    itemgroups: state.appApiData.settings.itemgroup,
    general: state.appApiData.settings.general,
    unit: state.appApiData.settings.unit,
    tax: state.appApiData.settings.tax,
    settings: state.appApiData.settings,
    chartofaccount: state.appApiData.settings.chartofaccount,
    companydetails: state.appApiData.companydetails,
    walkthroughactiveStep: state.walkthrough?.activeStep
});

const mapDispatchToProps = (dispatch: any) => ({
    setAlert: (alert: any) => dispatch(setAlert(alert)),
    setModal: (modal: any) => dispatch(setModal(modal))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddEdititem));


