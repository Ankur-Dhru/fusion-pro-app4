import React, {Component} from "react";
import {BackHandler, Image, Keyboard, Linking, Platform, View} from "react-native";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Container, ProIcon} from "../../components";
import {Paragraph, Text, Title, withTheme} from "react-native-paper";
import {setCompany, setPreferences} from "../../lib/Store/actions/appApiData";
import {auth as settingAuth} from "../../lib/setting";
import {TouchableOpacity} from "react-native-gesture-handler";
import requestApi, {actions, methods} from "../../lib/ServerRequest";
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';

import auth from '@react-native-firebase/auth';
import {errorAlert, log} from "../../lib/functions";


async function onGoogleButtonPress() {
    // Get the users ID token
    const data:any = await GoogleSignin.signIn();

    errorAlert(data.user.email+'\n'+data.user.name+'\n'+data.idToken)

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
}

class Index extends Component<any> {

    subscribe:any

    constructor(props: any) {
        super(props);

    }

    onAuthStateChanged = (user:any)=>{
        log("onAuthStateChanged", user);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        GoogleSignin.configure({
            webClientId: "220917791557-3bbbab3fcga2k0kl1bb4savn7afh7n8t.apps.googleusercontent.com"
        });
        //this.subscribe = auth().onAuthStateChanged(this.onAuthStateChanged);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        //this.subscribe = null;
    }

    handleBackButtonClick() {
        BackHandler.exitApp();
        return true;
    }


    handleSubmit = (values: any) => {
        Keyboard.dismiss();
        settingAuth.token = ''
        const {companyname}: any = values;
        requestApi({
            method: methods.get,
            action: actions.bootstrap,
        }).then((result) => {


        });
    }


    render() {

        const {navigation} = this.props;
        const {colors} = this.props.theme;

        this.props.navigation.setOptions({
            headerTitle: ``,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            //headerLeft:()=><Title onPress={this.handleBackButtonClick}>{backButton}</Title>
        });


        return (
            <Container surface={true}>
                <View style={[styles.p_6, styles.h_100]}>

                    <View style={[styles.middle, styles.mb_6, {marginBottom: 50}]}>

                        <Image
                            style={[{width: 80, height: 80}]}
                            source={require('../../assets/dhru-logo-22.png')}
                        />

                        <Title style={[styles.mt_5]}>Welcome to DHRU</Title>
                        <Paragraph style={[styles.paragraph, styles.text_xs]}>Grow Your Business with our PRO-efficient
                            Products</Paragraph>
                    </View>

                    <View style={[styles.middle, styles.mb_5, styles.mt_5]}>
                        <Text>Sign in or Create an Account</Text>
                    </View>

                    <View style={[styles.middle]}>
                        <View style={{width: 230,}}>

                            {/*{
                                Boolean(Platform.OS === 'ios') && <View style={[styles.py_4]}>
                                    <TouchableOpacity
                                        style={[styles.border, styles.py_4, {borderRadius: 50, borderColor: '#ddd'}]}
                                        onPress={() => {
                                        }}>
                                        <View style={[styles.grid, styles.middle, styles.px_6]}>
                                            <ProIcon name={'apple'} size={16} action_type={'text'} type={'brands'}/>
                                            <Paragraph style={[styles.paragraph, styles.text_sm, styles.ml_2]}>
                                                Continue with Apple
                                            </Paragraph>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }*/}


                            {/*<View style={[styles.py_4]}>
                                <TouchableOpacity
                                    style={[styles.border, styles.py_4, {borderRadius: 50, borderColor: '#ddd'}]}
                                    onPress={() => {
                                        onGoogleButtonPress().then((result:any)=>{
                                            log("RESULT", result.additionalUserInfo.profile);
                                        })
                                    }}>
                                    <View style={[styles.grid, styles.middle, styles.px_6]}>
                                        <ProIcon name={'google'} size={16} action_type={'text'} type={'brands'}/>
                                        <Paragraph style={[styles.paragraph, styles.text_sm, styles.ml_2]}>
                                            Continue with Google
                                        </Paragraph>
                                    </View>
                                </TouchableOpacity>
                            </View>*/}

                            <View style={[styles.py_4]}>
                                <TouchableOpacity
                                    style={[styles.border, styles.py_4, {borderRadius: 50, borderColor: '#ddd'}]}
                                    onPress={() => {
                                        navigation.navigate('LoginDhruCom', {
                                            screen: 'LoginDhruCom',
                                            params: {disableAddWorkspace: true}
                                        });
                                    }}>
                                    <View style={[styles.grid, styles.middle, styles.px_6]}>
                                        <ProIcon name={'envelope'} size={16} action_type={'text'} type={'solid'}/>
                                        <Paragraph style={[styles.paragraph, styles.text_sm, styles.ml_2]}>
                                            Login with Email
                                        </Paragraph>
                                    </View>
                                </TouchableOpacity>
                            </View>


                        </View>
                    </View>

                    <View style={[styles.center, styles.p_6]}>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate('SignupStep1', {
                                screen: 'SignupStep1',
                            });
                        }}><Paragraph style={[styles.paragraph, styles.title, {fontSize: 15}]}>
                            Don't have an account?
                            <Text style={[{color: colors.secondary}]}> Signup</Text>
                        </Paragraph></TouchableOpacity>
                    </View>


                    <View style={[styles.middle, {marginBottom: 100}]}>
                        <Paragraph style={[styles.paragraph, styles.text_xs]}>By signing up, you agree to Dhru's
                            <Paragraph
                                onPress={() => Linking.openURL('https://www.dhru.com/toc').catch((err) => console.error('An error occurred', err))}>
                                <Text style={[styles.text_xs, {color: colors.secondary}]}> Terms of Use </Text>
                            </Paragraph>
                            <Text> and </Text>
                            <Paragraph
                                onPress={() => Linking.openURL('https://www.dhru.com/privacypolicy').catch((err) => console.error('An error occurred', err))}>
                                <Text style={[styles.text_xs, {color: colors.secondary}]}>Privacy Policy </Text>
                            </Paragraph>.
                        </Paragraph>
                    </View>

                </View>
            </Container>
        );
    }
}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    setCompany: (company: any) => dispatch(setCompany(company)),
    setPreferences: (preferences: any) => dispatch(setPreferences(preferences)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

