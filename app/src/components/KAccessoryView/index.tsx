import * as React from 'react';
import {KeyboardAccessoryView} from "react-native-keyboard-accessory";

export default class Index extends React.Component<any> {

    render(){
        const {children}:any = this.props;
        return (
            <KeyboardAccessoryView alwaysVisible={true} style={{backgroundColor:'transparent'}}  hideBorder={true} avoidKeyboard={true} androidAdjustResize={true} heightProperty={"minHeight"} >
                {children}
            </KeyboardAccessoryView>
        );
    }
}
