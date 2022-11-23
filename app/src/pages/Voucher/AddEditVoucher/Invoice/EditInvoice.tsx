import React, {Component} from 'react';
import {View, Text, ScrollView, DatePickerAndroid, TouchableOpacity} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {InputBox, Button, Container, AppBar, CheckBox} from "../../../../components";
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
    Checkbox
} from "react-native-paper";
import DateTimePicker from '../../../../components/DateTimePicker';
import Dropdown from "../../../../components/Dropdown";
import {clone, findObject, getCurrencySign, log, objToArray, setDecimal, toCurrency} from "../../../../lib/functions";
import {Field, Form} from "react-final-form";

import { TextInput as TI } from 'react-native-paper';
import Awesome from 'react-native-vector-icons/FontAwesome5';
import {setDialog} from "../../../../lib/Store/actions/components";
import {backButton, voucher} from "../../../../lib/setting";
import {setPendingInvoices} from "../../../../lib/Store/actions/appApiData";
import KeyboardScroll from "../../../../components/KeyboardScroll";
import KAccessoryView from "../../../../components/KAccessoryView";
import InputField from "../../../../components/InputField";
let CurrencyFormat = require('react-currency-format');


class ChangeDates extends Component<any> {

    title:any;
    units:any;
    taxes:any;
    constructor(props:any) {
        super(props);
        const {route}:any = this.props;
        let  {invoice,key}:any = route.params;
        this.state = {checked:true,invoice:{...invoice,productratedisplay:setDecimal(invoice.productratedisplay)},key:key};
    }

    componentWillMount() {
        const {settings}:any = this.props;
    }


    handleSubmit = () => {

    }

    updateItem = (item:any,key:any) =>{
        const {setPendingInvoices,pendinginvoices} = this.props;
        pendinginvoices[key] = item;
        setPendingInvoices(clone(pendinginvoices));
    }

    autoFill = () => {
        let {invoice}:any = this.state;
        let rate = invoice.vouchertotaldisplay-invoice.paidamountdisplay;
        invoice = {...invoice,productratedisplay:rate}
        this.setState({invoice:invoice})
    }


    render() {

        const {route,navigation}:any = this.props;
        const {invoice,key,checked}:any = this.state;


        navigation.setOptions({
            headerTitle:(Boolean(invoice?.voucherprefix)?invoice?.voucherprefix:'') +''+invoice.voucherdisplayid,
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });

        return (
        <Container>

            {/*<AppBar  back={true} isModal={false} title={invoice.voucherprefix+''+invoice.voucherdisplayid} navigation={navigation}>

            </AppBar>*/}

                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{...invoice}}>
                    {props => (

                            <View style={[styles.pageContent]}>
                                <KeyboardScroll>

                                    <Card style={[styles.card]}>
                                        <Card.Content>



                                    <View style={[styles.center]}>

                                        <Paragraph style={[styles.paragraph,styles.head,{textAlign:'center'}]}>Due Amount</Paragraph>
                                        <TouchableOpacity onPress={()=>{this.autoFill()}}>
                                            <Paragraph style={[styles.paragraph,styles.mb_10,{textAlign:'center',fontSize:25,height:40,paddingTop:20,fontWeight:'bold'}]}>
                                                {toCurrency(invoice.vouchertotaldisplay-invoice.paidamountdisplay)}
                                            </Paragraph>
                                        </TouchableOpacity>

                                    </View>

                                    <View>


                                        <View>
                                            <Field name="productratedisplay">
                                                {props => (
                                                    <InputField
                                                        value={''+props.input.value}
                                                        label={'Pay Amount'}
                                                        autoFocus={false}
                                                        inputtype={'textbox'}
                                                        keyboardType='numeric'
                                                        left={<TI.Affix text={getCurrencySign()} />}
                                                        onChange={props.input.onChange}
                                                    />
                                                )}
                                            </Field>
                                        </View>


                                       {/* <View>
                                            <Field name="fullamount">
                                                {props2 =>  {
                                                    return (
                                                        <CheckBox  value={props2.input.value} status={'checked'} label={`Pay Full Amount`} onChange={(value:any)=> {
                                                            props.values.productratedisplay = invoice.vouchertotaldisplay-invoice.paidamountdisplay;
                                                            this.updateItem(props.values,key);
                                                            this.forceUpdate()
                                                        }} />

                                                    )
                                                }}
                                            </Field>
                                        </View>*/}


                                        <View>
                                            <Field name="notes">
                                                {props => (
                                                    <InputField
                                                        value={props.input.value}
                                                        label={'Notes'}
                                                        inputtype={'textbox'}
                                                        autoFocus={false}
                                                        multiline={true}
                                                        onChange={props.input.onChange}
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
                                    <Button       onPress={()=>{  this.updateItem(props.values,key); navigation.goBack() }}> Update  </Button>
                                </View>
                            </KAccessoryView>

                           </View>

                    )}
                </Form>




        </Container>

        )
    }

}



const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
    pendinginvoices:state.appApiData.pendinginvoices,
})
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
    setPendingInvoices: (invoices:any) => dispatch(setPendingInvoices(invoices)),
});

export default connect(mapStateToProps,mapDispatchToProps)(ChangeDates);


