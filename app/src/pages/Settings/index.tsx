import React, {Component} from 'react';
import {connect} from 'react-redux';
import {BackHandler, StatusBar, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";
import {setPreferences, setSettings} from "../../lib/Store/actions/appApiData";
import {setDialog} from "../../lib/Store/actions/components";

import {
    Button,
    Surface,
    TextInput,
    Text,
    RadioButton,
    DataTable,
    Card,
    List,
    Appbar,
    Paragraph, Title, withTheme, Switch
} from "react-native-paper";
import {clone, log, storeData} from "../../lib/functions";


import {AppBar, Container, Menu, ProIcon} from "../../components";
import {backButton} from "../../lib/setting";
import {setNavigationOptions} from "../../lib/navigation_options";
import InputField from "../../components/InputField";




class Settings extends Component<any> {

    sheetRef:any;
    constructor(props:any) {
        super(props);

        log('props.preferences',props.preferences)

        this.state = {theme:props.preferences && (props.preferences.theme || 'System Default'),printpreviewdisable:props.preferences && (props.preferences.printpreviewdisable)};
        //this.sheetRef = React.createRef<BottomSheet>();
    }


    componentDidMount() {
        this.setState({...this.state,...this.props.settings})
    }




    handleSubmit = () => {
        const {setSettings}:any = this.props;
        setSettings(this.state);
    }

    _onChangeTheme = (theme:any) => {
        const {setPreferences}:any = this.props;
        this.setState({theme},()=> {
            storeData('fusion-pro-app-preferences', this.state).then((r:any) => {
                setPreferences(this.state);
            });
        });
    }

    _onChangePrintpreview = (printpreviewdisable:any) => {
        const {setPreferences}:any = this.props;
        this.setState({printpreviewdisable:!printpreviewdisable},()=> {
            storeData('fusion-pro-app-preferences', this.state).then((r:any) => {
                setPreferences(this.state);
            });
        })
    }


    render() {

        const {theme,printpreviewdisable}:any = this.state;
        const {navigation,theme:{colors}}:any = this.props


        setNavigationOptions(navigation,"Settings",colors)


        /*navigation.setOptions({
            headerTitle:'Settings',
            headerLeft:()=><TouchableOpacity onPress={()=>navigation.goBack()}>{backButton}</TouchableOpacity>,
        });*/


        return (
            <Surface>


                <View  style={[styles.h_100]}>
                    <List.Item
                        title={'Theme'}
                        left={props => <List.Icon {...props} icon={()=><ProIcon name={'palette'} />} />}
                        right={(props:any) =>

                            <InputField
                                label={'Theme'}
                                divider={true}
                                removeSpace={true}
                                displaytype={'bottomlist'}
                                inputtype={'dropdown'}
                                render={() => <Paragraph style={[styles.p_4,{marginRight:20,marginTop:10}]}>{theme}</Paragraph>}
                                list={[{value:'Dark',label:'Dark'},{value:'Light',label:'Light'},{value:'System Default',label:'System Default'}]}
                                search={false}
                                selectedValue={theme}
                                listtype={'other'}
                                onChange={this._onChangeTheme}
                            />
                        }
                    />

                    <List.Item
                        title={'Print Preview'}
                        left={props => <List.Icon {...props} icon={()=><ProIcon name={'file-invoice'} />} />}
                        right={(props:any) =>
                            <View style={{marginRight:20}}><Switch value={!printpreviewdisable} onValueChange={()=>{this._onChangePrintpreview(printpreviewdisable)}} /></View>
                        }
                    />

                </View>
            </Surface>

        )
    }

}


const mapStateToProps = (state:any) => ({
    preferences: state.appApiData.preferences
})
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
    setPreferences: (preferences:any) => dispatch(setPreferences(preferences)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Settings));

