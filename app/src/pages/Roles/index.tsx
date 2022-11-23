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
import {assignOption, MESSAGE} from "../../lib/static";

const TicketTypeScreens = (props: any) => {

    const {navigation, route, roleList,theme:{colors}}: any = props;

    setNavigationOptions(navigation, "Roles",colors, route);

    const [list, setList] = useState<any>([]);

    useEffect(() => {
        if (!isEmpty(roleList)) {
            setList(roleList.map((role:any)=>assignOption(role, role)))
        }
    }, [roleList])


    const _renderItem = ({item}: any) => {

        return <TouchableOpacity
            onPress={() => errorAlert(MESSAGE.FEATURE_ONLY_WEB)}
        >
            <List.Item
                title={item?.label}
                right={props => <ListNavRightIcon {...props}/>}
            />
            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
        </TouchableOpacity>
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
    roleList: state?.appApiData.settings.role,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypeScreens)));

