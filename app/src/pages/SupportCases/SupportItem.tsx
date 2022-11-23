import React, {Component} from "react";
import {Divider, List, withTheme} from "react-native-paper";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {styles} from "../../theme";

class SupportItem extends Component<any, any> {

    render() {
        const {item, theme: {colors}, left, onPress} = this.props;
        const {title, description, titleNumberOfLines, right, descriptionNumberOfLines} = item;
        if (!right) {
        }

        return (
            <>
                <List.Item
                    title={title}
                    titleStyle={[styles.bold]}
                    onPress={() => onPress && onPress(item)}
                    titleNumberOfLines={titleNumberOfLines || 2}
                    description={description}
                    descriptionNumberOfLines={descriptionNumberOfLines || 5}
                    right={props => <ListNavRightIcon {...props}/>}
                    left={left}
                />
                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </>

        );
    }
}

export default withTheme(SupportItem);

