import React from "react";
import QRCodeScanner from "../QRCodeScanner";
import {Title} from "react-native-paper";
import {backButton} from "../../lib/setting";

const Scanner = (props:any) => {

    const {route,navigation}:any = props;

    navigation.setOptions({
        headerTitle:'',
        headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
    });

    return <QRCodeScanner
        onRead={route.params.onRead}
        multiline={route.params.multiline}
    />
}

export default Scanner;
