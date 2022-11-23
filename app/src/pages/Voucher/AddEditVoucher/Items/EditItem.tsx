import React, {Component} from 'react';
import {Keyboard, ScrollView, TextInput as TextInputReact, TouchableOpacity, View} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {Button, Container, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Card, Paragraph, Text, TextInput, TextInput as TI, Title, withTheme} from "react-native-paper";
import {checkStock, errorAlert, getCurrencySign, getType, isEmpty, log} from "../../../../lib/functions";
import {Field, Form} from "react-final-form";
import {setAlert, setDialog} from "../../../../lib/Store/actions/components";
import SerialItem from "./SerialItem";
import {backButton, voucher} from "../../../../lib/setting";
import {composeValidators, mustBeNumber, options_itc, required} from "../../../../lib/static";
import InputField from "../../../../components/InputField";
import KAccessoryView from '../../../../components/KAccessoryView';

let CurrencyFormat = require('react-currency-format');


class EditItem extends Component<any> {

    title: any;
    units: any;
    taxes: any;

    initdata: any;

    error = false;
    errorMessage = "";

    scrollRef: any
    editSerial = false;

    constructor(props: any) {
        super(props);
        const {route}: any = this.props;
        const {item}: any = route.params;
        this.state = {discounttype: item?.productdiscounttype || "%"};
        this.scrollRef = React.createRef();
        this.editSerial = Boolean(voucher?.settings?.editserial) && Boolean(item?.voucheritemid);
    }

    componentWillMount() {

        const {route}: any = this.props;
        const {item}: any = route.params;

        this.initdata = item;


        this.initdata.inventorytype = this.initdata?.inventorytype || this?.initdata?.itemdetail?.inventorytype


        if (!Boolean(this.initdata?.productdiscounttype)) {
            this.initdata.productdiscounttype = "%"
        }

        if(!Boolean(this.initdata.productratedisplay)){
            this.initdata.productratedisplay = 0
        }

        const {settings}: any = this.props;
        /*this.units = Object.keys(settings.unit).map((key:any)=>{
            return {label: settings.unit[key].unitname, value: settings.unit[key].unitid}
        });*/

        if (!Boolean(this.initdata.productqntunitid)) {
            this.initdata = {...this.initdata, productqntunitid: this.initdata.itemunit}
        }

        this.taxes = Object.keys(settings.tax).map((key: any) => {
            return {label: settings.tax[key].taxgroupname, value: settings.tax[key].taxgroupid}
        });


        if (this.initdata?.voucheritemid) {
            let serialnos: any = Boolean(this.initdata?.serial) && Object.keys(this.initdata.serial).map((keys) => {
                let serial = this.initdata.serial[keys];
                return serial.serialno
            })

            let mfdnos: any = Boolean(this.initdata?.serial) && Object.keys(this.initdata.serial).map((keys) => {
                let serial = this.initdata.serial[keys];
                return serial.mfdno
            })

            this.initdata = {
                ...this.initdata,
                serialno: Boolean(serialnos) && serialnos?.join('\n') || [],
                mfdno: Boolean(mfdnos) && mfdnos?.join('\n') || [],
            }
        }

        this.initdata = {
            ...this.initdata,
            askonplacetype: item?.itemdetail?.identificationtype || item?.identificationtype
        }

        if (voucher.settings.editserial && this.editSerial) {
            let updatedserial: any = [];
            if (Boolean(this.initdata?.serial)) {
                updatedserial = this.initdata?.updatedserial
                if (getType(this.initdata.serial) === 'object') {
                    updatedserial = []
                }
                Object.values(this.initdata?.serial)
                    .forEach(({serialno: sno, mfdno: mfd, auto}: any) => {
                        updatedserial = [
                            ...updatedserial,
                            {
                                oldserial: sno,
                                newserial: sno,
                                mfdno: mfd,
                                auto
                            }
                        ]
                    })
            }



            this.initdata = {
                ...this.initdata,
                updatedserial,
            }

        }

        if (voucher.settings.addserialmfd) {

            let serialno: any = [], updatedserial: any = [], mfdno: any = [];
            let abc: any = []

            if (Boolean(this.initdata?.serial)) {

                updatedserial = this.initdata?.updatedserial

                if (getType(this.initdata.serial) === 'object') {
                    updatedserial = []
                }

                getType(this.initdata.serial) === 'object' ? Object.values(this.initdata.serial).forEach(({
                                                                                                              serialno: sno,
                                                                                                              mfdno: mfd,
                                                                                                              auto
                                                                                                          }: any) => {
                    abc = [
                        ...abc,
                        sno
                    ]
                    serialno = [
                        ...serialno,
                        sno
                    ];
                    mfdno = [
                        ...mfdno,
                        mfd
                    ]
                    updatedserial = [
                        ...updatedserial,
                        {
                            oldserial: sno,
                            newserial: sno,
                            mfdno: mfd,
                            auto
                        }
                    ]
                }) : this.initdata.serial.map((serial: any) => {
                    abc = [
                        ...abc,
                        serial
                    ]
                    serialno = [
                        ...serialno,
                        serial
                    ];
                })
            }


            this.initdata = {
                ...this.initdata,
                serial: abc,
                soldSerial: this.initdata.serial,
                updatedserial,
                serialno,
                mfdno
            }
        }




    }

