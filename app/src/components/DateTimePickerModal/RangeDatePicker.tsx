import moment from "moment";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import DateRangePicker from "rn-select-date-range";


const App = ({selectItem}:any) => {
    const [selectedRange, setRange]:any = useState({});

    const onConfirm =() => {
        const dates = {dateto:selectedRange.firstDate,datefrom:selectedRange.secondDate,startdate:selectedRange.firstDate,enddate:selectedRange.secondDate}
        selectItem({"id": "Custom Range", "title": "Custom Range", "value": { "endtime": "11:59 PM", "starttime": "12:00 AM",...dates}})
    }

    return (
        <SafeAreaView>
            <View style={style.container}>
                <DateRangePicker
                    onSelectDateRange={(range) => {
                        setRange(range);
                    }}
                    blockSingleDateSelection={true}
                    responseFormat="YYYY-MM-DD"
                    confirmBtnTitle={'OK'}
                    onConfirm={onConfirm}
                    maxDate={moment()}
                    minDate={moment().subtract(100, "days")}
                    selectedDateContainerStyle={style.selectedDateContainerStyle}
                    selectedDateStyle={style.selectedDateStyle}
                />
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
        backgroundColor: '#222A55'
    },
    selectedDateStyle: {
        fontWeight: "bold",
        color: "white",
    },
});

export default App;
