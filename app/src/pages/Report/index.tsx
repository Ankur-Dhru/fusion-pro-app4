import React, {Component} from "react";
import { View,Text} from "react-native";
import {setDialog} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Container} from "../../components";
import {Appbar} from "react-native-paper";
import AppBar from "../../components/AppBar";


class Index extends Component<any> {

    constructor(props:any) {
        super(props);
        this.state = {show:true,value:new Date()}
    }

    render() {

        const {navigation}:any = this.props;

        return (
            <Container  surface={true}>

                <AppBar navigation={navigation} title={`Report`} back={false}>

                </AppBar>

                <View style={[styles.middle,styles.center,{flexGrow:2}]}>
                    <Text>Report</Text>
                </View>

            </Container>
        );
    }
}


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({

});
export default connect(mapStateToProps, mapDispatchToProps)(Index);

