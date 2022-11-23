import React from "react";
import Swipeout from "rc-swipeout";
import {styles} from "../../../theme";
import {TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, withTheme} from "react-native-paper";
import {toCurrency} from "../../../lib/functions";
import {connect} from "react-redux";
import {ProIcon} from "../../../components";

const AddedConsumable = ({products, removeProduct,showRemove,isDone, theme: {colors}}: any) => {

    const renderItem = ({item, index}: any) => {

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => removeProduct(index),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={isDone}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >
            <View key={item.itemunique}>
                <View style={[styles.py_2]}>
                    <View>
                        <View style={[styles.grid,styles.middle,styles.py_4]}>
                            {/*{Boolean(showRemove) &&<View>
                                <TouchableOpacity onPress={() => removeProduct(index)}>
                                    <ProIcon color={'#a72929'} name={'times-circle'}/>
                                </TouchableOpacity>
                            </View>}*/}
                            <View style={[styles.w_auto]}>
                                <Paragraph style={[styles.paragraph, styles.text_sm, styles.bold, styles.ellipse]}
                                           numberOfLines={1}>{item.name}</Paragraph>

                                {Boolean(item.serial) && <Paragraph
                                    style={[styles.paragraph, styles.muted, styles.text_xs]}>SN.
                                    NO.{item.serial}</Paragraph>}
                            </View>
                            <View>
                                <Paragraph
                                    style={[styles.paragraph, styles.text_sm, styles.textRight, styles.bold]}>
                                    {toCurrency(item.price || '0')}
                                </Paragraph>
                            </View>
                        </View>
                    </View>
                </View>
                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </View>
        </Swipeout>
    }

    return (Boolean(products.length) ? <View style={[styles.mb_5]}>{
        products.map((item: any, index: number) => {
            return renderItem({item, index})
        })
    }
    </View> : <></>)
}

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddedConsumable));

