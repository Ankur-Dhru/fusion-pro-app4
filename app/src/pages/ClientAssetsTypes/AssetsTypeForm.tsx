import {ScrollView, TouchableOpacity, View} from "react-native";
import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Field, Form} from "react-final-form";
import {styles} from "../../theme";
import {required, STATUS} from "../../lib/static";
import InputField from "../../components/InputField";
import BottomSpace from "../../components/BottomSpace";
import {Button, CheckBox, Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Card, List, Paragraph, withTheme} from "react-native-paper";
import {clone, errorAlert, getInit, isEmpty, log} from "../../lib/functions";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {deleteSettings, putSettings} from "../../lib/ServerRequest/api";
import {v4 as uuidv4} from "uuid";
import Swipeout from "rc-swipeout";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from "../../components/KAccessoryView"

const AssetsTypeForm = (props: any) => {
    let {navigation, route, assettypeList, customFieldList,theme:{colors}}: any = props;
    const {assets} = route?.params;
    let isNew = !Boolean(assets);

    setNavigationOptions(navigation, "Add Client Assets Type",colors, route);

    let initData: any = {
        customfield: {}
    };

    if (Boolean(assets)) {
        initData = {
            ...assets
        }
    }


    const _onSubmit = (values: any) => {
        let checkBaseField = isEmpty(values?.customfield);
        if (checkBaseField) {
            errorAlert("atleast one field required");
        } else {
            let allAssetType = {};
            if (Boolean(assettypeList)) {
                allAssetType = assettypeList;
            }
            if (!Boolean(values.assettypeid)) {
                values.assettypeid = uuidv4();
                values.__key = values.assettypeid;
            }
            allAssetType = {
                ...allAssetType,
                [values.assettypeid]: values
            };

            putSettings("assettype", allAssetType, true).then(() => {
                getInit(null, null, null, () => navigation.goBack(), "form", true)
            })
        }
    }

    const _deleteField = (assettypeid: any, fieldKey: any, callBack: any) => {
        if (assettypeid) {
            deleteSettings("assettype", assettypeid,
                (result: any) => {
                    if (result.status === STATUS.SUCCESS) {
                        getInit(null, null, null, () => callBack(), "form", true)
                    }
                }, undefined, {
                    "uniquename": "customfield",
                    "uniqueid": fieldKey
                })
        } else {
            callBack()
        }
    }

    const _navigateField = (customfield: any, form: any, other: any) => {
        navigation.navigate('ClientAssetsFieldForm', {
            customfield,
            form,
            ...other
        })
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
                                                <Field name="assettypename" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Asset Type Name'}
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
                                                <Field name="brandtagrequired">
                                                    {props => (
                                                        <CheckBox
                                                            value={props.input.value}
                                                            label={`Brand Required`}
                                                            onChange={props.input.onChange}/>
                                                    )}
                                                </Field>
                                            </View>


                                            <View style={[{marginLeft: -26}]}>
                                                <Field name="modeltagrequired">
                                                    {props => (
                                                        <CheckBox
                                                            value={props.input.value}
                                                            label={`Model Required`}
                                                            onChange={props.input.onChange}/>
                                                    )}
                                                </Field>
                                            </View>


                                        </View>


                                        {
                                            Object.keys(values?.customfield).map((key: any) => {
                                                const field = values.customfield[key];
                                                const findField = customFieldList.find((cf: any) => cf.input == field.input)
                                                let title = field.name, description = `Input : ${findField.name}`;
                                                if (field.base) {
                                                    title += ` (Base)`
                                                }

                                                return <Swipeout
                                                    right={[
                                                        {
                                                            text: 'Delete',
                                                            onPress: () => _deleteField(values.assettypeid, key, () => {
                                                                delete values.customfield[key];
                                                                let customfield = values.customfield;
                                                                form.change("customfield", clone(customfield));
                                                            }),
                                                            style: {backgroundColor: styles.red.color, color: 'white'},
                                                        }
                                                    ]}
                                                    disabled={Boolean(Object.values(values.customfield).length < 2)}
                                                    autoClose={true}
                                                    style={{backgroundColor: 'transparent'}}
                                                >
                                                    <List.Item
                                                        title={title}
                                                        description={description}
                                                        onPress={() => _navigateField(values?.customfield, form, {
                                                            fieldData: field,
                                                            key,
                                                        })}
                                                        right={props => <ListNavRightIcon {...props}/>}
                                                    />
                                                </Swipeout>

                                            })
                                        }

                                </Card.Content>
                            </Card>


                            <Card style={[styles.card]}>
                                <Card.Content>
                                        <View>
                                            <TouchableOpacity onPress={() => {
                                                let base = isEmpty(values?.customfield);
                                                _navigateField(values?.customfield, form, {
                                                    base:false
                                                });
                                            }}>
                                                <View style={[styles.grid, styles.middle]}>
                                                    <ProIcon color={styles.green.color} align={"left"}
                                                             name={'circle-plus'}/>
                                                    <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                                        Add Field
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
    assettypeList: state?.appApiData.settings.assettype,
    customFieldList: state?.appApiData.settings.staticdata.customfield
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(AssetsTypeForm)));

