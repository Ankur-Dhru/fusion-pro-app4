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
import {Card, DataTable, Divider, Paragraph, Title, List, TouchableRipple, withTheme} from "react-native-paper";
import moment from "moment";

import {getCurrencySign, log, objToArray, toCurrency} from "../../../../lib/functions";
import AddedItems from "../Items/AddedItems";
import AddedExpense from "./AddedExpense";





class VoucherDate extends Component<any> {

    initdata:any = {};
    paymentmethod:any;
    constructor(props:any) {
        super(props);
        this.initdata = props.initdata
        this.state={showitems:false}
    }



    render() {

        const {navigation,editmode,validate,theme:{colors}}:any = this.props


        return (

            <View>

                <View>

                    <AddedExpense  navigation={navigation} editmode={editmode} hidetitle={true} />
                    <View>
                        {editmode && <View ><TouchableOpacity     style={[styles.fieldspace]}  onPress={()=> {navigation.push('SearchExpense', {validate: validate,editmode:editmode})}}>
                            <View style={[styles.grid,styles.middle]}>
                                <ProIcon color={styles.green.color}  action_type={'text'}   name={'circle-plus'}/>
                                <Paragraph  style={[styles.paragraph,styles.text_sm,styles.green,{marginHorizontal:5}]}>
                                    Add Expense
                                </Paragraph>
                            </View>
                        </TouchableOpacity>
                            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                        </View> }
                    </View>
                </View>

                {/*<ExpenseSummary/>*/}

            </View>
        )
    }

}



const mapStateToProps = (state:any) => ({
    voucheritems:state.appApiData.voucheritems,
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({

});


export default connect(mapStateToProps,mapDispatchToProps)(withTheme(VoucherDate));


