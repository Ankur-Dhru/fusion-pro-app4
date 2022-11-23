import * as React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {View,Platform} from "react-native";
import {InputBox} from "../index";
import moment from "moment";
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {connect} from "react-redux";


class DateTime extends React.Component<any> {
    constructor(props:any) {
        super(props);
        this.state = {show:false,mode:'date',date:new Date(),...props};

    }

    showMode = (currentMode:any) => {
        this.setShow(true);
        this.setMode(currentMode);
    };

    setShow = (flag:any) =>{
        this.setState({show:flag})
    }
    setMode = (mode:any) =>{
        this.setState({mode:mode})
    }
    setDate = (date:any) =>{
        this.setState({date:date})
    }

    showDatepicker = () => {
        const {mode} = this.props;
        this.showMode(mode);
    };


    onChange = (selectedDate:any) => {
        const {onValueChanged} = this.props;
        const {date}:any = this.state;
        const currentDate = selectedDate || date;
        onValueChanged(currentDate);
        this.setShow(false);
        this.setDate(currentDate);
    };

    render(){

        const {show}:any = this.state;
        const {label,mode, date,settings} = this.props;
        const dateformat:any = settings.general.dateformat;

        return (
            <View>


                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={this.onChange}
                />


                {/*<View>
                    <InputBox
                        value={moment(date).format(`${mode === 'date'?dateformat:`${dateformat} HH:mm`}`)}
                        label={label}
                        mode={'flat'}
                        outlineColor="transparent"
                        autoFocus={false}
                        editable = {true}
                        right={<TextInput.Icon name="calendar" onPress={this.showDatepicker}  />}

                    />
                </View>*/}


                {/*<DateTimePickerModal
                    isVisible={show}
                    mode={mode}
                    is24Hour={true}
                    onConfirm={(date:any)=>this.onChange(date)}
                    onCancel={()=>this.setState({show:false})}
                />*/}

               {/* {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        is24Hour={true}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={this.onChange}
                    />
                )}*/}
            </View>
        );
    }
}


const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({

});


export default connect(mapStateToProps,mapDispatchToProps)(DateTime);
