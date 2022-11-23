import React, {Component} from 'react';
import {
    Platform,
    ScrollView, TextInput as TextInputReact, TouchableOpacity,
    View,
} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";

import {AppBar, Button, InputBox} from "../../../../components";
import {Field} from "react-final-form";
import {Surface, Title, withTheme} from "react-native-paper";
import {log} from "../../../../lib/functions";
import {backButton, voucher} from "../../../../lib/setting";
import {colors} from "react-native-elements";



class TermsConditions extends Component<any> {

    params:any;
    constructor(props:any) {
        super(props);
        const {route}:any = this.props;
        this.params = route.params

    }


    render() {

        const{editmode}:any = this.params;
        const {navigation,theme:{colors}}:any = this.props;

        navigation.setOptions({
            headerTitle:`Terms & Condition`,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Terms & Condition'}</Title>,
            })
        }


        return (
            <Surface style={[styles.h_100]}>

                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View   style={[styles.px_6,styles.mt_5,styles.h_100]}>

                        <TextInputReact
                            onChangeText={(e:any) => { voucher.data.toc=e }}
                            defaultValue={voucher.data.toc}
                            placeholder={'Terms & Condition'}
                            placeholderTextColor={colors.inputLabel}
                            multiline={true}
                            autoCapitalize='words'
                            style={[styles.inputLabel,styles.mb_5,{fontSize:16,color:colors.inputbox}]}
                        />

                    </View>
                </ScrollView>

                {editmode &&  <View   style={[styles.px_6,{marginBottom:20}]}>
                    <Button       onPress={()=>{ navigation.goBack() }}> Save  </Button>
                </View> }

            </Surface>
        )
    }

}



const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({

});


export default connect(mapStateToProps,mapDispatchToProps)(withTheme(TermsConditions));


