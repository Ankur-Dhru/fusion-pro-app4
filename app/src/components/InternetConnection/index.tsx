import * as React from 'react';
import {Button, Paragraph, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {View} from "react-native";
import {connect} from "react-redux";

class Index extends React.Component<any> {

    render(){
        const {connection}:any = this.props;
        return (
            <View  style={[styles.bg_dark,styles.middle]}>
                {!connection.internet && <Paragraph style={{color:'white'}}>Internet Connection Not Available</Paragraph>}
            </View>
        );
    }
}

const mapStateToProps = (state:any) => ({
    connection:state.appApiData.connection,
})
const mapDispatchToProps = (dispatch:any) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(Index));
