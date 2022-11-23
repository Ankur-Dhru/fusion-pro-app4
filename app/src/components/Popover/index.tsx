import React, { createRef } from 'react';
import Popover, {PopoverPlacement} from 'react-native-popover-view';
import {TouchableOpacity, View} from "react-native";
import {Button, Paragraph, Title} from "react-native-paper";
import {styles} from "../../theme";

import {ProIcon} from "../index";

class App extends React.Component<any> {
    touchable:any;

    constructor(props:any) {
        super(props);
        this.touchable = createRef();
        this.state = {
            showPopover: false
        }
    }

    hidePopover = () => {
        this.setState({ showPopover: false })
    }

    render() {
        const {childrens,label}:any = this.props;
        const {showPopover}:any = this.state;

        return (
            <>
                <TouchableOpacity ref={this.touchable} onPress={() => this.setState({ showPopover: true })}>
                    <View style={[styles.row,styles.alignItems,{marginTop:10}]}>

                        <ProIcon color={'#29A745'} size={22}   name={'circle-plus'}/>
                        <Paragraph  style={[styles.text_sm,styles.green,styles.bold,{marginLeft:5}]}>
                             {label?label:'Attach file'}
                        </Paragraph>

                    </View>
                </TouchableOpacity>
                <Popover from={this.touchable}
                         isVisible={showPopover}
                         onRequestClose={() => this.setState({ showPopover: false })}>
                    <View style={[styles.p_5]}>
                        {childrens(this.hidePopover)}
                    </View>
                </Popover>
            </>
        );
    }
}

export default App
