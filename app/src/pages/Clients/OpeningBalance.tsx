import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BackHandler, ScrollView, StatusBar, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";
import {setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {setDialog, setModal} from "../../lib/Store/actions/components";

import {
    Surface,
    TextInput,
    Text,
    RadioButton,
    DataTable,
    Card,
    List,
    Appbar,
    Paragraph, TextInput as TI
} from "react-native-paper";
import {getCurrencySign, log, storeData} from "../../lib/functions";

import {AppBar, Container,Button, Menu, ProIcon} from "../../components";
import {backButton} from "../../lib/setting";
import InputField from "../../components/InputField";
import KeyboardScroll from "../../components/KeyboardScroll";




class Settings extends Component<any> {

    constructor(props:any) {
        super(props);
    }


    componentDidMount() {

    }




    handleSubmit = (client:any) => {
        const {handleSubmit,setModal}:any = this.props;

        setModal({visible: false})

        handleSubmit(client);

    }



    render() {

        const {client,handleSubmit}:any = this.props

        return (
            <Container  surface={true}>

                <AppBar back={true} title={`Update Opening Balance`} isModal={true}></AppBar>

                <View  style={[styles.px_6]}>
                    <KeyboardScroll>
                        <InputField
                            label={'Opening Balance'}
                            divider={true}
                            inputtype={'textbox'}
                            left={<TI.Affix text={getCurrencySign()} />}
                            onChange={(value: any) => {
                                client.openingbalance = value
                            }}
                        />
                    </KeyboardScroll>

                    <View style={[styles.submitbutton]}>
                        <Button       onPress={()=>{ this.handleSubmit(client)  }}>  Save </Button>
                    </View>

                </View>
            </Container>

        )
    }

}


const mapStateToProps = (state:any) => ({
    preferences: state.appApiData.preferences
})
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
    setPreferences: (preferences:any) => dispatch(setPreferences(preferences)),
    setModal:(modal:any)=>dispatch(setModal(modal))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

