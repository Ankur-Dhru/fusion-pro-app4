import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import ProIcon from "../../components/ProIcon";
import { styles } from "../../theme";

class AttachmentItem extends Component<any, any> {
    render() {
        const {file_name, onPress, onPressName} = this.props;
        return (
            <View style={styles.attachContainer}>
                <ProIcon
                    name={"paperclip"}
                    size={18}
                    align={"center"}
                />
                <TouchableOpacity onPress={() => Boolean(onPressName) && onPressName()}>
                    <Text ellipsizeMode={"middle"} numberOfLines={1} style={styles.attachementtext}>{file_name}</Text>
                </TouchableOpacity>
                {
                    Boolean(onPress) && <ProIcon
                        name={"times-circle"}
                        size={18}
                        align={"center"}
                        onPress={onPress}
                    />
                }
            </View>
        );
    }
}


export default AttachmentItem;
