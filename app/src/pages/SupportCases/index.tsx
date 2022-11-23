import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import {withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../lib/navigation_options";
import ProIcon from "../../components/ProIcon";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {loginUrl, screenOptionStyle} from "../../lib/setting";
import {styles} from "../../theme";
import {connect} from "react-redux";
import CaseList from "./CaseList";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {isEmpty} from "../../lib/functions";
import {setRootAppData} from "../../lib/Store/actions/rootAppData";
import ClientAvatar from "../../components/ClientAvatar";

const Tab = createBottomTabNavigator();

class Index extends Component<any, any> {

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        const {setRootAppData} = this.props;
        requestApi({
            method: methods.get,
            action: actions.logininit,
            other: {url: loginUrl},
            showlog: true,
            successalert:false
        }).then((response: any) => {
            if (response.status === SUCCESS && !isEmpty(response.data)) {
                setRootAppData(response?.data)
            }
        })
    }

    render() {
        const {navigation, theme: {colors}} = this.props;
        setNavigationOptions(navigation, "Support Cases",colors)

        const screenOptions: any = {
            ...screenOptionStyle,
            headerTitle: "Support Cases",
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft: () => <ClientAvatar navigation={navigation}/>,
            headerRight: () => <TouchableOpacity onPress={() => {
                navigation.navigate("SupportRequest")
            }}>
                <View style={[styles.px_5]}>
                    <ProIcon name="plus"/>
                </View>
            </TouchableOpacity>
        };

        return (
            <Tab.Navigator screenOptions={{
                ...screenOptions,
                tabBarInactiveTintColor: '#969696',
                tabBarActiveTintColor: colors.secondary,
                tabBarLabelStyle: {fontSize: 10, marginBottom: 3,}
            }}>
                <Tab.Screen
                    initialParams={{status: "open"}}
                    name="Open"
                    component={CaseList}
                    options={{
                        tabBarIcon: ({focused, color, size}) => {
                            return (
                                <ProIcon name={'folder-open'} color={color} type={'light'}/>
                            )
                        },
                    }}/>
                <Tab.Screen
                    initialParams={{status: "closed"}}
                    name="Resolved"
                    component={CaseList}
                    options={{
                        tabBarIcon: ({focused, color, size}) => {
                            return (
                                <ProIcon name={'square-check'} color={color} type={'light'}/>
                            )
                        },
                    }}/>

            </Tab.Navigator>
        );
    }
}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    setRootAppData: (data: any) => dispatch(setRootAppData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

