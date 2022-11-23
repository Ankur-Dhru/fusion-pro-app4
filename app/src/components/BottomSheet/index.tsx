import React from "react";
import {
    View,
    Platform,
    BackHandler,
    StatusBar,
    Text,
    ScrollView,
    Dimensions,
    TouchableWithoutFeedback, Keyboard
} from 'react-native';
import {
    Appbar,
    Button,
    Dialog,
    Paragraph,
    Portal,
    Provider,
    Surface,
    Title,
    useTheme,
    withTheme
} from 'react-native-paper';
import {connect} from "react-redux";
import {setBottomSheet} from "../../lib/Store/actions/components";
import {styles} from "../../theme";
import Modal from "react-native-modal";

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

        const {bottomsheet}:any = this.props;

        this.state={
            label:bottomsheet.label,fullView:bottomsheet.fullView
        }
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        const {bottomsheet}:any = nextProps;
        this.setState({
            label:bottomsheet.label,fullView:bottomsheet.fullView
        })
    }


    render() {

        const {bottomsheet, setBottomSheet,theme:{colors}}:any = this.props;
        const Content = bottomsheet.component;

        const {label,fullView}:any = this.state;

        return (


            <>
                <Modal
                    style={{margin: 0}}
                    isVisible={bottomsheet.visible}
                    hasBackdrop={true}
                    onBackButtonPress={() => setBottomSheet({visible: false,component: () => {return <></>}})}
                    onBackdropPress={() => setBottomSheet({visible: false,component: () => {return <></>}})}
                    onSwipeComplete={() => setBottomSheet({visible: false,component: () => {return <></>}})}
                    deviceWidth={deviceWidth}
                    deviceHeight={deviceHeight}
                    animationIn={'slideInUp'}
                    animationOut={'slideOutDown'}
                    useNativeDriverForBackdrop={false}
                    coverScreen={true}
                    backdropColor={'#000000'}
                    backdropTransitionOutTiming={0}
                    statusBarTranslucent={true}
                    hideModalContentWhileAnimating={true}
                    propagateSwipe={true}
                >
                    <View style={[styles.noshadow,{height: '55%',marginTop: 'auto',borderRadius: 20,backgroundColor:colors.surface}]}>
                        <View style={{
                            height:'100%',
                            borderRadius: 20,
                            paddingTop: 15,
                            alignItems: "center",
                            shadowColor: "#fff",
                            shadowOffset: {
                                width: 0,
                                height: 0
                            },
                            shadowOpacity: 0,
                            elevation:0
                        }}>
                            <Content/>
                        </View>
                    </View>
                </Modal>
            </>

        );
    }
}


const mapStateToProps = (state:any) => ({
    bottomsheet: state.components.bottomsheet
});
const mapDispatchToProps = (dispatch:any) => ({
    setBottomSheet: (bottomsheet:any) => dispatch(setBottomSheet(bottomsheet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

