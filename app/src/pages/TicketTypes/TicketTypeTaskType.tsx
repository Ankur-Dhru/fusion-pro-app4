import {TouchableOpacity} from "react-native";
import React, {memo, useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {styles} from "../../theme";
import {Container} from "../../components";
import {connect} from "react-redux";
import {List, Title, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import Swipeout from "rc-swipeout";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {getInit, isEmpty} from "../../lib/functions";
import ProIcon from "../../components/ProIcon";
import {regExpJson2} from "../../lib/validation";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS, TASK_ICONS} from "../../lib/static";

const TicketTypeTaskType = (props: any) => {

    const {navigation, route, ticketsList,theme:{colors}}: any = props;
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
            if (!isEmpty(data.task_types)) {
                let listData = Object.keys(data.task_types).filter((id) => Boolean(id)).map((id) => ({id, ...data.task_types[id]}));
                setList(listData)
            }
        }
    }, [ticketsList])

    const _navigate = (data?: any) => {
        navigation.navigate("TaskTypeForm", {tickettypeid: editData.tickettypeid, ...data})
    }

    const _deleteTaskType = (id: any) => {
        deleteSettings("tickets", editData.tickettypeid, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        }, null, {
            "uniquename": "task_types",
            "uniqueid": id
        })
    }

    const _renderItem = ({item}: any) => {

        let disabled = true;
        if (Boolean(item?.id)) {
            disabled = regExpJson2.alphabet.test(item?.id)
        }

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteTaskType(item?.id),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={disabled}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate({title: item?.task_type_name, editData: item})}
            >
                <List.Item
                    title={item.task_type_name}
                    left={props => <ListNavRightIcon {...props} name={TASK_ICONS[item.type_key]}/>}
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
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypeTaskType)));

