import React, {memo} from "react";
import FlatList from "../../components/FlatList";
import {Container, ProIcon} from "../../components";
import {List, Title, withTheme,Divider} from "react-native-paper";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import {setNavigationOptions} from "../../lib/navigation_options";
import {styles} from "../../theme";
import Swipeout from "rc-swipeout";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {getInit} from "../../lib/functions";
import BottomSpace from "../../components/BottomSpace";

const ReasonList = (props: any) => {
    const {reasonsList, navigation, route,theme:{colors}} = props;

    let data: any = [];

    if (route.params.value) {
        data = Object.keys(reasonsList[route.params.value]).map((key) => ({
            title: reasonsList[route.params.value][key],
            value: key
        }))
    }

    setNavigationOptions(navigation, "Reasons",colors, route);

    navigation.setOptions({
        headerLargeTitleStyle:{color:colors.inputbox},
        headerTitleStyle:{color:colors.inputbox},
        headerRight: (props: any) => {
            return <Title
                onPress={() => _navigate({reasontype: route.params.value})}>
                <ProIcon name="plus"/>
            </Title>
        }
    });
    const _navigate = (data?: any) => {
        navigation.navigate("ReasonForm", {...data})
    }

    const _deleteReason = (reasonid: any) => {

        deleteSettings("reason", route.params.value, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        }, reasonid)
    }

    const _renderItem = ({item}: any) => {
        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteReason(item.value),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={Boolean(item?.system)}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >
            <TouchableOpacity
                onPress={() => _navigate({
                    reason: {
                        reasonname: item.title,
                        reasonid: item.value,
                        reasontype: route.params.value
                    },
                    title: item.title
                })}
            >
                <List.Item
                    title={item.title}
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
            data={data}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
        <BottomSpace/>
    </Container>
}


const mapStateToProps = (state: any) => ({
    reasonsList: state?.appApiData.settings.reason
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(ReasonList)));

