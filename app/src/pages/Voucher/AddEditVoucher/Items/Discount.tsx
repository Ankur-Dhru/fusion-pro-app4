import React, {Component} from 'react';
import {TouchableOpacity, View,} from 'react-native';
import {styles} from "../../../../theme";

import {Button, InputBox, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Paragraph, TextInput, TextInput as TI, Title, Divider, withTheme} from "react-native-paper";

import {clone, getCurrencySign, log, logData, objectToArray, toCurrency} from "../../../../lib/functions";
import {voucher} from "../../../../lib/setting";
import {Field} from "react-final-form";
import Dropdown from "../../../../components/Dropdown";
import {assignOption} from "../../../../lib/static";


import Calculator from "../../../../components/Calculator";



class Adjustment extends Component<any> {

    constructor(props: any) {
        super(props);

        this.state = {
            showdiscount: Boolean(voucher?.data?.voucherglobaldiscountdisplay),
            discountamount: 0,
            adjustmentamount: 0,
            discounttype:voucher.data.discounttype,
            globaldiscountvalue:voucher.data.globaldiscountvalue
        }
    }


    render() {

        const {showdiscount, discounttype, discountamount, globaldiscountvalue}: any = this.state;
        const {chartofaccount,updateSummary,editmode,theme:{colors}}: any = this.props;

        return (
            <View>
                {(voucher.data.vouchertransitionaldiscount && editmode) ? <View style={[]}>
                    {!showdiscount && <View><TouchableOpacity  style={[styles.fieldspace,{marginTop:10}]}  onPress={()=>  {this.setState({showdiscount:!showdiscount})} }>
                        <Title  style={[styles.textRight,styles.text_sm,styles.uppercase,styles.green]} >
                            + Discount
                        </Title>
                    </TouchableOpacity></View> }
                    {showdiscount &&
                        <View >

                            <View  style={[styles.fieldspace,{marginTop:10}]} >

                        <View style={[styles.grid,styles.middle]} >



                        <View style={[styles.cell]}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({showdiscount: !showdiscount,globaldiscountvalue:0},()=> { voucher.data.globaldiscountvalue = 0; updateSummary() })
                                }}>
                                    <Title style={[styles.textCenter]}>
                                        <ProIcon  name={'circle-xmark'} size={16} />
                                    </Title>
                                </TouchableOpacity>
                            </View>

                        <View style={[styles.cell]}>
                            <Paragraph>Discount</Paragraph>
                        </View>

                        {/*<View style={[styles.cell, styles.w_auto]}>

                            {Boolean(voucher.data.canchangediscoutnaccount) && <Field name="discountaccount">
                                {props => (
                                    <Dropdown
                                        label={'Discount Account'}
                                        mode={'flat'}
                                        list={chartofaccount.map((t: any) => assignOption(t.accountname, t.accountid))}
                                        value={props.input.value}
                                        onChange={(value: any) => {
                                            props.input.onChange(value)
                                        }}>
                                    </Dropdown>
                                )}
                            </Field>}

                        </View>*/}

                       {/* <View style={[styles.cell, styles.w_auto]}>
                            <Field name="discountpercentage">
                                {props => (
                                    <InputBox
                                        label={``}
                                        autoFocus={true}
                                        keyboardType='numeric'
                                        right={ <TI.Affix text={'%'}/>}
                                        onChange={(value: any) => {
                                            voucher.data.discountpercentage = value;
                                            this.setState({discountpercentage: value})
                                        }}
                                        onBlur={updateSummary()}
                                    />
                                )}
                            </Field>
                        </View>


                        <View style={[styles.cell, styles.w_auto]}>
                            <Field name="discountamount">
                                {props => (
                                    <InputBox
                                        label={``}
                                        autoFocus={false}
                                        keyboardType='numeric'
                                        left={<TI.Affix text={getCurrencySign()}/>}
                                        extrastyle={{textAlign:'right'}}
                                        onChange={(value: any) => {
                                            voucher.data.discountamount = value;
                                            this.setState({discountamount: value})
                                        }}
                                        onBlur={updateSummary()}
                                    />
                                )}
                            </Field>
                        </View>*/}

                        <View style={[styles.cell, styles.w_auto,{paddingRight:0}]}>

                            <TextInput
                                style={[styles.input]}
                                mode={'flat'}
                                value={globaldiscountvalue}
                                defaultValue={globaldiscountvalue}
                                left={<TI.Affix text={voucher.data.discounttype === '%' ? '' : getCurrencySign()}/>}
                                outlineColor="transparent"
                                dense={true}
                                keyboardType={'numeric'}
                                autoFocus={false}
                                disabled={!editmode}
                                onBlur={updateSummary()}
                                onChangeText={(value:any) => {
                                    this.setState({globaldiscountvalue: value},()=>{
                                        voucher.data.globaldiscountvalue = value;
                                        this.forceUpdate()
                                    })
                                }}

                            />


                            {/*<Calculator
                                label={''}
                                value={globaldiscountvalue}
                                style={{width:'100%'}}
                                onChange={(value: any) => {
                                    this.setState({globaldiscountvalue: value},()=>{
                                        voucher.data.globaldiscountvalue = value;
                                        this.forceUpdate()
                                    })
                                }}
                                onBlur={updateSummary()}
                            />*/}
                        </View>

                        <View style={[styles.cell,{marginLeft:10}]}>

                            <TouchableOpacity onPress={() => {
                                this.setState({discounttype: discounttype === '%' ? getCurrencySign() : '%'},()=>{
                                    const {discounttype}: any = this.state;
                                    voucher.data.discounttype = discounttype;
                                    this.forceUpdate()
                                })
                            }}>
                                <View style={[styles.grid,styles.middle]}>
                                    <Paragraph  style={[styles.paragraph,styles.text_sm]}>
                                        {voucher.data.discounttype === '%' ? '%' : getCurrencySign()}
                                    </Paragraph>
                                    <ProIcon   name={'angle-down'}/>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <View style={[styles.cell,{paddingRight:0,width:100}]}><Paragraph
                            style={[styles.textRight, styles.head]}>{toCurrency(voucher.data.voucherglobaldiscountdisplay || '0')}</Paragraph></View>

                    </View>

                            </View>

                        </View>
                    }
                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                </View> : <View style={[]}>
                    {Boolean(voucher.data.voucherglobaldiscountdisplay) && <View><View style={[styles.grid,styles.middle,styles.fieldspace,{marginTop:12}]}>
                        <View style={[styles.cell,styles.w_auto]}>
                            <Paragraph  style={[styles.paragraph,styles.text_sm,styles.uppercase]} >
                                 Discount
                            </Paragraph>
                        </View>
                        <View style={[styles.cell,{paddingRight:0}]}><Paragraph
                            style={[styles.textRight, styles.head]}>{toCurrency(voucher.data.voucherglobaldiscountdisplay || '0')}</Paragraph></View>
                    </View></View>}
                </View> }

            </View>
        )
    }

}





const mapStateToProps = (state: any) => ({
    chartofaccount: state.appApiData.settings.chartofaccount,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Adjustment));


