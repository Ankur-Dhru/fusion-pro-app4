import React, {memo} from "react";
import {List, Title, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container, ProIcon} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {getInit} from "../../lib/functions";

import {TouchableOpacity} from "react-native";
import Swipeout from "rc-swipeout";
import {styles} from "../../theme";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {putSettings} from "../../lib/ServerRequest/api";
import BottomSpace from "../../components/BottomSpace";
import {SUCCESS} from "../../lib/ServerRequest";


const Index = (props: any) => {

    const {navigation, paymenttermsList,theme:{colors}}: any = props;

    setNavigationOptions(navigation, "Due Date Terms",colors);

    const _deleteDueDateTerms = (termdays: any) => {
        paymenttermsList[termdays] = undefined;
        putSettings("paymentterms", paymenttermsList, true).then((result: any) => {
            if (result.status === SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        })
    }


    const _navigate = (data?: any) => {
        navigation.navigate("DueDateTermsForm", {...data})
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

        let title = item?.termname;

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteDueDateTerms(item.termdays),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={Boolean(item?.system)}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate({term: item, title})}
            >
                <List.Item
                    title={title}
                    description={`Number Of Days : ${item.termdays}`}
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
            data={Object.values(paymenttermsList).filter((data) => Boolean(data))}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
        <BottomSpace/>
    </Container>
}


const mapStateToProps = (state: any) => ({
    paymenttermsList: state?.appApiData.settings.paymentterms
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

