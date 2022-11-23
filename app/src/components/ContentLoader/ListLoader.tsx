import React from 'react'
// @ts-ignore
import ContentLoader from 'react-native-content-loader'
import {Circle, Rect} from 'react-native-svg'
import {View} from "react-native";
import {Surface, withTheme} from "react-native-paper";


class Index extends React.Component<any> {

    render(){
        const {theme:{colors}}:any = this.props
        return (
            <Surface style={{elevation:0}}>
                <View>
                    {Array.from(Array(15), (e, i) => {
                        return  <ContentLoader
                            width={370}
                            height={60}
                            primaryColor={colors.loaderprimary}
                            secondaryColor={colors.loadersecondary}
                        >
                            <Rect x="60" y="15" rx="5" ry="5"  width="300" height="15"/>
                            <Rect x="60" y="39" rx="5" ry="5" width="220" height="9"/>
                            <Rect x="10" y="10" rx="0" ry="0" width="40" height="40"/>
                        </ContentLoader>
                    })}
                </View>
            </Surface>
        );
    }
}

export default withTheme(Index)

