import React, {memo} from "react";
import {Caption, Divider, Paragraph, Text, Title, withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../lib/navigation_options";
import FlatList from "../../components/FlatList";
import {Button, Container, ProIcon} from "../../components";
import {styles} from "../../theme";
import {TouchableOpacity, View} from "react-native";
import {connect} from "react-redux";
import {getCurrentCompanyDetails, log, logoutUser, setAppType, setSpotLight} from "../../lib/functions";
import {setModal} from "../../lib/Store/actions/components";
import Avatar from "../../components/Avatar";
import HeaderLocation from "../../components/HeaderLocation";
import {chevronRight, isDevelopment, loginUrl, spotlight} from "../../lib/setting";
import {CommonActions} from "@react-navigation/native";
import {toggleWalkThrough} from "../../lib/Store/actions/walkthrough";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {store} from "../../App";
import {setItems} from "../../lib/Store/actions/appApiData";
import DeleteButton from "../../components/Button/DeleteButton";


// {title: 'Profile', value: 'profile'}, {label: 'Change Password', value: 'changepassword'}, {label: 'Preferences', value: 'preferences'}, {label: 'Logout', value: 'logout'}

const option = (icon: string, title: string, screen: string, type?: string, showNavIcon: boolean = true, color?: any, textColor?: any, visible: boolean = true,) => ({
    icon,
    title,
    screen,
    type,
    showNavIcon,
    color,
    textColor,
    visible
})

const profileList: any = [
    option("circle-user", "Profile", "Profile"),
    option("lock-keyhole", "Change Password", "ChangePassword"),
    option("poll-people", "Preferences", "SettingsStack", "preference"),
    option("circle-question", "How to use?", "Spotlight", "reset-spotlight", false, "", "", isDevelopment),
    option("right-from-bracket", "Logout", "Logout", "logout", false, styles.red.color, styles.red.color),
    option("code", "Sample", "Sample", "", true, "", "", isDevelopment),
]

const Index = (props: any) => {
    const {navigation, theme: {colors}, setModal, toggleWalkThrough}: any = props;

    const {username, adminid, email}: any = getCurrentCompanyDetails();

    setNavigationOptions(navigation, "", colors)

    const _navigate = (params?: any) => {

        if (params.type == "logout") {

            setAppType("account").then(() => {
            })

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'LoginStack'},
                    ],
                })
            );

            logoutUser()
        } else if (params.type == "reset-spotlight") {
            spotlight.one = true;
            spotlight.two = true;
            toggleWalkThrough();

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        {name: 'DashboardStack'},
                    ],
                })
            );
        } else {
            navigation.navigate(params.screen)
        }
    }

    const closeAccount = () =>{
        requestApi({
            method: methods.delete,
            action: actions.register,
            alert:true,
            other: {url: loginUrl},
        }).then((result) => {
            if (result.status === SUCCESS) {
                _navigate({type:'logout'})
            }
        });
    }

    const _renderItem = ({item}: any) => {
        return <View style={[styles.w_100]}>
            <TouchableOpacity onPress={() => _navigate(item)}>
                <View style={[styles.grid, styles.middle, styles.p_5, styles.w_100]}>
                    <View style={[styles.grid, styles.middle, styles.noWrap, styles.w_auto]}>
                        <ProIcon name={item.icon} type={'light'} size={18}/>
                        <Paragraph
                            style={[styles.paragraph, styles.ml_2]}>{item.title}</Paragraph>
                    </View>
                    {
                        Boolean(item.showNavIcon) && <View style={[styles.ml_auto]}>
                            <View>
                                <Text>
                                    {chevronRight}
                                </Text>
                            </View>
                        </View>
                    }
                </View>
            </TouchableOpacity>
            <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
        </View>
    }

    return <Container surface={true}>
        <View style={[{backgroundColor: colors.surface}]}>
            <View style={[{justifyContent: 'center', alignItems: 'center',}, styles.pb_4]}>
                <Avatar label={username} value={adminid || 1} fontsize={20} lineheight={70} size={72}/>
                <View>
                    <Title style={[styles.text_md, styles.textCenter]}>{username}</Title>
                    <Caption style={[styles.paragraph, styles.textCenter, styles.mb_10]}>{email}</Caption>
                    <HeaderLocation moreStyle={[{alignItems: 'center'}]}/>
                </View>
            </View>
            <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            <FlatList
                keyboardShouldPersistTaps={'handled'}
                scrollIndicatorInsets={{right: 1}}
                data={profileList.filter(({visible}: any) => Boolean(visible))}
                accessible={true}
                renderItem={_renderItem}
                initialNumToRender={20}
            />



            <View style={[styles.m_5,{borderColor: styles.red.color,
                borderWidth: 1,
                 marginTop:20,
                borderStyle: 'dashed',
                borderRadius: 5}]}>
                <DeleteButton
                    options={['Delete Account', 'Cancel']}
                    title={'Close & Delete Account'}
                    buttonTitle={'Close & Delete Account'}
                    morestyle = {{borderWidth:0}}
                    message={`Are you sure want to delete "${email}" account?`}
                    onPress={(index: any) => {
                        if (index === 0) {
                            closeAccount()
                        }
                    }}
                    render={() => {
                        return (
                            <View>
                                <Paragraph style={[styles.paragraph,{color:styles.red.color}]}>Close & Delete Account</Paragraph>
                                <Paragraph style={[styles.paragraph]}>
                                    Permanently delete DHRU account and remove workspace with all data and settings.
                                </Paragraph>
                            </View>

                        )
                    }}

                />
            </View>











        </View>
    </Container>
}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    toggleWalkThrough: () => dispatch(toggleWalkThrough()),
    setModal: (modal: any) => dispatch(setModal(modal)),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

