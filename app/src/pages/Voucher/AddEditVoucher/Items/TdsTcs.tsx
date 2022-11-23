import React, {Component} from 'react';
import {TouchableOpacity, View,} from 'react-native';
import {styles} from "../../../../theme";

import {Button, InputBox, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Divider, Paragraph, Text, TextInput, TextInput as TI, Title, withTheme} from "react-native-paper";
import {clone, getCurrencySign, log, logData, objectToArray, toCurrency} from "../../../../lib/functions";
import {voucher} from "../../../../lib/setting";

import Calculator from "../../../../components/Calculator";
import {Field} from "react-final-form";
import InputField from "../../../../components/InputField";
import {v4 as uuidv4} from "uuid";



class Adjustment extends Component<any> {

    constructor(props: any) {
        super(props);
        this.state = {
            showtdstcs: false,
            tdstcs: voucher.data.selectedtdstcs,
        }
    }


    render() {

        const {showtdstcs,tdstcs}: any = this.state;
        const {updateSummary,editmode,settings,updatetdstcs,theme:{colors}}:any = this.props;

        let tcslist:any = []
        let tdslist:any = [];

        objectToArray(settings.tcs).map((value: any) => {
            tcslist.push({label: value.tcsname, value: value.tcsid})
        });

        objectToArray(settings.tds).map((value: any) => {
            tdslist.push({label: value.tdsname, value: value.tdsid})
        });

        return (
            <View>
                {((Boolean(voucher.data.istds) || Boolean(voucher.data.istcs)) && editmode) ? <>

                    <View><Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                        {!showtdstcs &&  <View   style={[styles.fieldspace,{marginTop:12,marginBottom:0}]}>
                            <TouchableOpacity   onPress={()=>  {this.setState({showtdstcs:!showtdstcs},()=>{

                            })} }>
                                <Title  style={[styles.textRight,styles.text_sm,styles.green]} >
                                    + {(Boolean(voucher.data.istds) || Boolean(voucher.data.istcs))?'TDS / TCS':voucher.data.selectedtdstcs}
                                </Title>
                            </TouchableOpacity>
                        </View> }


                        {showtdstcs && <View style={[styles.grid,styles.middle]}>

                            <View style={[styles.cell]}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({showtdstcs: !showtdstcs},()=>{voucher.data.tdsaccount = '', voucher.data.tcsaccount = '';voucher.data.tdstcsamountdisplay='0'; updateSummary()})
                                }}>
                                    <Title style={[styles.textCenter]}>
                                        <ProIcon size={15} name={'circle-xmark'}/>
                                    </Title>
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.cell,styles.w_auto,styles.px_6,styles.mr_2,{borderLeftColor:'#eee',borderLeftWidth:1,borderRightColor:'#eee',borderRightWidth:1}]}>


                                {(Boolean(voucher.data.istds) || Boolean(voucher.data.istcs)) ? <View>
                                        <Field name="selectedtdstcs">
                                            {props => (
                                                <InputField
                                                    label={''}
                                                    mode={'flat'}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'dropdown'}
                                                    search={false}
                                                    listtype={'other'}
                                                    divider={false}
                                                    selectedValue={props.input.value}
                                                    list={[{label: 'TDS', value: 'TDS'}, {label: 'TCS', value: 'TCS'}]}
                                                    value={props.input.value || voucher.data.selectedtdstcs}
                                                    onChange={(value: any) => {
                                                        voucher.data.tdsaccount = '';
                                                        voucher.data.tcsaccount = '';
                                                        voucher.data.tdstcsamountdisplay='';
                                                        props.input.onChange(value);
                                                        voucher.data.selectedtdstcs =value;
                                                        updatetdstcs(value);
                                                        this.setState({tdstcs: value},()=>{ updateSummary(); this.forceUpdate();})
                                                    }}>
                                                </InputField>
                                            )}
                                        </Field>

                                        <View style={{marginTop:-10}} key={uuidv4()}>
                                            <Field name={voucher.data.selectedtdstcs === "TDS" ? "tdsaccount" : "tcsaccount"}>
                                                {props => (
                                                    <>
                                                    <InputField
                                                        label={''}
                                                        mode={'flat'}
                                                        displaytype={'pagelist'}
                                                        inputtype={'dropdown'}
                                                        search={false}
                                                        divider={false}
                                                        listtype={'other'}

                                                        selectedValue={props.input.value}
                                                        list={tdstcs === 'TDS' ? tdslist : tcslist}

                                                        onChange={(value: any) => {
                                                            props.input.onChange(value);
                                                            if (voucher.data.selectedtdstcs === "TDS"){
                                                                voucher.data.tdsaccount =value
                                                            }else {
                                                                voucher.data.tcsaccount =value
                                                            }
                                                            updateSummary()
                                                            this.forceUpdate();
                                                        }}>
                                                    </InputField>

                                                    </>

                                                )}
                                            </Field>
                                        </View>

                                    </View> :
                                    <View><Paragraph>{voucher.data.selectedtdstcs}</Paragraph></View>}

                            </View>


                            <View style={[styles.cell,{paddingRight:0}]}><Paragraph  style={[styles.textRight, styles.text_xs]}>{toCurrency(voucher.data.tdstcsamountdisplay || '0')}</Paragraph></View>

                        </View> }

                    </View>

                </>
                : <View>
                        {Boolean(voucher.data?.tdstcsamountdisplay) &&  <View style={[styles.grid,styles.middle,styles.fieldspace,{marginTop:12}]}>
                    <View style={[styles.cell,styles.w_auto]}>
                        <Paragraph  style={[styles.paragraph,styles.text_xs]} >
                            TDS/TCS
                        </Paragraph>
                    </View>
                    <View style={[styles.cell,{paddingRight:0}]}><Paragraph
                        style={[styles.paragraph,styles.textRight, styles.text_xs]}>{toCurrency(voucher.data.tdstcsamountdisplay || '0')}</Paragraph></View>
                </View>}
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


