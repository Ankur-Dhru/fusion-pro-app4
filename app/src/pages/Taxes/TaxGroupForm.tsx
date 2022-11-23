import {ScrollView, TouchableOpacity, View} from "react-native";
import React, {memo, useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required, STATUS} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Card, List, Paragraph, withTheme} from "react-native-paper";
import {clone, getInit, getStateList, isEmpty} from "../../lib/functions";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import Swipeout from "rc-swipeout";
import {v4 as uuidv4} from "uuid";
import {deleteSettings, getTaxRegType, putSettings} from "../../lib/ServerRequest/api";
import {SUCCESS} from "../../lib/ServerRequest";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const TaxGroupForm = (props: any) => {
    let {navigation, route, taxList, general,theme:{colors}}: any = props;
    const [stateList, setStateList] = useState<any>({});
    const [taxTypes, setTaxTypes] = useState([]);
    const [options_tax, setTaxOptions] = useState([]);
    const {taxes} = route?.params;

    let isNew = !Boolean(taxes);

    const loadStateAndTaxTypes = (country: any) => {

        getStateList(country).then((response) => {
            if (response.status === STATUS.SUCCESS && response.data) {
                setStateList(response.data)
            }
        });
        getTaxRegType(country).then((response) => {
            if (response.status === STATUS.SUCCESS && response.data) {
                if (response?.data[0]?.tax_type) {
                    setTaxTypes(response?.data[0]?.tax_type)
                }
            }
        });
    }

    useEffect(() => {
        loadStateAndTaxTypes(general.country);
        let data: any = Object.values(taxList)?.map((t: any) => ({label: t.taxgroupname, value: t.taxgroupid}))
        setTaxOptions(data)
    }, [])


    setNavigationOptions(navigation, "Add Tax Details",colors, route);

    let initData: any = {
        intrastatetaxstateid: 0,
        taxes: [],
        mid: 0
    };

    if (Boolean(taxes)) {
        initData = {
            ...taxes
        }
    }


    const _onSubmit = (values: any) => {
        if (!Boolean(values?.taxgroupid)) {
            values.taxgroupid = uuidv4();
            values.__key = values.taxgroupid
        }

        if (isEmpty(taxList)) {
            taxList = {}
        }
        taxList[values.taxgroupid] = values;
        putSettings("tax", taxList, true).then((result) => {
            if (result.status === SUCCESS) {
                getInit(null, null, null, () => {
                    navigation.goBack();
                }, "form", true)
            }
        })
    }

    const _navigationTax = (allTax?: any, form?: any, data?: any) => {
        navigation.navigate("TaxesForm", {taxTypes, allTax, form, ...data})
    }

    const _navigationIntraStateTax = (stateTaxData: any, form?: any, data?: any) => {
        navigation.navigate("IntraStateTax", {stateList, options_tax, stateTaxData, form, ...data})
    }

    const _deleteTax = (taxid: any, callback: any) => {
        if (Boolean(initData.taxgroupid)) {
            deleteSettings("tax", initData.taxgroupid, (result: any) => {
                if (result.status === STATUS.SUCCESS) {
                    getInit(null, null, null, () => {
                        callback()
                    }, "form", true)
                }
            }, undefined, {
                "uniquename": "taxid",
                "uniqueid": taxid
            })
        } else {
            callback()
        }

    }

    const _deleteIntraStateTax = (intrataxid: any, callback: any) => {
        if (Boolean(initData.taxgroupid)) {
            deleteSettings("tax", initData.taxgroupid, (result: any) => {
                if (result.status === STATUS.SUCCESS) {
                    getInit(null, null, null, () => {
                        callback()
                    }, "form", true)
                }
            }, undefined, {
                "uniquename": "statetax",
                "uniqueid": intrataxid
            })
        } else {
            callback()
        }
    }

    return <Container>
        <Form
            onSubmit={_onSubmit}
            initialValues={initData}
            render={({handleSubmit, submitting, values, form,...more}: any) => {

                return (
                    <View style={[styles.pageContent]}>
                        <KeyboardScroll>
                            <Card style={[styles.card]}>
                                <Card.Content>

                                        <View>
                                            <View>
                                                <Field name="taxgroupname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Tax Group Name'}
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

                                            <View style={[{marginLeft: -26}]}>
                                                <Field name="notaxreasonenable">
                                                    {props => (
                                                        <CheckBox
                                                            value={props.input.value}
                                                            label={`No-Tax Reason Required`}
                                                            onChange={props.input.onChange}/>
                                                    )}
                                                </Field>
                                            </View>

                                        </View>
                                </Card.Content>
                            </Card>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent,{paddingHorizontal: 0}]}>
                                        {
                                            !isEmpty(values?.taxes) && values?.taxes?.map((taxdata: any, index: any) => {
                                                let {taxname, taxpercentage, taxtype, taxid} = taxdata
                                                let title = `${taxname} (${taxpercentage}%)`
                                                return <Swipeout
                                                    right={[
                                                        {
                                                            text: 'Delete',
                                                            onPress: () => _deleteTax(taxid, () => {
                                                                let newtax = values?.taxes?.filter((t: any) => t.taxid !== taxid);
                                                                form.change("taxes", isEmpty(newtax) ? [] : newtax);
                                                            }),
                                                            style: {backgroundColor: styles.red.color, color: 'white'},
                                                        }
                                                    ]}
                                                    disabled={values?.taxes.length < 2}
                                                    autoClose={true}
                                                    style={{backgroundColor: 'transparent'}}
                                                >
                                                    <List.Item
                                                        title={title}
                                                        description={`Tax Type : ${taxtype}`}
                                                        onPress={() => {
                                                            _navigationTax(values.taxes, form, {title, taxdata})
                                                        }}
                                                        right={props => <ListNavRightIcon {...props}/>}
                                                    />
                                                </Swipeout>

                                            })
                                        }

                                        <View style={[styles.p_5]}>
                                            <TouchableOpacity onPress={() => {
                                                _navigationTax(values.taxes, form)
                                            }}>
                                                <View style={[styles.grid, styles.middle]}>
                                                    <ProIcon color={styles.green.color} align={"left"}
                                                             name={'circle-plus'}/>
                                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                                        Add Tax
                                                    </Paragraph>
                                                </View>
                                            </TouchableOpacity>




                                        </View>

                                        </Card.Content>
                                    </Card>


                            <Card style={[styles.card]}>
                                <Card.Content>


                                            <Field name="overseastaxgroupid">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Overseas Tax Group'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Select Overseas Tax Group"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        key={uuidv4()}
                                                        listtype={'other'}
                                                        list={options_tax}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>

                                            <Field name="intrastatetaxgroupid">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        label={'Intra State Tax Group'}
                                                        selectedValue={props.input.value}
                                                        selectedLabel={"Intra State Tax Group"}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        showlabel={false}
                                                        appbar={true}
                                                        search={false}
                                                        key={uuidv4()}
                                                        listtype={'other'}
                                                        list={options_tax}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                </Card.Content>
                            </Card>


                            <Card style={[styles.card]}>
                                <Card.Content style={[styles.cardContent,{paddingHorizontal: 0}]}>
                                        {
                                            Boolean(values?.statetax) && Object.keys(values?.statetax).map((key: any) => {
                                                const data = values?.statetax[key];

                                                if (isEmpty(stateList)) {
                                                    return <></>
                                                }

                                                return <Swipeout
                                                    right={[
                                                        {
                                                            text: 'Delete',
                                                            onPress: () => _deleteIntraStateTax(key, () => {
                                                                delete values.statetax[key];
                                                                let customfield = values.statetax;
                                                                form.change("statetax", clone(customfield));
                                                            }),
                                                            style: {backgroundColor: styles.red.color, color: 'white'},
                                                        }
                                                    ]}
                                                    autoClose={true}
                                                    style={{backgroundColor: 'transparent'}}
                                                >
                                                    <List.Item
                                                        title={stateList[data.state].name}
                                                        description={taxList[data.taxgroupid].taxgroupname}
                                                        onPress={() => {
                                                            _navigationIntraStateTax(values?.statetax, form, {
                                                                intraData: {
                                                                    ...data,
                                                                    key
                                                                }
                                                            })
                                                        }}
                                                        right={props => <ListNavRightIcon {...props}/>}
                                                    />
                                                </Swipeout>

                                            })
                                        }

                                        <View style={[styles.p_5]}>
                                            <TouchableOpacity onPress={() => {
                                                let base = isEmpty(values?.customfield);
                                                _navigationIntraStateTax(values?.statetax, form)
                                            }}>
                                                <View style={[styles.grid, styles.middle]}>
                                                    <ProIcon color={styles.green.color} align={"left"}
                                                             name={'circle-plus'}/>
                                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                                        Add Intra State Tax
                                                    </Paragraph>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                </Card.Content>
                            </Card>


                        </KeyboardScroll>
                        <KAccessoryView>
                            <View style={[styles.submitbutton]}>
                                <Button
                                    disable={more.invalid} secondbutton={more.invalid}
                                    onPress={() => handleSubmit(values)}>{Boolean(isNew) ? "Save" : "Update"}</Button>
                            </View>
                        </KAccessoryView>

                    </View>
                )
            }}>
        </Form>
    </Container>
}

const mapStateToProps = (state: any) => ({
    taxList: state?.appApiData.settings.tax,
    general: state?.appApiData?.settings?.general,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TaxGroupForm)));

