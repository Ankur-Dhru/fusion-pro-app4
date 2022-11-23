import * as React from 'react';
import {Appbar, Button} from 'react-native-paper';
import {styles} from "../../theme";
import Search from "../SearchBox";

import {View} from "react-native";
import {ProIcon} from "../index";

export default class Index extends React.Component<any> {

    render(){
        const {label,navigation}:any = this.props;
        return (
            <View style={[styles.p_6]}><ProIcon name={'circle-user'} type={'solid'}  size={26} onPress={()=> {navigation.openDrawer()} } /></View>
        );
    }
}
