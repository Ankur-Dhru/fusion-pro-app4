import React, {Component, Fragment} from 'react';
import {Dimensions, Platform, TouchableOpacity, View} from 'react-native'
import {setCompany, setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";
import {Card, Divider, List, Paragraph, Text, withTheme} from 'react-native-paper';

import {styles} from "../../theme";
import {
    clone,
    getAppType,
    getCurrentCompanyDetails, getInit, isDebug,
    log,
    logoutUser,
    objToArray, queryStringToJSON, retrieveData,
    setAppType,
    storeData,
} from "../../lib/functions";
import {setModal} from "../../lib/Store/actions/components";
import Settings from "../Settings";
import {ScrollView} from "react-native-gesture-handler";
import {Button, InputBox, ProIcon} from "../../components";
import {auth, chevronRight, current, loginUrl, nav} from "../../lib/setting";
import {CommonActions} from "@react-navigation/native";
import Avatar from "../../components/Avatar";
import KeyboardScroll from "../../components/KeyboardScroll";
import {Field, Form} from "react-final-form";
import {composeValidators, required, startWithString} from "../../lib/static";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {afterAddWorkspace} from "../SetupWorkspace/AddWorkspace";

const windowHeight = Dimensions.get('window').height;

class drawerContentComponents extends Component<any> {

    sheetRef: any;
    _captchaRef2: any;
    token: any;
    oldCompany: any

    menuitems = [{label: 'Profile', value: 'profile'}, {
        label: 'Change Password',
        value: 'changepassword'
    }, {label: 'Preferences', value: 'preferences'}, {label: 'Logout', value: 'logout'}]

    constructor(props: any) {
        super(props);

        this.state = {
            locations: [],
            currentuser: props.companydetails.currentuser,
            other: false,
            currentworkspace: props.companydetails.currentuser,
            companydetails:props.companydetails
        }
        this._captchaRef2 = React.createRef();
    }

    componentDidMount() {
        this.oldCompany = this.props?.companydetails?.current;
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {

        this.setState({...this.state,companydetails:nextProps.companydetails})

        if (Boolean(this.oldCompany !== nextProps?.companydetails?.current)) {
            // log("componentWillReceivePropsTest", "this.oldCompany", this.oldCompany);
            // this.oldCompany = nextProps?.companydetails?.current;
            // log("componentWillReceivePropsTest", "this.oldCompany", this.oldCompany);
            // log("componentWillReceivePropsTest", "this.oldCompany", current.user);
            //
            // let user = Object.keys(nextProps?.companydetails.companies).find((key: any) => nextProps?.companydetails.companies[key].company === this.oldCompany)
            // this._handlePress(user, this.oldCompany)
        }
    }

    navigateToScreen = (currentuser: any, company: any, locationid?: any) => {
        setAppType("account").then(() => {
            current.user = currentuser;
            current.company = company;
            if (locationid){
                current.locationid = locationid;
            }
            nav.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'DashboardStack'},
                    ],
                })
            );
        })
    }

    clickMenu = (menu: any) => {
        const {navigation, setModal}: any = this.props;
        this.setState({other: true});
        if (menu.value === 'profile') {
            navigation.navigate('Profile', {
                screen: 'Profile',
            });
        } else if (menu.value === 'changepassword') {
            navigation.navigate('ChangePassword', {
                screen: 'ChangePassword',
            });
        } else if (menu.value === 'preferences') {
            setModal({title: 'Preferences', visible: true, component: () => <Settings/>})
        } else if (menu.value === 'logout') {
            logoutUser();
        }
    }


    _handlePress = async (currentuser: any, company: any) => {
        const {companydetails}: any = this.props;
        this.setState({currentworkspace: currentuser});
        if (!Boolean(companydetails.companies[currentuser].locations)) {
            current.user = currentuser;
            current.company = company;
            nav.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'DashboardStack'},
                    ],
                })
            );
        }
    }

    handleSubmit = (values:any) => {
        requestApi({
            method: methods.get,
            action: 'workspace',
            queryString:{workspace:values.companyname},
            other: {url: loginUrl},
        }).then((result) => {


            /*let workspacelogin = result.data[0]?.workspace_login;
            const params = queryStringToJSON(workspacelogin);
            auth.token = params['t'];*/

            afterAddWorkspace(values)
        });
    }


    render() {


        const {navigation, setCompany}: any = this.props;

        const {colors}: any = this.props.theme;

        const {other, currentworkspace,companydetails}: any = this.state;

        const {username, adminid, email}: any = getCurrentCompanyDetails();


        // @ts-ignore
        return (
            <View style={[styles.h_100, styles.px_5,{backgroundColor:colors.screenbg}]}>


                <View style={[{paddingBottom: 0, marginTop: Platform.OS === 'ios' ? 45 : 15}]}>

                </View>

                <Card style={[styles.card]}>
                    <Card.Content>
                        <TouchableOpacity onPress={() => {
                            navigation.navigate("ProfileSettings");
                        }}>
                            <View style={[styles.grid, styles.middle, styles.noWrap]}>
                                <Avatar label={username} value={adminid || 1} size={35}/>
                                <View style={[styles.ml_2]}>
                                    <Text style={[styles.paragraph, styles.text_md, {
                                        lineHeight: 20,
                                        fontSize: 16
                                    }]}>{username && username}</Text>
                                    {Boolean(email) &&
                                        <Text style={[styles.paragraph, styles.muted, styles.text_xs]}>{email}</Text>}
                                </View>
                                <View style={[styles.ml_auto]}>
                                    {chevronRight}
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>


                <Card style={[styles.card, {backgroundColor: '#E6EFFE'}]}>
                    <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                        <View>
                            <List.Item
                                style={[styles.listitem]}
                                titleStyle={[{color: colors.secondary}]}
                                title={'Help Center'}
                                left={props => <List.Icon {...props} icon={() => <ProIcon name={'circle-info'}
                                                                                          color={colors.secondary}
                                                                                          action_type={'text'}/>}/>}
                                onPress={() => {
                                    setAppType("help").then(() => {
                                        navigation.closeDrawer();
                                        navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [
                                                    {name: 'SupportNavigator'},
                                                ],
                                            })
                                        );
                                    })
                                }}
                            />
                        </View>
                    </Card.Content>
                </Card>


                <Card style={[styles.card, {height: windowHeight - 300}]}>
                    <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                        <ScrollView keyboardShouldPersistTaps='handled'>

                            <List.Section title={''}>


                                {
                                    Boolean(companydetails?.companies) && Object.keys(companydetails?.companies).map((currentuser, id) => {

                                        let cmp = companydetails.companies[currentuser];
                                        let companylocations: any = objToArray(cmp.locations);
                                        let cw = Boolean(companydetails['currentuser'] === currentuser);


                                        return (

                                            <Fragment key={id}>
                                                <List.Item
                                                    style={[styles.listitem]}
                                                    titleStyle={[cw && styles.bold]}
                                                    title={cmp.alias || cmp.company}
                                                    left={props => <List.Icon    {...props}
                                                                                 icon={() => <Avatar label={cmp.company}
                                                                                                     value={cmp.company}
                                                                                                     more={{borderRadius: 5}}
                                                                                                     size={28}/>}/>}
                                                    right={props => <List.Icon    {...props} icon={() => <ProIcon
                                                        name={`chevron-${currentuser === currentworkspace ? 'up' : Boolean(companylocations) ? 'down' : 'right'}`}
                                                        size={16} action_type={'text'}/>}/>}
                                                    onPress={() => this._handlePress(currentuser, cmp.company)}
                                                />

                                                {Boolean(companylocations) && currentuser === currentworkspace &&
                                                    <View style={[styles.mb_4]}>
                                                        {
                                                            companylocations.filter((location:any)=>{
                                                                return location.allowed === 1
                                                            }).map((location: any) => {
                                                                let checked = Boolean((cmp.locationid === location.locationid) && companydetails['currentuser'] === currentuser);
                                                                return (
                                                                    <>

                                                                        <List.Item
                                                                            style={[styles.listitem, {paddingVertical: 0}]}
                                                                            title={location.locationname}
                                                                            titleStyle={[{
                                                                                marginLeft: 0,
                                                                                color: checked ? colors.secondary : colors.inputLabel
                                                                            }]}
                                                                            left={props => <List.Icon    {...props}
                                                                                                         icon={() =>
                                                                                                             <ProIcon
                                                                                                                 name={`location${checked ? '-check' : '-pin'}`}
                                                                                                                 color={checked ? colors.secondary : colors.inputLabel}
                                                                                                                 action_type={'text'}/>}/>}

                                                                            onPress={() => {
                                                                                getAppType().then((appType: any) => {
                                                                                    cmp.locationid = location.locationid;
                                                                                    if (companydetails['currentuser'] !== currentuser || other || appType === "help") {
                                                                                        this.setState({other: false})
                                                                                        this.navigateToScreen(currentuser, cmp.company, cmp.locationid)
                                                                                    } else {
                                                                                        this.forceUpdate();
                                                                                        companydetails.companies[currentuser].locationid = location.locationid
                                                                                        storeData('fusion-pro-app', companydetails).then((r: any) => {
                                                                                            current.locationid = location.locationid;
                                                                                            setCompany({companydetails})
                                                                                            navigation.closeDrawer()
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }}
                                                                        />


                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </View>}


                                                <View style={[{paddingHorizontal: 15}]}>
                                                    <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                                </View>


                                            </Fragment>
                                        )
                                    })
                                }


                            </List.Section>

                            {isDebug &&  <Form
                                onSubmit={this.handleSubmit}
                                render={({handleSubmit, submitting, values, ...more}: any) => (
                                    <View style={[styles.grid,{paddingHorizontal:10}]}>
                                        <View style={[styles.w_auto]}>
                                            <Field name="companyname"
                                                   validate={composeValidators(required, startWithString)}>
                                                {props => (
                                                    <InputBox
                                                        {...props}
                                                        value={props.input.value}
                                                        label={'Workspace'}
                                                        autoFocus={false}
                                                        autoCapitalize='none'
                                                        onChange={props.input.onChange}
                                                    />
                                                )}
                                            </Field>
                                        </View>

                                        <View style={[styles.submitbutton]}>
                                            <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                                handleSubmit(values)
                                            }}>Add</Button>
                                        </View>

                                    </View>

                                )}
                            >
                            </Form>}

                        </ScrollView>
                    </Card.Content>
                </Card>




                <Card style={[styles.card]}>
                    <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                        <View>
                            <List.Item
                                style={[styles.listitem]}
                                titleStyle={{marginLeft: 0, paddingLeft: 0}}
                                title={'Add Workspace'}
                                left={props => <List.Icon    {...props} icon={() => <ProIcon name={'plus'}
                                                                                             action_type={'text'}/>}/>}
                                onPress={() => {
                                    this.setState({other: true});
                                    navigation.navigate('AddWorkspace', {
                                        screen: 'AddWorkspace',
                                    });
                                }}
                            />

                            {/*<View style={[{paddingHorizontal: 15}]}>
                                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                            </View>

                            <List.Item
                                style={[styles.listitem]}
                                title={'Preferences'}
                                left={props => <List.Icon {...props}
                                                          icon={() => <ProIcon name={'cog'} action_type={'text'}/>}/>}
                                onPress={() => {
                                    setModal({title: 'Preferences', visible: true, component: () => <Settings/>})
                                }}
                            />*/}

                        </View>
                    </Card.Content>
                </Card>

                {/*<Card style={[styles.card]}>
                    <Card.Content style={[styles.cardContent, {paddingHorizontal: 0}]}>
                        <View>

                            <List.Item
                                style={[styles.listitem]}
                                titleStyle={[styles.red]}
                                title={'Logout'}
                                left={props => <List.Icon {...props} icon={() => <ProIcon name={'sign-out'}
                                                                                          color={styles.red.color}
                                                                                          action_type={'text'}/>}/>}
                                onPress={() => {
                                    logoutUser();
                                }}
                            />
                        </View>
                    </Card.Content>
                </Card>*/}

            </View>
        )
    }
}


const mapStateToProps = (state: any) => ({
    companydetails: state.appApiData.companydetails,
    location: objToArray(state.appApiData.settings.location),
})

const mapDispatchToProps = (dispatch: any) => ({
    setCompany: (company: any) => dispatch(setCompany(company)),
    setModal: (modal: any) => dispatch(setModal(modal)),
    setSettings: (settings: any) => dispatch(setSettings(settings)),
    setPreferences: (preferences: any) => dispatch(setPreferences(preferences)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(drawerContentComponents));
