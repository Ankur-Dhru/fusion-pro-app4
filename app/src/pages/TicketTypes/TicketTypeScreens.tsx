import {ScrollView, TouchableOpacity, View} from "react-native";
import React, {memo, useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Form} from "react-final-form";
import {styles} from "../../theme";
import BottomSpace from "../../components/BottomSpace";
import {Button, Container} from "../../components";
import {connect} from "react-redux";
import {List, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import Swipeout from "rc-swipeout";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {errorAlert, isEmpty} from "../../lib/functions";
import {MESSAGE} from "../../lib/static";

const TicketTypeScreens = (props: any) => {

    const {navigation, route, ticketsList,theme:{colors}}: any = props;
    const {editData} = route?.params;
    setNavigationOptions(navigation, "General",colors, route);

    const [list, setList] = useState<any>([]);

    useEffect(() => {
        if (editData.tickettypeid) {
            let data = ticketsList[editData.tickettypeid];
            if (!isEmpty(data.task_screens)) {
                let statusData = Object.keys(data.task_screens).map((id) => ({id, ...data.task_screens[id]}));
                setList(statusData)
            }
        }
    }, [ticketsList])


    const _renderItem = ({item}: any) => {

        return <TouchableOpacity
            onPress={() => errorAlert(MESSAGE.FEATURE_ONLY_WEB)}
        >
            <List.Item
                title={item?.screen_name}
                right={props => <ListNavRightIcon {...props}/>}
            />
            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
        </TouchableOpacity>
    }

    return <Container surface={true}>
        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={list}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
    </Container>
}

const mapStateToProps = (state: any) => ({
    ticketsList: state?.appApiData.settings.tickets,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypeScreens)));

