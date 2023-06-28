import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Image, TouchableOpacity
} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";

import {AppBar} from "../../components";
import {Surface, Text, Title} from "react-native-paper";
import {backButton} from "../../lib/setting";
import {log} from "../../lib/functions";


class FullView extends Component<any> {

    params:any;
    constructor(props:any) {
        super(props);
        const {route}:any = this.props;
        this.params = route.params

    }


    render() {


        const{item}:any = this.params;
        const{navigation}:any = this.props;

        navigation.setOptions({
            headerTitle:'',
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });


        let image = `https://${item.download_url.replace('http://', '').replace('https://', '')}`;

        return (
            <Surface style={[styles.h_100]}>

                {/*<AppBar  back={true}  title={``} navigation={navigation}>

                </AppBar>*/}

                <ScrollView >
                    <View   style={[styles.w_100]}>
                         <Image style={{height:500}} source={{ uri:image}}/>
                    </View>

                </ScrollView>

            </Surface>
        )
    }

}



const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({

});


export default connect(mapStateToProps,mapDispatchToProps)(FullView);


