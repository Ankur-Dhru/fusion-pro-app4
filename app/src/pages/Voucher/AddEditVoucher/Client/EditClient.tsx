import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import {styles} from "../../../../theme";

import {InputBox, Button, AppBar} from "../../../../components";
import {connect} from "react-redux";
import {Title, Surface} from "react-native-paper";
import {Field, Form} from "react-final-form";
import { TextInput as TI } from 'react-native-paper';
import {setDialog} from "../../../../lib/Store/actions/components";


class ChangeDates extends Component<any> {

    title:any;
    units:any;
    taxes:any;
    constructor(props:any) {
        super(props);
        this.state = {};
    }

    componentWillMount() {

    }


    handleSubmit = () => {

    }




    render() {

        const {navigation,client,setDialog}:any = this.props;




        return (
            <Surface style={[styles.h_100]}>

                <AppBar  back={true} isModal={true} title={``} navigation={navigation}>

                </AppBar>

                <View  style={[styles.h_100,styles.cardShadow]}>
                    <View style={[styles.p_5]}>


                        <View style={[styles.grid,styles.justifyContent]}>
                            <Title>Client Name</Title>
                            {/*<Paragraph> <ProIcon name={'trash-sharp'}   /> </Paragraph>*/}
                        </View>

                        <ScrollView keyboardShouldPersistTaps='handled'>

                            <Form
                                onSubmit={this.handleSubmit}
                                initialValues={{...client}}>
                                {(
                                    <View>

                                        <View>
                                            <View>

                                                <View style={[styles.row]}>
                                                    <Field name="name">
                                                        {props =>  {
                                                            return (<InputBox
                                                                value={props.input.value}
                                                                label={'Name'}
                                                                autoFocus={false}
                                                                onChange={props.input.onChange}
                                                            />)
                                                        }}
                                                    </Field>
                                                </View>

                                                <View style={[styles.row]}>
                                                    <Field name="gst">
                                                        {props => {
                                                            return (
                                                                <InputBox
                                                                    value={props.input.value}
                                                                    label={'GST'}
                                                                    autoFocus={false}
                                                                    onChange={props.input.onChange}
                                                                />
                                                            )}}
                                                    </Field>
                                                </View>

                                                <View style={[styles.row]}>
                                                    <Field name="address">
                                                        {props => (
                                                            <InputBox
                                                                value={props.input.value}
                                                                label={'Address'}
                                                                autoFocus={false}
                                                                right={<TI.Affix text="%" />}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>

                                                <View style={[styles.row]}>
                                                    <Field name="state">
                                                        {props => (
                                                            <InputBox
                                                                value={props.input.value}
                                                                label={'State'}
                                                                autoFocus={false}
                                                                onChange={props.input.onChange}
                                                            />
                                                        )}
                                                    </Field>
                                                </View>


                                                <View style={[styles.mt_4]}>
                                                    <Button       onPress={()=>{   setDialog({visible: false}) }}> Update  </Button>
                                                </View>

                                            </View>

                                        </View>

                                    </View>
                                )}
                            </Form>


                        </ScrollView>
                    </View>
                </View>
            </Surface>

        )
    }

}



const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({
    setDialog: (dialog:any) => dispatch(setDialog(dialog)),
});

export default connect(mapStateToProps,mapDispatchToProps)(ChangeDates);


