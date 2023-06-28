import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Field} from "react-final-form";
import {assignOption, composeValidators, minLength, required} from "../../lib/static";
import InputField from "../../components/InputField";
import {clone, isEmpty, log} from "../../lib/functions";
import {CheckBox} from "../../components";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {v4 as uuidv4} from "uuid";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {connect} from "react-redux";
import {voucher} from "../../lib/setting";
import PinPattern from "../../components/InputField/PinPattern";
import WalkThrough from "react-native-walkthrough-tooltip"
import TooltipContent from "../../components/Spotlight/TooltipContent";
import {STEPS, TooltipContainer} from "../../components/Spotlight/Tooltip";
import {isVisibleTooltip, setActiveStepNumber} from "../../lib/Store/store-service";

const AssetsForm = ({
                        values,
                        assettype,
                        assetNameAfter,
                        isFieldVisibleAfterSelectType,
                        navigation,
                        fromJob,
                        fromEditJob,
                        hideAssetName,
                        doNotUpdateAssetType,
                        theme: {colors}
                    }: any) => {

    const [option_assettype, setOptionAssettype] = useState<any>([]);
    const [fieldVisible, setFieldVisible] = useState<any>(!Boolean(isFieldVisibleAfterSelectType));
    const [option_brand, setBrand] = useState<any>([]);
    const [option_model, setModel] = useState<any>([]);
    const [option_accessories, setAccessories] = useState<any>([])
    const [selectedAssetType, setSelectedAssetType] = useState<any>(values?.assettype);
    const [callBackSelect, setCallBackSelect] = useState<any>();

    useEffect(() => {
        let options: any = [];
        if (!isEmpty(assettype)) {
            options = Object.keys(assettype).map((k) => assignOption(assettype[k].assettypename, k))
        }
        setOptionAssettype(options)

        requestApi({
            method: methods.get,
            action: actions.tag,
            queryString: {tagtype: 'brand,model,accessories'},
            loader: false,
            showlog: true,
            loadertype: 'form'
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                const {brand, model, accessories} = result.data;

                const option_brand = brand ? brand.map((k: any) => assignOption(k, k)) : [];
                const option_model = model ? model.map((k: any) => assignOption(k, k)) : [];
                const option_accessories = accessories ? accessories.map((k: any) => assignOption(k, k)) : [];

                setBrand(option_brand);
                setModel(option_model);
                setAccessories(option_accessories);
            }
        })

    }, [assettype]);

    useEffect(() => {
        if (selectedAssetType) {
            values.customfield = assettype[selectedAssetType]?.customfield;
            values.brandtagrequired = assettype[selectedAssetType]?.brandtagrequired;
            setSelectedAssetType(selectedAssetType)
            setFieldVisible(Boolean(selectedAssetType))
            voucher.data.customfield = values.customfield;
            voucher.data.brandtagrequired = values.brandtagrequired;
        }
    }, [])

    useEffect(() => {
        if (callBackSelect?.callBack) {
            let lastIndex = option_accessories.length - 1;
            let lastValue = option_accessories[lastIndex]
            callBackSelect.callBack({value: [lastValue.value]})
        }
    }, [option_accessories])

    let hasSpace = Boolean(fromJob) && !Boolean(fromEditJob);

    let hasFields = (!Boolean(hideAssetName) && Boolean(assetNameAfter)) || (Boolean(hideAssetName) && Boolean(values?.customfield))  || Boolean(fromJob)

    let nextStepNumber = 17;


    const {showbrand,showattachment,showmodel,showassetname}:any = voucher.type;


    return <View>
        <View>

            <Card style={[styles.card, hasSpace && {marginBottom: 0}]}>
                <Card.Content style={[hasSpace && {paddingHorizontal: 0, paddingVertical: 0}]}>


                    {
                        (!Boolean(hideAssetName) && !Boolean(assetNameAfter)) &&  <View>
                            <Field name="assetname">
                                {props => (
                                    <InputField
                                        {...props}
                                        value={props.input.value}
                                        label={'Asset Name'}
                                        inputtype={'textbox'}
                                        onChange={(value: any) => {
                                            props.input.onChange(value);
                                            voucher.data.assetname = value;
                                        }}
                                    />
                                )}
                            </Field>
                        </View>
                    }

                    <View>
                        <WalkThrough
                            arrowSize={{width: 16, height: 16}}
                            content={<TooltipContent message={"Select Asset Type"} />}
                            isVisible={isVisibleTooltip(STEPS.SELECT_ASSET_TYPE)}
                        >
                            <TooltipContainer stepOrder={STEPS.SELECT_ASSET_TYPE}>
                                <Field
                                    name="assettype"
                                    validate={(props: any) => required(props, "Asset Type")}>
                                    {props => {
                                        return (<>
                                            <InputField
                                                {...props}
                                                label={'Asset Type'}
                                                divider={true}
                                                displaytype={'bottomlist'}
                                                inputtype={'dropdown'}
                                                list={option_assettype}
                                                search={false}
                                                validateWithError={true}
                                                onAdd={({setBottomSheet}: any) => {
                                                    setBottomSheet({visible: false});
                                                    navigation.navigate('SettingsNavigator', {
                                                        screen: 'ClientAssetsTypesNavigator',
                                                        params: {screen: 'ClientAssetsTypeForm', params: {}},
                                                    });
                                                }}
                                                key={uuidv4()}
                                                editmode={!Boolean(doNotUpdateAssetType)}
                                                listtype={'other'}
                                                description={!Boolean(doNotUpdateAssetType) ? "" : "You are not allowed to change asset."}
                                                descriptionStyle={[styles.errorText]}
                                                selectedValue={props.input.value}
                                                selectedLabel={"Select Asset Type"}
                                                onChange={(value: any) => {
                                                    voucher.data.reseterror = true;
                                                    values.customfield = assettype[value]?.customfield;
                                                    values.brandtagrequired = assettype[value]?.brandtagrequired;
                                                    props.input.onChange(value);
                                                    setSelectedAssetType(value);
                                                    setFieldVisible(Boolean(value));
                                                    voucher.data.assettype = value;
                                                    voucher.data.customfield = values.customfield;
                                                    voucher.data.brandtagrequired = values.brandtagrequired;

                                                    setActiveStepNumber(18);
                                                }}
                                            />
                                        </>)
                                    }}
                                </Field>
                            </TooltipContainer>
                        </WalkThrough>

                    </View>


                </Card.Content>
            </Card>


            {((showbrand || values?.brandtagrequired) || (showmodel || values?.modeltagrequired)) && <Card  style={[styles.card]}>
                <Card.Content  style={[hasSpace && {paddingHorizontal: 0, paddingVertical: 0}]}>
                    {(showbrand || values?.brandtagrequired) && <View>
                        <Field name="brand"
                               validate={values?.brandtagrequired ? (props: any) => required(props, "Brand") : undefined}>
                            {props => {
                                return (<>
                                    <InputField
                                        {...props}
                                        label={'Brand'}
                                        divider={true}
                                        displaytype={'pagelist'}
                                        inputtype={'dropdown'}
                                        list={option_brand}
                                        selectedLabel={"Select Brand"}
                                        search={false}
                                        validateWithError={true}
                                        key={uuidv4()}
                                        onAdd={(text: any, callBack: any) => {
                                            let item = assignOption(text, text);
                                            setBrand((value: any) => [...value, item]);
                                            callBack(item);
                                        }}
                                        listtype={'other'}
                                        selectedValue={props.input.value}
                                        onChange={(value: any) => {

                                            console.log('onChange1 value',value)
                                            props.input.onChange(value);
                                            voucher.data.brand = value;
                                        }}
                                    />
                                </>)
                            }}
                        </Field>

                    </View>}

                    {(showmodel || values?.modeltagrequired) && <View>
                        <Field name="model"
                               validate={values?.modeltagrequired ? (props: any) => required(props, "Model") : undefined}>
                            {props => (
                                <InputField
                                    {...props}
                                    label={'Model'}
                                    divider={true}
                                    displaytype={'pagelist'}
                                    inputtype={'dropdown'}
                                    list={option_model}
                                    validateWithError={true}
                                    selectedLabel={"Select Model"}
                                    search={false}
                                    onAdd={(text: any, callBack: any) => {
                                        let item = assignOption(text, text);
                                        setModel([...option_model, item]);
                                        callBack(item);
                                    }}
                                    key={uuidv4()}
                                    listtype={'other'}
                                    selectedValue={props.input.value}
                                    onChange={(value: any) => {
                                        props.input.onChange(value);
                                        log('value',value)
                                        voucher.data.model = value;
                                    }}
                                />
                            )}
                        </Field>
                    </View>}
                </Card.Content>
            </Card>}

            {
                Boolean(fieldVisible) && <>

                    {hasFields && <Card style={[styles.card]}>
                        <Card.Content style={[hasSpace && {paddingHorizontal: 0, paddingVertical: 0}]}>

                            {
                                (!Boolean(hideAssetName) && Boolean(assetNameAfter)) && <View>
                                    <Field name="assetname">
                                        {props => (
                                            <InputField
                                                {...props}
                                                value={props.input.value}
                                                label={'Asset Name'}
                                                inputtype={'textbox'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                    voucher.data.assetname = value;
                                                }}
                                            />
                                        )}
                                    </Field>
                                </View>
                            }

                            {
                                (Boolean(hideAssetName) && Boolean(values?.customfield)) && <>{
                                    Object.keys(values.customfield).some((key: any) => Boolean(values.customfield[key].base))
                                        ? <>{Object.keys(values.customfield)
                                            .filter((key) => values.customfield[key].base)
                                            .map((key: any, index: any) => {

                                                const {
                                                    type,
                                                    name,
                                                    options,
                                                    description,
                                                    required: req,
                                                    base,
                                                    input
                                                } = values.customfield[key];

                                                let fieldname: any = 'basefield';
                                                if (type === "pattern") {
                                                    fieldname = {
                                                        basefield: {
                                                            type: "",
                                                            typevalue: ""
                                                        }
                                                    }
                                                }

                                                nextStepNumber++;

                                                return <View key={index}>
                                                    {
                                                        type && <>
                                                            <WalkThrough
                                                                arrowSize={{width: 16, height: 16}}
                                                                content={<TooltipContent
                                                                    message={name}
                                                                />}
                                                                isVisible={isVisibleTooltip(nextStepNumber)}
                                                            >
                                                                <TooltipContainer stepOrder={nextStepNumber}>
                                                                    {
                                                                        (input !== "imei" && (type === "text" || type === "password" || type === "textarea")) &&
                                                                        <Field name={fieldname}
                                                                               validate={req || base ? (props: any) => required(props, name) : undefined}>
                                                                            {props => (
                                                                                <><InputField
                                                                                    {...props}
                                                                                    value={props.input.value}
                                                                                    label={name}
                                                                                    validateWithError={true}
                                                                                    inputtype={type === "textarea" ? 'textarea' : 'textbox'}
                                                                                    secureTextEntry={type === "password"}
                                                                                    multiline={type === "textarea"}
                                                                                    onChange={(value: any) => {
                                                                                        props.input.onChange(value);
                                                                                        voucher.data[fieldname] = value;
                                                                                    }}
                                                                                />
                                                                                </>
                                                                            )}
                                                                        </Field>
                                                                    }

                                                                    {
                                                                        (input === "imei") &&
                                                                        <Field name={fieldname}
                                                                               validate={req || base ? composeValidators((props: any) => required(props, name), minLength(15, name)) : undefined}>
                                                                            {props => (
                                                                                <><InputField
                                                                                    {...props}
                                                                                    value={props.input.value}
                                                                                    label={name}
                                                                                    validateWithError={true}
                                                                                    inputtype={'scan'}
                                                                                    keyboardType={"numeric"}
                                                                                    navigation={navigation}
                                                                                    onChange={(value: any) => {
                                                                                        props.input.onChange(value);
                                                                                        voucher.data[fieldname] = value;
                                                                                    }}
                                                                                    maxLength={15}
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
                                                                                        validateWithError={true}
                                                                                        inputtype={'dropdown'}
                                                                                        multiselect={type === 'checkbox'}
                                                                                        listtype={'other'}
                                                                                        onChange={(value: any) => {
                                                                                            props.input.onChange(value);
                                                                                            voucher.data[fieldname] = value;
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
                                                                                    voucher.data[fieldname] = value;
                                                                                }}/></View>)}
                                                                        </Field>
                                                                    }

                                                                    {
                                                                        type === 'pinpattern' && <Field name={fieldname}
                                                                                                        validate={req ? (props: any) => required(props, name) : undefined}>
                                                                            {props => (<PinPattern
                                                                                navigation={navigation}
                                                                                type={props?.input?.value?.type}
                                                                                onChangeType={(type: any) => {
                                                                                    let value = {type, typevalue: ""};
                                                                                    props.input.onChange(value)
                                                                                    voucher.data[fieldname] = value;
                                                                                }}
                                                                                onChangeTypeValue={(typevalue: any, callback:any) => {
                                                                                    let value = {...props?.input?.value, typevalue};
                                                                                    props.input.onChange(value)
                                                                                    voucher.data[fieldname] = value;
                                                                                    callback && callback()
                                                                                }}
                                                                                typeValue={props?.input?.value?.typevalue}
                                                                            />)}
                                                                        </Field>
                                                                    }


                                                                </TooltipContainer>
                                                            </WalkThrough>
                                                        </>
                                                    }
                                                </View>

                                            })}</> : <View>
                                            {Boolean(showassetname) && <Field name="assetname">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        value={props.input.value}
                                                        label={'Asset Name'}
                                                        validateWithError={true}
                                                        inputtype={'textbox'}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                            voucher.data.assetname = value;
                                                        }}
                                                    />
                                                )}
                                            </Field>}
                                        </View>
                                }
                                </>
                            }




                            {(voucher.settings.attachment && showattachment) && Boolean(hasSpace) && <>
                                <View>
                                    {<View style={{marginHorizontal: -15}}>
                                        <InputField
                                            label={'Add Attachment'}
                                            divider={true}
                                            onChange={(value: any) => {
                                                //this.forceUpdate()
                                            }}
                                            inputtype={'attachment'}
                                            navigation={navigation}
                                        />
                                    </View>}
                                </View>
                            </>}


                            {/*{
                                Boolean(fromJob) && <View>
                                    <Field name="accessories">
                                        {props => (
                                            <InputField
                                                label={'Accessories'}
                                                mode={'flat'}
                                                divider={true}
                                                key={uuidv4()}
                                                list={clone(option_accessories)}
                                                selectedLabel={"e.g. Charger, Bag, Cover"}
                                                defaultValue={props.input.value}
                                                selectedValue={props.input.value}
                                                displaytype={'pagelist'}
                                                inputtype={'dropdown'}
                                                multiselect={'checkbox'}
                                                listtype={'other'}
                                                onAdd={(text: any, callBack: any) => {
                                                    setAccessories((prevState: any) => [...prevState, assignOption(text, text)])
                                                    let value = [text];
                                                    if (!isEmpty(props?.input?.value)) {
                                                        value = [...props.input.value, ...value]
                                                    }
                                                    callBack({value});
                                                }}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value);
                                                    voucher.data.accessories = value;
                                                }}>
                                            </InputField>
                                        )}
                                    </Field>
                                </View>
                            }*/}

                        </Card.Content>
                    </Card>}


                    {(Boolean(values?.customfield) && !isEmpty(Object.keys(values.customfield)
                            .filter((key) => Boolean(hideAssetName) ? !Boolean(values?.customfield[key]?.base) : true))) &&
                        <Card style={[styles.card]}>
                            <Card.Content style={[hasSpace && {paddingHorizontal: 0, paddingVertical: 0}]}>



                                {
                                    Object.keys(values.customfield)
                                        .filter((key) => Boolean(hideAssetName) ? !Boolean(values?.customfield[key]?.base) : true)
                                        .map((key: any, index: any) => {

                                            const {
                                                type,
                                                name,
                                                options,
                                                description,
                                                required: req,
                                                base,
                                                input
                                            } = values.customfield[key];

                                            let fieldname: any = `data[${key}][${name}]`;
                                            if (base) {
                                                fieldname = 'basefield'
                                                if (type === "pattern") {
                                                    fieldname = {
                                                        basefield: {
                                                            type: "",
                                                            typevalue: ""
                                                        }
                                                    }
                                                }
                                            }


                                            return <View key={index}>
                                                {
                                                    type && <>
                                                        {
                                                            (input !== "imei" && (type === "text" || type === "password" || type === "textarea")) &&
                                                            <Field name={fieldname}
                                                                   validate={req || base ? (props: any) => required(props, name) : undefined}>
                                                                {props => (
                                                                    <><InputField
                                                                        {...props}
                                                                        value={props.input.value}
                                                                        label={name}
                                                                        placeholder={''}
                                                                        inputtype={type === "textarea" ? 'textarea' : 'textbox'}
                                                                        secureTextEntry={type === "password"}
                                                                        multiline={type === "textarea"}
                                                                        validateWithError={true}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value);
                                                                            voucher.data[fieldname] = value;
                                                                        }}
                                                                    />
                                                                    </>
                                                                )}
                                                            </Field>
                                                        }
                                                        {
                                                            (input === "imei") &&
                                                            <Field name={fieldname}
                                                                   validate={req || base ? composeValidators((props: any) => required(props, name), minLength(15, name)) : undefined}>
                                                                {props => (
                                                                    <><InputField
                                                                        {...props}
                                                                        value={props.input.value}
                                                                        label={name}
                                                                        placeholder={''}
                                                                        inputtype={'scan'}
                                                                        validateWithError={true}

                                                                        navigation={navigation}
                                                                        onChange={(value: any) => {
                                                                            props.input.onChange(value);
                                                                            voucher.data[fieldname] = value;
                                                                        }}
                                                                        maxLength={15}
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
                                                                                voucher.data[fieldname] = value;
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
                                                                        voucher.data[fieldname] = value;
                                                                    }}/></View>)}
                                                            </Field>
                                                        }

                                                        {
                                                            type === 'pinpattern' &&
                                                            <><Paragraph>{name}</Paragraph>
                                                                <Field
                                                                    name={fieldname}
                                                                    validate={req ? (props: any) => required(props, name) : undefined}>
                                                                    {props => (<PinPattern
                                                                        navigation={navigation}
                                                                        type={props?.input?.value?.type}
                                                                        onChangeType={(type: any) => {
                                                                            let value = {type, typevalue: ""};
                                                                            props.input.onChange(value)
                                                                            voucher.data[fieldname] = value;
                                                                        }}
                                                                        onChangeTypeValue={(typevalue: any, callback: any) => {
                                                                            let value = {...props?.input?.value, typevalue};
                                                                            props.input.onChange(value)
                                                                            voucher.data[fieldname] = value;
                                                                            callback && callback()
                                                                        }}
                                                                        typeValue={props?.input?.value?.typevalue}
                                                                    />)}
                                                                </Field></>
                                                        }

                                                    </>
                                                }
                                            </View>

                                        })
                                }
                            </Card.Content>
                        </Card>}


                </>
            }


        </View>
    </View>
}

const mapStateToProps = (state: any) => ({
    walkthroughactiveStep: state.walkthrough?.activeStep
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AssetsForm));

