import React, {Component} from "react";
import {useIsFocused} from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { log } from "../../lib/functions";
import {voucher} from "../../lib/setting";

const Index = (Component:any)=> (props:any) => {
    const isFocused = voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5' ? false :useIsFocused();
    return <Component isFocused={isFocused} {...props} />
}

export default Index;
