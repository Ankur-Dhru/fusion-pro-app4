
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
                            height={50}
                            primaryColor={colors.loaderprimary}
                            secondaryColor={colors.loadersecondary}
                        >
                            <Rect x="20" y="15" rx="0" ry="0" width="360" height="40" />
                        </ContentLoader>
                    })}
                </View>
            </Surface>
        );
    }
}

export default withTheme(Index)





