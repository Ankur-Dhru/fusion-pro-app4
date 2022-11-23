import React, {memo} from "react";
import {Container, ProIcon} from "../../components";
import {List, Title, withTheme,Divider} from "react-native-paper";
import {TouchableOpacity} from "react-native";
import FlatList from "../../components/FlatList";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {editOptionItem, log} from "../../lib/functions";
import {styles} from "../../theme";
import {chevronRight} from "../../lib/setting";



const editOptions = [
    editOptionItem("General", "LocationGeneral"),
    editOptionItem("Preference", "LocationPreferences"),
    editOptionItem("Department", "LocationDepartment"),
    editOptionItem("Tables", "LocationTables", false),
]

const LocationForm = (props: any) => {

    const {navigation, route, locations,theme:{colors}}: any = props;
    let title = "Add Location";
    const locationId = route?.params?.locationid;
    const isEdit = Boolean(locationId);
    let locationData: any = {};
    if (isEdit) {
        locationData = locations[locationId];
        title = `${locationData?.locationname}`
    }
    const isFoodService = Boolean(locationData.industrytype === "foodservices")

    setNavigationOptions(navigation, title,colors);

    const _OnPress = (item: any, isNew: boolean) => {
        navigation.navigate(item.screen, {
            ...item,
            title: `${locationData?.locationname} - ${item.title}`,
            alreadySetup: true,
            isNew,
            locationData,
            locations
        })
    }

    const renderClients = ({item}: any) => {

        return (

            <TouchableOpacity
                style={[{paddingHorizontal: 5}]}
                onPress={() => _OnPress(item, false)}>
                <List.Item
                    title={item.title}
                    titleNumberOfLines={2}
                    descriptionNumberOfLines={5}
                    right={props => <List.Icon
                        {...props}
                        icon={() => <Title>
                            {chevronRight}
                        </Title>}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        );
    };

    return <Container  surface={true}>
        <FlatList
            data={editOptions.filter(({visible}) => isFoodService ? true : Boolean(visible))}
            renderItem={renderClients}
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            keyExtractor={(item: any) => item?.id}
            initialNumToRender={10}
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll={true}
            invertStickyHeaders={false}
            progressViewOffset={100}
        />
    </Container>
}

const mapStateToProps = (state: any) => ({
    locations: state?.appApiData.settings.location
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(LocationForm)));

