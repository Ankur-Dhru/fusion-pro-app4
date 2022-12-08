import * as React from 'react';
import {withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import Dashboard from "../Dashboard";
import Menu from "../Menu";
import Task from "../Task";
import {TouchableOpacity, View} from "react-native";
import {
    getCurrentCompanyDetails,
    getInit,
    getRoleModuleAccess,
    getVisibleNav,
    log, PERMISSION_NAME,
    retrieveData
} from "../../lib/functions";
import {setCompany} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";
import {isDevelopment, nav, screenOptionStyle} from "../../lib/setting";

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ProIcon from "../../components/ProIcon";
import Avatar from "../../components/Avatar";
import Blank from "../Blank";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import ClientareaLoader from "../../components/ContentLoader/ClientareaLoader";
import ClientAvatar from "../../components/ClientAvatar";
import {FILTERED_VOUCHER, vouchers} from "../../lib/static";

const Tab = createBottomTabNavigator();

class Index extends React.Component<any> {

    params: any;
    taskaccess:any;
    constructor(props: any) {

        const {navigation}: any = props;
        nav.navigation = navigation;

        super(props);

        this.state = {
            workspace: true,
            isLoading: false,
            taskaccess:false
        }
        const {route}: any = this.props;
        this.params = route.params;
        FILTERED_VOUCHER.data = getVisibleNav(vouchers);



        //this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        setTimeout(()=>{
            this.setState({taskaccess:getRoleModuleAccess(PERMISSION_NAME.VIEW_TASK)?.access})
        },1000)
    }


    componentWillMount = async () => {



        //BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);

        const {navigation, connection} = this.props;

        await retrieveData('fusion-pro-app').then(async (data: any) => {

            if (Boolean(Object.keys(data.companies).length)) {
                if (connection.internet) {
                    await getInit(data, navigation, '', (response: any) => {
                        this.setState({workspace: response, isLoading: true,})
                    });
                } else {
                    this.setState({workspace: true, isLoading: true})
                }
            } else {
                this.setState({workspace: false, isLoading: true})
                // if (!Boolean(this?.params?.disableAddWorkspace)) {
                //     Alert.alert(
                //         "Opps",
                //         'No any workspace found',
                //         [
                //             {
                //                 text: "Add Workspace", onPress: () =>
                //                     navigation.navigate('AddWorkspace', {
                //                         screen: 'AddWorkspace',
                //                     })
                //             }
                //         ]
                //     );
                // }
            }
        })


    }

    /*componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        let state = this.props.navigation.getState();
        if (state.index === 0) {
            BackHandler.exitApp();
        } else {
            this.props.navigation.goBack(null);
        }
        return true;
    }*/




    render() {



        const {navigation} = this.props;
        const {colors}: any = this.props.theme;
        const {username, adminid}: any = getCurrentCompanyDetails();
        const {workspace, isLoading, organization,taskaccess}: any = this.state;

        log('taskaccess',taskaccess)

        const screenOptions: any = {
            ...screenOptionStyle,
            headerLeft: () => <ClientAvatar navigation={navigation}/>,
            headerRight: () => <View style={[styles.grid]}>

                {
                    isDevelopment && <TouchableOpacity onPress={() => getInit()}>
                        <View>
                            <ProIcon name={"rotate"}/>
                        </View>
                    </TouchableOpacity>
                }


                <TouchableOpacity onPress={() => {
                    navigation.navigate('SettingsNavigator');
                }}>
                    <View style={[styles.px_5]}>
                        <ProIcon name={"gear"}/>
                    </View>
                </TouchableOpacity>
            </View>
        };

        const screenOptions2: any = {
            ...screenOptionStyle,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <View>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.openDrawer()
                }}>
                    <Avatar label={username} value={adminid} size={28}/>
                </TouchableOpacity>
            </View>,
        };

        const BlankAreaStack = createNativeStackNavigator();


        if (!isLoading) {
            return <BlankAreaStack.Navigator screenOptions={{...screenOptions2, headerTitle: 'Clientarea'}}
                                             initialRouteName={'Blank'}>
                <BlankAreaStack.Screen name="Blank" component={() => <ClientareaLoader/>}/>
            </BlankAreaStack.Navigator>
        } else if (!workspace && isLoading) {

            return <BlankAreaStack.Navigator screenOptions={{...screenOptions2, headerTitle: 'Clientarea'}}
                                             initialRouteName={'Blank'}>
                <BlankAreaStack.Screen name="Blank"
                                       component={(props: any) => <Blank {...props} organization={organization}
                                                                         workspace={workspace}/>}/>
            </BlankAreaStack.Navigator>
        }



        return (

            <>


                <Tab.Navigator screenOptions={{
                    ...screenOptions,
                    /*headerShown:false,*/
                    tabBarInactiveTintColor: '#969696',
                    tabBarActiveTintColor: colors.secondary,
                    tabBarLabelStyle: {fontSize: 10, marginBottom: 3,}
                }}>


                    <Tab.Screen name="Dashboard"
                                component={Dashboard}
                                options={{
                                    tabBarIcon: ({focused, color, size}) => {
                                        return (
                                            <ProIcon name={'chart-line'} color={color} type={'light'}/>
                                        )
                                    },
                                }}/>
                    <Tab.Screen
                        name="Menu"
                        component={Menu}
                        options={{
                            tabBarIcon: ({focused, color, size}) => {
                                return (
                                    <ProIcon name={'bars'} color={color} type={'light'}/>
                                )
                            },
                        }}/>


                    {Boolean(taskaccess?.view) && <Tab.Screen name="Task" component={Task}
                                options={{
                                    tabBarIcon: ({focused, color, size}) => {
                                        return (
                                            <ProIcon name={'list-check'} color={color} type={'light'}/>
                                        )
                                    },
                                }}/>}

                </Tab.Navigator>

            </>

        );
    }
}


const mapStateToProps = (state: any) => ({
    connection: state.appApiData.connection,
})
const mapDispatchToProps = (dispatch: any) => ({
    setCompany: (company: any) => dispatch(setCompany(company)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));
