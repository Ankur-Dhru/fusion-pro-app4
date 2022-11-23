import {TouchableOpacity} from "react-native";
import {Divider, List, withTheme} from "react-native-paper";
import ListNavRightIcon from "../ListNavRightIcon";
import {styles} from "../../theme";
import React from "react";

const Index = (props:any) => {
    const {title, description, onPress, isRightNav, descriptionNumberOfLines = 2} =props;
    const {colors}:any = props.theme;
    return <TouchableOpacity onPress={onPress}>
        <List.Item
            title={title}
            titleStyle={{textTransform:"capitalize"}}
            titleNumberOfLines={2}
            description={description}
            descriptionNumberOfLines={descriptionNumberOfLines}
            right={props => isRightNav ? <ListNavRightIcon {...props}/> : <></>}
        />
        <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
    </TouchableOpacity>
}
export default withTheme(Index);
