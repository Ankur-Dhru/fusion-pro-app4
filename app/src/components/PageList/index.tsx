import React, {memo, useEffect, useState} from "react";
import {List, Text, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";

import {TouchableOpacity} from "react-native";
import {styles} from "../../theme";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {putTickets} from "../../lib/ServerRequest/api";
import {editOptionItem} from "../../lib/functions";

const pageList = [
    editOptionItem("General", "TicketTypeGeneral", true),
    editOptionItem("Settings", "TicketTypeSettings", true, ["kot"]),
    editOptionItem("Task Type", "TicketTypeTaskType", false, ["task"]),
    editOptionItem("Ticket Status", "TicketTypeTicketStatus", true),
    editOptionItem("Kanban Board", "TicketTypeKanbanBoard", false, ["task"]),
    editOptionItem("Screens", "TicketTypeScreens", false, ["task"]),
    editOptionItem("Outsourcing", "TicketTypeOutsourcing", false, ["task"]),
]

const Index = (props: any) => {
    const { navigate, pageList}: any = props;
    const {colors}:any = props.theme;

    const _renderItem = ({item}: any) => {
        return <TouchableOpacity
            onPress={() => navigate(item)}
        >
            <List.Item
                title={item.title}
                right={props => <ListNavRightIcon {...props}/>}
            />
            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
        </TouchableOpacity>
    }


    return <Container surface={true}>
        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={pageList}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
    </Container>
}


export default memo(withTheme(Index));

