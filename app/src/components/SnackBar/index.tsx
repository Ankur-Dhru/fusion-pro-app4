import React,{Component} from "react";
import {connect} from "react-redux";
import {Snackbar,withTheme} from 'react-native-paper';
import {setAlert} from "../../lib/Store/actions/components";


class Index extends Component {

    constructor(props:any){
        super(props);
    }

    onDismiss = () =>{
        const {setAlert}:any = this.props;
        setAlert({visible:false})
    }

    render() {
        const {alert}:any = this.props;
        return (
            <Snackbar
                visible={alert.visible}
                onDismiss={() => this.onDismiss()}
                /*action={{
                    label: 'OK',
                    onPress: () => {

                    },
                }}*/
                duration={1000}
            >
                {alert.message}
            </Snackbar>
        );
    }
}

const mapStateToProps = (state:any) => ({
    alert : state.components.alert
})

const mapDispatchToProps = (dispatch:any) => ({
    setAlert: (alert:any) => dispatch(setAlert(alert)),
});

// @ts-ignore
export default  withTheme(connect(mapStateToProps,mapDispatchToProps)(Index));


