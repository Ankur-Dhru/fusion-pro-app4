import * as React from 'react';
import {Component} from 'react';
import {Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View} from 'react-native';
import {Paragraph, withTheme} from 'react-native-paper';
import {Button} from "../../components";
import {AppBar, Container} from "../index";
import {setModal, setPageSheet} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {styles} from "../../theme";


class Editor extends Component<any> {

    richText: any;
    richHTML: any
    previousChar: any;

    constructor(props: any) {
        super(props);

        this.state = {
            defaultValue: props.defaultValue,
            isTrackingStarted: false
        }
        this.richHTML = props.defaultValue
        this.richText = React.createRef();
    }


    componentDidMount() {

    }

    /*<p>sgvh <span className="dx-mention" spellCheck="false" data-marker="@" data-mention-value="admin admin" data-id="1">﻿<span contentEditable="false"><span>@</span>admin admin</span>﻿</span> </p>*/

    /*pattern: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*!/gi,*/


    save = () => {
        const {onChange, setPageSheet}: any = this.props;
        onChange(this.richHTML);
        Keyboard.dismiss()
        this.richText?.current?.dismissKeyboard();
        setTimeout(()=>{
            setPageSheet({visible: false})
        },100)
    }

    handleChange = (html: any) => {
        this.richHTML = html;
    }


    render() {

        const {defaultValue}: any = this.state;
        const {label, btnRender}: any = this.props
        const {colors} = this.props.theme;

        return (

            <Container surface={true}>

                <AppBar back={true} title={label} isModal={true}>
                    <View  style={[styles.mr_1]}>
                        {!Boolean(btnRender) ? <Button compact={true} secondbutton={true} onPress={() => {
                            this.save()
                        }}>
                            Done
                        </Button> : <TouchableOpacity onPress={() => {
                            this.save()
                        }}>
                            {btnRender}
                        </TouchableOpacity>}
                    </View>
                </AppBar>

                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View style={[styles.px_5]}>
                        <RichEditor
                            ref={this.richText}
                            placeholder={label}
                            initialFocus={true}
                            initialContentHTML={defaultValue}
                            onChange={this.handleChange}
                        />
                    </View>
                </ScrollView>





                {Platform.OS === "android" && <RichToolbar
                    editor={this.richText}
                    selectedIconTint={colors.primary}
                    style={{backgroundColor: colors.bottomNavigation}}
                />}


                {Platform.OS === "ios" && <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={60}>
                    <RichToolbar
                        editor={this.richText}
                        selectedIconTint={colors.primary}
                        style={{backgroundColor: colors.bottomNavigation}}
                    />


                </KeyboardAvoidingView>}

            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    setModal: (dialog: any) => dispatch(setModal(dialog)),
    setPageSheet: (pagesheet: any) => dispatch(setPageSheet(pagesheet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Editor));

