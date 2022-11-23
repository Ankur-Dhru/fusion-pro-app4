import Swipeout from "rc-swipeout";
import {styles} from "../../theme";
import {TouchableOpacity} from "react-native";
import {List,Divider} from "react-native-paper";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import React from "react";

export const itemObject = (
    itemTitle?: string,
    swipeDisabled: boolean = true,
    onPress?: any,
    onDelete?: any,
    description?: any,
) => ({
    itemTitle,
    description,
    swipeDisabled,
    onPress,
    onDelete
})


export const _renderItem = ({
                                item: {
                                    itemTitle,
                                    description,
                                    swipeDisabled,
                                    onPress,
                                    onDelete
                                }
                            }: any) => {

    return <Swipeout
        right={[
            {
                text: 'Delete',
                onPress: onDelete,
                style: {backgroundColor: styles.red.color, color: 'white'},
            }
        ]}
        disabled={swipeDisabled}
        autoClose={true}
        style={{backgroundColor: 'transparent'}}
    >

        <TouchableOpacity
            onPress={onPress}
        >
            <List.Item
                title={itemTitle}
                description={description}
                right={props => <ListNavRightIcon {...props}/>}
            />
            <Divider style={[styles.divider]}/>
        </TouchableOpacity>
    </Swipeout>
}
