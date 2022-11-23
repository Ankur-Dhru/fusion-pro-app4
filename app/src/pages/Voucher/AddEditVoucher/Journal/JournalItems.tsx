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

import {clone, getCurrencySign, log, objectToArray, objToArray, toCurrency} from "../../../../lib/functions";
import AddedJournal from "./AddedJournal";
import {voucher} from "../../../../lib/setting";



class VoucherDate extends Component<any> {

    initdata:any = {};

    constructor(props:any) {
        super(props);
        this.initdata = props.initdata
        this.state={creditshowitems:false,debitshowitems:false}
    }



    render() {

        const {navigation,editmode,voucheritems,validate,theme:{colors}}:any = this.props;

        let crtotal = 0;
        let drtotal = 0;
        let crdifference = 0;
        let drdifference = 0;

        voucher.data.invoiceitems = objectToArray(clone(voucheritems));

        Object.keys(voucheritems).map((key:any)=>{
            const {productrate,productdisplayname}:any = voucheritems[key];
            if(productdisplayname === 'dr'){
                drtotal += +productrate;
            }
            if(productdisplayname === 'cr'){
                crtotal += +productrate;
            }
            drdifference = drtotal - crtotal;
            crdifference = crtotal - drtotal;
        })

        voucher.data.drtotal = drtotal;
        voucher.data.crtotal = crtotal;

        voucher.data.vouchertotaldisplay = voucher.data.vouchertotal = drtotal;



        return (

            <View>

                <AddedJournal type={"dr"}  navigation={navigation} disableButton={true}   editmode={editmode}  />

                <View style={{marginBottom:20}}>
                    {editmode &&  <TouchableOpacity     style={[styles.fieldspace,{paddingTop:14}]}  onPress={()=> {

                        navigation.navigate('EditJournal', {
                            item:{},
                            productdisplayname:'dr'
                        })

                        //navigation.push('SearchJournal', {type: 'Debit',productdisplayname:'dr',validate: validate,editmode:editmode})
                    }
                    }>

                        <View style={[styles.grid,styles.middle]}>
                            <ProIcon color={styles.red.color}  action_type={'text'}   name={'circle-plus'}/>
                            <Paragraph  style={[styles.paragraph,styles.text_sm,styles.red,{marginHorizontal:5}]}>
                                Add Debit
                            </Paragraph>
                        </View>

                    </TouchableOpacity>}
                </View>




                <AddedJournal  type={"cr"}  navigation={navigation} disableButton={true}   editmode={editmode}  />

                <View style={{marginBottom:20}}>
                    {editmode &&  <TouchableOpacity     style={[styles.fieldspace,{paddingTop:14}]}  onPress={()=> {
                        navigation.navigate('EditJournal', {
                            item:{},
                            productdisplayname:'cr'
                        })
                        //navigation.push('SearchJournal', {type: 'Credit',productdisplayname:'cr',validate: validate,editmode:editmode})
                    }}>
                        <View style={[styles.grid,styles.middle]}>
                            <ProIcon color={styles.green.color}  action_type={'text'}   name={'circle-plus'}/>
                            <Paragraph  style={[styles.paragraph,styles.text_sm,styles.green,{marginHorizontal:5}]}>
                                Add Credit
                            </Paragraph>
                        </View>
                    </TouchableOpacity>}
                </View>




                <View   style={[{paddingTop:14}]}>

                    <View style={[styles.row,{marginBottom:0}]}>
                        <View style={[styles.cell, styles.w_auto]}><Paragraph style={[styles.paragraph]}>Total</Paragraph></View>
                        <View style={[styles.cell, {width: 100}]}><Paragraph
                            style={[styles.textRight, styles.red,styles.paragraph]}>{toCurrency(drtotal || '0')}</Paragraph></View>
                        <View style={[styles.cell, {width: 100,paddingRight: 0}]}><Paragraph
                            style={[styles.textRight,styles.paragraph, styles.green]}>{toCurrency(crtotal || '0')}</Paragraph></View>
                    </View>



                    <View style={[styles.row]}>
                        <View style={[styles.cell, styles.w_auto]}><Paragraph  style={[styles.paragraph]}>Difference</Paragraph></View>
                        <View style={[styles.cell, {width: 100}]}><Paragraph
                            style={[styles.textRight,styles.paragraph, styles.red, styles.bold]}>{toCurrency(drdifference > 0 ? drdifference : '0')}</Paragraph></View>
                        <View style={[styles.cell, {width: 100,paddingRight: 0}]}><Paragraph
                            style={[styles.textRight,styles.paragraph, styles.green, styles.bold]}>{toCurrency(crdifference > 0 ? crdifference : '0')}</Paragraph></View>
                    </View>

                </View>


                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>

            </View>
        )
    }

}



const mapStateToProps = (state:any) => ({
    voucheritems:state.appApiData.voucheritems,
})
const mapDispatchToProps = (dispatch:any) => ({

});


export default connect(mapStateToProps,mapDispatchToProps)(withTheme(VoucherDate));


