import React, {Component, memo} from 'react';
import {Image, View} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";

import {ProIcon} from "../../components";
import {ActivityIndicator, Paragraph, withTheme} from "react-native-paper";
import {log} from "../../lib/functions";


class ThumbView extends Component<any, any> {

    params: any;
    loader: any;

    constructor(props: any) {
        super(props);
        this.loader = React.createRef()
    }


    render() {

        const {source, extentation, theme}: any = this.props;

        return (

            <View style={[styles.border, styles.center, styles.middle, {height: 72, width: 72}]}>
                {extentation === 'pdf' && <ProIcon name={'file-pdf'} size={25}/>}
                {extentation === 'zip' && <ProIcon name={'file-zipper'} size={25}/>}
                {extentation === 'xlsx' && <ProIcon name={'file-excel'} size={25}/>}
                {extentation === 'docx' && <ProIcon name={'file-word'} size={25}/>}
                {(extentation === 'jpg' || extentation === 'jpeg' || extentation === 'png') &&
                    <Image  style={{height: 65, width: 65}} source={{uri: source.uri, cache: 'only-if-cached'}}/>}
                <View style={{position: "absolute", left: 25, top: 25}}>
                    {
                        source.status === 'uploading' ?
                            <ActivityIndicator color={theme.colors.secondary}/> : <></>}
                </View>
            </View>

        )
    }

}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(ThumbView)));


