import React, {memo} from "react";
import {List, Title, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container, ProIcon} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {getInit, log} from "../../lib/functions";
import {TouchableOpacity} from "react-native";
import Swipeout from "rc-swipeout";
import {styles} from "../../theme";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import BottomSpace from "../../components/BottomSpace";




const Index = (props: any) => {

    const {unitList, navigation,theme:{colors}}: any = props;
    setNavigationOptions(navigation, "Units",colors);

    const _deleteUnit = (unitid: any) => {
        deleteSettings("unit", unitid, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        })
    }


    const _navigate = (params?: any) => {
        let data = {};
        if (params) {
            data = {unit: params, title: `${params?.unitname}`};
        }
        navigation.navigate("UnitForm", data)
    }

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

    const _renderItem = ({item}: any) => {

        let title = item.unitname, description = `Type : ${item?.unittype}`;
        if (item?.unitcode) {
            title += ` (${item?.unitcode})`
        }
        if (item?.relatedunit) {
            description += ` | Related Unit : ${item?.relatedunit}`
        }
        if (item?.unitrate) {
            description += ` | Rate : ${item?.unitrate}`
        }

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteUnit(item?.unitid),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={Boolean(item?.system)}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate(item)}
            >
                <List.Item
                    title={title}
                    description={description}
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
            data={Object.values(unitList)}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
        <BottomSpace/>
    </Container>
}


const mapStateToProps = (state: any) => ({
    unitList: state?.appApiData.settings.unit
})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

