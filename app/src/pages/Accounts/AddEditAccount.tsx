import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    DatePickerAndroid,
    TouchableOpacity,
    Platform,
    TextInput as TextInputReact
} from 'react-native';
import {styles} from "../../theme";

import {InputBox, Button, Container, AppBar} from "../../components";
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
import Dropdown from "../../components/Dropdown";
import Dropdown2 from "../../components/Dropdown2";
import {Field, Form} from "react-final-form";

import {assignOption, required} from "../../lib/static";
import BottomSpace from "../../components/BottomSpace";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
let CurrencyFormat = require('react-currency-format');
import KAccessoryView from '../../components/KAccessoryView';
import HTML from 'react-native-render-html';
import {backButton} from "../../lib/setting";
import ListLoader from "../../components/ContentLoader/ListLoader";
import FormLoader from "../../components/ContentLoader/FormLoader";
import InputField from "../../components/InputField";
import KeyboardScroll from "../../components/KeyboardScroll";
import { OnChange } from 'react-final-form-listeners'
import {log} from "../../lib/functions";
import {v4 as uuidv4} from "uuid";

class AddEditAccount extends Component<any> {

    title:any = 'Add Chart of Account';
    initdata:any = {accountinfo:'',accountmid: '',accountname: "",accountno: "",accountstatus: '1',accountsubtype: "",accounttype: ""}
    desc:any;

    params:any;

    constructor(props:any) {
        super(props);

        this.state = {isLoading:true}

        const {route}:any = this.props;
        const {account}:any = route.params;
        this.params = route.params


        if (account && Boolean(account.accountid)){
            this.title = `${account.accountname}`;
            this.initdata = {...this.initdata,...account}
        }

    }


    handleSubmit = (values:any) => {
        requestApi({
            method: Boolean(this.initdata.accountid)?methods.put:methods.post,
            action: actions.chartofaccount,
            body: values,
        }).then((result) => {
            if (result.status ===SUCCESS) {
                this.props.navigation.goBack()
               if(Boolean(this.params.getAccounts)){
                    this.params.getAccounts()
                }
            }
        });
    }


    render() {

        const {route,accounttypes,chartofaccount,navigation}:any = this.props;

        const {isLoading}:any=this.state

        const {colors}:any = this.props.theme

        const {account}:any = route.params;
        const {accounttype,accountsubtype}:any = this.initdata

        const optionAccounttypes = Object.keys(accounttypes).map((k) => assignOption(k, k));
        const chartofaccounts = chartofaccount.map((account:any,key:any) => assignOption(account.accountname, account.accountid));

        let optionAccountSubtype: any = [];
        if (accounttype) {
            this.desc = '';
            optionAccountSubtype = Object.keys(accounttypes[accounttype]).map((k) => assignOption(k, k));
        }
        if (accountsubtype) {
            this.desc = accounttypes[accounttype][accountsubtype];
        }

        if(!isLoading){
            return <FormLoader />
        }


        navigation.setOptions({
            headerTitle:this.title,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{`${this.title}`}</Title>,
            })
        }


        return (
            <Container>




                    <Form
                        onSubmit={this.handleSubmit}
                        initialValues={{...this.initdata}}
                        render={({ handleSubmit, submitting, values,form, ...more}:any) => (
                            <View style={[styles.pageContent]}>
                                <KeyboardScroll>
                                    <Card style={[styles.card]}>

                                        <Card.Content>
                                            <View>

                                                <Field name="accountstatus">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Active'}
                                                            value={props.input.value === '1'}
                                                            inputtype={'switch'}
                                                            onChange={(value:any) => {
                                                                props.input.onChange(value?1:0);
                                                            }}>
                                                        </InputField>
                                                    )}
                                                </Field>


                                                <Field name="accounttype" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Account Type'}
                                                            mode={'flat'}
                                                            list={optionAccounttypes}
                                                            editmode={values.issystemaccount !== '1'}
                                                            value={props.input.value}
                                                            selectedValue={props.input.value}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            listtype={'other'}
                                                            onChange={(value:any) => {
                                                                props.input.onChange(value);
                                                                this.desc = '';
                                                                values.accountsubtype = '';
                                                                optionAccountSubtype = Object.keys(accounttypes[value]).map((k) => assignOption(k, k));
                                                            }}>
                                                        </InputField>
                                                    )}
                                                </Field>

                                                {Boolean(optionAccountSubtype.length) && <View>

                                                    <Field name="accountsubtype"  validate={required}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                key={uuidv4()}
                                                                label={'Account Sub Type'}
                                                                mode={'flat'}
                                                                list={optionAccountSubtype}
                                                                editmode={values.issystemaccount !== '1'}
                                                                value={props.input.value}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value:any) => {
                                                                    props.input.onChange(value);
                                                                    this.desc = accounttypes[values.accounttype][value];
                                                                }}>
                                                            </InputField>
                                                        )}
                                                    </Field>


                                                    {Platform.OS === 'ios' && Boolean(this.desc) && <Paragraph style={[styles.paragraph,styles.mb_5,styles.mt_5]}>
                                                        <HTML baseStyle={{color:colors.inputLabel}}  source={{ html: this.desc }}   />
                                                    </Paragraph>}



                                                    <Field name="accountmid">
                                                        {props => (
                                                            <InputField
                                                                label={'Listed in Account'}
                                                                mode={'flat'}
                                                                list={chartofaccounts || []}
                                                                value={props.input.value}
                                                                editmode={values.issystemaccount !== '1'}
                                                                selectedValue={props.input.value}
                                                                displaytype={'pagelist'}
                                                                inputtype={'dropdown'}
                                                                listtype={'other'}
                                                                onChange={(value:any) => { props.input.onChange(value);}}>
                                                            </InputField>
                                                        )}
                                                    </Field>


                                                    <Field name="accountname"  validate={required}>
                                                        {props => (
                                                            <InputField
                                                                {...props}
                                                                value={props.input.value}
                                                                editmode={values.issystemaccount !== '1'}
                                                                label={'Name'}
                                                                inputtype={'textbox'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>


                                                    <Field name="accountno">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                label={'Account Code'}
                                                                inputtype={'textbox'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>


                                                    <Field name="accountinfo">
                                                        {props => (
                                                            <InputField
                                                                value={props.input.value}
                                                                editmode={values.issystemaccount !== '1'}
                                                                defaultValue={props.input.value}
                                                                label={'Account Info'}
                                                                inputtype={'textarea'}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>


                                                </View>}

                                            </View>

                                        </Card.Content>

                                    </Card>
                                </KeyboardScroll>

                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button  disable={more.invalid} secondbutton={more.invalid}    onPress={()=>{ handleSubmit(values) }}>   {Boolean(account)?'Update':'Add'} </Button>
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
    accounttypes: state.appApiData.settings.staticdata.accounttypes,
    chartofaccount: state.appApiData.settings.chartofaccount,
})
const mapDispatchToProps = (dispatch:any) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(AddEditAccount));


