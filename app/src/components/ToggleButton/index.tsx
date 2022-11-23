import * as React from 'react';
import { ToggleButton } from 'react-native-paper';
import ProIcon from "../ProIcon";
import {useEffect} from "react";


const ToggleButtons = (props:any) => {
    const [value, setValue] = React.useState('server');

    useEffect(() => {
        Boolean(value) && props.onValueChange(value)
    }, [value]);


    return (
        <ToggleButton.Row  onValueChange={value => setValue(value)} value={value}>
            <ToggleButton  style={{height:35,width:80}} icon={()=><ProIcon name={'user'} size={18}/>} value="server" />
            <ToggleButton style={{height:35,width:80}}  icon={()=><ProIcon name={'address-book'}/>}  value="phonebook" />
        </ToggleButton.Row>
    );
};

export default ToggleButtons;
