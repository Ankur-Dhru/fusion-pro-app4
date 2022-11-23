import React from 'react'
import { View } from 'react-native'
import { CalculatorInput } from 'react-native-calculator'
import {Paragraph, Text, Title, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import {Divider} from "react-native-paper";

class Index extends React.Component<any> {
    render() {
        const { colors } = this.props.theme;
        const {onChange,label}:any = this.props;
        return (
            <View>
                {Boolean(label) && <Text style={[styles.inputLabel]}>{label}</Text>}
                <CalculatorInput
                    onChange={(e:any) => { onChange(e) }}
                    fieldTextStyle={{fontSize:18,color:colors.inputbox}}
                    fieldContainerStyle={{padding:0,margin:0}}

                    numericButtonBackgroundColor={'black'}
                    acceptButtonBackgroundColor={'#222A55'}
                    borderColor={'#ffffff3b'}
                    roundTo={2}
                    thousandSeparator={''}
                    displayColor={'black'}
                    displayTextAlign={'right'}

                    /*hideDisplay={true}*/
                    actionButtonBackgroundColor={'#ccc'}
                    actionButtonColor={'black'}
                    calcButtonColor={'white'}
                    noDecimal={false}
                    {...this.props}
                />

            </View>
        )
    }
}

export default  (withTheme(Index));
