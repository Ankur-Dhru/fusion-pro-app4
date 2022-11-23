import React, {memo, useEffect, useState} from "react";
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
import {getInit, log} from "../../lib/functions";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";


const Index = (props: any) => {


    const {navigation, route, tdsList, tcsList, tdsStaticList, tcsStaticList,theme:{colors}}: any = props;
    const {templateKey}: any = route.params;
    const [dataList, setDataList] = useState([]);
    const [isTDS, setTds] = useState(templateKey === "tds");

    useEffect(() => {
        if (isTDS) {
            setDataList(Object.values(tdsList));
        } else {
            setDataList(Object.values(tcsList));
        }
    }, [tdsList, tcsList])

    setNavigationOptions(navigation, "Tadsdxes",colors, route);

    const _deleteTaxGroup = (id: any) => {
        deleteSettings(isTDS ? "tds" : "tcs", id, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        })
    }


    const _navigate = (data?: any) => {
        if (isTDS) {
            navigation.navigate("TdsForm", {...data})
        } else {
            navigation.navigate("TcsForm", {...data})
        }
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

        let title = item?.tdsname, descriptions, id = item.tdsid;
        if (item?.tdsrate) {
            title += ` (${item.tdsrate}%)`
        }
        if (item.tdssection && tdsStaticList[item.tdssection]?.tax_specific_type) {
            descriptions = `TDS Section : ${tdsStaticList[item.tdssection]?.tax_specific_type}`
        }

        if (!isTDS) {
            id = item.tcsid
            title = item?.tcsname;
            if (item?.tcsrate) {
                title += ` (${item.tcsrate}%)`
            }

            if (item.tcssection && tcsStaticList[item.tcssection]?.tax_specific_type_formatted) {
                descriptions = `Nature Of Collection : ${tcsStaticList[item.tcssection]?.tax_specific_type_formatted}`
            }
        }


        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteTaxGroup(id),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate({editdata: item, title})}
            >
                <List.Item
                    title={title}
                    description={descriptions}
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
            data={dataList}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />

    </Container>
}


const mapStateToProps = (state: any) => ({
    tdsList: state.appApiData.settings.tds,
    tcsList: state.appApiData.settings.tcs,
    tdsStaticList: state.appApiData.settings.staticdata.tdstax,
    tcsStaticList: state.appApiData.settings.staticdata.tcstax,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

