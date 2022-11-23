import React,{Component} from "react";
import {Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {connect} from "react-redux";
import {setDialog} from "../../lib/Store/actions/components";
import {styles} from "../../theme";



class Confirm extends Component {

    constructor(props:any) {
        super(props);
        this.state={input:''}
    }

    render() {
        const {setDialog,confirmed,message,type}:any = this.props;
        const {input}:any = this.state
        return (
            <View style={styles.flexGrow}>


                    <View style={[styles.p_5,styles.flex,{padding:20}]}>

                        <View style={styles.p_5}>
                            <Text>{message}</Text>
                        </View>

                        {Boolean(type) &&  <View>
                            <TextInput
                                style={[styles.input]}
                                label={'Type : '+type}
                                autoFocus={true}
                                mode={'outlined'}
                                value={input}
                                onChangeText={(text) => this.setState({input: text})}
                            />
                        </View>}

                    </View>

                    <View style={styles.dialog_action}>
                        <Button contentStyle={[styles.buttonContent]}  color={'#343A40'}   style={[styles.button]}   onPress={() => setDialog({visible: false})}>Cancel</Button>
                        <Button  mode={'contained'}  disabled={type &&  input !== type}   contentStyle={[styles.buttonContent]}  color={'#343A40'}   style={[styles.button]}   onPress={() => {setDialog({visible:false}); confirmed()}}>Confirm</Button>
                    </View>

            </View>
        )
    }
};



const mapStateToProps = (state:any) => ({

});
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Confirm);


