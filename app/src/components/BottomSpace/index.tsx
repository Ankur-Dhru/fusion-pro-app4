import * as React from 'react';
import {View} from "react-native";
import { Platform } from 'react-native';

export default class Index extends React.Component<any> {

    render(){
        return (
            <View style={{height:Platform.OS==='ios'?260:50}}></View>
        );
    }
}
