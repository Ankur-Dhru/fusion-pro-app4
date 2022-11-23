import * as React from 'react';
import {withTheme} from "react-native-paper";
import ActionSheet from "react-native-actionsheet";
import {TouchableOpacity, View} from "react-native";

//13.1
class Index extends React.Component<any> {

    ActionSheet:any

    constructor(props:any) {
        super(props);
        this.ActionSheet = React.createRef()
    }

    render(){
        const {options,children,onPress,message,cancelButtonIndex=3,destructiveButtonIndex=0}:any = this.props;

        return (
            <View>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={options}
                    cancelButtonIndex={cancelButtonIndex}
                    destructiveButtonIndex={destructiveButtonIndex}
                    onPress={(index) => {
                        onPress(index)
                    }}
                    {...this.props}
                />
                <TouchableOpacity   onPress={()=>this.ActionSheet.show()}>
                    {children}
                </TouchableOpacity>
            </View>
        );
    }
}
export default  (withTheme(Index));
