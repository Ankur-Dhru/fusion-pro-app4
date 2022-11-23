import React, {Component} from 'react';
import {
    Platform,
    ScrollView, TextInput as TextInputReact, TouchableOpacity,
    View,
} from 'react-native';
import {styles} from "../../../../theme";

import {connect} from "react-redux";

import {AppBar, Button, InputBox} from "../../../../components";
import {Surface, Text, Title, withTheme} from "react-native-paper";
import {backButton, voucher} from "../../../../lib/setting";
import {v4 as uuidv4} from "uuid";



class CustomerNotes extends Component<any> {

    params:any;
    constructor(props:any) {
        super(props);
        const {route}:any = this.props;
        this.params = route.params
    }


    render() {

        const {navigation,theme:{colors}}:any = this.props
        const{editmode,handleSubmit}:any = this.params;

        navigation.setOptions({
            headerTitle:voucher.type.screentype === 'sales'?'Customer Notes': voucher.type.screentype === 'purchase'?'Notes ':'Notes',
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{voucher.type.screentype === 'sales'?'Customer Notes': voucher.type.screentype === 'purchase'?'Notes (Internal use. Not visible to Vendor)':'Notes'}</Title>,
            })
        }

        return (
            <Surface style={[styles.h_100]}>
               {/* <AppBar  back={true}  title={`${voucher.type.screentype === 'sales'?'Customer Notes': voucher.type.screentype === 'purchase'?'Notes (Internal use. Not visible to Vendor)':'Notes'}`} navigation={navigation}>

                </AppBar>*/}

                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View   style={[styles.px_6,styles.mt_5,styles.h_100]}>

                        <TextInputReact
                            onChangeText={(e:any) => { voucher.data.vouchernotes=e }}
                            defaultValue={voucher.data.vouchernotes}
                            key={uuidv4()}
                            placeholder={'Customer Notes'}
                            multiline={true}
                            autoCapitalize='words'
                            placeholderTextColor={colors.inputLabel}
                            style={[styles.inputLabel,styles.mb_5,{fontSize:16,color:colors.inputbox}]}
                        />

                    </View>
                </ScrollView>

                {editmode &&  <View   style={[styles.px_6,{marginBottom:20}]}>
                    <Button       onPress={()=>{
                        Boolean(handleSubmit) && handleSubmit()
                        navigation.goBack()
                    }}> Save  </Button>
                </View>}



            </Surface>
        )
    }

}



const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({

});


export default connect(mapStateToProps,mapDispatchToProps)(withTheme(CustomerNotes));


