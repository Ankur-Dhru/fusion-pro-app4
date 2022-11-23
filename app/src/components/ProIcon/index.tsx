import * as React from 'react';
import Icon from "react-native-fontawesome-pro";
import {withTheme,Text} from "react-native-paper";
import {styles} from "../../theme";
import {TouchableOpacity} from "react-native-gesture-handler";
import {log} from "../../lib/functions";

class Index extends React.Component<any> {

    render() {

        try {

            const {colors}: any = this.props.theme;
            const {
                size = 20,
                type = 'light',
                name,
                color = colors.inputbox,
                onPress,
                align = 'center',
                action_type = 'button'
            }: any = this.props;


            //return <TouchableOpacity><Text>{name}</Text></TouchableOpacity>

            return (
                <>
                    {action_type === 'button' ? <><TouchableOpacity style={[styles.center, {
                            height: 30,
                            width: 35,

                            alignItems: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
                        }]} onPress={onPress}>
                            <Icon name={name} type={type} color={color} size={size}/>
                        </TouchableOpacity>

                        </>
                        :
                        <>
                            <Icon name={name} type={type} color={color} size={size}/>
                        </>
                    }
                </>
            );
        }
        catch (e) {
            log('e',e)
        }
    }
}

export default (withTheme(Index))
