import React from "react";
import {styles} from "../../theme";
import {Card, Paragraph, withTheme} from "react-native-paper";
import {View} from "react-native";
import {chevronRight, voucher} from "../../lib/setting";
import {getVoucherTypeData} from "../../lib/functions";

const JobDetailCard = (props: any) => {
    const {jobdisplayid, navigation, jobnumber, theme, warranty, priority, assetdata} = props;

    const {colors} = theme;
    return <Card style={[styles.card]} onPress={() => {
        voucher.type = getVoucherTypeData("vouchertypeid", "f3e46b64-f315-4c56-b2d7-58591c09d6e5", jobdisplayid, 1231);
        voucher.data = {};
        navigation.navigate('EditJobsheet', {
            screen: 'EditJobsheet',
        });
    }}>
        <Card.Content>
            <View style={[styles.grid, styles.justifyContent]}>
                <View>
                    <Paragraph style={[{
                        color: colors.secondary
                    }]}>
                        {jobnumber} - {warranty}
                    </Paragraph>
                    <Paragraph>
                        {assetdata?.assetname}
                        {(Boolean(assetdata?.basefield) && Boolean(assetdata?.basefield != assetdata?.assetname)) && ` (${assetdata?.basefield})`}
                    </Paragraph>

                </View>
                <View style={[styles.grid, styles.justifyContent]}>
                    <View style={[styles.badge, , {padding: 0}, styles[`badge${priority}`]]}><Paragraph
                        style={[styles.paragraph, styles.text_xs, {
                            color: 'white',
                            paddingRight: 5,
                            paddingLeft: 5,
                            textTransform: 'capitalize',
                        }]}>{priority}</Paragraph></View>
                    {chevronRight}
                </View>
            </View>
        </Card.Content>
    </Card>
}
export default withTheme(JobDetailCard);
