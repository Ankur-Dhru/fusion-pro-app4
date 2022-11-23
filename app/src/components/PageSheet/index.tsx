import React from "react";

import {
    Surface,
} from 'react-native-paper';
import {connect} from "react-redux";
import {setPageSheet} from "../../lib/Store/actions/components";
import {Keyboard, Modal as ReactNativeModal} from "react-native";


class Index extends React.Component<any> {

    constructor(props:any) {
        super(props);

        const {pagesheet}:any = this.props;

        this.state={
            label:pagesheet.label,fullView:pagesheet.fullView
        }
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        const {pagesheet}:any = nextProps;
        if(!Boolean(pagesheet.visible)){
            Keyboard.dismiss();
        }
        this.setState({
            label:pagesheet.label,fullView:pagesheet.fullView
        })
    }


    render() {

        const {pagesheet, setPageSheet}:any = this.props;
        const Content = pagesheet.component;

        return (


            <>
                <ReactNativeModal
                    animationType="slide"
                    presentationStyle="formSheet"
                    transparent={false}
                    statusBarTranslucent={false}
                    visible={Boolean(pagesheet.visible)}
                    onRequestClose={() => {
                        Keyboard.dismiss();
                        setTimeout(()=>{
                            setPageSheet({visible: false})
                        },100)
                    }}>
                    <Surface style={{height: '100%',borderRadius: 20,}}>
                        {Boolean(pagesheet.visible) && <Content/>}
                    </Surface>

                </ReactNativeModal>

            </>

        );
    }
}


const mapStateToProps = (state:any) => ({
    pagesheet: state.components.pagesheet
});
const mapDispatchToProps = (dispatch:any) => ({
    setPageSheet: (pagesheet:any) => dispatch(setPageSheet(pagesheet)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

