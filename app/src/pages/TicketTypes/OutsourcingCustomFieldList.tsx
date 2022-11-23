import React, {memo, useEffect, useState} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Title, withTheme} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {getInit, isEmpty} from "../../lib/functions";
import {_renderItem, itemObject} from "./item";

const OutsourcingCustomFieldList = (props: any) => {

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
            let statusData: any = []
            if (!isEmpty(data.outsourcingcustomfield)) {
                statusData = Object.keys(data.outsourcingcustomfield).map((id) => {
                    const itemData: any = data.outsourcingcustomfield[id];
                    return itemObject(itemData.displayname, false, () => {
                        _navigate({title: itemData.displayname, editData: {id, ...itemData}})
                    }, () => _deleteTicketStatus(id))
                });
            }
            setList(statusData)
        }
    }, [ticketsList])

    const _deleteTicketStatus = (id: any) => {
        deleteSettings("tickets", editData.tickettypeid, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        }, null, {
            "uniquename": "outsourcingcustomfield",
            "uniqueid": id
        })
    }

    const _navigate = (data?: any) => {
        navigation.navigate("OutsourcingCustomFieldForm", {
            tickettypeid: editData.tickettypeid,
            fieldData: data?.editData, ...data,
            fromTask: true
        })
    }

    // const _renderItem = ({item}: any) => {
    //
    //     let title = item?.name;
    //
    //
    //     return <Swipeout
    //         right={[
    //             {
    //                 text: 'Delete',
    //                 onPress: () => _deleteTicketStatus(item?.id),
    //                 style: {backgroundColor: styles.red.color, color: 'white'},
    //             }
    //         ]}
    //         disabled={Boolean(item?.ossystem)}
    //         autoClose={true}
    //         style={{backgroundColor: 'transparent'}}
    //     >
    //
    //         <TouchableOpacity
    //             onPress={() => _navigate({title, editData: item})}
    //         >
    //             <List.Item
    //                 title={title}
    //                 right={props => <ListNavRightIcon {...props}/>}
    //             />
    //             <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
    //         </TouchableOpacity>
    //     </Swipeout>
    // }

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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(OutsourcingCustomFieldList)));

