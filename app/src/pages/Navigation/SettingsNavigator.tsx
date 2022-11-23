import React from "react";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {screenOptionStyle} from "../../lib/setting";
import Locations from "../Locations";
import LocationDepartment from "../Locations/LocationDepartment";
import LocationForm from "../Locations/LocationForm";
import LocationPreferences from "../Locations/LocationPreferences";
import LocationTables from "../Locations/LocationTables";
import BusinessDetails from "../SetupWorkspace/BusinessDetails";
import DepartmentForm from "../Locations/DepartmentForm";
import TableForm from "../Locations/TableForm";
import LocationSettings from "../LocationSettings";
import Currency from "../Currency";
import CurrencyForm from "../Currency/CurrencyForm";
import Units from "../Units";
import UnitForm from "../Units/UnitForm";
import PaymentMethod from "../PaymentMethod";
import PaymentMethodForm from "../PaymentMethod/PaymentMethodForm";
import Automation from "../Automation";
import Reasons from "../Reasons";
import ReasonList from "../Reasons/ReasonList";
import ReasonForm from "../Reasons/ReasonForm";
import Templates from "../Templates";
import DueDateTerms from "../DueDateTerms";
import DueDateTermsForm from "../DueDateTerms/DueDateTermsForm";
import ClientAssetsTypes from "../ClientAssetsTypes";
import AssetsTypeForm from "../ClientAssetsTypes/AssetsTypeForm";
import AssetsFieldForm from "../ClientAssetsTypes/AssetsFieldForm";
import Taxes from "../Taxes";
import TaxGroupForm from "../Taxes/TaxGroupForm";
import TaxesForm from "../Taxes/TaxesForm";
import IntraStateTax from "../Taxes/IntraStateTax";
import TdsTcs from "../TdsTcs";
import {log} from "../../lib/functions";
import TdsForm from "../TdsTcs/TdsForm";
import TcsForm from "../TdsTcs/TcsForm";
import VoucherTypes from "../VoucherTypes";
import VoucherTypesForm from "../VoucherTypes/VoucherTypesForm";
import VoucherTypeGeneral from "../VoucherTypes/VoucherTypeGeneral";
import VoucherTypeAccounting from "../VoucherTypes/VoucherTypeAccounting";
import TicketTypes from "../TicketTypes";
import TicketTypeGeneral from "../TicketTypes/TicketTypeGeneral";
import TicketTypeSettings from "../TicketTypes/TicketTypeSettings";
import TicketTypeTaskType from "../TicketTypes/TicketTypeTaskType";
import TicketTypeTicketStatus from "../TicketTypes/TicketTypeTicketStatus";
import TicketTypeKanbanBoard from "../TicketTypes/TicketTypeKanbanBoard";
import TicketTypeScreens from "../TicketTypes/TicketTypeScreens";
import TicketTypeOutsourcing from "../TicketTypes/TicketTypeOutsourcing";
import TicketTypesForm from "../TicketTypes/TicketTypesForm";
import TicketStatusForm from "../TicketTypes/TicketStatusForm";
import TaskTypeForm from "../TicketTypes/TaskTypeForm";
import KanbanForm from "../TicketTypes/KanbanForm";
import OutsourcingStatusList from "../TicketTypes/OutsourcingStatusList";
import OutsourcingStatusForm from "../TicketTypes/OutsourcingStatusForm";
import OutsourcingCustomFieldList from "../TicketTypes/OutsourcingCustomFieldList";
import Roles from "../Roles";