    updateQnt = (qnt: any) => {
        this.initdata.productqnt = qnt;
        //this.forceUpdate()
    }

    addLineInMessage = () => {
        if (Boolean(this.errorMessage)) {
            this.errorMessage += "\n";
        }
    }

    checkRepeat = async (values: any) => {


        if (voucher.settings.addserialmfd) {

            try {
                if (!Boolean(values.voucheritemid)) {


                    if (Boolean(values?.numbers?.mfdno)) {
                        values = {
                            ...values,
                            mfdno: values?.numbers?.mfdno?.split("\n").filter((item: any) => {
                                return Boolean(item)
                            }),
                        }
                    }

                    if (Boolean(values?.numbers?.serialno)) {
                        values = {
                            ...values,
                            serialno: values?.numbers?.serialno?.split("\n").filter((item: any) => {
                                return Boolean(item)
                            }),
                        }
                    }


                } else {

                    values = {
                        ...values,
                        serialno: values.updatedserial.map((serial: any) => {
                            return serial.newserial
                        }),
                        mfdno: values.updatedserial.map((serial: any) => {
                            return serial.mfdno
                        })
                    }

                }
            } catch (e) {
                log(e, 'e')
            }


            if (values?.serialno.length || values?.mfdno.length) {

                //values.productqnt = values?.serialno.length;

                let {
                    itemdetail,
                    product_tax_object_display,
                    product_tax_object,
                    taxobjdisplay,
                    taxobj,
                    soldSerial,
                    ...data
                } = values;

                let soldSerialArray: any = [];
                if (!isEmpty(soldSerial)) {
                    soldSerialArray = Object.values(soldSerial).map((ss: any, index: number) => ({
                        ...ss,
                        index
                    })).filter(({sold}: any) => Boolean(sold));
                }
                let removedArrayIndex: any = []
                let serialnos = values.serialno
                    .filter((sn: any, index: any) => {
                        if (!soldSerialArray.some((ssa: any) => ssa.serialno === sn)) {
                            removedArrayIndex.push(index)
                            return true;
                        }
                        return false;
                    })
                    .map((no: any) => {
                        return {[no]: values.voucheritemid || 0}
                    })
                let mfdnos = values.mfdno.filter((sn: any, index: any) => {
                    return removedArrayIndex.some((rIndex: any) => rIndex === index)
                }).map((no: any) => {
                    return {[no]: values.voucheritemid || 0}
                })


                await requestApi({
                    method: methods.post,
                    action: actions.repeat,
                    body: {mfdno: mfdnos, serialno: serialnos},
                    showlog: false
                }).then((result) => {
                    if (result.status === SUCCESS && Boolean(result.data)) {
                        this.handleSubmit(values);
                    }
                });
            } else {
                this.handleSubmit(values);
            }
        } else {
            this.handleSubmit(values);
        }

    }

    handleSubmit = (values: any) => {

        const {route, settings, navigation}: any = this.props;
        const {updateItem}: any = route.params;

        const {setAlert} = this.props;

        this.error = false;
        this.errorMessage = "";

        try {

            if (!Boolean(values?.productdiscountvalue)) {
                this.initdata.productdiscountvalue = "0";
                values.productdiscountvalue = "0";
            }

            if ((settings?.general?.taxregtype[0] === "grr" || settings?.general?.taxregtype[0] === "grc") && settings.general.country === 'IN') {
                if (!Boolean(values.hsn)) {
                    this.addLineInMessage();
                    this.errorMessage += `Please Enter ${this.initdata.itemtype === 'service' ? 'SAC No.' : 'HSN Code'}`;
                }
                /*if (!Boolean(values.defaultitc)) {
                    this.addLineInMessage();
                    this.errorMessage += `Please Select Default ITC`;
                }*/
            }

            if (!Boolean(values.voucheritemid) && voucher.settings.addserialmfd) {

                if (Boolean(values?.serialno.length)) {
                    values.productqnt = values?.serialno?.length
                }
                if (Boolean(values?.mfdno?.length)) {
                    if (+values.productqnt !== (values?.mfdno?.length)) {
                        this.addLineInMessage();
                        this.errorMessage += `Product qnt can't match with no. of MFD`;
                    }
                }
            }


            values.productrate = values.productratedisplay / voucher.data.vouchercurrencyrate;

            this.error = Boolean(this.errorMessage);

            if (!this.error) {
                updateItem(values);
                navigation.goBack()
            } else {
                errorAlert(this.errorMessage);
            }

        } catch (e) {
            log('e', e)
        }

    }


