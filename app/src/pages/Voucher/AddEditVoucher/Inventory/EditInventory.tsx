import React, {Component} from 'react';
import {
    View,
    Text,
    ScrollView,
    DatePickerAndroid,
    TextInput as TextInputReact,
    Keyboard,
    TouchableOpacity
} from 'react-native';
import {styles} from "../../../../theme";

import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {InputBox, Button, Container, AppBar} from "../../../../components";
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
    Checkbox, withTheme
} from "react-native-paper";
import KAccessoryView from "../../../../components/KAccessoryView";
import DateTimePicker from '../../../../components/DateTimePicker';
import Dropdown from "../../../../components/Dropdown";
import {clone, findObject, getCurrencySign, log, objToArray, toCurrency} from "../../../../lib/functions";
import {Field, Form} from "react-final-form";

import { TextInput as TI } from 'react-native-paper';
import Awesome from 'react-native-vector-icons/FontAwesome5';
import {setDialog} from "../../../../lib/Store/actions/components";
import InputField from "../../../../components/InputField";
import {backButton, voucher} from "../../../../lib/setting";
import {required} from "../../../../lib/static";
import KeyboardScroll from "../../../../components/KeyboardScroll";
let CurrencyFormat = require('react-currency-format');


class ChangeDates extends Component<any> {

    title:any;
    units:any;

    initdata: any;

    taxes:any;
    constructor(props:any) {
        super(props);
        this.state = {checked:true};
    }

    componentWillMount() {
        const {route}: any = this.props;
        const {item}: any = route.params;

        this.initdata = item;
    }


    handleSubmit = (values:any) => {
        const {route,navigation}: any = this.props;
        const {updateItem}: any = route.params;
        //values.productrate = values.productratedisplay / voucher.data.vouchercurrencyrate;
        updateItem(values);
        navigation.goBack()
    }




    render() {

        const {route, settings,navigation}: any = this.props;

        const {colors} = this.props.theme;

        navigation.setOptions({
            headerTitle:'Edit Item',
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });

        let isSpecificItem = Boolean(this.initdata?.inventorytype === "specificidentification")

        return (
        <Container>


            <Form
                onSubmit={this.handleSubmit}
                initialValues={{
                    ...this.initdata,
                }}
                render={({ handleSubmit, submitting, values, ...more}:any) => (
                    <View  style={[styles.pageContent]}>
                    <KeyboardScroll>
                        <View>
                            <Card style={[styles.card]}>

                                    <Card.Content>
                                        <View>


                                            <InputField
                                                value={values.stockonhand+' '+values.unit}
                                                label={`Available Qnt`}
                                                inputtype={'textbox'}
                                                disabled={true}
                                                autoFocus={false}
                                            />



                                            <Field name="productqnt" validate={required}>
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        value={'' + props.input.value || 0}
                                                        label={'Actual Qty'}
                                                        divider={true}
                                                        inputtype={'textbox'}
                                                        keyboardType='numeric'
                                                        autoFocus={false}
                                                        disabled={isSpecificItem}
                                                        right={<TextInput.Affix text={values.unit}/>}
                                                        onChange={(value:any)=> {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>

                                            {Boolean(values.productqnt) &&  <InputField
                                                value={(values.productqnt - values.stockonhand) +' '+values.unit}
                                                label={`Adjusted Qnt`}
                                                inputtype={'textbox'}
                                                disabled={true}
                                                autoFocus={false}
                                            />}

                                            <Field name="productrate">
                                                {props => (
                                                    <InputField
                                                        {...props}
                                                        value={'' + props.input.value}
                                                        label={'Price / Qnt'}
                                                        divider={true}
                                                        inputtype={'textbox'}
                                                        keyboardType='numeric'
                                                        autoFocus={false}
                                                        disabled={true}
                                                        left={<TextInput.Affix text={getCurrencySign()}/>}
                                                        onChange={(value:any)=> {
                                                            props.input.onChange(value)
                                                        }}
                                                    />
                                                )}
                                            </Field>

                                        </View>

                                        {
                                            isSpecificItem &&
                                            <View style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                <TouchableOpacity onPress={() => {
                                                    navigation.navigate('RemoveSerialStock', {
                                                        item:this.initdata,
                                                        updateItem: (item:any)=>{
                                                            this.initdata = item;
                                                            this.forceUpdate()
                                                        }
                                                    })
                                                }}>
                                                    <Paragraph style={[styles.paragraph, {color:colors.secondary}]}>Serial No.</Paragraph>
                                                </TouchableOpacity>
                                            </View>
                                        }

                                    </Card.Content>

                                </Card>
                        </View>
                    </KeyboardScroll>

                    <KAccessoryView>
                        <View style={[styles.submitbutton]}>
                            <Button disable={more.invalid} secondbutton={more.invalid}    onPress={() => {
                                Keyboard.dismiss();
                                handleSubmit(values)
                            }}> Update </Button>
                        </View>
                    </KAccessoryView>

                </View>
                    )} />

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


