import React from "react";
import {TouchableOpacity} from "react-native";
import {List} from "react-native-paper";
import moment from "moment";
import {store} from "../../App";

const DayPickerItem = ({item, onPress}: any) => {

    let dateformat = store.getState().appApiData.settings.general.date_format.toUpperCase()

    return <TouchableOpacity onPress={() => onPress(item)}>
        <List.Item
            title={`${item.title}`}
            description={`${moment(item?.value?.startdate).format(dateformat)} To ${moment(item?.value?.enddate).format(dateformat)}`}
        />
    </TouchableOpacity>

}

export default DayPickerItem;
