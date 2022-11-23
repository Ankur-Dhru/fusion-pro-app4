import * as React from 'react';
import {Button, Paragraph} from 'react-native-paper';
import {styles} from "../../theme";
import {Platform, View} from "react-native";
import {KeyboardAccessoryView} from "react-native-keyboard-accessory";

export default class Index extends React.Component<any> {

    render(){
        const {children}:any = this.props;
        return (
            <>
                <View>{children}</View>
                {Platform.OS === 'ios' &&  <KeyboardAccessoryView  style={{backgroundColor:'transparent'}} hideBorder={true}>
                    {children}
                </KeyboardAccessoryView>}
            </>
        );
    }
}
