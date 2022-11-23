import React, { useState } from 'react';
import {Appearance, View} from 'react-native';
import {
    Dropdown,
} from 'sharingan-rn-modal-dropdown';
import {styles} from "../../theme";
import {Colors, DarkTheme, DefaultTheme, withTheme} from "react-native-paper";
import {DarkTheme as darkNav} from "@react-navigation/native";
import {setContacts, setSettings} from "../../lib/Store/actions/appApiData";
import {connect} from "react-redux";

const colorScheme = Appearance.getColorScheme();

const DropdownInput = (props:any) => {

    const [value, setValue] = useState('');

    const onChange = (value: string) => {
        setValue(value);
    };

    const lightTheme:any = {
        ...DefaultTheme,
        roundness: 5,
        dark: false,
        colors: {
            ...DefaultTheme.colors,
            /*placeholder:'#375664',
            surface:'#fff',
            backdrop:'#777',
            onSurface:'#222',
            notification:'#222',*/
            backdrop:'#eee',
            backgroundColor:'transparent',
            elevation: 2,
            primary: '#222A55',
            accent:'#222A55'
        },
        //fonts: configureFonts(fontConfig),
    };

    const darkTheme:any = {
        ...DarkTheme,
        roundness: 5,
        dark: true,
        mode:'adaptive',
        colors: {
            ...DarkTheme.colors,
            backdrop:'#000',
            backgroundColor:'transparent',
            elevation: 2,
            surface:'#0c0c0c',
            primary: '#eee',
            accent:'#fff'
        },
        //fonts: configureFonts(fontConfig),
    };


    const {label,list,preferences}:any = props;

    let theme = colorScheme;
    if(preferences && preferences.theme === 'Light'){
        theme = 'light';
    }
    else if(preferences && preferences.theme === 'Dark'){
        theme = 'dark';
    }

    return (
        <View>
            <Dropdown
                label={label}
                paperTheme={theme === 'light' ?lightTheme:darkTheme}
                data={list}
                enableSearch={false}
                textInputStyle={[styles.dropdown,{backgroundColor:'transparent'}]}
                selectedItemTextStyle={{color:'green'}}
                value={value}
                onChange={onChange}
                /*primaryColor={Colors.indigoA700}
                headerTextStyle={{
                    color: 'white',
                }}
                removeLabel
                underlineColor="transparent"*/
                {...props}
            />
        </View>
    );
};


const mapStateToProps = (state:any) => ({
    preferences: state.appApiData.preferences,
})
const mapDispatchToProps = (dispatch:any) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(DropdownInput);

