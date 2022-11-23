import React, {memo} from "react";
import {List, Title, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container, ProIcon} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";

import {TouchableOpacity} from "react-native";
import Swipeout from "rc-swipeout";
import {styles} from "../../theme";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import BottomSpace from "../../components/BottomSpace";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {getInit} from "../../lib/functions";


const Index = (props: any) => {

    const {navigation, assettypeList,theme:{colors}}: any = props;

    setNavigationOptions(navigation, "Client's Assets Types",colors);

    const _deleteAssetsTypes = (id: any) => {
        deleteSettings("assettype", id, (result: any) => {
            if (result.status === STATUS.SUCCESS ) {
                getInit(null, null, null, null, "list", true)
            }
        })
    }


    const _navigate = (data?: any) => {
        navigation.navigate("ClientAssetsTypeForm", {...data})
    }

    navigation.setOptions({
        headerRight: (props: any) => {
            return <Title
                onPress={() => _navigate()}>
                <ProIcon name="plus"/>
            </Title>
        }
    });

    const _renderItem = ({item}: any) => {

        let title = item?.assettypename;

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteAssetsTypes(item.assettypeid),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={Boolean(item?.system)}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate({assets: item, title})}
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
            data={Object.values(assettypeList)}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
        <BottomSpace/>
    </Container>
}


const mapStateToProps = (state: any) => ({
    assettypeList: state?.appApiData.settings.assettype
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

