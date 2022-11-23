import React, {Component} from 'react';
import {View,} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";

import {clone, findObject, isEmpty, log} from "../../../../lib/functions";
import {CheckBox} from "../../../../components";
import {Field} from "react-final-form";
import {Card, Divider, Paragraph, Text, withTheme} from "react-native-paper";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {setPendingInvoices, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";
import {assignOption, options_place, required} from "../../../../lib/static";
import {voucher} from "../../../../lib/setting";
import InputField from "../../../../components/InputField";
import {v4 as uuidv4} from "uuid";
import moment from 'moment';


class CustomView extends Component<any, any> {


    reasonlist: any = [];
    invoicelist: any = [];

    referenceid: any;
    paymentmethod: any;
    options_outsourcing_status: any = [];
    custom_fields: any = [];

    constructor(props: any) {
        super(props);
        this.state = {
            checked: false,
            paymenttypevalue: 'Invoice Payment',
            adjustmentchecked: 'Quantity',
            option_accessories: []
        }
        const {ticketsList, values, form} = props;
        if (ticketsList) {
            if (ticketsList[values?.tickettypeid]?.outsourcingstatuslist) {
                this.options_outsourcing_status = Object
                    .values(ticketsList[values?.tickettypeid]?.outsourcingstatuslist)
                    .map((status: any) => {
                        if (status?.osdefault) {
                            form.change("outsourcingstatus", status?.key);
                            voucher.data.outsourcingstatus = status?.key;
                        }
                        return assignOption(status?.osstatusname, status?.key)
                    })
            }
            if (ticketsList[values?.tickettypeid]?.outsourcingcustomfield) {
                this.custom_fields = Object
                    .values(ticketsList[values?.tickettypeid]?.outsourcingcustomfield)
            }
        }
    }

    getGatewayDetailByKey = (key: any, value: any) => {
        const {settings} = this.props;
        const gatewayname: any = Object.keys(settings.paymentgateway[key]).filter((key) => key !== "settings");
        return settings.paymentgateway[key][gatewayname].find((a: any) => a.input === value)
    }

    getVoucherItems = (value: any) => {

        let found = findObject(this.invoicelist, 'value', value);
        const {voucherdisplayid, vouchertypeid} = found[0].more;
        const {updateVoucherItems} = this.props;

        requestApi({
            method: methods.get,
            action: actions.voucher,
            queryString: {voucherdisplayid: voucherdisplayid, vouchertype: vouchertypeid}
        }).then((result) => {
            if (result.status === SUCCESS) {
                Object.keys(result.data.voucheritems).map((key: any) => {
                    result.data.voucheritems[key].itemunique = key;
                });
                updateVoucherItems(result.data.voucheritems);
            }
        });
    }

    handleSubmit = () => {

    }

    resetItemsTaxGroup = () => {
        const {voucheritems, updateVoucherItems} = this.props;
        Object.keys(voucheritems).map((keys: any) => {
            let item = voucheritems[keys];
            item.producttaxgroupid = '';
            voucheritems[keys] = item;
        });
        updateVoucherItems(clone(voucheritems))
    }

    componentDidMount() {
        const {setPendingInvoices, location, assettype}: any = this.props;
        const {clientdetail}: any = voucher.data;
        setPendingInvoices(clientdetail?.pendinginvoice || clientdetail?.pendingbills)

        if (Boolean(voucher?.settings?.assettype)) {
            requestApi({
                method: methods.get,
                action: actions.tag,
                queryString: {tagtype: 'accessories'},
                loader: false,
                showlog: true,
                loadertype: 'list'
            }).then((result: any) => {
                if (result.status === SUCCESS && result?.data) {
                    const option_accessories = !isEmpty(result?.data) && result?.data?.map((k: any) => assignOption(k, k)) || [];
                    this.setState({
                        option_accessories
                    })
                }
            })
        }
    }


    render() {


        const {
            settings,
            pendinginvoices,
            chartofaccount,
            editmode,
            location,
            navigation,
            warrantylist,
            taskpriorityList, theme: {colors},
            form,
            values
        } = this.props;
        const {
            deliverystatus,
            invoicelist,
            reasonlist,
            paymenttype,
            receivedamount,
            billlist,
            account,
            adjustment,
            reversecharge,
            paymentmethod,
            accountlist,
            assettype,
            reasontype,
            customfield,
            outsourcingFields
        }: any = voucher.settings;
        const {option_accessories} = this.state;
        const chartofaccounts = chartofaccount.map((account: any, key: any) => assignOption(account.accountname, account.accountid));

        let options_warranty: any = [], option_priority: any = [], options_staff: any = [];

        if (reasonlist) {
            this.reasonlist = Boolean(settings.reason[reasontype]) && Object.keys(settings.reason[reasontype]).map((key: any) => {
                return {label: settings.reason[reasontype][key], value: key}
            });
        }


        if (invoicelist || billlist) {
            this.invoicelist = Boolean(pendinginvoices) && Object.keys(pendinginvoices).map((key: any) => {
                return {
                    label: `${pendinginvoices[key].voucherprefix}${pendinginvoices[key].voucherdisplayid}`,
                    value: key,
                    more: pendinginvoices[key]
                }
            });
            let found = findObject(this.invoicelist, 'value', voucher.data.referenceid);
            if (found[0]?.more) {
                const {voucherdisplayid, voucherprefix} = found[0]?.more;
                this.referenceid = voucherprefix + '' + voucherdisplayid;
            }
        }

        if (Boolean(assettype)) {
            if (warrantylist) {
                options_warranty = warrantylist.map((wrty: any) => assignOption(wrty, wrty))
            }
            if (taskpriorityList) {
                option_priority = Object.keys(taskpriorityList).map((t: any) => assignOption(taskpriorityList[t], t))
            }
            if (settings.staff) {
                options_staff = Object.values(settings.staff).map((stf: any) => assignOption(stf.username, stf.adminid))
            }
        }


        if (paymentmethod) {
            this.paymentmethod = Boolean(settings.paymentgateway) && Object.keys(settings.paymentgateway).map((key: any) => {
                const b: any = this.getGatewayDetailByKey(key, 'displayname');
                return {label: b.value, value: key}
            });
        }

        const option_accounts = settings.chartofaccount.map((account: any) => assignOption(account.accountname, account.accountid));
        const option_place = options_place.map((place: any) => assignOption(place.text, place.value));

        const findaccount = findObject(option_accounts, 'value', voucher.data.accountid);
        const accountname = findaccount[0]?.label;

        const {showordertype,showpriority}:any = voucher.type;

        let hasCustom = (Boolean(assettype) && Boolean(values?.assettype)) && ((showordertype || showpriority ||  accountlist || reversecharge || account || invoicelist) || (billlist && Boolean(this.invoicelist.length)) || reasonlist || (deliverystatus && editmode) || outsourcingFields)


        return (
            <View>
                {((Boolean(hasCustom) && Boolean(assettype) && Boolean(values?.assettype)) || paymentmethod) && <Card style={[styles.card]}>
                    <Card.Content style={{paddingBottom: 0}}>
                        {
                            Boolean(assettype) && Boolean(values?.assettype) && <>
                            {showordertype && <Field name="warranty">
                                    {props => {
                                        return (<InputField
                                            label={'Order Type'}
                                            mode={'flat'}
                                            editmode={editmode}
                                            hideDivider={true}
                                            morestyle={styles.voucherDropdown}
                                            list={options_warranty}
                                            value={props.input.value}
                                            selectedValue={props.input.value}
                                            selectedLabel={"Select Order Type"}
                                            displaytype={'bottomlist'}
                                            inputtype={'dropdown'}
                                            listtype={'other'}
                                            onChange={(value: any) => {
                                                props.input.onChange(value);

                                            }}>
                                        </InputField>)
                                    }}
                                </Field>}

                                {showpriority &&  <Field name="priority">
                                    {props => {
                                        return (<InputField
                                            label={'Priority'}
                                            mode={'flat'}
                                            editmode={editmode}
                                            hideDivider={true}
                                            morestyle={styles.voucherDropdown}
                                            list={option_priority}
                                            value={props.input.value}
                                            selectedValue={props.input.value}
                                            selectedLabel={"Select Priority"}
                                            displaytype={'bottomlist'}
                                            inputtype={'dropdown'}
                                            listtype={'priority'}
                                            onChange={(value: any) => {
                                                props.input.onChange(value);
                                            }}>
                                        </InputField>)
                                    }}
                                </Field>}
                            </>
                        }

                        {paymentmethod && <Field name="referencetype">
                            {props => {
                                return (<InputField
                                    label={'Payment Method'}
                                    mode={'flat'}
                                    editmode={editmode}
                                    hideDivider={true}
                                    morestyle={styles.voucherDropdown}
                                    list={this.paymentmethod}
                                    value={props.input.value}
                                    selectedValue={props.input.value}
                                    displaytype={'bottomlist'}
                                    inputtype={'dropdown'}
                                    listtype={'other'}
                                    onChange={(value: any) => {
                                        props.input.onChange(value);
                                        voucher.data.referencetype = value
                                        const {
                                            paymentmethod,
                                            paymentaccount
                                        }: any = settings.paymentgateway[value].settings;
                                        voucher.data.payment = paymentmethod;
                                        voucher.data.accountid = paymentaccount;
                                        this.forceUpdate()
                                    }}>
                                </InputField>)
                            }}
                        </Field>}


                        {accountlist && <View style={[styles.fieldspace]}>
                            <Text style={[styles.inputLabel]}>Chart of Account</Text>
                            <View style={[styles.row, styles.justifyContent, {marginBottom: 5}]}>
                                <Paragraph style={[styles.paragraph]}>{accountname}</Paragraph>
                            </View>
                            <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                        </View>}


                        {reversecharge && <View>
                            <Field name={'reversecharge'}>
                                {props => (<View style={{marginLeft: -25, marginTop: -10, marginBottom: 5}}><CheckBox
                                    value={props.input.value}
                                    editmode={editmode}
                                    label={'Applicable for reverse charge'}
                                    onChange={(value: any) => {
                                        props.input.onChange(value);
                                        voucher.data.reversecharge = value;
                                        this.resetItemsTaxGroup();
                                        navigation.forceRefresh();
                                    }}/></View>)}
                            </Field>
                            <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                        </View>}

                        {/*{adjustment && <Field name="adjustment">
                            {props => {
                                return (
                                    <InputField
                                        {...props}
                                        label={'Adjustment'}
                                        divider={true}
                                        editmode={editmode}
                                        displaytype={'bottomlist'}
                                        inputtype={'dropdown'}
                                        list={[{value: 'Quantity', label: 'Quantity'}, {
                                            value: 'Value',
                                            label: 'Value'
                                        }]}
                                        search={false}
                                        listtype={'other'}
                                        selectedValue={props.input.value}
                                        onChange={(value: any) => {
                                            props.input.onChange(value);
                                            voucher.data.adjustment = value
                                        }}
                                    />
                                )
                            }}
                        </Field>}*/}


                        {account && <Field name="account">
                            {props => {
                                return (<InputField
                                    {...props}
                                    label={'Account'}
                                    divider={true}
                                    editmode={editmode}
                                    displaytype={'pagelist'}
                                    inputtype={'dropdown'}
                                    list={chartofaccounts}
                                    search={false}
                                    listtype={'other'}
                                    selectedValue={props.input.value}
                                    onChange={(value: any) => {
                                        props.input.onChange(value);
                                        voucher.data.account = value
                                    }}
                                />)
                            }}
                        </Field>}


                        {(invoicelist || billlist) && Boolean(this.invoicelist.length) &&
                            <View><View style={[]}>
                                {editmode ? <View>
                                    {Boolean(this.invoicelist.length) && <Field name="referenceid">
                                        {props => {
                                            return (<>
                                                <InputField
                                                    {...props}
                                                    label={invoicelist ? 'Invoices' : 'Bills'}
                                                    divider={true}
                                                    editmode={editmode}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    list={this.invoicelist}
                                                    search={false}
                                                    listtype={'other'}
                                                    selectedValue={props.input.value}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                        voucher.data.referenceid = value
                                                        this.getVoucherItems(value)
                                                    }}
                                                />
                                            </>)
                                        }}
                                    </Field>}
                                </View> : <View style={[styles.fieldspace]}><Paragraph
                                    style={[styles.paragraph,]}>{invoicelist ? 'Invoices' : 'Bills'}</Paragraph><Paragraph
                                    style={[styles.paragraph, styles.bold]}>{this.referenceid}</Paragraph></View>}
                            </View></View>}

                        {reasonlist && <View>
                            <View>
                                <View>
                                    <Field name={`${voucher.settings.inventoryitems ? 'reason' : 'referencetype'}`}
                                           validate={required}>
                                        {props => {
                                            return (<>
                                                <InputField
                                                    {...props}
                                                    label={'Reason'}
                                                    divider={true}
                                                    editmode={editmode}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    morestyle={styles.voucherDropdown}
                                                    list={this.reasonlist}
                                                    search={false}
                                                    listtype={'other'}
                                                    selectedValue={props.input.value}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                        if (voucher.settings.inventoryitems) {
                                                            voucher.data.reason = value;
                                                        } else {
                                                            voucher.data.referencetype = value
                                                        }
                                                    }}
                                                />

                                            </>)
                                        }}
                                    </Field>

                                </View>
                            </View>

                        </View>}

                        {deliverystatus && editmode && <Field name="deliverystatus">
                            {props => {
                                return (<>
                                    <InputField
                                        {...props}
                                        label={'Status'}
                                        divider={true}
                                        editmode={editmode}
                                        displaytype={'bottomlist'}
                                        inputtype={'dropdown'}
                                        morestyle={styles.voucherDropdown}
                                        list={[{value: 'Open', label: 'Open'}, {
                                            value: 'Delivered',
                                            label: 'Delivered'
                                        }]}
                                        search={false}
                                        listtype={'other'}
                                        selectedValue={props.input.value}
                                        onChange={(value: any) => {
                                            props.input.onChange(value);
                                            voucher.data.deliverystatus = value
                                        }}
                                    />
                                </>)
                            }}
                        </Field>}
                        {
                            Boolean(outsourcingFields) && <>
                                <Field name="outsourcinglocation" validate={required}>
                                    {props => {
                                        return (<InputField
                                            {...props}
                                            label={'Location'}
                                            divider={true}
                                            editmode={editmode}
                                            displaytype={'bottomlist'}
                                            inputtype={'dropdown'}
                                            list={option_place}
                                            key={uuidv4()}
                                            search={false}
                                            listtype={'other'}
                                            selectedValue={props.input.value}
                                            onChange={(value: any) => {
                                                props.input.onChange(value);
                                                voucher.data.outsourcinglocation = value
                                            }}
                                        />)
                                    }}
                                </Field>

                                <View>
                                    <Field name={'pickup'}>
                                        {props => (
                                            <View style={{marginLeft: -25, marginTop: -10, marginBottom: 5}}><CheckBox
                                                value={props.input.value}
                                                editmode={editmode}
                                                label={'Pickup / Sent'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                    voucher.data.pickup = value;
                                                    let date: any, time: any;
                                                    if (value) {
                                                        date = moment()
                                                            .format("YYYY-MM-DD HH:mm:ss");
                                                        time = moment().format("YYYY-MM-DD HH:mm:ss");
                                                    } else {
                                                        form.change("delivery", false);
                                                        form.change("deliverydate", undefined);
                                                    }
                                                    voucher.data.pickupdate = date;
                                                    voucher.data.pickuptime = date;
                                                    voucher.data.delivery = false;
                                                    form.change("pickupdate", date);
                                                    form.change("pickuptime", time);
                                                    form.change("delivery", false);
                                                }}/></View>)}
                                    </Field>
                                    <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                </View>

                                {
                                    Boolean(values.pickup) && <View style={[styles.grid, styles.justifyContent]}>
                                        <View style={{width: '49%'}}>
                                            <Field name={'pickupdate'}>
                                                {props => (<InputField
                                                    label={"Pickup / Sent Date"}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'datepicker'}
                                                    mode={'date'}
                                                    dueterm={false}
                                                    editmode={editmode}
                                                    selectedValue={props.input.value}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                        voucher.data.pickupdate = value;
                                                    }}
                                                />)}
                                            </Field>
                                        </View>
                                        <View style={{width: '49%'}}>
                                            <Field name={'pickuptime'}>
                                                {props => (<InputField
                                                    label={"Pickup / Sent Time"}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'datepicker'}
                                                    mode={'time'}
                                                    editmode={editmode}
                                                    selectedValue={props.input.value}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                        voucher.data.pickuptime = value;
                                                    }}
                                                />)}
                                            </Field>
                                        </View>
                                    </View>
                                }


                                <View>
                                    <Field name={'delivery'}>
                                        {props => (
                                            <View style={{marginLeft: -25, marginBottom: 5}}><CheckBox
                                                value={props.input.value}
                                                editmode={editmode ? Boolean(values.pickup) : editmode}
                                                label={'Ready'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                    voucher.data.delivery = value;

                                                    let date: any, time: any;
                                                    if (value) {
                                                        date = moment().format("YYYY-MM-DD");
                                                        time = moment().format("YYYY-MM-DD HH:mm:ss");
                                                    }
                                                    voucher.data.deliverydate = date;
                                                    voucher.data.deliverytime = time;
                                                    form.change("deliverydate", date);
                                                    form.change("deliverytime", time);
                                                }}/></View>)}
                                    </Field>
                                    <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                </View>

                                {
                                    Boolean(values.delivery) && <View style={[styles.grid, styles.justifyContent]}>
                                        <View style={{width: '49%'}}>
                                            <Field name={'deliverydate'}>
                                                {props => (<InputField
                                                    label={"Ready Date"}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'datepicker'}
                                                    mode={'date'}
                                                    dueterm={false}
                                                    editmode={editmode}
                                                    selectedValue={props.input.value}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                        voucher.data.deliverydate = value;
                                                    }}
                                                />)}
                                            </Field>
                                        </View>
                                        <View style={{width: '49%'}}>
                                            <Field name={'deliverytime'}>
                                                {props => (<InputField
                                                    label={"Ready Time"}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'datepicker'}
                                                    mode={'time'}
                                                    editmode={editmode}
                                                    selectedValue={props.input.value}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                        voucher.data.deliverytime = value;
                                                    }}
                                                />)}
                                            </Field>
                                        </View>
                                    </View>
                                }

                                <Field name="outsourcingstatus">
                                    {props => {
                                        return (<InputField
                                            {...props}
                                            label={'Outsourcing status'}
                                            divider={true}
                                            editmode={editmode}
                                            displaytype={'bottomlist'}
                                            inputtype={'dropdown'}
                                            list={this.options_outsourcing_status}
                                            key={uuidv4()}
                                            search={false}
                                            listtype={'other'}
                                            selectedValue={props.input.value}
                                            onChange={(value: any) => {
                                                props.input.onChange(value);
                                                voucher.data.outsourcingstatus = value
                                            }}
                                        />)
                                    }}
                                </Field>


                                {
                                    this.custom_fields
                                        .map(({
                                                  type,
                                                  key,
                                                  input,
                                                  required: req,
                                                  options,
                                                  displayname: name
                                              }: any, index: any) => {
                                            let fieldname = `data[${key}][${name}]`;

                                            return <View key={index}>
                                                {
                                                    type && <>
                                                        {
                                                            (input !== "imei" && (type === "text" || type === "password" || type === "textarea")) &&
                                                            <Field name={fieldname}
                                                                   validate={req ? (props: any) => required(props, name) : undefined}>
                                                                {props => (
                                                                    <><InputField
                                                                        {...props}
                                                                        value={props.input.value}
                                                                        label={name}
                                                                        inputtype={type === "textarea" ? 'textarea' : 'textbox'}
                                                                        secureTextEntry={type === "password"}
                                                                        multiline={type === "textarea"}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value);
                                                                        }}
                                                                    />
                                                                    </>
                                                                )}
                                                            </Field>
                                                        }

                                                        {
                                                            (input === "imei") &&
                                                            <Field name={fieldname}
                                                                   validate={req ? (props: any) => required(props, name) : undefined}>
                                                                {props => (
                                                                    <><InputField
                                                                        {...props}
                                                                        value={props.input.value}
                                                                        label={name}
                                                                        inputtype={'scan'}
                                                                        navigation={navigation}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value);
                                                                        }}
                                                                    />
                                                                    </>
                                                                )}
                                                            </Field>
                                                        }

                                                        {
                                                            (type === "dropdown" || type === "radio" || type === 'checkbox') &&
                                                            <Field name={fieldname}
                                                                   validate={req ? (props: any) => required(props, name) : undefined}>
                                                                {props => (
                                                                    <>
                                                                        <InputField
                                                                            {...props}
                                                                            label={name}
                                                                            mode={'flat'}
                                                                            list={Object.values(options).map((t: any) => assignOption(t, t))}
                                                                            value={props.input.value}
                                                                            selectedValue={props.input.value}
                                                                            displaytype={'pagelist'}
                                                                            inputtype={'dropdown'}
                                                                            multiselect={type === 'checkbox'}
                                                                            listtype={'other'}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value);
                                                                            }}>
                                                                        </InputField>
                                                                    </>
                                                                )}
                                                            </Field>
                                                        }

                                                        {
                                                            type === 'checkboxgroup' && <Field name={fieldname}>
                                                                {props => (<View style={{marginLeft: -25}}><CheckBox
                                                                    value={props.input.value}
                                                                    label={name}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}/></View>)}
                                                            </Field>
                                                        }


                                                    </>
                                                }
                                            </View>
                                        })
                                }
                            </>
                        }
                    </Card.Content>
                </Card>}
            </View>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    voucheritems: state.appApiData.voucheritems,
    pendinginvoices: state.appApiData.pendinginvoices,
    chartofaccount: state.appApiData.settings.chartofaccount,
    warrantylist: state?.appApiData.settings.staticdata.warranty,
    taskpriorityList: state?.appApiData.settings.staticdata.taskpriority,
    ticketsList: state?.appApiData.settings.tickets,
})
const mapDispatchToProps = (dispatch: any) => ({
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
    setPendingInvoices: (invoices: any) => dispatch(setPendingInvoices(invoices)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(CustomView));


