import React from "react";
import ListItem from "../../components/ListItem";
import {log} from "../../lib/functions";
import FlatList from "../FlatList";

const Index = (data: any = [], onPress?: any, isRightNav?: boolean) => {

    const _renderItem = ({item}: any) => {

        return <ListItem
            title={item?.title}
            description={item?.description}
            isRightNav={isRightNav}
            onPress={onPress}/>
    }

    return <FlatList
        keyboardShouldPersistTaps={'handled'}
        scrollIndicatorInsets={{right: 1}}
        data={data}
        accessible={true}
        renderItem={_renderItem}
        initialNumToRender={20}
    />
}
export default Index;
