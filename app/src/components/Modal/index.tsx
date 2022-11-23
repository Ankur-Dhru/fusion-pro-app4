import React from "react";
import {View, Platform, BackHandler, StatusBar, Text, ScrollView, Dimensions} from 'react-native';
import {Appbar, Button, Dialog, Portal, Provider, Surface, Title, useTheme, withTheme} from 'react-native-paper';
import {connect} from "react-redux";
import {setModal} from "../../lib/Store/actions/components";
import {styles} from "../../theme";

import AppBar from "../AppBar";
import Modal from 'react-native-modal';
const deviceWidth:any = Dimensions.get('window').width;
const deviceHeight:any =
    Platform.OS === 'ios'
        ? Dimensions.get('window').height
        : require('react-native-extra-dimensions-android').get(
        'REAL_WINDOW_HEIGHT',
        );


class Index extends React.Component<any> {

    constructor(props:any) {
        super(props);
    }

    render() {

        const {modal, setModal}:any = this.props;
        const Content = modal.component;

        /*if (!modal.visible) {
            return (<View></View>)
        }*/


        return (
            <Modal
                style={{margin: 0,height:300}}
                isVisible={modal.visible}
                hasBackdrop={true}
                onBackButtonPress={() => setModal({visible: false})}
                onBackdropPress={() => setModal({visible: false})}
                onSwipeComplete={() => setModal({visible: false})}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                animationIn={'slideInRight'}
                animationOut={'slideOutRight'}
                useNativeDriverForBackdrop={true}
                coverScreen={false}
                backdropColor={'#000000'}
                statusBarTranslucent={true}
                /*propagateSwipe={true}
                swipeThreshold={500}
                swipeDirection={'left'}*/
                hideModalContentWhileAnimating={true}
            >

                <Surface style={[styles.h_100]}>
                    <Content/>
                </Surface>
            </Modal>
        );
    }
}


const mapStateToProps = (state:any) => ({
    modal: state.components.modal
});
const mapDispatchToProps = (dispatch:any) => ({
    setModal: (modal:any) => dispatch(setModal(modal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);


/*
onPress={() => setModal({title: 'Restaurants',visible:true,component: ()=><Login/>,button:{text:'OK',action:this.loadRestaurant()}})}*/
