import React, {memo, useEffect, useState} from "react";
import {Container, ProIcon} from "../../components";
import {Divider, List, Title, withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../lib/navigation_options";
import {ScrollView} from "react-native";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {selectLocation} from "../../lib/Store/store-service";
import DepartmentForm from "./DepartmentForm";
import {connect} from "react-redux";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {styles} from "../../theme";
import Swipeout from "rc-swipeout";
import {getInit} from "../../lib/functions";

const LocationDepartment = (props: any) => {

    const {navigation, route, locations}:any = props;
    const {colors}:any = props.theme;

    let locationData = selectLocation(route?.params?.locationData?.locationid);


    const [departmentList, setDepartmentList] = useState(locationData?.departments || []);

    useEffect(() => {
        locationData = selectLocation(route?.params?.locationData?.locationid);
        setDepartmentList(locationData?.departments)
    }, [locations])

    setNavigationOptions(navigation, "Department",colors, route);

    const _navigate = (params?: any) => {
        navigation.navigate("DepartmentForm", {
            locationData,
            departmentList,
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
                    let newList = departmentList.filter(({departmentid}: any) => departmentid !== id)
                    setDepartmentList(newList)
                }, "list",true)
            }
        }, "departments", {
            "uniquename": "departmentid",
            "uniqueid": id
        })
    }


    return <Container surface={true}>
        <ScrollView keyboardShouldPersistTaps='handled'>
            {departmentList?.map((d: any) => {
                return <>
                    <Swipeout
                        right={[
                            {
                                text: 'Delete',
                                onPress: () => _onRemove(d.departmentid),
                                style: {backgroundColor: styles.red.color, color: 'white'},
                            }
                        ]}
                        disabled={departmentList.length === 1}
                        autoClose={true}
                        style={{backgroundColor: 'transparent'}}
                    >
                        <List.Item
                            title={d.name}
                            description={d.type}
                            onPress={() => _navigate({
                                department: d,
                                title: `${d.name}`
                            })}
                            right={props => <ListNavRightIcon {...props}/>}
                        />
                        <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                    </Swipeout>

                </>
            })}
        </ScrollView>
    </Container>
}

const mapStateToProps = (state: any) => ({
    locations: state?.appApiData.settings.location
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(LocationDepartment)));

