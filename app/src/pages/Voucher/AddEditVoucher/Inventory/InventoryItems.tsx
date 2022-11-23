import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    TouchableNativeFeedback,
    TouchableWithoutFeedback
} from 'react-native';
import {styles} from "../../../../theme";

import {Button, InputBox, Menu, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Card, DataTable, Paragraph, Title, List, TouchableRipple, Divider} from "react-native-paper";

import moment from "moment";

import {getCurrencySign, log, objToArray, toCurrency} from "../../../../lib/functions";
import AddedInventory from "./AddedInventory";


class InventoryItems extends Component<any> {

    constructor(props: any) {
        super(props);
    }

    // cartitem

    render() {

        const {navigation, validate, editmode}: any = this.props

        return (

            <View>
                <View>
                    <AddedInventory navigation={navigation} hidetitle={true} editmode={editmode}/>
                    <View>
                        {editmode && <View>
                            <TouchableOpacity style={[styles.fieldspace]} onPress={() => {
                                navigation.push('SearchInventory', {validate: validate, editmode: editmode})
                            }}>
                                <View style={[styles.grid, styles.middle]}>
                                    <ProIcon color={styles.green.color} action_type={'text'} name={'circle-plus'}/>
                                    <Paragraph
                                        style={[styles.paragraph, styles.text_sm, styles.green, {marginHorizontal: 5}]}>
                                        Add product
                                    </Paragraph>
                                </View>
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
            </View>
        )
    }

}


const mapStateToProps = (state: any) => ({
    voucheritems: state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(InventoryItems);


