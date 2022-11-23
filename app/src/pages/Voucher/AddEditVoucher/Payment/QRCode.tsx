

import * as React from 'react';
import {Paragraph, RadioButton, Surface} from 'react-native-paper';
import {Image, Platform, View} from "react-native";
import {styles} from "../../../../theme";
import {storeData, toCurrency} from "../../../../lib/functions";
import {setDialog} from "../../../../lib/Store/actions/components";
import {setPreferences} from "../../../../lib/Store/actions/appApiData";
import {connect} from "react-redux";
import {AppBar} from "../../../../components";
import {voucher} from "../../../../lib/setting";


class Index extends React.Component<any> {

    constructor(props:any) {
        super(props);
    }

    componentDidMount() {

    }


    render(){

        const {qrcode}:any = this.props;

        return (
            <Surface>
                <AppBar back={true} title={`QR Code`} isModal={true}></AppBar>
                <View  style={[styles.h_100,styles.px_6]}>

                    <Paragraph style={[styles.head,{textAlign:'center'}]}>Pay Amount</Paragraph>
                    <Paragraph style={[{textAlign:'center',fontSize:25,paddingTop:20,fontWeight:'bold'}]}>{toCurrency(voucher.data.vouchertotaldisplay - voucher.data.paidamount)}</Paragraph>

                    <View  style={{justifyContent:'center',alignItems:'center'}}>
                        <View style={{width:360,height:310,margin:'auto',alignContent:'center'}}>
                            <Image style={{width:'100%',height:'100%',margin:'auto'}} source={{ uri : Platform.OS === 'android' ? 'file://'+qrcode: qrcode }}/>
                        </View>
                    </View>

                    <Paragraph style={[{textAlign:'center',fontSize:20,paddingTop:20,fontWeight:'bold'}]}>Pay with Any App</Paragraph>

                    <View style={[styles.center,styles.middle,{}]}>
                        <Image
                            style={[{height:120,width:320}]}
                            source={require('../../../../assets/gateways.png')}
                        />
                    </View>

                    <Paragraph style={[styles.head,{textAlign:'center'}]}>150+ App</Paragraph>

                </View>
            </Surface>
        );
    }
}


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
