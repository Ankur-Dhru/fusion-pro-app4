import React, {Component} from 'react';
import {connect} from "react-redux";


import {ActivityIndicator, BottomSheet, Dialog, Modal, PageSheet, SnackBar} from "./components";
import {setSettings} from "./lib/Store/actions/appApiData";
import {Appearance, AppState, Linking, StatusBar, View} from "react-native";
import DrawerNavigator from "./pages/Navigation/DrawerNavigator";
import {CheckConnectivity, getInit, log, navigationRef, retrieveData} from "./lib/functions";
// @ts-ignore
import Contacts from "react-native-contacts";

import {configureFontAwesomePro} from "react-native-fontawesome-pro";
import {
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
    NavigationContainer,
} from '@react-navigation/native';
import {
    DarkTheme as PaperDarkTheme,
    DefaultTheme as PaperDefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper';
import {auth, current, defaultvalues, isDevelopment} from "./lib/setting";
import {LoginStackNavigator} from "./pages/Navigation/StackNavigator";


configureFontAwesomePro();


const colorScheme = Appearance.getColorScheme();
//const colorScheme = 'light';

export const PreferencesContext = React.createContext({
    toggleTheme: () => {
    },
    isThemeDark: false,
});


let promisewait:any = () => {
    return new Promise(resolve => {
        setTimeout(()=>{
            resolve({})
        },3000)
    })
}

class Index extends Component<any> {

    linking: any;

    constructor(props: any) {

        super(props);

        Contacts.iosEnableNotesUsage(false);
        this.state = {isLoading: true, appState: AppState.currentState}
    }

    /*componentDidMount () {
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }*/



    _handleAppStateChange = (nextAppState: any) => {
        const {appState}: any = this.state;
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            CheckConnectivity()
        }
        this.setState({appState: nextAppState});
    }



    render() {

        const {preferences}: any = this.props;

        let config: any = {
            screens: {
                LoginStack:{
                    initialRouteName: 'LoginWith',
                    screens: {
                        LoginWith: {
                            path: "login",
                        },
                        ResetPassword: {
                            path: "resetpassword",
                        },
                        SignupStep1: {
                            path: "signup",
                        },
                        Verification: {
                            path: "verification",
                        },
                        ChangeEmail: {
                            path: "changeemail",
                        },
                    }
                },
                DashboardStack: {
                    initialRouteName: 'ClientArea',
                    screens: {
                        ClientArea: {
                            initialRouteName: 'Task',
                            screens: {
                                Task: {
                                    path: "ticket",
                                },
                                Menu: {
                                    path: "add",
                                },
                                Dashboard: {
                                    path: "dashboard",
                                },
                            }
                        },
                        AddEditTask: {
                            path: "new-task/:ticketdisplayid/:workspace",
                        },
                        AddEditVoucher: {
                            path: "voucher-list/new-invoice/:voucherdisplayid/:workspace",
                        }
                    }
                },
            }
        }

        /*if (!isAuthenticated) {
            config = {
                screens: {
                    initialRouteName: "LoginWith",
                    LoginWith: {
                        path: "login",
                    },
                }
            }
        }*/




        this.linking = {
            prefixes: ['https://fusionpro.dhru.io/','fusionpro://'],
            async getInitialURL() {
                const url = await Linking.getInitialURL();

                if (url != null) {
                    let logout = false
                    defaultvalues.isReceiveURL = Boolean(url);
                    await retrieveData('fusion-pro-app').then(async (data: any) => {

                        if(data.token === 'logout'){
                            logout = true;
                            return 'https://fusionpro.dhru.io/login';
                        }
                        else {
                            let workspace = url.substring(url.lastIndexOf('/') + 1);
                            current.company = workspace;
                            current.user = workspace + '-' + data.userid;
                            auth.token = data.token;
                            await getInit(data, '', '', (response: any) => {
                                CheckConnectivity()
                            });
                        }
                    })
                    await promisewait();
                    if(!logout) {
                        return url;
                    }
                }
            },

            config: config
        };



        const CombinedDefaultTheme = {
            ...PaperDefaultTheme,
            ...NavigationDefaultTheme,
            roundness: 5,
            dark: false,
            colors: {
                ...PaperDefaultTheme.colors,
                ...NavigationDefaultTheme.colors,
                backdrop: '#eee',
                bottomNavigation: 'white',
                inputbox: 'black',
                inputLabel: '#666',
                backgroundColor: 'transparent',
                elevation: 2,
                screenbg: '#f4f4f4',
                surface: '#fff',
                primary: '#222A55',
                accent: '#222A55',
                secondary: '#016EFE',
                divider: '#eee',
                filterbox: '#E6EFFE',
                loadersecondary: '#eeeeee',
                loaderprimary: '#ddd',
                walkthroughbg:"#fff"
            },
        };
        const CombinedDarkTheme = {
            ...PaperDarkTheme,
            ...NavigationDarkTheme,
            dark: true,
            mode: 'adaptive',
            colors: {
                ...PaperDarkTheme.colors,
                ...NavigationDarkTheme.colors,
                backdrop: '#000',
                bottomNavigation: 'black',
                backgroundColor: 'transparent',
                elevation: 2,
                inputbox: 'white',
                screenbg: '#000',
                inputLabel: '#ccc',
                surface: '#121212',
                primary: '#eee',
                accent: '#fff',
                secondary: '#016EFE',
                divider: '#464646',
                filterbox: '#000',
                loadersecondary: '#222',
                loaderprimary: '#000',
                walkthroughbg:"#333"
            },
        };


        let theme = colorScheme;
        if (preferences && preferences.theme === 'Light') {
            theme = 'light';
        } else if (preferences && preferences.theme === 'Dark') {
            theme = 'dark';
        }


        let themeis: any = (theme === 'light' ? CombinedDefaultTheme : CombinedDarkTheme);



        return (
            <PreferencesContext.Provider value={preferences}>
                <PaperProvider theme={themeis}>

                    <StatusBar
                        animated={true}
                        backgroundColor={theme === 'light' ? '#fff' : '#222'}
                        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
                        showHideTransition={'fade'}
                        hidden={false}/>

                    <NavigationContainer ref={navigationRef} linking={this.linking} theme={themeis}>
                        <DrawerNavigator/>
                    </NavigationContainer>

                    <Dialog/>
                    {/*<RefreshToken/>*/}

                    {/*<BottomSheet/>
                    <Confirm/>*/}

                    <BottomSheet/>
                    <PageSheet/>
                    <Modal/>


                    <SnackBar/>
                    <ActivityIndicator/>
                </PaperProvider>
            </PreferencesContext.Provider>
        );
    }

}


const mapStateToProps = (state: any) => ({
    preferences: state.appApiData.preferences,
})
const mapDispatchToProps = (dispatch: any) => ({
    setSettings: (settings: any) => dispatch(setSettings(settings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

