import * as React from 'react';
import {Button, Paragraph} from 'react-native-paper';


import { RNCamera } from 'react-native-camera';
import {Text, TouchableOpacity, View} from "react-native";
import {styles} from "../../theme";

export default class Index extends React.Component<any> {



    camera:any;
    render(){
        const {route}:any = this.props;

        return <></>

        return (
            <View style={[styles.h_100]}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={{width:'100%',height:'90%'}}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    /*androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}*/
                />
                <View  style={[styles.row,styles.justifyContent]}>
                    <TouchableOpacity onPress={route.params.handleBack}>
                        <Paragraph  style={[styles.paragraph,styles.textCenter,styles.p_5]}> Cancel </Paragraph>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.takePicture.bind(this)}>
                        <Paragraph  style={[styles.paragraph,styles.textCenter,styles.p_5]}> SNAP  </Paragraph>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    takePicture = async () => {
        const {route}:any = this.props;
        if (this.camera) {
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);
            route.params.handleCapture(data);
        }
    };

}
