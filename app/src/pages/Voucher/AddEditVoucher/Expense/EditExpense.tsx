import React, {Component} from 'react';
import {View, Text, ScrollView, DatePickerAndroid, TouchableOpacity, TextInput as TextInputReact} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {InputBox, Button, Container, AppBar, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {
    Appbar,
    Card,
    DataTable,
    Menu,
    Paragraph,
    Searchbar,
    Title,
    List,
    Surface,
    TextInput,
    withTheme
} from "react-native-paper";
import DateTimePicker from '../../../../components/DateTimePicker';
import Dropdown from "../../../../components/Dropdown";
import {clone, findObject, getCurrencySign, getType, log, objToArray} from "../../../../lib/functions";
import {Field, Form} from "react-final-form";

import { TextInput as TI } from 'react-native-paper';
import Awesome from 'react-native-vector-icons/FontAwesome5';
import {setDialog} from "../../../../lib/Store/actions/components";
import {backButton, voucher} from "../../../../lib/setting";
import InputField from "../../../../components/InputField";
import {
    assignOption,
    composeValidators,
    currencylist,
    mustBeNumber,
    options_itc,
    required
} from "../../../../lib/static";
import SerialItem from "../Items/SerialItem";
import KeyboardScroll from "../../../../components/KeyboardScroll";
import KAccessoryView from "../../../../components/KAccessoryView";
let CurrencyFormat = require('react-currency-format');


class ChangeDates extends Component<any> {

    title:any;
    units:any;
    taxes:any;
    initdata:any;

    constructor(props:any) {
        super(props);

    }

    componentWillMount() {

        const {route,settings}: any = this.props;
        const {item}: any = route.params;
        this.initdata = item;

        this.taxes = Object.keys(settings.tax).map((key:any)=>{
            return {label: settings.tax[key].taxgroupname, value: settings.tax[key].taxgroupid}
        });
    }


    handleSubmit = (values:any) => {
        const {route,navigation}: any = this.props;
        values.productrate = values.productratedisplay / voucher.data.vouchercurrencyrate;
        const {updateItem}: any = route.params;
        updateItem(values);
        navigation.goBack()
    }




    render() {

        const {route,navigation,settings,theme:{colors}}:any = this.props;


        const option_accounts = settings.chartofaccount.map((account:any) => assignOption(account.accountname, account.accountid));


        navigation.setOptions({
            headerTitle:'Edit Expense',
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });

        const option_notaxreason:any = Object.keys(settings?.reason?.notaxreason).map((key:any)=>{
            let reason = settings?.reason?.notaxreason[key];
            return {label:reason,value:key}
        })

        return (
        <Container>


            <Form
                onSubmit={this.handleSubmit}
                initialValues={{
                    ...this.initdata,
                }}
                render={({ handleSubmit, submitting, values, ...more}:any) => (
                    <View style={[styles.pageContent]}>
                        <KeyboardScroll>
                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>

                                        <Field name="accountid" >
                                            {props => (
                                                <>
                                                    <InputField
                                                        label={'Account'}
                                                        divider={true}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        list={option_accounts}
                                                        search={false}
                                                        listtype={'other'}
                                                        selectedValue={props.input.value}
                                                        onChange={(value: any,obj:any) => {
                                                            values.accountname = obj.label;
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </Field>


                                        <Field name="productratedisplay" validate={composeValidators(required,mustBeNumber)}>
                                            {props =>  {
                                                return (<InputField
                                                    {...props}
                                                    value={props.input.value}
                                                    defaultValue={ parseFloat(props.input.value).toFixed(2)+''}
                                                    label={'Expense Amount'}
                                                    keyboardType='numeric'
                                                    inputtype={'textbox'}
                                                    autoFocus={false}
                                                    left={<TextInput.Affix text={getCurrencySign()} />}
                                                    onChange={(value:any)=> {
                                                        more.form.change("productrate", value)
                                                        props.input.onChange(value)
                                                    }}
                                                />)
                                            }}
                                        </Field>

                                        <Field name="itemtype">
                                            {props => (
                                                <>
                                                    <InputField
                                                        label={'Expense Type'}
                                                        divider={true}
                                                        displaytype={'bottomlist'}
                                                        inputtype={'dropdown'}
                                                        list={[{value:'services',label:'Services'},{value:'goods',label:'Goods'}]}
                                                        search={false}
                                                        listtype={'other'}
                                                        selectedValue={props.input.value}
                                                        onChange={(value: any) => {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </Field>

                                        {Boolean(values.itemtype) &&  <Field name="hsn">
                                            {props =>  {
                                                return (<InputField
                                                    value={props.input.value}
                                                    label={`${values.itemtype === 'services'?'SAC':'HSN Code'}`}
                                                    inputtype={'textbox'}
                                                    keyboardType='numeric'
                                                    autoFocus={false}
                                                    onChange={props.input.onChange}
                                                />)
                                            }}
                                        </Field>}


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
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </Field>


                                        {voucher.settings.eligibleforitc && <>{settings?.tax[values?.producttaxgroupid]?.notaxreasonenable ?
                                            <Field name="taxreason" validate={required}>
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
                                                            onChange={(value: any,obj:any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                            :
                                            <Field name="itc" validate={required}>
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
                                                            onChange={(value: any,obj:any) => {
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        }</>}


                                        <View style={[styles.mb_5]}>
                                            <Field name="productremark">
                                                {props => (

                                                    <TextInputReact
                                                        onChange={props.input.onChange}
                                                        defaultValue={props.input.value}
                                                        placeholder={'Notes'}
                                                        placeholderTextColor={colors.inputLabel}
                                                        style={[styles.inputLabel,styles.mb_5,{fontSize:16,color:colors.inputbox}]}
                                                        multiline={true}
                                                    />

                                                )}
                                            </Field>

                                        </View>


                                    </View>

                                </Card.Content>

                            </Card>
                        </KeyboardScroll>

                        <KAccessoryView>
                            <View style={[styles.submitbutton]}>
                                <Button disable={more.invalid} secondbutton={more.invalid}    onPress={() => {
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



const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(ChangeDates));


