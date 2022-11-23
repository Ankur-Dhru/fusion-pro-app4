import React, {Component} from 'react';
import {TouchableOpacity, View,} from 'react-native';
import {styles} from "../../../../theme";

import {Button, InputBox, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Divider, Paragraph, Text, TextInput, TextInput as TI, Title, withTheme} from "react-native-paper";
import {clone, getCurrencySign, log, logData, objectToArray, toCurrency} from "../../../../lib/functions";
import {voucher} from "../../../../lib/setting";

import Calculator from "../../../../components/Calculator";
import {getFloatValue, getRoundOffValue} from "../../../../lib/voucher_calc";



class Adjustment extends Component<any> {

    constructor(props: any) {
        super(props);
        this.state = {
            showadjustment: props.showadjustment,
            adjustmentamount:0
        }
    }




    render() {

        const {showadjustment, adjustmentamount}: any = this.state;
        const {updateSummary,editmode,showAdjustment,settings,theme:{colors}}:any = this.props;


        return (
            <View>
                {voucher.data.isadjustment && editmode ? <>

                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>

                {!showadjustment &&  <View   style={[styles.fieldspace,styles.grid,styles.justifyContent, {marginTop:10,marginBottom: 0}]}>
                    <TouchableOpacity   onPress={()=>  {
                        let amountDisplay =  getRoundOffValue("auto", voucher.data?.totalwithoutroundoffdisplay, settings.currency?.[voucher.data.currency]?.decimalplace) - voucher.data?.totalwithoutroundoffdisplay
                        voucher.data.adjustmentamount = ''+ getFloatValue(amountDisplay,settings.currency?.[voucher.data.currency]?.decimalplace);
                        this.setState({showadjustment:!showadjustment,adjustmentamount: voucher.data.adjustmentamount},()=> showAdjustment(!showadjustment))}
                    }>
                        <Title  style={[styles.textRight,styles.text_sm,styles.uppercase,styles.green]} >
                            Auto Adjust
                        </Title>
                    </TouchableOpacity>

                    <TouchableOpacity   onPress={()=>  {this.setState({showadjustment:!showadjustment},()=> showAdjustment(!showadjustment))} }>
                        <Title  style={[styles.textRight,styles.text_sm,styles.uppercase,styles.green]} >
                             + Adjustment
                        </Title>
                    </TouchableOpacity>
                    </View> }

                    {showadjustment && <View style={[styles.fieldspace,{marginTop:10,marginBottom: 0}]}><View style={[styles.grid, styles.middle]}>
                        <View style={[styles.cell]}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({showadjustment: !showadjustment},()=> { voucher.data.adjustmentamount = 0; showAdjustment(!showadjustment); updateSummary()})
                                }}>
                                    <Title style={[styles.textCenter]}>
                                        <ProIcon size={16} name={'circle-xmark'}/>
                                    </Title>
                                </TouchableOpacity>
                            </View>

                        {/*<View style={[styles.cell]}>
                            <Paragraph>Adjustment</Paragraph>
                        </View>*/}

                        <View style={[styles.cell, styles.w_auto]}>

                            <View>

                                <TextInput
                                    style={[styles.input]}
                                    mode={'flat'}
                                    defaultValue={voucher.data.adjustmentlabel}
                                    outlineColor="transparent"
                                    dense={true}
                                    disabled={!editmode}
                                    onChangeText={(value:any) => {
                                        voucher.data.adjustmentlabel = value;
                                    }}

                                />

                            </View>

                        </View>

                        <View style={[styles.cell,{width:70}]}>
                            <View style={[styles.bg_global]}>


                                <TextInput
                                    style={[styles.input]}
                                    mode={'flat'}
                                    defaultValue={voucher.data.adjustmentamount}
                                    left={<TI.Affix text={getCurrencySign()}/>}
                                    outlineColor="transparent"
                                    dense={true}
                                    keyboardType={'numeric'}
                                    autoFocus={true}
                                    disabled={!editmode}
                                    onChangeText={(value:any) => { voucher.data.adjustmentamount = value;
                                        this.setState({adjustmentamount: value},()=> {updateSummary()}) }}

                                />


                                {/*<Calculator
                                    label={''}
                                    value={voucher.data.adjustmentamount}
                                    onChange={(value: any) => {
                                        voucher.data.adjustmentamount = value;
                                        this.setState({adjustmentamount: value},()=> {updateSummary()})
                                    }}
                                    left={<TI.Affix text={getCurrencySign()}/>}
                                    fieldContainerStyle={{padding:0,margin:0}}
                                />*/}
                            </View>
                        </View>

                        <View style={[styles.cell,{paddingRight:0,width:100}]}><Paragraph
                            style={[styles.textRight, styles.head]}>{toCurrency(voucher.data.adjustmentamount || 0)}</Paragraph></View>

                    </View>

                    </View> }

                </> : <View>
                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                    <View style={[styles.grid,styles.middle,styles.fieldspace,{marginTop:12}]}>
                        <View style={[styles.cell,styles.w_auto]}>
                            <Paragraph  style={[styles.paragraph,styles.text_xs,styles.uppercase]} >
                                {voucher.data.adjustmentlabel}
                            </Paragraph>
                        </View>
                        <View style={[styles.cell,{paddingRight:0}]}><Paragraph  style={[styles.textRight, styles.text_xs]}>{toCurrency(voucher.data.adjustmentamount || '0')}</Paragraph></View>
                    </View>
                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]} />
                </View>}
            </View>
        )
    }

}





const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Adjustment));


