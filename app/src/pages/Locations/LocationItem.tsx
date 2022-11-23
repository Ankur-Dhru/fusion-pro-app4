import React, {memo} from "react";
import {TouchableOpacity} from "react-native";
import {List, withTheme,Divider} from "react-native-paper";
import {connect} from "react-redux";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {styles} from "../../theme";

const LocationItem = (props: any) => {
    const {item, industrytypes, onPress,theme:{colors}} = props;

    let descriptions = "";

    if (item?.industrytype) {
        descriptions += industrytypes[item.industrytype]?.name
    }

    if (item?.city) {
        descriptions += ` - ${item.city}`
    }

    return <TouchableOpacity
        onPress={() => onPress(item)}
    >
        <List.Item
            title={`${item?.locationname}`}
            description={descriptions}
            right={props => <ListNavRightIcon {...props}/>}
        />
        <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
    </TouchableOpacity>
}

const mapStateToProps = (state: any) => {
    return {
        industrytypes: state.appApiData.settings.staticdata.industrytypes,
    }
}
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(LocationItem)));

