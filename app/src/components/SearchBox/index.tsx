import * as React from 'react';
import {Searchbar, Surface, withTheme} from 'react-native-paper';

import {useEffect} from "react";
import {styles} from "../../theme";
import {Platform, View} from "react-native";
import {log} from "../../lib/functions";


const Search = (props:any) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query:any) => { setSearchQuery(query) };



    useEffect(() => {

            if (Boolean(searchQuery)) {
                const delayDebounceFn = setTimeout(() => {
                    !props.disableKeypress && props?.handleSearch(searchQuery);
                }, props.timeout ? props.timeout : 1000)
                return () => clearTimeout(delayDebounceFn)
            } else {
                !props.disabledefaultload && props?.handleSearch(searchQuery)
            }
    }, [searchQuery]);



    const {colors}:any = props.theme;

    return (
        <Surface style={[styles.p_5,{height: 'auto',elevation:0,backgroundColor:colors.surface,...props.more}]}>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                autoFocus={false}
                value={searchQuery}
                useNativeDriver={true}
                onSubmitEditing={()=>  props.handleSearch(searchQuery.trim()) }
                style={[{elevation:0,height:40,borderRadius:12,backgroundColor:colors.screenbg}]}
                inputStyle={{height:Platform.OS === 'ios'?40:43}}
                {...props}
            />
        </Surface>
    );
};

export default (withTheme(Search));
