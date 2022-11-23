import React, {Component } from 'react'

import {styles} from "../../theme";
import {Image, View} from "react-native";

import ActivityIndicator from "../../components/ActivityIndicator";
import {Paragraph, Title} from "react-native-paper";
import {ProIcon} from "../index";



class Index extends Component<any> {

    constructor(props:any) {
        super(props);
    }

    render() {

        const {item} = this.props;
       // let extentation = item.file_name?item.file_name.split('.').pop():'';
        let extentation = item.type;
        return (
            <View>{Boolean(item.download_url) ?
                <Paragraph  style={[styles.border,{height:78,width:78,padding:3,borderRadius:3}]}>
                    {extentation === 'pdf' && <ProIcon size={20}  name={'circle-xmark'}/> }
                    {extentation === 'zip' && <ProIcon size={20} name={'circle-xmark'}/> }
                    {(extentation === 'jpg' || extentation === 'jpeg' || extentation === 'png') ? <Image style={{height:'100%',width:'100%',borderRadius:3}} source={{ uri:`https://${item.download_url}`}}/> :'' }
                </Paragraph> :
                <View>{item.file_name !== 'none' ?<ActivityIndicator  />: '' }</View>
            }</View>
        )
    }
}

export default Index
