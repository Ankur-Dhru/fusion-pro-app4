import * as React from 'react';
import {Button, withTheme} from 'react-native-paper';
import {styles} from "../../theme";

class Index extends React.Component<any> {

    render(){
        let {label,children,contentStyle,mode,more,secondbutton,compact}:any = this.props;
        const {colors}:any = this.props.theme;
        if(secondbutton){
            more={
                ...more,
                backgroundColor:'#E6EFFE',
                color:colors.secondary
            }
        }
        return (
            <Button
                 mode={'contained'}
                 style={{borderRadius:8,elevation:0}}
                 contentStyle={{height:compact?'auto':45,backgroundColor:!Boolean(mode) ? colors.secondary : 'transparent',...more}}
                 labelStyle={[styles.capitalize,styles.bold,{color:secondbutton?more.color:'white'}]}
                 {...this.props}
            >{children}</Button>
        );
    }
}

export default (withTheme(Index))
