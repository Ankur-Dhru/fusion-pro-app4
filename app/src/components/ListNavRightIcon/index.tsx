import React from "react";
import {List, Title} from "react-native-paper";
import {ProIcon} from "../index";
import {chevronRight} from "../../lib/setting";

const Index = ({hide, name,type, ...props}: any) => {
    return Boolean(hide) ? <></> : <List.Icon
        {...props}
        icon={() => <Title>
            {Boolean(name) ? <ProIcon name={name} align={'right'} type={type} size={16}/> : chevronRight }
        </Title>}/>
}

export default Index;
