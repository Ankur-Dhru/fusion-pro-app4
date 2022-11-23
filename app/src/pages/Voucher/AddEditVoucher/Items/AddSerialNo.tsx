import React, {Component} from 'react';
import {View, Text, ScrollView, DatePickerAndroid, TouchableOpacity} from 'react-native';
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
import {clone, findObject, getCurrencySign, log, objToArray} from "../../../../lib/functions";
import {Field, Form} from "react-final-form";

import { TextInput as TI } from 'react-native-paper';
import Awesome from 'react-native-vector-icons/FontAwesome5';
import {setDialog} from "../../../../lib/Store/actions/components";
import InputField from "../../../../components/InputField";
import {composeValidators, mustBeNumber, required} from "../../../../lib/static";
import Description from "../../../../components/Description";
import {voucher} from "../../../../lib/setting";
let CurrencyFormat = require('react-currency-format');


class AddSerialNo extends Component<any> {

    askonplacetype:any = 'auto'
    constructor(props:any) {
        super(props);

        this.askonplacetype = props.item.identificationtype

        if(props.item.identificationtype === 'askonplace'){
            this.askonplacetype = 'auto'
        }
    }

    componentWillMount() {

    }


    handleSubmit = () => {

    }

    render() {


        const {item,settings} = this.props;

        return (
            <View>

                <View>

                    {<View>

                        <Field name={`serialno`} validate={composeValidators(required)}>
                            {props => (
                                <InputField
                                    {...props}
                                    value={props.input.value}
                                    label={`Serial No.`}
                                    inputtype={'textarea'}
                                    description={`Enter ${item.productqnt} serial nos. (Each serail no in new line)`}
                                    onChange={(value:any)=>{
                                        props.input.onChange(value);
                                    }}
                                />
                            )}
                        </Field>


                    </View>}


                    <View>

                        <Field name={`mfdno`}>
                            {props => (
                                <InputField
                                    {...props}
                                    value={props.input.value+''}
                                    label={'MFD/IMEI No.'}
                                    keyboardType='numeric'
                                    inputtype={'textarea'}
                                    description={`Enter ${item.productqnt} MFD nos. (Each MFD no in new line)`}
                                    onChange={props.input.onChange}
                                />
                            )}
                        </Field>

                    </View>

                </View>
            </View>

        )
    }

}



const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
});


export default connect(mapStateToProps,mapDispatchToProps)(withTheme(AddSerialNo));


