import React, {Component} from 'react';
import {
    KeyboardAvoidingView, ScrollView, TouchableOpacity,
    View,
} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";

import {getCurrencySign, log, objToArray} from "../../../../lib/functions";
import Dropdown2 from "../../../../components/Dropdown2";
import {InputBox, ProIcon} from "../../../../components";
import {Field} from "react-final-form";
import {
    Checkbox,
    TextInput as TI,
    RadioButton,
    Paragraph,
    Button,
    Title,
    Divider,
    withTheme,
    Card
} from "react-native-paper";

import {red50} from "react-native-paper/lib/typescript/styles/colors";
import {chevronRight, voucher} from "../../../../lib/setting";
import {v4 as uuidv4} from "uuid";


class VoucherView extends Component<any> {

    initdata: any = {};
    paymentmethod: any = [];

    constructor(props: any) {
        super(props);
        this.initdata = props.initdata
    }


    render() {

        const {navigation, editmode, theme: {colors},handleSubmit} = this.props;

        const {showcustomernote,showtoc}:any = voucher.type;

        const hasNotes = ((voucher.settings.notes && showcustomernote) || (voucher.settings.termscondition && showtoc))


        return (


            <View>

                {hasNotes && <Card style={[styles.card]} key={uuidv4()}>
                    <Card.Content>

                        {(voucher.settings.notes && showcustomernote) && <View>

                            <TouchableOpacity onPress={() => {
                                navigation.push('CustomerNotes', {
                                    screen: 'CustomerNotes',
                                    editmode: editmode,
                                    handleSubmit:handleSubmit
                                })
                            }} style={{paddingBottom: 10}}>
                                <View style={[styles.grid, styles.justifyContent, styles.middle,styles.noWrap]}>
                                    <Paragraph
                                        style={[styles.paragraph, styles.head]}>{voucher.type.screentype === 'sales' ? 'Customer Notes' : voucher.type.screentype === 'purchase' ? 'Notes (Internal use. Not visible to Vendor)' : 'Notes'}</Paragraph>
                                    <View>
                                        {chevronRight}
                                    </View>
                                </View>
                            </TouchableOpacity>

                            <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>

                        </View>}

                        {(voucher.settings.termscondition && showtoc) && <View>
                            <TouchableOpacity onPress={() => {
                                navigation.push('TermsCondition', {
                                    screen: 'TermsCondition',
                                    editmode: editmode
                                })
                            }} style={{paddingTop: 10}}>
                                <View style={[styles.grid, styles.justifyContent, styles.middle]}>
                                    <Paragraph style={[styles.paragraph, styles.head]}>Terms & Condition</Paragraph>
                                    <View>
                                        {chevronRight}
                                    </View>
                                </View>
                            </TouchableOpacity>

                        </View>}

                    </Card.Content>
                </Card>}


            </View>


        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(VoucherView));


