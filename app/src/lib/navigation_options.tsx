import {Title, useTheme} from "react-native-paper";
import {backButton} from "./setting";
import {Platform} from "react-native";
import React from "react";
import {styles} from "../theme";
import {log} from "./functions";


export const setNavigationOptions = (navigation: any, title: any,colors:any, route?: any) => {

    if (route?.params?.title) {
        title = route?.params?.title
    }

    navigation.setOptions({
        headerTitle: title,
        headerLargeTitleStyle:{color:colors.inputbox},
        headerTitleStyle:{color:colors.inputbox},
        headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
    });
    if (Platform.OS === "android") {
        navigation.setOptions({
            headerCenter: () => <Title style={[styles.headertitle]}>{title}</Title>,
        })
    }
}
