import React, {memo, useEffect, useState} from "react";
import {Container} from "../../components";
import List from "../../components/List";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {Text, withTheme} from "react-native-paper";
import {isEmpty, log} from "../../lib/functions";
import {assignListItem} from "../../lib/static";
import {v4 as uuidv4} from 'uuid';
import FlatList from "../../components/FlatList";
import ListItem from "../../components/ListItem";
import {View} from "react-native";

const AccountGroups = (props: any) => {
    const {navigation, route, accountTypesList,theme:{colors}}: any = props;
    setNavigationOptions(navigation, "Account Group",colors, route);
    const [list, setList] = useState<any>([])

    useEffect(() => {
        if (!isEmpty(accountTypesList)) {
            setList(Object.keys(accountTypesList).map((key) => assignListItem(key)))
        }
    }, [accountTypesList])

    const _navigate = (data?: any) => {
        navigation.navigate("ListAccounts", { ...data})
    }

    const _renderItem = ({item}: any) => {

        return <ListItem
            title={item?.title}
            description={item?.description}
            isRightNav={true}
            onPress={() => _navigate({title: item?.title})}
            />
    }

    return <Container surface={true}>
        <View>
        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={list}
            accessible={true}
            keyExtractor={(item: any) => item.id}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
        </View>
    </Container>
}

const mapStateToProps = (state: any) => ({
    accountTypesList: state?.appApiData.settings.staticdata.accounttypes,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(AccountGroups)));

