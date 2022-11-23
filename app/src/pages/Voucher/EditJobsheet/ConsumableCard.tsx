import React, {memo, useEffect, useState} from "react";
import {styles} from "../../../theme";
import {Card, Text} from "react-native-paper";
import {View} from "react-native";
import {chevronRight, voucher} from "../../../lib/setting";
import ListNavRightIcon from "../../../components/ListNavRightIcon";

const ConsumableCard = memo(({values, navigation,isDone}: any) => {

    const [itemCount, setItemCount] = useState(0);
    useEffect(() => {
        setItemCount(voucher?.data?.products?.length);
    }, [values?.products])

    if(isDone && !itemCount){
        return <></>
    }

    return <Card style={[styles.card]} onPress={() => {
        navigation.navigate("ConsumableTab", {values})
    }}>
        <Card.Content>
            <View style={[styles.grid, styles.justifyContent]}>
                <View>
                    <Text style={[styles.caption]}>{itemCount ? itemCount : ""} Consumable Inventory / Service </Text>
                </View>
                {chevronRight}
            </View>
        </Card.Content>
    </Card>
})
export default ConsumableCard;
