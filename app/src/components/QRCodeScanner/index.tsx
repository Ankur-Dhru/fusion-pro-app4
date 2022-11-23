'use strict';

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    Linking, View, Platform
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

import {log} from "../../lib/functions";
import {Button} from "../index";
import {styles} from "../../theme";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import AddedItems from "../../pages/Voucher/AddEditVoucher/Items/AddedItems";
import {voucher} from "../../lib/setting";
import {Divider, Paragraph, withTheme} from "react-native-paper";

class ScanScreen extends Component<any> {

    scanner:any;
    sheetRef:any;

    constructor(props:any) {
        super(props);
        this.state = {serials:[]}
        this.sheetRef = React.createRef();
    }

    submitNumbers = () => {
        const {serials}:any = this.state;
        let numbers = Boolean(serials.length) && serials?.join('\n')
        this.props.onRead(numbers);
    }

    onSuccess = (e?:any) => {


        const {multiline}:any = this.props;

        if(multiline){
            const {serials}:any = this.state;
            const repeat = serials.some((serial:any)=>{
               return serial === e.data
            })
            !repeat && this.setState({serials:[...serials,e.data]})
        }
        else{
            this.props.onRead(e.data);
        }
        setTimeout(()=>{
            this?.scanner?.reactivate()
        },3000)
        Linking.openURL(e?.data).catch(err =>
            console.error('An error occured', err)
        );
    };

    render() {

        const {multiline}:any = this.props;
        const { colors } = this.props.theme;
        const {serials}:any = this.state;

        return (
            <>
                <QRCodeScanner
                    ref={(node) => { this.scanner = node }}
                    showMarker={true}
                    markerStyle={{borderColor:'white'}}
                    onRead={this.onSuccess}
                    cameraStyle={{height:'100%'}}
                    containerStyle={{height:100}}
                />

                {multiline && Boolean(serials.length) && <BottomSheet
                    ref={this.sheetRef}
                    index={0}
                    handleComponent={() =>
                        <View style={{backgroundColor: colors.backdrop,
                            width: '100%',
                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            marginBottom: -1,
                            ...styles.shadow}}>
                            <View style={{alignSelf: 'center',}}>
                                <View style={[styles.bg_global,{
                                    width: 40,
                                    height: 5,
                                    borderRadius: 5,
                                    marginTop: 10,}
                                ]}></View>
                            </View>
                        </View>
                    }
                    snapPoints={[150, '30%']}>

                    <BottomSheetScrollView style={{backgroundColor:colors.backdrop}}>
                        <View style={[styles.px_6]}>

                            <><View   style={[{marginTop:12}]}>
                                <Paragraph style={[styles.paragraph,styles.bold,styles.muted,styles.text_sm]}>Scanned Items</Paragraph>
                            </View>
                                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/></>

                            <View  style={[styles.mt_4]}>
                                {
                                    serials.map((serial:any)=>{
                                        return(<Paragraph>{serial}</Paragraph>)
                                    })
                                }
                            </View>

                            <View style={[styles.mt_5,styles.mb_10]}>
                                <Button   onPress={() => { this.submitNumbers()}}> {'Done'} </Button>
                            </View>
                        </View>
                    </BottomSheetScrollView>

                </BottomSheet> }

            </>
        );
    }
}



export default withTheme(ScanScreen);

