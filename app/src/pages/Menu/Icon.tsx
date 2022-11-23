import * as React from 'react';
import {Divider, IconButton, Paragraph, Text, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {TouchableOpacity, View} from "react-native";


import {ProIcon} from "../../components";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {ACCESS_TYPE} from "../../lib/static";
import {chevronRight} from "../../lib/setting";
import {log} from "../../lib/functions";

class Index extends React.Component<any> {

    render() {
        const {item, handleNavigation,length,key, gridview,theme:{colors}, fromSetting}: any = this.props;

        return (<>
            {gridview ? <View style={[styles.mb_5, {width: '25%', marginTop: 10}]}>
                <TouchableOpacity
                    onPress={() => fromSetting ? handleNavigation(item) : handleNavigation('Voucher', item, false)}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <View style={{width: 50}}>
                            <View style={[{backgroundColor: `${item.color}2b`, borderRadius: 50}]}>
                                <IconButton
                                    icon={() => <ProIcon name={item.icon} color={item.color} size={20}/>}
                                />
                                {/*{item.add && <View style={[styles.absolute, {
                                    right: 0,
                                    bottom: 5,
                                    backgroundColor: item.color,
                                    height: 12,
                                    width: 12,
                                    borderRadius: 50
                                }]}>
                                    <MCIcon name={'plus'} color={'white'} size={12}/>
                                </View>}*/}
                            </View>
                        </View>
                    </View>
                    <Paragraph
                        style={[styles.paragraph, styles.text_xs,styles.mt_2, styles.textCenter, {lineHeight: 15}]}>{item.label}</Paragraph>
                </TouchableOpacity>
            </View> : <><View style={[styles.w_100]}>

                <View>
                    <View style={[styles.grid,styles.middle,styles.py_5,styles.w_100]}>
                        <TouchableOpacity  style={[styles.grid,styles.middle,styles.noWrap,styles.w_auto]} onPress={() => fromSetting ? handleNavigation(item) : handleNavigation('Voucher', item, false)}>
                            <ProIcon name={item.icon} type={'light'} color={item.color} size={18}/>
                            <Paragraph  style={[styles.paragraph,styles.ml_2]}>{item.label}</Paragraph>
                        </TouchableOpacity>
                        <View style={[styles.ml_auto]}>
                            <View>
                                {
                                    item.accessType[ACCESS_TYPE.ADD] &&
                                    <TouchableOpacity onPress={() => fromSetting ? handleNavigation(item) : handleNavigation('Voucher', item, true)}>
                                        <Text><MCIcon name={'plus'} size={20}  /></Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                </View>

                {<Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>}

            </View>

            </>

            }
        </>);
    }
}

export default withTheme(Index)
