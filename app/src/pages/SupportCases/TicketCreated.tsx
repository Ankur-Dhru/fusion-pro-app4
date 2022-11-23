import React, {memo} from "react";
import {connect} from "react-redux";
import {Paragraph, Text, Title, withTheme} from "react-native-paper";
import LeftIcon from "./LeftIcon";
import Container from "../../components/Container";
import {View} from "react-native";
import {styles} from "../../theme";
import {Button} from "../../components";
import {nav} from "../../lib/setting";
import {CommonActions} from "@react-navigation/native";


const TicketCreated = ({route, navigation, ...props}: any) => {

    return <Container surface={true}>

        <View style={[styles.middle, styles.center, styles.h_100]}>
            <View style={[styles.mb_5]}>
                <LeftIcon
                    {...{item: {icon: "check", color: "85B65DFF"}}}
                    size={50}
                />
            </View>

            <Paragraph>Successfully new created case</Paragraph>
            <Title>#{route?.params?.data?.ticket_id}</Title>
            <Text style={[styles.p_5]}>{route?.params?.data?.display_note}</Text>
            {
                route?.params?.data?.request_login_details && <View style={[styles.mb_4]}>
                    <Button
                        onPress={() => {
                            navigation.navigate("LoginCredential", route?.params)
                        }}>Update Login Credential</Button>
                </View>
            }
            <Button
                secondbutton={true}
                onPress={() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 1,
                            routes: [
                                {name: 'DashboardStack'},
                                {name: 'SupportNavigator'},
                            ],
                        })
                    );
                }}>Back</Button>
        </View>

    </Container>
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketCreated)));

