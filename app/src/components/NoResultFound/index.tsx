import * as React from 'react';
import {Button, withTheme} from 'react-native-paper';
import {Image} from "react-native";
import {log} from "../../lib/functions";

class Index extends React.Component<any> {

    render(){
        const {theme:{colors,dark}}:any = this.props

        return (
            <Image
                style={[{height: 150, width: 150, opacity: 0.5}]}
                source={dark?require('../../assets/noitems-invert.png'):require('../../assets/noitems.png')}
            />
        );
    }
}

export default (withTheme(Index))
