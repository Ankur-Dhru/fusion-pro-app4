import React, {Component} from "react";
import {View} from "react-native";
import {Surface, withTheme} from "react-native-paper";
import {AppBar, Button} from "../../../../components";
import {styles} from "../../../../theme";
import InputField from "../../../../components/InputField";
import {setModal} from "../../../../lib/Store/actions/components";
import {connect} from "react-redux";
import {v4 as uuidv4} from 'uuid';
import {Field, Form} from "react-final-form";
import {voucher} from "../../../../lib/setting";

class Index extends Component<any, any> {

    constructor(props: any) {
        super(props);
        const {form, values} = this.props;
        this.state = {
            estimate: Boolean(values.estimate === '1'),
            estimateapproval: values?.estimateapproval
        }
    }


    render() {
        const {form, values, setModal,navigation} = this.props;
        const {estimate, estimateapproval} = this.state;
        return (
            <Surface>
                <AppBar back={true} title={`Estimate`} isModal={true}></AppBar>

                <View style={[styles.h_100, styles.px_6]}>
                    <Form
                        onSubmit={(values) => {
                            form.change("estimate", values?.estimate);
                            form.change("estimateapproval", values?.estimateapproval);
                            voucher.data.estimate = values?.estimate
                            voucher.data.estimateapproval = values?.estimateapproval
                            setModal({visible: false});
                        }}
                        initialValues={{
                            estimate: values?.estimate,
                            estimateapproval: values?.estimateapproval,
                        }}
                        render={({handleSubmit, submitting, values, ...more}: any) => (
                            <View>
                                <View>
                                    <Field name="estimate">
                                        {props => (
                                            <InputField
                                                {...props}
                                                label={'Create Estimate'}
                                                value={Boolean(props.input.value === '1')}
                                                inputtype={'switch'}
                                                onChange={(value: any) => {
                                                    props.input.onChange(value ? '1' : '0');
                                                }}>
                                            </InputField>
                                        )}
                                    </Field>


                                </View>
                                {
                                    Boolean(values?.estimate == '1') && <View>

                                        <Field name="estimateapproval">
                                            {props => (
                                                <InputField
                                                    label={'Approval'}
                                                    mode={'flat'}
                                                    hideDivider={true}
                                                    morestyle={styles.voucherDropdown}
                                                    disabledCloseModal={true}
                                                    list={[
                                                        {value: "0", label: "Client approval required"},
                                                        {value: "1", label: "Pre-approved"},
                                                    ]}
                                                    value={props.input.value + ""}
                                                    selectedValue={props.input.value}
                                                    selectedLabel={"Select Approval"}
                                                    displaytype={'bottomlist'}
                                                    inputtype={'dropdown'}
                                                    key={uuidv4()}
                                                    listtype={'other'}
                                                    onChange={(value: any) => {
                                                        props.input.onChange(value);
                                                    }}/>
                                            )}
                                        </Field>


                                    </View>
                                }

                                <Button onPress={() => handleSubmit(values)}> Save </Button>
                            </View>
                        )}/>


                </View>
            </Surface>
        );
    }
}

const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    setModal: (dialog: any) => dispatch(setModal(dialog)),

});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

