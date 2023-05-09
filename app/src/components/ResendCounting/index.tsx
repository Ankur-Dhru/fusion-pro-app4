import React, {useEffect, useRef, useState} from "react";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import {Paragraph} from "react-native-paper";
import {colors} from "react-native-elements";

const Resend = ({ onResendOTP }: any) => {
    const time = 60;
    const [counter, setCounter] = useState(time);
    let intervalId: any = useRef(null);
    const startInterval = () => {
        intervalId.current = setInterval(() => {
            setCounter((prevState) => {
                let c = prevState - 1;
                if (c == 0) {
                    clearInterval(intervalId.current);
                }
                return c;
            });
        }, 1000);
    };
    useEffect(() => {
        startInterval();
        return () => clearInterval(intervalId.current);
    }, []);
    let enabled = Boolean(counter == 0);

    if(enabled){
        return (
            <View style={[styles.py_5, styles.middle, {marginBottom: 10, marginTop: 10}]}>
                <TouchableOpacity onPress={() => {
                    if(enabled) {
                        setCounter(time);
                        onResendOTP();
                        startInterval();
                    }
                }}>
                    <Paragraph  style={[{color: '#016EFE'}]}> Resend OTP </Paragraph>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[styles.py_5, styles.middle, {marginBottom: 10, marginTop: 10}]}>
            <Paragraph  style={[{color: '#016EFE'}]}>  { `Resend OTP After ${counter} Second`} </Paragraph>
        </View>
    )


};
export default Resend;
