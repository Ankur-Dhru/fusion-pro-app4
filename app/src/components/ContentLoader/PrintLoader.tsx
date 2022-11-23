import * as React from 'react';
import {Button, Surface, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
// @ts-ignore
import ContentLoader from 'react-native-content-loader'
import {Circle, Rect} from 'react-native-svg'
import {View} from "react-native";
import InternetConnection from "../InternetConnection";

class Index extends React.Component<any> {

    render(){

        const {theme:{colors}}:any = this.props

        return (
            <Surface style={[styles.h_100,{elevation:0}]}>
                    <View style={{paddingLeft:15,}}>
                        <ContentLoader   height={800} width={360} primaryColor={colors.loaderprimary}
                                         secondaryColor={colors.loadersecondary}>
                            <Rect x="1" y="16" rx="5" ry="5" width="98" height="51" />
                            <Rect x="160" y="36" rx="5" ry="5" width="196" height="6" />
                            <Rect x="194" y="17" rx="5" ry="5" width="161" height="12" />
                            <Rect x="125" y="69" rx="5" ry="5" width="229" height="14" />
                            <Rect x="179" y="47" rx="5" ry="5" width="175" height="6" />
                            <Rect x="1" y="127" rx="5" ry="5" width="141" height="11" />
                            <Rect x="163" y="128" rx="5" ry="5" width="173" height="5" />
                            <Rect x="163" y="138" rx="5" ry="5" width="151" height="4" />
                            <Rect x="163" y="148" rx="5" ry="5" width="126" height="4" />
                            <Rect x="1" y="191" rx="5" ry="5" width="198" height="12" />
                            <Rect x="1" y="207" rx="5" ry="5" width="214" height="14" />
                            <Rect x="1" y="225" rx="5" ry="5" width="193" height="14" />
                            <Rect x="276" y="214" rx="5" ry="5" width="76" height="19" />
                            <Rect x="1" y="274" rx="5" ry="5" width="231" height="6" />
                            <Rect x="1" y="288" rx="5" ry="5" width="180" height="5" />
                            <Rect x="1" y="331" rx="5" ry="5" width="194" height="18" />
                            <Rect x="1" y="358" rx="5" ry="5" width="155" height="18" />
                            <Rect x="269" y="359" rx="5" ry="5" width="85" height="18" />
                            <Rect x="305" y="335" rx="5" ry="5" width="50" height="18" />
                            <Rect x="1" y="424" rx="5" ry="5" width="86" height="4" />
                            <Rect x="1" y="435" rx="5" ry="5" width="133" height="5" />
                            <Rect x="240" y="496" rx="5" ry="5" width="114" height="18" />
                            <Rect x="308" y="482" rx="5" ry="5" width="41" height="3" />
                            <Rect x="258" y="482" rx="5" ry="5" width="41" height="3" />
                        </ContentLoader>
                    </View>
            </Surface>
        );
    }
}

export default withTheme(Index)
