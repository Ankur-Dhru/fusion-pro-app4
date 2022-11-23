import React, {useState} from "react";
import {styles} from "../../../../theme";
import {View} from "react-native";
import {Divider, Paragraph, Title, withTheme} from "react-native-paper";
import {getCurrentCompanyDetails, toCurrency} from "../../../../lib/functions";
import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {ProIcon} from "../../../../components";

const ViewProfit = ({voucherid,theme:{colors}}: any) => {

    const [showProfit, setShowProfit] = useState(false);
    const [profit, setProfit] = useState(0);

    const {defaultcurrency}:any = getCurrentCompanyDetails();

    const _onClick = () => {

        requestApi({
            method: methods.get,
            action: actions.profit,
            queryString: {voucherid},
            showlog:true
        }).then((response: any) => {
            if (response.status === SUCCESS && response?.data) {
                setProfit(response.data.profit);
                setShowProfit((value) => !value)
            }
        })
    }
    return <>
        <View style={[styles.grid, styles.middle, styles.fieldspace, {marginTop: 12}]}>
            <View style={[styles.cell, styles.w_auto]}><Paragraph
                style={[styles.paragraph, styles.head, styles.text_sm]}>Profit</Paragraph></View>
            {
                showProfit ? <View style={[styles.cell, {paddingRight: 0}]}><Paragraph
                        style={[styles.paragraph, styles.textRight, styles.bold, styles.text_sm]}>{toCurrency(profit,defaultcurrency)}</Paragraph></View> :
                    <Title onPress={_onClick}>
                        <ProIcon name={'eye'} size={14}/>
                    </Title>
            }

        </View>
        <Divider style={[styles.divider,styles.hide,{borderBottomColor:colors.divider}]}/>
    </>

}
export default withTheme(ViewProfit);
