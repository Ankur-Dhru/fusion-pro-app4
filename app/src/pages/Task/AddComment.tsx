import React, {Component, useRef} from 'react';
import {View, Text, ScrollView, DatePickerAndroid, TouchableOpacity, Keyboard} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";
import {
    withTheme
} from "react-native-paper";

import {RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {KeyboardAccessoryView} from "react-native-keyboard-accessory";
import {log} from "../../lib/functions";
import {ProIcon} from "../../components";

class Client extends Component<any> {

    initdata:any;
    richText:any;


    constructor(props:any) {
        super(props);
        this.initdata = props.initdata;
        this.state={defaultValue:''}
    }

    componentDidMount() {
        this.richText = React.createRef() || useRef();
    }


    sendMesage = () => {
        let {saveConversation}:any = this.props;
        const {defaultValue}:any = this.state;
        this.richText.current.setContentHTML('')
        this.richText.current.dismissKeyboard();
        saveConversation(defaultValue);
        this.setState({defaultValue:''})
    }

    handleChange = (html:any) => {
         this.setState({defaultValue:html})
    }

    render() {

        const { colors } = this.props.theme;
        const {scrollToBottom}:any = this.props;
        const {defaultValue}:any = this.state;


        return (
            <>
                {<KeyboardAccessoryView alwaysVisible={true} androidAdjustResize={true} >
                {({ isKeyboardVisible }) => (
                    <View>

                        {<View>
                            <RichEditor
                                ref={this.richText}
                                placeholder={'Add a comment...'}
                                initialFocus={false}
                                onChange={this.handleChange}
                                onFocus={()=> {scrollToBottom}}
                                initialContentHTML={defaultValue}
                                hideKeyboardAccessoryView={true}
                                initialHeight={55}
                                editorStyle={{backgroundColor:colors.backdrop,color:colors.inputbox}}
                            />

                            <TouchableOpacity
                                accessible={false}
                                style={[styles.absolute, {right: 10,top:5}]} disabled={!Boolean(defaultValue)} onPress={()=> {
                                this.sendMesage();
                                Keyboard.dismiss
                            }}>
                                <ProIcon color={Boolean(defaultValue)?colors.primary:'#fff'} name={'paper-plane'}   />
                            </TouchableOpacity>
                        </View> }


                        {isKeyboardVisible  && (
                            <View>
                                <RichToolbar
                                    editor={this.richText}
                                    selectedIconTint={colors.primary}
                                    style={{backgroundColor:colors.bottomNavigation}}
                                />
                            </View>
                        )}

                    </View>

                )}
            </KeyboardAccessoryView> }
            </>

        )
    }

}



const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(Client));


