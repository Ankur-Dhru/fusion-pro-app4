import React from "react";
import {View, Platform, BackHandler, StatusBar,Text} from 'react-native';
import {Appbar, Button, Dialog, Portal, Title} from 'react-native-paper';
import {connect} from "react-redux";
import {setDialog} from "../../lib/Store/actions/components";
import {styles} from "../../theme";




class Index extends React.Component {

    backHandler:any;
    constructor(props:any) {
        super(props);
    }




    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    handleBackPress = () => {
        const {setDialog,dialog}:any = this.props;
        if(Platform.OS === 'android') {
            setDialog({visible: false});
        }
        return dialog.visible
    }

    render() {

        const {dialog, setDialog,actionButton}:any = this.props;
        const Content = dialog.component;
        const ActionButton = dialog.actionButton;
        let contentSize = [styles.dialog_content]
        if(Platform.OS !== 'web'){
            dialog.size='full';
        }
        if(dialog.size === 'full'){
            contentSize = [styles.dialog_content];
        }
        if (!dialog.visible) {
            return (<View></View>)
        }


        return (
            <Portal>


                <Dialog
                    visible={dialog.visible}
                    onDismiss={() => setDialog({visible: false})}>
                    {Boolean(dialog.title) && <Dialog.Title>{dialog.title}</Dialog.Title>}

                    <Dialog.Content >
                        <Content />
                    </Dialog.Content>

                    <Dialog.Actions style={[styles.grid,styles.justifyContent]}>
                        <Button      onPress={() => setDialog({visible: false})}>Cancel</Button>
                         <ActionButton/>
                    </Dialog.Actions>

                </Dialog>

            </Portal>
        );
    }
}


const mapStateToProps = (state:any) => ({
    dialog: state.components.dialog
});
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);


/*
onPress={() => setDialog({title: 'Restaurants',visible:true,component: ()=><Login/>,button:{text:'OK',action:this.loadRestaurant()}})}*/
