import React, {memo} from "react";
import FlatList from "../../components/FlatList";
import {Container} from "../../components";
import {List, withTheme,Divider} from "react-native-paper";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import {setNavigationOptions} from "../../lib/navigation_options";
import {notes} from "../../lib/static";
import BottomSpace from "../../components/BottomSpace";
import {styles} from "../../theme";

const Index = (props: any) => {
    const {navigation,theme:{colors}} = props;

    setNavigationOptions(navigation, "Reasons",colors);
    const _navigate = (params?: any) => {
        navigation.navigate("ReasonsList", params)
    }

    const _renderItem = ({item}: any) => {
        return <TouchableOpacity
            onPress={() => _navigate(item)}
        >
            <List.Item
                title={item.title}
                right={props => <ListNavRightIcon {...props}/>}
            />
            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
        </TouchableOpacity>
    }
    return <Container  surface={true}>
        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={Object.keys(notes).map((value) => ({title: notes[value], value}))}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
        <BottomSpace/>
    </Container>
}


const mapStateToProps = (state: any) => ({
    reasonList: state?.appApiData.settings.reason
})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