    removeserialno = (index: any) => {
        this.initdata.serial.splice(index, 1);
        this.initdata.productqnt = this.initdata.serial?.length
        this.forceUpdate()
    }


    render() {


        const {route, settings, navigation, theme: {colors}}: any = this.props;
        const option_notaxreason: any = Object.keys(settings?.reason?.notaxreason).map((key: any) => {
            let reason = settings?.reason?.notaxreason[key];
            return {label: reason, value: key}
        })

        const {updateItem, item, ...data}: any = route.params;

        const {
            itemdetail,
            product_tax_object_display,
            product_tax_object,
            taxobjdisplay,
            taxobj,
            ...otherdata
        }: any = item;
        const {discounttype}: any = this.state;


        navigation.setOptions({
            headerTitle: 'Edit Item',
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
        });

        let isNotOutsourcing = !Boolean(voucher?.settings?.outsourcing)

        let decimalplace = settings.currency?.[voucher.data.currency]?.decimalplace;

        return (
            <Container>


                <Form
                    onSubmit={this.checkRepeat}
                    initialValues={{
                        ...this.initdata,
                        productqnt: this.initdata.productqnt.toString(),
                    }}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <ScrollView ref={this.scrollRef}>

                                <View>

                                    <Card style={[styles.card]}>
                                        <Card.Content>

                                            {<View style={[styles.mb_5, styles.row, styles.justifyContent]}>
                                                <Paragraph
                                                    style={[styles.paragraph, styles.caption]}> {this.initdata.itemname || this.initdata.productdisplayname}</Paragraph>
                                                <View style={[styles.paragraph, styles.badge, styles.text_xs, {
                                                    textAlignVertical: 'top',
                                                    borderRadius: 2,
                                                    textTransform: 'uppercase',
                                                    backgroundColor: this.initdata.itemtype === 'service' ? 'orange' : 'green'
                                                }]}><Text style={{
                                                    color: 'white',
                                                    textTransform: 'uppercase'
                                                }}> {this.initdata.itemtype} </Text></View>
                                            </View>}


                                            {Boolean(this.initdata?.serial) && Boolean(this.initdata?.serial?.length) && !Boolean(voucher.settings.addserialmfd) &&
                                                <View style={[styles.mb_5]}>
                                                    <View>
                                                        <Paragraph
                                                            style={[styles.paragraph, styles.caption, styles.text_xs, styles.p_0]}>Serial
                                                            No</Paragraph>
                                                        {
                                                            this.initdata.serial.map((serialno: any, index: any) => {
                                                                return (
                                                                    <View style={[styles.grid, styles.middle]}>
                                                                        {<Paragraph
                                                                            style={[styles.paragraph, styles.text_sm]}>
                                                                            {serialno}
                                                                        </Paragraph>}
                                                                        {index > 0 && <TouchableOpacity onPress={() => {
                                                                            this.removeserialno(index)
                                                                        }}>
                                                                            <ProIcon color={styles.red.color} size={12}
                                                                                     name={'circle-xmark'}/>
                                                                        </TouchableOpacity>}
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                    </View>

                                                </View>}


                                            {settings.general.country === 'IN' && <>
                                                <Field name="hsn">
                                                    {props => {
                                                        return (<InputField
                                                            value={'' + props.input.value}
                                                            divider={true}
                                                            inputtype={'textbox'}
                                                            label={this.initdata.itemtype === 'service' ? 'SAC Code.' : 'HSN Code'}
                                                            onChange={(value: any) => {
                                                                this.initdata.hsn = value
                                                                props.input.onChange(value)
                                                            }}
                                                            keyboardType='numeric'
                                                        />)
                                                    }}
                                                </Field>

                                            </>}

                                            {this.initdata.sku && <View style={[styles.mb_5]}>
                                                <Paragraph
                                                    style={[styles.paragraph, styles.caption, styles.text_xs]}>SKU</Paragraph>
                                                <Paragraph style={[styles.paragraph,]}>{this.initdata.sku}</Paragraph>
                                            </View>}


                                            {/*!Boolean(this.initdata?.serial?.length) && !Boolean(voucher.settings.addserialmfd) &&*/}
                                            {(this.initdata.inventorytype !== "specificidentification" && isNotOutsourcing) ?
                                                <Field name="productqnt"
                                                       validate={composeValidators(required, mustBeNumber)}>
                                                    {props => {
                                                        return (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                label={'Quantity'}
                                                                divider={true}
                                                                inputtype={'textbox'}
                                                                keyboardType='numeric'
                                                                autoFocus={false}
                                                                right={<TextInput.Affix
                                                                    text={settings?.unit[this.initdata.productqntunitid]?.unitcode}/>}
                                                                onChange={(value: any) => {
                                                                    this.initdata.productqnt = value
                                                                    props.input.onChange(value)
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                </Field> :
                                                <View>
                                                    {/*<Paragraph
                                                        style={[styles.caption, styles.text_xs, styles.p_0]}>Qnt</Paragraph>
                                                    <Paragraph>{this.initdata.productqnt} {this.initdata.salesunits && JSON.stringify(this.initdata.salesunits[this.initdata.salesunit])}</Paragraph>*/}
                                                </View>
                                            }

                                            <Field name="productratedisplay"
                                                   validate={composeValidators(required, mustBeNumber)}>
                                                {props => {
                                                    return (<View style={{marginTop: 10}}>

                                                            <InputField
                                                                {...props}
                                                                defaultValue={'' + props?.input?.value}
                                                                value={'' + props?.input?.value}
                                                                label={isNotOutsourcing ? 'Price' : "Estimate"}
                                                                divider={true}
                                                                inputtype={'textbox'}
                                                                keyboardType='numeric'
                                                                autoFocus={false}
                                                                left={<TextInput.Affix text={getCurrencySign()}/>}
                                                                onChange={(value: any) => {
                                                                    this.initdata.productratedisplay = value
                                                                    props.input.onChange(value)
                                                                }}
                                                            />


                                                        </View>
                                                    )
                                                }}
                                            </Field>

                                            {Boolean(voucher.data.voucherinlinediscountforitem) &&
                                                <View>
                                                    <Field name="productdiscountvalue">
                                                        {fieldProps => (

                                                            <View style={{marginTop: 10}}>

                                                                <View style={[styles.grid, styles.middle]}>
                                                                    <View style={[styles.flexGrow]}>

                                                                        <InputField
                                                                            value={'' + fieldProps.input.value}
                                                                            label={'Discount'}
                                                                            keyboardType='numeric'
                                                                            divider={true}
                                                                            inputtype={'textbox'}
                                                                            autoFocus={false}
                                                                            contentStyle={{height: 50, margin: 3}}
                                                                            left={discounttype === 'Amount' &&
                                                                                <TI.Affix
                                                                                    text={discounttype === '%' ? '' : getCurrencySign()}/>}
                                                                            onChange={(value: any) => {

                                                                                this.initdata.productdiscountvalue = value
                                                                                fieldProps.input.onChange(value)
                                                                            }}
                                                                        />


                                                                    </View>
                                                                    <View style={{marginLeft: 10}}>

                                                                        <TouchableOpacity onPress={() => {
                                                                            this.setState({discounttype: discounttype === '%' ? getCurrencySign() : '%'}, () => {
                                                                                const {discounttype}: any = this.state;
                                                                                values.productdiscounttype = discounttype;
                                                                                this.forceUpdate()
                                                                            })
                                                                        }}>
                                                                            <View style={[styles.grid, styles.middle]}>
                                                                                <Paragraph
                                                                                    style={[styles.paragraph, styles.text_sm]}>
                                                                                    {discounttype === '%' ? '%' : getCurrencySign()}
                                                                                </Paragraph>
                                                                                <ProIcon name={'angle-down'}/>
                                                                            </View>
                                                                        </TouchableOpacity>


                                                                    </View>
                                                                </View>
                                                            </View>
                                                        )}
                                                    </Field>
                                                </View>}

                                            <Field name="producttaxgroupid">
                                                {props => (
                                                    <>
                                                        <InputField
                                                            label={'Tax Rate'}
                                                            divider={true}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            list={this.taxes}
                                                            search={false}
                                                            listtype={'other'}
                                                            selectedValue={props.input.value}
                                                            onChange={(value: any) => {
                                                                this.initdata.producttaxgroupid = value
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </Field>

                                           {settings?.tax[values?.producttaxgroupid]?.notaxreasonenable  &&
                                                <Field name="taxreason" validate={settings?.general?.taxregtype[0] !== 'gu'?required:undefined}>
                                                    {props => (
                                                        <>
                                                            <InputField
                                                                {...props}
                                                                label={'Reason'}
                                                                divider={true}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                list={option_notaxreason}
                                                                search={false}
                                                                listtype={'other'}
                                                                selectedValue={props.input.value}
                                                                onChange={(value: any) => {
                                                                    this.initdata.taxreason = value
                                                                    props.input.onChange(value)
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </Field>}

                                                {voucher.settings.eligibleforitc && <Field name="itc" validate={required}>
                                                    {props => (
                                                        <>
                                                            <InputField
                                                                {...props}
                                                                label={'ITC'}
                                                                divider={true}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                list={options_itc}
                                                                search={false}
                                                                listtype={'other'}
                                                                selectedValue={props.input.value}
                                                                onChange={(value: any) => {
                                                                    this.initdata.itc = value
                                                                    props.input.onChange(value)
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </Field>}


                                            <View>
                                                <Field name="productremark">
                                                    {props => (

                                                        <TextInputReact
                                                            defaultValue={props.input.value}
                                                            placeholder={'Notes'}
                                                            placeholderTextColor={colors.inputLabel}
                                                            style={[styles.inputLabel, styles.mb_5, {
                                                                fontSize: 16,
                                                                color: colors.inputbox
                                                            }]}
                                                            multiline={true}
                                                            onChange={(value: any) => {
                                                                this.initdata.productremark = value
                                                                props.input.onChange(value)
                                                            }}
                                                        />

                                                    )}
                                                </Field>

                                            </View>

                                        </Card.Content>

                                    </Card>

                                    {
                                        Boolean(this.editSerial) && Boolean(values.updatedserial.length > 0) &&
                                        <Card style={[styles.card]}>
                                            <Card.Content>
                                                {
                                                    values.updatedserial?.map(({newserial, oldserial}: any, i: any) => {
                                                        return <View style={[styles.grid, styles.middle]}>
                                                            <View style={[styles.w_auto]}>
                                                                <Field name={`updatedserial[${i}].newserial`}
                                                                       validate={required}>
                                                                    {props => {
                                                                        return (<InputField
                                                                            value={'' + props.input.value}
                                                                            divider={true}
                                                                            inputtype={'textbox'}
                                                                            label={"Serial No."}
                                                                            onChange={(value: any) => {
                                                                                props.input.onChange(value)
                                                                            }}
                                                                        />)
                                                                    }}
                                                                </Field>
                                                            </View>
                                                            <View style={[styles.ml_2]}>
                                                                <Button
                                                                    compact={true}
                                                                    disabled={!Boolean(newserial)}
                                                                    secondbutton={!Boolean(newserial)}
                                                                    onPress={() => {
                                                                        checkStock(newserial, {productid: item.productid}).then((response: any) => {
                                                                            if (response.status === SUCCESS && response.data) {
                                                                                const serialdetail = response.data[newserial];
                                                                                if (serialdetail?.stock > 0) {
                                                                                    more.form.change(`updatedserial[${i}].newserial`, serialdetail.serial)
                                                                                    more.form.change(`updatedserial[${i}].mfdno`, serialdetail.mfd)
                                                                                    more.form.change(`updatedserial[${i}].checked`, true);
                                                                                    errorAlert('Serial Number' +
                                                                                        ' Replaced', "Success");
                                                                                } else {
                                                                                    more.form.change(`updatedserial[${i}].newserial`, oldserial)
                                                                                    errorAlert('Item out of stock');
                                                                                }
                                                                            }
                                                                        })
                                                                    }}> Check Stock </Button>
                                                            </View>
                                                        </View>
                                                    })
                                                }
                                            </Card.Content>
                                        </Card>
                                    }


                                    {(voucher.settings.addserialmfd && this.initdata.inventorytype === "specificidentification" && isNotOutsourcing) &&
                                        <Card style={[styles.card]}>
                                            <Card.Content>

                                                <Paragraph
                                                    style={[styles.paragraph, styles.caption]}> Serial / MFD
                                                    Number </Paragraph>

                                                <SerialItem navigation={navigation} item={values}
                                                            updateQnt={this.updateQnt}/></Card.Content>
                                        </Card>}


                                </View>

                            </ScrollView>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        Keyboard.dismiss();
                                        this.scrollRef.current.scrollTo(0)
                                        handleSubmit(values)
                                    }}> Update </Button>
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
})
const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setAlert: (alert: any) => dispatch(setAlert(alert))
});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(EditItem));


