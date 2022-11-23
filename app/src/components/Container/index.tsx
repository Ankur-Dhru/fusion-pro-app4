import * as React from 'react';
import {Surface, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {KeyboardAvoidingView, Platform} from "react-native";


class Index extends React.Component<any> {
    render(){
        const {children,surface,theme:{colors}}:any = this.props;
        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

        return (

            <Surface style={[styles.coverScreen,{backgroundColor:surface?colors.surface:colors.screenbg}]} {...this.props}>
                {children}
            </Surface>

        );
    }
}



export default  withTheme(Index)
