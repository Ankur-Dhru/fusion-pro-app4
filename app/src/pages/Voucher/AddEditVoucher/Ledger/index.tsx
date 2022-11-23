import React, {Component} from 'react';
import {
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";
import {Paragraph, Divider, withTheme} from "react-native-paper";

import {voucher} from "../../../../lib/setting";
import {log, toCurrency} from "../../../../lib/functions";



class Ledger extends Component<any> {


    constructor(props:any) {
        super(props);
    }


    render() {

        const {row,summary}:any = voucher.data.ledger;
        const {theme:{colors},companydetails}:any = this.props;


        let currentcompany = companydetails.companies[companydetails.currentuser];
        let companycurrency = currentcompany?.defaultcurrency?.__key;


        return (
            <View>

                <View  style={[styles.mt_4]}>

                    <View style={[styles.grid,styles.py_4]}>

                        <View style={[styles.cell,styles.w_auto,{paddingLeft:0}]}>
                            <Paragraph style={[styles.paragraph,styles.bold]}>Account</Paragraph>
                        </View>

                        <View style={[styles.cell,{width:100}]}>
                            <Paragraph style={[styles.textRight,styles.bold]}>
                                Credit
                            </Paragraph>
                        </View>

                        <View style={[styles.cell,{paddingRight:0,width:100}]}>
                            <Paragraph style={[styles.textRight,styles.bold]}>
                                Debit
                            </Paragraph>
                        </View>

                    </View>

                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>

                {
                    Boolean(row) && Object.keys(row).map((key:any)=>{
                        const obj = row[key];


                        return (
                            <View>


                                    <View style={[styles.grid,styles.middle,styles.py_4]}>

                                        <View style={[styles.cell,styles.w_auto,{paddingLeft:0}]}>
                                            <Paragraph style={[styles.paragraph]}>{obj.account}</Paragraph>
                                        </View>

                                        <View style={[styles.cell,{width:100}]}>
                                            <Paragraph style={[styles.paragraph, styles.textRight,styles.green]}>
                                                {toCurrency(obj.credit+'',companycurrency)}
                                            </Paragraph>
                                        </View>

                                        <View style={[styles.cell,{paddingRight:0,width:100}]}>
                                            <Paragraph style={[styles.paragraph, styles.textRight,styles.red]}>
                                                {toCurrency(obj.debit+'',companycurrency)}
                                            </Paragraph>
                                        </View>

                                    </View>

                                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                            </View>
                        )

                    })
                }

                </View>


                <View style={[styles.grid,styles.middle,styles.py_4]}>

                    <View style={[styles.cell,styles.w_auto,{paddingLeft:0}]}>

                    </View>

                    <View style={[styles.cell,{width:100}]}>
                        <Paragraph style={[styles.textRight,styles.bold,styles.green]}>
                            {toCurrency(summary.credit+'',companycurrency)}
                        </Paragraph>
                    </View>

                    <View style={[styles.cell,{paddingRight:0,width:100}]}>
                        <Paragraph style={[styles.textRight,styles.bold,styles.red]}>
                            {toCurrency(summary.debit+'',companycurrency)}
                        </Paragraph>
                    </View>

                </View>


            </View>
        )
    }

}





const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch:any) => ({

});


export default connect(mapStateToProps,mapDispatchToProps)(withTheme(Ledger));


