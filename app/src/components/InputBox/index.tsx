import * as React from 'react';
import {TextInput, withTheme, Text, Paragraph,Divider} from 'react-native-paper';
import {styles} from "../../theme";
import {View} from "react-native";



class Index extends React.Component<any> {
    state = {
        text: ''
    };

    render(){
        const {label,value,defaultValue,onChange,width,extrastyle,editmode=true,underlineColor='transparent',labelstyle}:any = this.props;
        const {colors} = this.props.theme;

        return (
            <View>
                <TextInput
                    value={value}
                    defaultValue={defaultValue}
                    style={[styles.input,{width:width,backgroundColor:colors.backgroundColor,...extrastyle}]}
                    mode={'flat'}
                    outlineColor="transparent"
                    dense={true}
                    disabled={!editmode}
                    underlineColor={underlineColor}
                    onChangeText={(e:any) => { onChange(e) }}
                    {...this.props}
                    label={<Text style={labelstyle}>{label}</Text>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </View>
        );
    }
}

export default withTheme(Index)
