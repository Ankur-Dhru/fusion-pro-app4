import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {screenOptionStyle} from "../../lib/setting";
import React from "react";
import SupportCases from "../SupportCases";
import SupportRequest from "../SupportCases/SupportRequest";
import SupportTicketForm from "../SupportCases/SupportTicketForm";
import ProductList from "../SupportCases/ProductList";
import TicketCreated from "../SupportCases/TicketCreated";
import LoginCredential from "../SupportCases/LoginCredential";
import ViewTickets from "../SupportCases/ViewTickets";

const SupportStackNavigator = createNativeStackNavigator();

const SupportNavigator = () => {
    return <SupportStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'SupportCases'}>

        <SupportStackNavigator.Screen
            name="SupportCases"
            component={SupportCases}
            options={{headerShown: false,}}/>

        <SupportStackNavigator.Screen
            name="SupportRequest"
            component={SupportRequest}
            options={{headerTitle: "Support Request", headerLargeTitle: true}}/>


        <SupportStackNavigator.Screen
            name="SupportTicketForm"
            component={SupportTicketForm}
            options={{headerTitle: "Support Request Form", headerLargeTitle: true}}/>

        <SupportStackNavigator.Screen
            name="ProductList"
            component={ProductList}
            options={{headerTitle: "Product List", headerLargeTitle: true}}/>

        <SupportStackNavigator.Screen
            name="TicketCreated"
            component={TicketCreated}
            options={{headerShown: false}}/>

        <SupportStackNavigator.Screen
            name="LoginCredential"
            component={LoginCredential}
            options={{headerTitle: "Login Credential", headerLargeTitle: true}}/>

        <SupportStackNavigator.Screen
            name="ViewTickets"
            component={ViewTickets}
            options={{headerTitle: "View Tickets", headerLargeTitle: true}}/>


    </SupportStackNavigator.Navigator>
}

export default SupportNavigator;
