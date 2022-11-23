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
            <Surface style={{elevation:0}}>
                <View style={{paddingLeft:15,}}>
                <ContentLoader
                    speed={2}
                    width={350}
                    height={800}
                    primaryColor={colors.loaderprimary}
                    secondaryColor={colors.loadersecondary}
                >
                    <Circle cx="27" cy="35" r="26"  />
                    <Circle cx="86" cy="35" r="26" />
                    <Circle cx="146" cy="35" r="26" />
                    <Circle cx="206" cy="35" r="26" />
                    <Circle cx="266" cy="35" r="26" />

                    <Circle cx="27" cy="121" r="26" />
                    <Circle cx="87" cy="123" r="26" />
                    <Circle cx="145" cy="123" r="26" />
                    <Circle cx="206" cy="121" r="26" />

                    <Rect x="1" y="80" rx="0" ry="0" width="360" height="1" />
                    <Rect x="1" y="160" rx="0" ry="0" width="360" height="1" />

                    <Rect x="1" y="180" rx="0" ry="0" width="100" height="100" />
                    <Rect x="120" y="180" rx="0" ry="0" width="100" height="100" />
                    <Rect x="240" y="180" rx="0" ry="0" width="100" height="100" />

                    <Rect x="1" y="300" rx="0" ry="0" width="340" height="37" />
                </ContentLoader>
                </View>
            </Surface>
        );
    }
}

export default withTheme(Index)
