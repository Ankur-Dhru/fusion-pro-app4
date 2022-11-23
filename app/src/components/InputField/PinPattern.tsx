import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, RadioButton, Text, withTheme} from "react-native-paper";
import {styles} from "../../theme";
import InputField from "./index";
import {chevronRight} from "../../lib/setting";
import ProIcon from "../ProIcon";

class PinPattern extends Component<any, any> {

    render() {
        const {onChangeType, type, onChangeTypeValue, typeValue, navigation, theme: {colors}} = this.props;

        return (
            <View>
                <View style={{marginLeft: -8}}>

                        <View style={[styles.grid]}>
                            <View>
                                <TouchableOpacity onPress={()=>onChangeType('pin')}>
                                    <View style={[styles.grid, styles.middle]}>
                                        {<ProIcon   name={type==='pin'?'circle-check':'circle'} />}
                                        <Paragraph style={[styles.paragraph, styles.text_sm]}>
                                            PIN
                                        </Paragraph>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={[{marginLeft:15}]}>
                                <TouchableOpacity onPress={()=>onChangeType('pattern')}>
                                    <View style={[styles.grid, styles.middle]}>
                                        {<ProIcon   name={type==='pattern'?'circle-check':'circle'}   />}
                                        <Paragraph style={[styles.paragraph, styles.text_sm]}>
                                            Pattern
                                        </Paragraph>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                </View>

                {
                    Boolean(type) && <View>
                        {
                            Boolean(type === "pin") && <InputField
                                value={Boolean(typeValue)?typeValue.toString():""}
                                label={"PIN"}
                                inputtype={'textbox'}
                                validateWithError={true}
                                keyboardType='numeric'
                                onChange={onChangeTypeValue}
                            />
                        }
                        {
                            Boolean(type === "pattern") && <View style={{paddingBottom: 10}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.push("PatternScreen",{onChangeTypeValue, pattern: typeValue})
                                    }}
                                    style={{paddingBottom: 12, paddingTop:12}}>
                                    <View style={[styles.grid, styles.justifyContent, styles.middle, styles.noWrap]}>
                                        <Paragraph
                                            style={[styles.paragraph, styles.head]}>{Boolean(typeValue) ? `View Pattern` :"Set Pattern"}</Paragraph>
                                        <View>
                                            {chevronRight}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                            </View>
                        }
                    </View>
                }
            </View>
        );
    }
}

export default withTheme(PinPattern);
