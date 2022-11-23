import {TouchableOpacity} from "react-native";
import React, {memo, useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {styles} from "../../theme";
import {Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {List, Title, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import Swipeout from "rc-swipeout";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {getInit, isEmpty} from "../../lib/functions";

const TicketTypeTicketStatus = (props: any) => {

    const {navigation, route, ticketsList, ticketStatusList,theme:{colors}}: any = props;
    const {editData} = route?.params;
    setNavigationOptions(navigation, "General",colors, route);
    navigation.setOptions({
        headerLargeTitleStyle:{color:colors.inputbox},
        headerTitleStyle:{color:colors.inputbox},
        headerRight: (props: any) => {
            return <Title
                onPress={() => _navigate()}>
                <ProIcon name="plus"/>
            </Title>
        }
    });
    const [list, setList] = useState<any>([]);

    useEffect(() => {
        if (editData.tickettypeid) {
            let data = ticketsList[editData.tickettypeid];
            if (!isEmpty(data.ticketstatuslist)) {
                let statusData = Object.keys(data.ticketstatuslist).map((id) => ({id, ...data.ticketstatuslist[id]}));
                setList(statusData)
            }
        }
    }, [ticketsList])

    const _deleteTicketStatus = (id: any) => {
        deleteSettings("tickets", editData.tickettypeid, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        },null, {
            "uniquename": "ticketstatuslist",
            "uniqueid": id
        })
    }

    const _navigate = (data?: any) => {
        navigation.navigate("TicketStatusForm", {tickettypeid: editData.tickettypeid, ...data})
    }

    const _renderItem = ({item}: any) => {

        let title = item?.ticketstatusname;
        if (item.ticketdefault) {
            title += " (Default)"
        }

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteTicketStatus(item?.id),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={Boolean(item?.system)}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate({title: item?.ticketstatusname, editData: item})}
            >
                <List.Item
                    title={title}
                    description={`Type : ${ticketStatusList[item?.taskstatus]}`}
                    right={props => <ListNavRightIcon {...props}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        </Swipeout>
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
    ticketStatusList: state?.appApiData.settings.staticdata.ticketstatus,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypeTicketStatus)));

