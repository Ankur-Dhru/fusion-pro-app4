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

const OutsourcingStatusList = (props: any) => {

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
            if (!isEmpty(data.outsourcingstatuslist)) {
                let statusData = Object.keys(data.outsourcingstatuslist).map((id) => ({id, ...data.outsourcingstatuslist[id]}));
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
            "uniquename": "outsourcingstatuslist",
            "uniqueid": id
        })
    }

    const _navigate = (data?: any) => {
        navigation.navigate("OutsourcingStatusForm", {tickettypeid: editData.tickettypeid, ...data})
    }

    const _renderItem = ({item}: any) => {

        let title = item?.osstatusname;
        if (item.osdefault) {
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
            disabled={Boolean(item?.ossystem)}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate({title: item?.osstatusname, editData: item})}
            >
                <List.Item
                    title={title}
                    right={props => <ListNavRightIcon {...props}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        </Swipeout>
    }

    return <Container  surface={true}>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(OutsourcingStatusList)));

