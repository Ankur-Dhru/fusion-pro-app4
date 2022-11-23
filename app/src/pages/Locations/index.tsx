import React, {memo, useEffect, useState} from "react";
import {Title, withTheme} from "react-native-paper";
import {setSettings} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";
import FlatList from "../../components/FlatList";
import LocationItem from "./LocationItem";
import {Container, ProIcon} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {styles} from "../../theme";
import Swipeout from "rc-swipeout";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {getInit} from "../../lib/functions";

const Index = (props: any) => {

    const {locations, navigation,theme:{colors}}: any = props
    const [listLength, setLength] = useState<number>(0)

    useEffect(() => {
        setLength(Object.values(locations).length)
    }, [locations])

    const _deleteLocation = (locationid: any) => {
        deleteSettings("location", locationid, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        })
    }

    const _renderItem = (itemData: any) => <Swipeout
        right={[
            {
                text: 'Delete',
                onPress: () => _deleteLocation(itemData?.item?.locationid),
                style: {backgroundColor: styles.red.color, color: 'white'},
            }
        ]}
        disabled={listLength < 2}
        autoClose={true}
        style={{backgroundColor: 'transparent'}}
    >
        <LocationItem
            {...itemData}
            onPress={() => navigation.navigate("LocationForm", {
                locationid: itemData?.item?.locationid
            })}
        />
    </Swipeout>


    setNavigationOptions(navigation, "Outlet / Location",colors);

    navigation.setOptions({
        headerLargeTitleStyle:{color:colors.inputbox},
        headerTitleStyle:{color:colors.inputbox},
        headerRight: (props: any) => {
            return <Title
                onPress={() => navigation.navigate("LocationGeneral", {
                    alreadySetup: true, isNew: true, locations, title: "Add Location"
                })}>
                <ProIcon name="plus"/>
            </Title>
        }
    });

    return <Container surface={true}>


        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={Object.values(locations)}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
    </Container>
}

const mapStateToProps = (state: any) => ({
    locations: state?.appApiData.settings.location
})
const mapDispatchToProps = (dispatch: any) => ({
    setSettings: (settings: any) => dispatch(setSettings(settings))
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));
