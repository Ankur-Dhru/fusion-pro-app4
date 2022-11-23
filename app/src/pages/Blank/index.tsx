import React, {Component} from "react";

import {connect} from "react-redux";
import {styles} from "../../theme";
import {Button, Container} from "../../components";
import {Paragraph, withTheme,} from "react-native-paper";
import {View} from "react-native";
import {setAppType} from "../../lib/functions";
import {CommonActions} from "@react-navigation/native";
import NoResultFound from "../../components/NoResultFound";


class Index extends Component<any> {

    constructor(props: any) {
        super(props);

    }

    render() {

        const {navigation, organization, workspace, companydetails} = this.props;


        let countCompany: number = 0;
        if (Boolean(companydetails) && Boolean(companydetails?.companies)) {
            countCompany = Object.keys(companydetails?.companies).length
        }

        return (
            <Container surface={true}>
                <View style={[styles.center, styles.middle, styles.h_100]}>
                    <View style={[styles.absolute, styles.w_100, styles.center, styles.middle, {top: '25%'}]}>
                        <NoResultFound/>
                        <Paragraph style={[styles.paragraph, styles.mb_5]}>No Workspace Found</Paragraph>
                        <View style={[styles.mb_4, styles.mt_5]}>
                            {
                                Boolean(countCompany) ?
                                    <Button
                                        onPress={() => {
                                            navigation.navigate('OrganizationProfile', {
                                                screen: 'OrganizationProfile',
                                            });
                                        }}>Setup Organization</Button> :
                                    <Button
                                        onPress={() => {
                                            navigation.navigate('AddWorkspace', {
                                                screen: 'AddWorkspace',
                                            });
                                        }}>Create Workspace</Button>
                            }

                        </View>
                        <View style={[styles.mb_4]}>
                            <Button
                                secondbutton={true}

                                onPress={() => {
                                    setAppType("help").then(() => {
                                        navigation.dispatch(
                                            CommonActions.reset({
                                                index: 0,
                                                routes: [
                                                    {name: 'SupportNavigator'},
                                                ],
                                            })
                                        );
                                    })
                                }}>Help Center</Button>
                        </View>
                    </View>
                </View>
            </Container>
        );
    }
}


const mapStateToProps = (state: any) => ({
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));


