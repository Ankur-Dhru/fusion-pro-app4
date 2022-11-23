import React, {memo, useEffect, useState} from "react";
import {Container, ProIcon} from "../../components";
import {Divider, List, Title, withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../lib/navigation_options";
import {ScrollView} from "react-native";
import {connect} from "react-redux";
import TableForm from "./TableForm";
import {selectLocation} from "../../lib/Store/store-service";
import {styles} from "../../theme";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import Swipeout from "rc-swipeout";
import {getInit} from "../../lib/functions";

const LocationTables = ({navigation, route,theme:{colors}, locations}: any) => {
    let locationData = selectLocation(route?.params?.locationData?.locationid);

    const [tableList, setTableList] = useState(locationData?.tables || []);


    useEffect(() => {
        locationData = selectLocation(route?.params?.locationData?.locationid);
        setTableList(locationData?.tables)
    }, [locations])

    setNavigationOptions(navigation, "Tables",colors, route);


    const _navigate = (params?: any) => {
        navigation.navigate("TableForm", {
            locationData,
            tableList,
            ...params
        })
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
    const _onRemove = (id: any) => {
        deleteSettings("location", locationData?.locationid, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, ()=>{
                    let newList = tableList.filter(({tableid}: any) => tableid !== id)
                    setTableList(newList)
                }, "list", true)
            }
        }, "tables", {
            "uniquename": "tableid",
            "uniqueid": id
        })
    }


    return <Container  surface={true}>
        <ScrollView keyboardShouldPersistTaps='handled'>
            {
                tableList?.map((table: any) => {
                    return <>
                        <Swipeout
                            right={[
                                {
                                    text: 'Delete',
                                    onPress: () => _onRemove(table.tableid),
                                    style: {backgroundColor: styles.red.color, color: 'white'},
                                }
                            ]}
                            disabled={tableList.length < 2}
                            autoClose={true}
                            style={{backgroundColor: 'transparent'}}
                        >
                            <List.Item
                                title={table?.tablename}
                                description={`Paxes: ${table.paxes} | Area : ${table.area}`}
                                onPress={() => _navigate({
                                    table,
                                    title: `${table?.tablename}`
                                })}
                            />
                            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                        </Swipeout>

                    </>
                })
            }
        </ScrollView>
    </Container>
}

const mapStateToProps = (state: any) => ({
    locations: state?.appApiData.settings.location
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(LocationTables)));