const SettingsStackNavigator = createNativeStackNavigator();
const SettingsNavigator = () => {
    return <SettingsStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'LocationSettings'}>

        <SettingsStackNavigator.Screen
            name="LocationSettings"
            component={LocationSettings}
            options={{headerTitle: 'Settings', headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="LocationNavigator"
            component={LocationNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="CurrencyNavigator"
            component={CurrencyNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="UnitsNavigator"
            component={UnitsNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="PaymentMethodNavigator"
            component={PaymentMethodNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="Automation"
            component={Automation}
            options={{headerTitle: 'Automation', headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="ReasonsNavigator"
            component={ReasonsNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="Templates"
            component={Templates}
            options={{headerTitle: 'Templates', headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="DueDateTermsNavigator"
            component={DueDateTermsNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="ClientAssetsTypesNavigator"
            component={ClientAssetsTypesNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="TaxesNavigator"
            component={TaxesNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="TdsTcsNavigator"
            component={TdsTcsNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="VoucherTypeNavigator"
            component={VoucherTypeNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="TicketTypesTypeNavigator"
            component={TicketTypesTypeNavigator}
            options={{headerShown: false, headerLargeTitle: true}}/>

        <SettingsStackNavigator.Screen
            name="Roles"
            component={Roles}
            options={{headerTitle: 'Templates', headerLargeTitle: true}}/>
    </SettingsStackNavigator.Navigator>
}
export default SettingsNavigator;

const LocationStackNavigator = createNativeStackNavigator();
export const LocationNavigator = () => {
    return <LocationStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'Locations'}>

        <LocationStackNavigator.Screen
            name="Locations"
            component={Locations}
            options={{headerTitle: 'Outlet / Location', headerLargeTitle: true}}/>

        <LocationStackNavigator.Screen
            name="LocationForm"
            component={LocationForm}
            options={{headerTitle: 'Edit Location', headerLargeTitle: true}}/>

        <LocationStackNavigator.Screen
            name="LocationGeneral"
            component={BusinessDetails}
            options={{headerTitle: 'Edit Location', headerLargeTitle: true}}/>

        <LocationStackNavigator.Screen
            name="LocationPreferences"
            component={LocationPreferences}
            options={{headerTitle: 'Edit Location', headerLargeTitle: true}}/>

        <LocationStackNavigator.Screen
            name="LocationDepartment"
            component={LocationDepartment}
            options={{headerTitle: 'Edit Location', headerLargeTitle: true}}/>

        <LocationStackNavigator.Screen
            name="DepartmentForm"
            component={DepartmentForm}
            options={{headerTitle: 'Add Department', headerLargeTitle: true}}/>

        <LocationStackNavigator.Screen
            name="LocationTables"
            component={LocationTables}
            options={{headerTitle: 'Edit Location', headerLargeTitle: true}}/>

        <LocationStackNavigator.Screen
            name="TableForm"
            component={TableForm}
            options={{headerTitle: 'Add Table', headerLargeTitle: true}}/>
    </LocationStackNavigator.Navigator>
}

const CurrencyStackNavigator = createNativeStackNavigator();
export const CurrencyNavigator = () => {
    return <CurrencyStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'Currency'}
    >

        <CurrencyStackNavigator.Screen
            name="Currency"
            component={Currency}
            options={{headerTitle: 'Currency', headerLargeTitle: true}}/>

        <CurrencyStackNavigator.Screen
            name="CurrencyForm"
            component={CurrencyForm}
            options={{headerTitle: 'Add Currency', headerLargeTitle: true}}/>

    </CurrencyStackNavigator.Navigator>
}

const UnitsStackNavigator = createNativeStackNavigator();
export const UnitsNavigator = () => {
    return <UnitsStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'Units'}
    >

        <UnitsStackNavigator.Screen
            name="Units"
            component={Units}
            options={{headerTitle: 'Units', headerLargeTitle: true}}/>

        <UnitsStackNavigator.Screen
            name="UnitForm"
            component={UnitForm}
            options={{headerTitle: 'Add Units', headerLargeTitle: true}}/>

    </UnitsStackNavigator.Navigator>
}

const PaymentMethodStackNavigator = createNativeStackNavigator();
export const PaymentMethodNavigator = () => {
    return <PaymentMethodStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'PaymentMethod'}
    >

        <PaymentMethodStackNavigator.Screen
            name="PaymentMethod"
            component={PaymentMethod}
            options={{headerTitle: 'Payment Method', headerLargeTitle: true}}/>

        <PaymentMethodStackNavigator.Screen
            name="PaymentMethodForm"
            component={PaymentMethodForm}
            options={{headerTitle: 'Add Payment Method', headerLargeTitle: true}}/>

    </PaymentMethodStackNavigator.Navigator>
}

const ReasonsStackNavigator = createNativeStackNavigator();
export const ReasonsNavigator = () => {
    return <ReasonsStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'Reasons'}
    >

        <ReasonsStackNavigator.Screen
            name="Reasons"
            component={Reasons}
            options={{headerTitle: 'Reasons', headerLargeTitle: true}}/>

        <ReasonsStackNavigator.Screen
            name="ReasonsList"
            component={ReasonList}
            options={{headerTitle: 'Reasons', headerLargeTitle: true}}/>

        <ReasonsStackNavigator.Screen
            name="ReasonForm"
            component={ReasonForm}
            options={{headerTitle: 'Add Reason', headerLargeTitle: true}}/>

    </ReasonsStackNavigator.Navigator>
}

const DueDateTermsStackNavigator = createNativeStackNavigator();
export const DueDateTermsNavigator = () => {
    return <DueDateTermsStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'DueDateTerms'}
    >

        <DueDateTermsStackNavigator.Screen
            name="DueDateTerms"
            component={DueDateTerms}
            options={{headerTitle: 'DueDateTerms', headerLargeTitle: true}}/>

        <DueDateTermsStackNavigator.Screen
            name="DueDateTermsForm"
            component={DueDateTermsForm}
            options={{headerTitle: 'Add Due Date Terms', headerLargeTitle: true}}/>

    </DueDateTermsStackNavigator.Navigator>
}

const ClientAssetsTypesStackNavigator = createNativeStackNavigator();
export const ClientAssetsTypesNavigator = () => {
    return <ClientAssetsTypesStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'ClientAssetsTypes'}
    >

        <ClientAssetsTypesStackNavigator.Screen
            name="ClientAssetsTypes"
            component={ClientAssetsTypes}
            options={{headerTitle: "Client's Assets Types", headerLargeTitle: true}}/>

        <ClientAssetsTypesStackNavigator.Screen
            name="ClientAssetsTypeForm"
            component={AssetsTypeForm}
            options={{headerTitle: "Add Client Assets", headerLargeTitle: true}}/>

        <ClientAssetsTypesStackNavigator.Screen
            name="ClientAssetsFieldForm"
            component={AssetsFieldForm}
            options={{headerTitle: "Add Client Assets", headerLargeTitle: true}}/>


    </ClientAssetsTypesStackNavigator.Navigator>
}

const TaxesStackNavigator = createNativeStackNavigator();
export const TaxesNavigator = () => {
    return <TaxesStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'Taxes'}
    >

        <TaxesStackNavigator.Screen
            name="Taxes"
            component={Taxes}
            options={{headerTitle: "Taxes", headerLargeTitle: true}}/>

        <TaxesStackNavigator.Screen
            name="TaxGroupForm"
            component={TaxGroupForm}
            options={{headerTitle: "Add Tax Group", headerLargeTitle: true}}/>

        <TaxesStackNavigator.Screen
            name="TaxesForm"
            component={TaxesForm}
            options={{headerTitle: "Add Taxes", headerLargeTitle: true}}/>

        <TaxesStackNavigator.Screen
            name="IntraStateTax"
            component={IntraStateTax}
            options={{headerTitle: "Add Intra State Tax", headerLargeTitle: true}}/>

    </TaxesStackNavigator.Navigator>
}

const TdsTcsStackNavigator = createNativeStackNavigator();
export const TdsTcsNavigator = (props: any) => {


    return <TdsTcsStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'TdsTcs'}
    >

        <TdsTcsStackNavigator.Screen
            name="TdsTcs"
            component={TdsTcs}
            initialParams={props.route.params}
            options={{headerTitle: "TdsTcs", headerLargeTitle: true, ...props}}/>

        <TdsTcsStackNavigator.Screen
            name="TdsForm"
            component={TdsForm}
            options={{headerTitle: "Add TdsTcs", headerLargeTitle: true}}/>

        <TdsTcsStackNavigator.Screen
            name="TcsForm"
            component={TcsForm}
            options={{headerTitle: "Add TdsTcs", headerLargeTitle: true}}/>


    </TdsTcsStackNavigator.Navigator>
}

const VoucherTypeStackNavigator = createNativeStackNavigator();
export const VoucherTypeNavigator = () => {
    return <VoucherTypeStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'VoucherTypes'}
    >

        <VoucherTypeStackNavigator.Screen
            name="VoucherTypes"
            component={VoucherTypes}
            options={{headerTitle: "VoucherTypes", headerLargeTitle: true}}/>


        <VoucherTypeStackNavigator.Screen
            name="VoucherTypesForm"
            component={VoucherTypesForm}
            options={{headerTitle: "VoucherTypes", headerLargeTitle: true}}/>

        <VoucherTypeStackNavigator.Screen
            name="VoucherTypeGeneral"
            component={VoucherTypeGeneral}
            options={{headerTitle: "Voucher Type General", headerLargeTitle: true}}/>

        <VoucherTypeStackNavigator.Screen
            name="VoucherTypeAccounting"
            component={VoucherTypeAccounting}
            options={{headerTitle: "Voucher Type Accounting", headerLargeTitle: true}}/>

    </VoucherTypeStackNavigator.Navigator>
}

const TicketTypesStackNavigator = createNativeStackNavigator();
export const TicketTypesTypeNavigator = () => {
    return <TicketTypesStackNavigator.Navigator
        screenOptions={{...screenOptionStyle}}
        initialRouteName={'TicketTypes'}
    >

        <TicketTypesStackNavigator.Screen
            name="TicketTypes"
            component={TicketTypes}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TicketTypesForm"
            component={TicketTypesForm}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>


        <TicketTypesStackNavigator.Screen
            name="TicketTypeGeneral"
            component={TicketTypeGeneral}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TicketTypeSettings"
            component={TicketTypeSettings}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TicketTypeTaskType"
            component={TicketTypeTaskType}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TicketTypeTicketStatus"
            component={TicketTypeTicketStatus}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TicketTypeKanbanBoard"
            component={TicketTypeKanbanBoard}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TicketTypeScreens"
            component={TicketTypeScreens}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TicketTypeOutsourcing"
            component={TicketTypeOutsourcing}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TicketStatusForm"
            component={TicketStatusForm}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="TaskTypeForm"
            component={TaskTypeForm}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="KanbanForm"
            component={KanbanForm}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="OutsourcingStatusList"
            component={OutsourcingStatusList}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="OutsourcingStatusForm"
            component={OutsourcingStatusForm}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="OutsourcingCustomFieldList"
            component={OutsourcingCustomFieldList}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>

        <TicketTypesStackNavigator.Screen
            name="OutsourcingCustomFieldForm"
            component={AssetsFieldForm}
            options={{headerTitle: "TicketTypes", headerLargeTitle: true}}/>


    </TicketTypesStackNavigator.Navigator>
}
