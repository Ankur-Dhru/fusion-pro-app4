import React, {Component} from 'react';
import {View, Text, ScrollView, DatePickerAndroid, TouchableOpacity, Platform} from 'react-native';
import {styles} from "../../theme";

import {InputBox, Button, Container, AppBar, CheckBox, ProIcon} from "../../components";
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
    TextInput as TI, withTheme,
} from "react-native-paper";
import Dropdown from "../../components/Dropdown";
import Dropdown2 from "../../components/Dropdown2";
import {clone, errorAlert, findObject, getCurrencySign, log, objToArray} from "../../lib/functions";
import {Field, Form} from "react-final-form";

import BottomSpace from "../../components/BottomSpace";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {assignOption, inventoryOption, options_itc, required} from "../../lib/static";
import {pricing} from "../../lib/static";
import {setAlert} from "../../lib/Store/actions/components";
import {backButton, nav, voucher} from "../../lib/setting";
import Icon from "react-native-fontawesome-pro";
import FormLoader from "../../components/ContentLoader/FormLoader";
import InputField from '../../components/InputField';
import {v4 as uuidv4} from "uuid";
import KeyboardScroll from "../../components/KeyboardScroll";
import KAccessoryView from '../../components/KAccessoryView';


class AddEditCategory extends Component<any> {

    title:any = 'Add Product Category';

    params:any;

    initdata:any = {
        itemgroupcolor: "#000000",
        itemgroupid: uuidv4(),
        itemgroupmid: "0",
        itemgroupname: "",
        itemgroupstatus: "1",
    }

    constructor(props:any) {
        super(props);
        this.state = {showitems:false,};

        const {route:{params}}:any = this.props;
        this.params = params;

    }

    componentWillMount() {
        if(this.params?.category && this.params?.category?.itemgroupid){
            this.initdata = {
                ...this.initdata,
                ...this.params.category
            }
            this.title = this.initdata.itemgroupname
        }
    }


    handleSubmit = (values:any) => {

        requestApi({
            method: methods.put,
            action: actions.settings,
            body:{settingid:'itemgroup',settingdata:[{"key":values.itemgroupid,"value":values}]},
            showlog:true
        }).then((result) => {
            if (result.status ===SUCCESS) {
                nav.saveGroup && nav.saveGroup({[values.itemgroupid]:values},values.itemgroupid)
                this.props.navigation.goBack();
                if(Boolean(this.params.getInitData)){
                    this.params.getInitData()
                }
            }
        });

    }



    render() {

        const {navigation,itemgroups,theme:{colors}}:any = this.props;

        const mastergroups:any = objToArray(itemgroups);
        const mastergroups_options = mastergroups.filter((group:any)=>{
            return group.itemgroupid !== this.initdata.itemgroupid
        }).map((group:any,key:any) => assignOption(group.itemgroupname, group.itemgroupid));

        navigation.setOptions({
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{this.title}</Title>,
            })
        }


        navigation.setOptions({
            headerTitle:this.title,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
        });

        return (
            <Container>

                    <Form
                        onSubmit={this.handleSubmit}
                        initialValues={{...this.initdata}}
                        render={({ handleSubmit, submitting, values, ...more}:any) => (
                            <View style={[styles.pageContent]}>
                                <KeyboardScroll>
                                    <Card style={[styles.card]}>

                                        <Card.Content>
                                            <View>

                                                <Field name="itemgroupstatus">
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            label={'Active'}
                                                            value={Boolean(props.input.value)}
                                                            inputtype={'switch'}
                                                            onChange={(value:any) => {
                                                                props.input.onChange(value?1:0);
                                                            }}>
                                                        </InputField>
                                                    )}
                                                </Field>


                                                <Field name="itemgroupname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Category Name'}
                                                            inputtype={'textbox'}
                                                            onChange={props.input.onChange}
                                                        />
                                                    )}
                                                </Field>


                                                <Field name="itemgroupmid">
                                                    {props => (
                                                        <InputField
                                                            label={'Parent Category'}
                                                            divider={true}
                                                            displaytype={'pagelist'}
                                                            inputtype={'dropdown'}
                                                            list={mastergroups_options}
                                                            search={false}
                                                            listtype={'other'}
                                                            selectedValue={props.input.value}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>


                                            </View>

                                        </Card.Content>

                                    </Card>
                                </KeyboardScroll>

                                <KAccessoryView>
                                    <View style={[styles.submitbutton]}>
                                        <Button   disable={more.invalid} secondbutton={more.invalid}     onPress={()=>{ handleSubmit(values) }}>  {this.initdata.itemgroupid?'Update':'Add'} </Button>
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
    itemgroups: state.appApiData.settings.itemgroup,
})
const mapDispatchToProps = (dispatch:any) => ({
    setAlert: (alert: any) => dispatch(setAlert(alert))
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(AddEditCategory));


