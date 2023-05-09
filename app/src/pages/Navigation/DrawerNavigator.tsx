
import React, {Component} from 'react';


import {setCompany, setSettings} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";




import {createDrawerNavigator} from '@react-navigation/drawer';

import DrawerNavigatorContent from "../../pages/Navigation/DrawerNavigatorContent"

import Splash from "../Splash";


import {
    DashboardStackNavigator,
    LoginStackNavigator,
} from "./StackNavigator";
import Settings from "../Settings";
import {getCurrentCompanyDetails, log} from "../../lib/functions";

import {TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";
import Avatar from "../../components/Avatar";
import GettingStarted from "../BeforeLogin/GettingStarted";
import {nav} from "../../lib/setting";
import VerifyOTP from "../BeforeLogin/VerifyOTP";



const Drawer = createDrawerNavigator();
const screenOptionStyle = {
    headerShown: false,
    swipeEdgeWidth: 0
};



class DrawerView extends Component<any> {

    constructor(props:any) {
        super(props);
    }


    render() {

        const {username,adminid}:any = getCurrentCompanyDetails();

        const {navigation,isAuthenticated}: any = this.props;

        nav.navigation = navigation;

        const screenOptions:any = {
            ...screenOptionStyle,

            headerLeft:()=><View style={[styles.px_5]}><TouchableOpacity onPress={()=> {this.props.navigation.openDrawer()} }>
                <Avatar label={username} value={adminid} size={28}  />
            </TouchableOpacity>
                <View  style={[styles.socket,{backgroundColor:this.props.connection.socket?'green':'red'}]}></View>
            </View>,

        };

        return (
            <Drawer.Navigator
                screenOptions={{...screenOptions}}
                drawerContent={(props) => <DrawerNavigatorContent  {...props} />}
                initialRouteName={'Splash'}>
                <Drawer.Screen name={'Splash'}   component={Splash}   />
                <Drawer.Screen name={'GettingStarted'}   component={GettingStarted}    />
                <Drawer.Screen name={'LoginStack'}  component={LoginStackNavigator}  options={({ route }:any) => ({ title: route.params && route.params.title })} />
                <Drawer.Screen name={'DashboardStack'} options={{title:'Client Area'}} component={DashboardStackNavigator}  />
                <Drawer.Screen name={'Settings'} options={{title:'Settings'}} component={Settings}  />
            </Drawer.Navigator>
        )
    }
}


const mapStateToProps = (state:any) => ({
    isAuthenticated: state.authentication.isAuthenticated,
})

const mapDispatchToProps = (dispatch:any) => ({
    setCompany: (company:any) => dispatch(setCompany(company)),
    setSettings: (settings:any) => dispatch(setSettings(settings)),
});

export default connect(mapStateToProps,mapDispatchToProps)(DrawerView);


