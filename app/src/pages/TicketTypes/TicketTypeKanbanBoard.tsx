import {TouchableOpacity} from "react-native";
import React, {memo, useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {styles} from "../../theme";
import {Container} from "../../components";
import {connect} from "react-redux";
import {List, Title, withTheme,Divider} from "react-native-paper";
import Swipeout from "rc-swipeout";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {deleteSettings, putTickets} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {getInit, isEmpty, log} from "../../lib/functions";
import ProIcon from "../../components/ProIcon";
import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";
import FlatList from "../../components/FlatList";

const TicketTypeKanbanBoard = (props: any) => {


    const {navigation, route, ticketsList,theme:{colors}}: any = props;
    const {editData, _onSubmit} = route?.params;
    setNavigationOptions(navigation, "General",colors, route);
    const [list, setList] = useState<any>([]);
    const [editEnable, setEditEnable] = useState<boolean>(false);
    navigation.setOptions({
        headerLargeTitleStyle:{color:colors.inputbox},
        headerTitleStyle:{color:colors.inputbox},
        headerRight: (props: any) => {
            return <>
                <Title
                    onPress={() => setEditEnable((value: boolean) => !value)}>
                    <ProIcon name={editEnable ? "eye" : "pen-to-square"}/>
                </Title>
                <Title
                    onPress={() => _navigate()}>
                    <ProIcon name="plus"/>
                </Title>
            </>
        }
    });


    useEffect(() => {
        if (editData.tickettypeid) {
            let data = ticketsList[editData.tickettypeid];
            if (!isEmpty(data.kanbanstatuslist)) {
                let listData = Object.keys(data.kanbanstatuslist)
                    .filter((id) => Boolean(id))
                    .map((id) => ({id, ...data.kanbanstatuslist[id]}));
                setList(listData)
            }
        }
    }, [ticketsList])

    const _navigate = (data?: any) => {
        navigation.navigate("KanbanForm", {tickettypeid: editData.tickettypeid, ...data})
    }

    const _deleteKanban = (id: any) => {
        deleteSettings("tickets", editData.tickettypeid, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        }, null, {
            "uniquename": "kanabanstatuslist",
            "uniqueid": id
        })
    }

    const _dragRenderItem = ({item, drag, isActive}: any) => {

        return <ScaleDecorator>
            {_flatRenderItem({item, drag})}
        </ScaleDecorator>
    }

    const _onDragEnd = ({data}: any) => {
        let kanbanstatuslist: any = {};

        data.map(({id, ...data}: any, index: number) => {
            kanbanstatuslist[id] = {
                ...data,
                sort: index + 1
            }
        })
        let ticketData = ticketsList[editData.tickettypeid];
        ticketData = {...ticketData, kanbanstatuslist};
        setList(data)
        putTickets(editData.tickettypeid, ticketData).then(() => {
        })
    }

    const getSortList = () => {
        return list?.sort((a: any, b: any) => (a?.sort > b?.sort) ? 1 : -1)
    }

    const _flatRenderItem = ({item, drag}: any) => {
        let description = "";

        if (item?.taskstatus && !isEmpty(editData.ticketstatuslist)) {
            description = `Task Status: ${editData.ticketstatuslist[item?.taskstatus]?.ticketstatusname}`
        }
        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteKanban(item?.id),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={Boolean(item.system) || editEnable}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >
            <TouchableOpacity
                onLongPress={drag}
                onPress={() => _navigate({title: item?.columnname, editData: item})}
            >
                <List.Item
                    title={item?.columnname}
                    description={description}
                    left={props => editEnable ?
                        <ListNavRightIcon type={"solid"} name={"grip-vertical"} {...props}/> : <></>}
                    right={props => <ListNavRightIcon {...props}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        </Swipeout>
    }



    return <Container  surface={true}>
        {
            editEnable ?
                <DraggableFlatList
                    keyboardShouldPersistTaps={'handled'}
                    scrollIndicatorInsets={{right: 1}}
                    data={getSortList()}
                    onDragEnd={_onDragEnd}
                    accessible={true}
                    keyExtractor={(item: any) => item.id}
                    renderItem={_dragRenderItem}
                    initialNumToRender={20}
                /> :
                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    scrollIndicatorInsets={{right: 1}}
                    data={getSortList()}
                    accessible={true}
                    keyExtractor={(item: any) => item.id}
                    renderItem={_flatRenderItem}
                    initialNumToRender={20}
                />
        }

    </Container>
}

const mapStateToProps = (state: any) => ({
    ticketsList: state?.appApiData.settings.tickets,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypeKanbanBoard)));

