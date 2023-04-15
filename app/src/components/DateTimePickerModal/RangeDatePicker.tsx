import moment from "moment";
import React, { useState } from "react";
import {SafeAreaView, StyleSheet, View, Text, TouchableOpacity} from "react-native";
import DateRangePicker from "rn-select-date-range";
import {styles} from "../../theme";
import {Paragraph} from "react-native-paper";
import {errorAlert, toDateFormat} from "../../lib/functions";


const App = ({selectItem}:any) => {
    const [selectedRange, setRange]:any = useState({});

    const onConfirm =() => {
        if(Boolean(selectedRange?.firstDate)) {
            const dates = {
                dateto: selectedRange.firstDate,
                datefrom: selectedRange.secondDate,
                startdate: selectedRange.firstDate,
                enddate: selectedRange.secondDate,
                label: toDateFormat(selectedRange.firstDate) + ' To ' + toDateFormat(selectedRange.secondDate)
            }
            selectItem({
                "id": "Custom Range",
                "title": "Custom Range",
                "value": {"endtime": "11:59 PM", "starttime": "12:00 AM", ...dates}
            })
        }
        else{
            errorAlert('please select secound date or press 2 times on same date for single date selection')
        }
    }

    return (
        <SafeAreaView>
            <View style={style.container}>
                <DateRangePicker
                    onSelectDateRange={(range) => {
                        setRange(range);
                    }}
                    blockSingleDateSelection={false}
                    responseFormat="YYYY-MM-DD"
                    confirmBtnTitle={''}
                    clearBtnTitle={''}
                    onConfirm={onConfirm}
                    maxDate={moment()}
                    minDate={moment().subtract(100, "days")}
                    selectedDateContainerStyle={style.selectedDateContainerStyle}
                    selectedDateStyle={style.selectedDateStyle}
                />

                <TouchableOpacity onPress={() => {
                    onConfirm()
                }} style={[styles.px_6,styles.p_5,styles.m_2,styles.bg_light,{borderRadius:5,}]}>
                    <Paragraph style={[styles.paragraph,styles.textCenter,styles.bold]}>Apply</Paragraph>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const style = StyleSheet.create({
    container: {
        margin: 20,
    },
    selectedDateContainerStyle: {
        height: 35,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#126AFB'
    },
    selectedDateStyle: {
        fontWeight: "bold",
        color: "white",
    },
});

export default App;
