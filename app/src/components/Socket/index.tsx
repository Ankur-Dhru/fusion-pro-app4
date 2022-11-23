import {useNetInfo} from "@react-native-community/netinfo";
import {View} from "react-native";
import * as React from 'react';
import {styles} from "../../theme";
import {log} from "../../lib/functions";



export const Socket = () => {
    const netInfo:any = useNetInfo();

    return (
        <View>
            <View style={[styles.absolute,{width:8,height:8,backgroundColor:netInfo.isConnected?'green':'red',top:25,borderRadius:5}]}></View>
        </View>
    );
};
