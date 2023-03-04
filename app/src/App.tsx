import React, {Component} from 'react';
import Provider from "./Provider";
import {connect, Provider as StoreProvider} from 'react-redux';
import configureStore from './lib/Store/configureStore';
import {Alert, AppState, Linking, LogBox, Platform, ScrollView, Text, View} from "react-native";
import {firebase} from "@react-native-firebase/messaging";
import {auth} from "./lib/setting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {log} from "./lib/functions";
import {enableScreens} from 'react-native-screens';
import {setSettings} from "./lib/Store/actions/appApiData";
import 'react-native-get-random-values';
import { YellowBox } from 'react-native';
import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions
} from "react-native/Libraries/NewAppScreen";
import Splash from "./pages/Splash";

export const store: any = configureStore();
export var token: any;

enableScreens(true);

LogBox.ignoreAllLogs();


export default class App extends Component<any, any> {

    async componentDidMount() {
        YellowBox.ignoreWarnings(['Animated: `useNativeDriver`']);
        await this.checkPermission();
    }


    //Check whether Push Notifications are enabled or not
    async checkPermission() {

        const authorizationStatus = await firebase.messaging().requestPermission();

        if (authorizationStatus === firebase.messaging.AuthorizationStatus.AUTHORIZED) {
            await this.getToken();
        } else if (authorizationStatus === firebase.messaging.AuthorizationStatus.PROVISIONAL) {
            await this.getToken();
        } else {
            await this.requestPermission();
        }
    }



    //Get Device Registration Token
    async getToken() {



        await firebase.messaging().registerDeviceForRemoteMessages()
        auth.device_token = await AsyncStorage.getItem('fcmToken');

        // if (!Boolean(auth.device_token)) {
        try {
            if (Platform.OS === 'ios') {

             //   const apnsToken = await firebase.messaging().getToken();
                auth.device_token = await firebase.messaging().getAPNSToken();

            } else {
                auth.device_token = await firebase.messaging().getToken();
            }
        } catch (e) {
            log('device_token token registration failed?', e);
        }
        if (auth.device_token) {
            await AsyncStorage.setItem('fcmToken', auth.device_token);
        }
        // }
        firebase.messaging().onTokenRefresh((fcmToken: any) => {

            auth.device_token = fcmToken;
        });

    }

    //Request for Push Notification
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission({
                sound: true,
                announcement: false,
                /*provisional: true,*/
            });
            // If user allow Push Notification
            await this.getToken();
        } catch (error) {
            // If user do not allow Push Notification
            log('Rejected');
        }
    }


    render() {
        return (
            <StoreProvider store={store}>
                <Provider></Provider>
            </StoreProvider>
        );
    }

}



