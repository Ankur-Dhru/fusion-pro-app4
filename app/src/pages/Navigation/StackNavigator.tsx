import React from "react";
import 'react-native-gesture-handler';
import {createNativeStackNavigator} from "react-native-screens/native-stack";


import AddEditVoucher from "../Voucher/AddEditVoucher";
import ListVoucher from "../Voucher/ListVoucher";

import Task from "../Task";
import Profile from "../UserProfile";
import ClientArea from "../ClientArea";
import Dashboard from "../Dashboard";
import Splash from "../Splash";


import ClientList from "../Voucher/AddEditVoucher/Client/ClientList";
import ChangeDates from "../Voucher/AddEditVoucher/Dates/ChangeDates";
import SearchItem from "../Voucher/AddEditVoucher/Items/SearchItem";
import ScanItem from "../Voucher/AddEditVoucher/Items/ScanItem";
import EditItem from "../Voucher/AddEditVoucher/Items/EditItem";

import SearchExpense from "../Voucher/AddEditVoucher/Expense/SearchExpense";
import EditExpense from "../Voucher/AddEditVoucher/Expense/EditExpense";
import EditInvoice from "../Voucher/AddEditVoucher/Invoice/EditInvoice";

import TermsCondition from "../Voucher/AddEditVoucher/TermsCondition";
import Payment from "../Voucher/AddEditVoucher/Payment";
import Print  from "../Print";

import ExchangeCurrencyRate from "../Voucher/AddEditVoucher/ExchangeCurrencyRate";

import AddEditTask from "../Task/AddEditTask";

import AddEditClient from "../Clients/AddEditClient";
import ListClient from "../Clients/ListClient";

import AddEditItem from "../Items/AddEditItem";
import ListItem from "../Items/ListItem";

import AddEditAccount from "../Accounts/AddEditAccount";
import ListAccounts from "../Accounts/ListAccounts";
import SearchJournal from "../Voucher/AddEditVoucher/Journal/SearchJournal";
import EditJournal from "../Voucher/AddEditVoucher/Journal/EditJournal";
import CustomerNotes from "../Voucher/AddEditVoucher/CustomerNotes";

import SearchInventory from "../Voucher/AddEditVoucher/Inventory/SearchInventory";
import EditInventory from "../Voucher/AddEditVoucher/Inventory/EditInventory";
import CaptureImage from "../Attachment/CaptureImage";
import FullView from "../Attachment/FullView";
import DropdownList2 from "../../components/Dropdown2/DropdownList";
import Subtask from "../../pages/Task/Subtask";
import {defaultvalues, screenOptionStyle} from "../../lib/setting";
import Settings from "../Settings";
import GettingStarted from "../BeforeLogin/GettingStarted";
import LoginWith from "../BeforeLogin/LoginWith";
import LoginDhruCom from "../BeforeLogin/LoginDhruCom";
import ChangePassword from "../UserProfile/ChangePassword";
import ChangeEmail from "../UserProfile/ChangeEmail";
import Blank from "../Blank";
import Verification from "../BeforeLogin/Verification";
import OrganizationProfile from "../SetupWorkspace/OrganizationProfile";
import AddWorkspace from "../SetupWorkspace/AddWorkspace";
import BusinessDetails from "../SetupWorkspace/BusinessDetails";
import CurrencyPreferences from "../SetupWorkspace/CurrencyPreferences";
import AddEditStaff from "../Staffs/AddEditStaff";
import SignupStep1 from "../BeforeLogin/SignupStep1";
import SignupStep2 from "../BeforeLogin/SignupStep2";
import ListStaff from "../Staffs/ListStaff";
import AddEditCategory from "../ItemCategory/AddEditCategory";
import ListCategory from "../ItemCategory/ListCategory";
import LocationSettings from "../LocationSettings";
import ClientOverview from "../Clients/ClientOverview";
import SettingsNavigator from "./SettingsNavigator";
import ListStatement from "../Clients/ListStatement";
import ListAssets from "../Clients/ListAssets";
import AddEditAssets from "../Clients/AddEditAssets";
import AccountGroups from "../Accounts/AccountGroups";
import Scanner from "../../components/InputField/Scanner";
import EditJobsheet from "../Voucher/EditJobsheet";
import EditAssets from "../Voucher/EditJobsheet/EditAssets";
import ConsumableTab from "../Voucher/EditJobsheet/ConsumableTab";
import SearchConsumableItems from "../Voucher/EditJobsheet/SearchConsumableItems";
import ScanItemConsumable from "../Voucher/EditJobsheet/ScanItemConsumable";
import JobAdvPayment from "../Voucher/AddEditVoucher/JobAdvPayment";
import ProfileSettings from "../ProfileSettings";
import DropdownList from "../DropdownList";
import SupportNavigator from "./SupportNavigator";
import ClientVouchers from "../Clients/ClientVouchers";
import ResetPassword from "../BeforeLogin/ResetPassword";
import RemoveSerialStock from "../Voucher/AddEditVoucher/Inventory/RemoveSerialStock";
import {log} from "../../lib/functions";
import Sample from "../Sample";
import PatternScreen from "../PatternScreen";
import WhatsappVerification from "../BeforeLogin/WhatsappVerification";
import VerifyOTP from "../BeforeLogin/VerifyOTP";

