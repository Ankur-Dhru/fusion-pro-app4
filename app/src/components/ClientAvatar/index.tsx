import React from "react";
import {styles} from "../../theme";
import {TouchableOpacity, View} from "react-native";
import Avatar from "../Avatar";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";
import {getCurrentCompanyDetails} from "../../lib/functions";

const Index = ({navigation, connection}: any) => {

    const {username, adminid}: any = getCurrentCompanyDetails();

    return <View
        style={[styles.px_5]}>
        <TouchableOpacity onPress={() => {
            navigation.openDrawer()
        }}>
            <Avatar label={username} value={adminid || 1} size={28}/>
        </TouchableOpacity>
        <View
            style={[styles.socket, {backgroundColor: connection?.socket ? 'green' : 'red'}]}></View>
    </View>
}

const mapStateToProps = (state: any) => ({
    connection: state.appApiData.connection,
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));
