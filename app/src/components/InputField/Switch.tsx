import * as React from 'react';
import {Switch, withTheme} from 'react-native-paper';
import {View} from "react-native";
import {styles} from "../../theme";
import {platform} from "@haskkor/react-native-recaptchav3/dist/src/constants";

const ToggleSwitch = (props:any) => {
    const [isSwitchOn, setIsSwitchOn] = React.useState(props.value);

    const onToggleSwitch = () => {
        props.onChange(!isSwitchOn)
        setIsSwitchOn(!isSwitchOn)
    };

    return <View style={[styles.grid,{marginLeft: platform.isIOS?0:-10}]}><Switch value={isSwitchOn} color={styles.green.color}  onValueChange={onToggleSwitch} /></View>;
};

export default withTheme(ToggleSwitch);