//let screenOptions = {...screenOptionStyle,headerLargeTitleStyle:{color:defaultvalues.theme.colors.inputbox},headerTitleStyle:{color:defaultvalues.theme.colors.inputbox}}

let screenOptions = {...screenOptionStyle};

const DashboardStack = createNativeStackNavigator();
const DashboardStackNavigator = (props: any) => {

    return (
        <DashboardStack.Navigator initialRouteName={'ClientArea'} screenOptions={{...screenOptions}}>

            <DashboardStack.Screen name="ClientArea" component={ClientArea} options={{headerShown: false}}/>

            <DashboardStack.Screen name="AddEditVoucher" component={AddEditVoucher} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="EditJobsheet" component={EditJobsheet} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="EditAssets" component={EditAssets} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ConsumableTab" component={ConsumableTab} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="SearchConsumableItems" component={SearchConsumableItems} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ScanItemConsumable" component={ScanItemConsumable} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ListVoucher" component={ListVoucher} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ClientList" component={ClientList}  options={{headerTitle: 'Client List', headerLargeTitle: false}}/>
            <DashboardStack.Screen name="SearchItem" component={SearchItem}/>
            <DashboardStack.Screen name="EditItem" component={EditItem} options={{headerTitle: 'Edit Item'}}/>
            <DashboardStack.Screen name="ScanItem" component={ScanItem}/>
            <DashboardStack.Screen name="Scanner" component={Scanner}/>
            <DashboardStack.Screen name="ChangeDates" component={ChangeDates}/>
            <DashboardStack.Screen name="TermsCondition" component={TermsCondition}
                                   options={{headerTitle: 'Terms & Conditions'}}/>
            <DashboardStack.Screen name="CustomerNotes" component={CustomerNotes}
                                   options={{headerTitle: 'Customer Notes'}}/>
            <DashboardStack.Screen name="FullView" component={FullView}/>
            <DashboardStack.Screen name="Payment" component={Payment} options={{headerLargeTitle: false}}/>

            <DashboardStack.Screen name="Print" component={Print} options={{headerTitle: 'Preview'}}/>


            <DashboardStack.Screen name="SearchExpense" component={SearchExpense}/>
            <DashboardStack.Screen name="ExchangeCurrencyRate" component={ExchangeCurrencyRate}/>
            <DashboardStack.Screen name="EditExpense" component={EditExpense}/>

            <DashboardStack.Screen name="EditInvoice" component={EditInvoice}/>

            <DashboardStack.Screen name="AddEditItem" component={AddEditItem} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="AddEditCategory" component={AddEditCategory} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="AddEditAccount" component={AddEditAccount} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="AddEditClient" component={AddEditClient} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ClientOverview" component={ClientOverview} options={{headerLargeTitle: false}}/>
            <DashboardStack.Screen name="AddEditAssets" component={AddEditAssets} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="AdvancedPayment" component={JobAdvPayment} options={{headerLargeTitle: false}}/>

            <DashboardStack.Screen name="ListItem" component={ListItem} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ListCategory" component={ListCategory} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ListClient" component={ListClient} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="AccountGroups" component={AccountGroups} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ListAccounts" component={ListAccounts} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ListStatement" component={ListStatement} options={{headerLargeTitle: false}}/>
            <DashboardStack.Screen name="ClientVouchers" component={ClientVouchers} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ListAssets" component={ListAssets} options={{headerLargeTitle: true}}/>

            <DashboardStack.Screen name="SearchJournal" component={SearchJournal}/>
            <DashboardStack.Screen name="EditJournal" component={EditJournal}/>

            <DashboardStack.Screen name="SearchInventory" component={SearchInventory}/>
            <DashboardStack.Screen name="EditInventory" component={EditInventory}/>
            <DashboardStack.Screen name="RemoveSerialStock" component={RemoveSerialStock}/>

            <DashboardStack.Screen name="CaptureImage" component={CaptureImage}/>

            <DashboardStack.Screen name="DropdownList2" component={DropdownList2}/>

            {/*<DashboardStack.Screen name="Add" component={Add}/>
            <DashboardStack.Screen name="Task" component={Task} options={{}}/>*/}


            <DashboardStack.Screen name="AddEditTask" component={AddEditTask} options={{headerLargeTitle: false}}/>
            <DashboardStack.Screen name="Subtask" component={Subtask} options={{}}/>


            <DashboardStack.Screen name="AddWorkspace" component={AddWorkspace}
                                   options={{headerTitle: 'Add Workspace', headerLargeTitle: true}}/>
            <DashboardStack.Screen name="Profile" component={Profile}
                                   options={{headerTitle: 'Profile', headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ChangePassword" component={ChangePassword}
                                   options={{headerTitle: 'Change Password', headerLargeTitle: true}}/>
            <DashboardStack.Screen name="OrganizationProfile" component={OrganizationProfile}
                                   options={{headerTitle: 'Setup Organization', headerLargeTitle: true}}/>
            <DashboardStack.Screen name="BusinessDetails" component={BusinessDetails}
                                   options={{headerTitle: 'Business Details', headerLargeTitle: true}}/>
            <DashboardStack.Screen name="CurrencyPreferences" component={CurrencyPreferences}
                                   options={{headerTitle: 'Currency Preferences', headerLargeTitle: true}}/>


            <DashboardStack.Screen name="SettingsNavigator" component={SettingsNavigator}
                                   options={{headerShown: false, headerLargeTitle: true}}/>

            <DashboardStack.Screen name="LocationNavigator" component={SettingsNavigator}
                                   options={{headerShown: false, headerLargeTitle: true}}/>

            <DashboardStack.Screen name="SupportNavigator" component={SupportNavigator}
                                   options={{headerShown: false, headerLargeTitle: true}}/>

            <DashboardStack.Screen name="SettingsStack" component={SettingsStackNavigator}
                                   options={{headerShown: false, headerLargeTitle: true}}/>

            <DashboardStack.Screen name="ListStaff" component={ListStaff} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="AddEditStaff" component={AddEditStaff} options={{headerLargeTitle: true}}/>
            <DashboardStack.Screen name="ProfileSettings" component={ProfileSettings} options={{headerLargeTitle: true}}/>

            <DashboardStack.Screen name="DropdownList" component={DropdownList} options={{headerLargeTitle: false}}/>
            <DashboardStack.Screen name="Sample" component={Sample} options={{headerLargeTitle: false}}/>
            <DashboardStack.Screen name="PatternScreen" component={PatternScreen} options={{headerLargeTitle: false}}/>



        </DashboardStack.Navigator>
    );
};




const ClientAreaStack = createNativeStackNavigator();
const ClientAreaStackNavigator = () => {
    return (
        <ClientAreaStack.Navigator screenOptions={{...screenOptions}} initialRouteName={'Dashboard'}>
            <ClientAreaStack.Screen name="Dashboard" component={Dashboard}/>
        </ClientAreaStack.Navigator>
    );
};

const BlankAreaStack = createNativeStackNavigator();
const BlankAreaStackNavigator = () => {
    return (
        <BlankAreaStack.Navigator screenOptions={{...screenOptions}} initialRouteName={'Blank'}>
            <BlankAreaStack.Screen name="Blank" component={Blank}/>
        </BlankAreaStack.Navigator>
    );
};


const ReportStack = createNativeStackNavigator();
const ReportStackNavigator = () => {
    return (
        <ReportStack.Navigator screenOptions={{...screenOptions}} initialRouteName={'Report'}>
            {/*<ReportStack.Screen name="Report" component={Report} />*/}
        </ReportStack.Navigator>
    );
};


const TaskStack = createNativeStackNavigator();
const TaskStackNavigator = () => {
    return (
        <TaskStack.Navigator screenOptions={{...screenOptions}} initialRouteName={'Task'}>
            <TaskStack.Screen name="Task" component={Task} options={{}}/>
            <TaskStack.Screen name="AddEditTask" component={AddEditTask} options={{headerLargeTitle: true,}}/>
            <TaskStack.Screen name="Subtask" component={Subtask} options={{}}/>
        </TaskStack.Navigator>
    );
};


const LoginStack = createNativeStackNavigator();
const LoginStackNavigator = () => {
    return (
        <LoginStack.Navigator screenOptions={{...screenOptions}} initialRouteName={'LoginWith'}>
            <LoginStack.Screen name="LoginWith" component={LoginWith}
                               options={{headerTitle: '', headerLargeTitle: false}}/>
            <LoginStack.Screen name="LoginDhruCom" component={LoginDhruCom}
                               options={{headerTitle: 'Login', headerLargeTitle: false}}/>
            <LoginStack.Screen name="ResetPassword" component={ResetPassword}
                               options={{headerTitle: 'Reset Password', headerLargeTitle: false}}/>



            <LoginStack.Screen name="SignupStep1" component={SignupStep1}
                               options={{headerTitle: 'Create an account', headerLargeTitle: true}}/>
            <LoginStack.Screen name="SignupStep2" component={SignupStep2}
                               options={{headerTitle: 'Create an account', headerLargeTitle: true}}/>

            <LoginStack.Screen name="Verification" component={Verification}
                               options={{headerTitle: 'Verify Your Email', headerLargeTitle: true}}/>

            <LoginStack.Screen name="WhatsappVerification" component={WhatsappVerification}
                               options={{headerTitle: 'Verify Your Whatsapp', headerLargeTitle: true}}/>

            <LoginStack.Screen name="VerifyOTP" component={VerifyOTP}
                               options={{headerTitle: 'Verify OTP', headerLargeTitle: true}}/>

            <LoginStack.Screen name="ChangeEmail" component={ChangeEmail}
                               options={{headerTitle: 'Change Email', headerLargeTitle: true}}/>
            <LoginStack.Screen name="DropdownList" component={DropdownList} options={{headerLargeTitle: false}}/>
        </LoginStack.Navigator>
    );
};


const SplashStack = createNativeStackNavigator();
const SplashStackNavigator = () => {
    return (
        <SplashStack.Navigator screenOptions={{...screenOptions}} initialRouteName={'Splash'}>
            <SplashStack.Screen name="Splash" component={Splash}/>
            <SplashStack.Screen name="GettingStarted" component={GettingStarted} options={{headerTitle: 'Dhru', headerLargeTitle: true}}/>
        </SplashStack.Navigator>
    );
};

const SettingsStack = createNativeStackNavigator();
const SettingsStackNavigator = () => {
    return (
        <SettingsStack.Navigator screenOptions={{...screenOptions}} initialRouteName={'Preferences'}>
            <SettingsStack.Screen name="Preferences" component={Settings}
                                  options={{headerTitle: 'Preferences', headerLargeTitle: false}}/>
        </SettingsStack.Navigator>
    );
};


export {
    SplashStackNavigator,
    DashboardStackNavigator,
    BlankAreaStackNavigator,
    SettingsStackNavigator,
    LoginStackNavigator,
    ClientAreaStackNavigator,
    ReportStackNavigator,
    TaskStackNavigator
};


