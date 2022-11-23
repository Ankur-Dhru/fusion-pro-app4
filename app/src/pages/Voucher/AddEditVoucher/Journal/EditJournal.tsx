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
import {assignOption, composeValidators, mustBeNumber, options_itc, required} from "../../../../lib/static";
import SerialItem from "../Items/SerialItem";
import ClientDetail from "../Client/ClientDetail";
import {setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";
import {v4 as uuidv4} from "uuid";
import KeyboardScroll from "../../../../components/KeyboardScroll";
import KAccessoryView from '../../../../components/KAccessoryView';
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

        if(!Boolean(item?.productqnt)){
            item.productrate = '';
            item.clientid = '';
            item.clientname = '';
        }

        this.initdata = item;


    }

    selectClient = (client:any) => {
        this.initdata.clientid = client.clientid;
        this.initdata.clientname = client.displayname;
        this.forceUpdate()
    }


    handleSubmit = (values:any) => {
        const {route,navigation,setVoucherItems,updateVoucherItems}: any = this.props;
        const {updateItem,productdisplayname}: any = route.params;

        values.productdisplayname = productdisplayname;
        if(Boolean(values.productqnt)){
            setVoucherItems(clone(values));
        }
        else{
            values.itemunique = uuidv4();
            values.productqnt = 1;
            values.voucherrelatedid = 2;
            setVoucherItems(clone(values));
        }

        navigation.goBack()
    }




    render() {


        const {route,navigation,settings,theme:{colors}}:any = this.props;
        const {updateItem,productdisplayname}: any = route.params;



        const option_accounts = settings.chartofaccount.map((account:any) => assignOption(account.accountname, account.accountid));


        navigation.setOptions({
            headerTitle:`${this.initdata?.productqnt?'Edit':'Add'} ${productdisplayname === 'dr'?'Debit':'Credit'}`,
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });


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

                                            <Field name="accountid" validate={composeValidators(required)}>
                                                {props => (
                                                    <>
                                                        <InputField
                                                            {...props}
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
                                                                this.initdata.accountid = value;
                                                                props.input.onChange(value)
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </Field>


                                            <Field name="productrate" validate={composeValidators(required,mustBeNumber)}>
                                                {props =>  {
                                                    return (<InputField
                                                        {...props}
                                                        value={props.input.value}
                                                        label={`${productdisplayname === 'dr'?'Debit':'Credit'} Amount`}
                                                        keyboardType='numeric'
                                                        inputtype={'textbox'}
                                                        autoFocus={false}
                                                        left={<TextInput.Affix text={getCurrencySign()} />}
                                                        onChange={(value:any)=> {
                                                            this.initdata.productrate = value;
                                                            props.input.onChange(value)
                                                        }}
                                                    />)
                                                }}
                                            </Field>


                                            <View style={[{marginHorizontal:-15}]}>
                                                <ClientDetail selectClient={this.selectClient} item={this.initdata}  foritem={true}  editmode={true}  navigation={navigation}/>
                                            </View>



                                            <View style={[styles.mb_5]}>
                                                <Field name="productremark">
                                                    {props => (

                                                        <TextInputReact
                                                            onChange={props.input.onChange}
                                                            defaultValue={props.input.value}
                                                            placeholderTextColor={colors.inputLabel}
                                                            style={[styles.inputLabel,styles.mb_5,{fontSize:16,color:colors.inputbox}]}
                                                            placeholder={'Notes'}
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
                                    }}> {this.initdata?.productqnt?'Update':'Add'}</Button>
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
    setVoucherItems: (items:any) => dispatch(setVoucherItems(items)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(ChangeDates));


