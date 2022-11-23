import * as React from 'react';
import {Platform, View} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {ScrollView} from "react-native-gesture-handler";

export default class KeyboardScroll extends React.Component<any> {

    render() {
        const {children, scrollRef, scrollEnabled, onScroll}: any = this.props;
        return (
            <KeyboardAwareScrollView ref={scrollRef} onScroll={onScroll}>

                <ScrollView   scrollEnabled={scrollEnabled}  >
                    <View>{children}</View>
                </ScrollView>

            </KeyboardAwareScrollView>
        );
    }
}
