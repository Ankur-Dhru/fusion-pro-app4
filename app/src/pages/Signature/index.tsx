import React, {Component} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";
import {Card, Paragraph, withTheme} from "react-native-paper";

import {setDialog, setLoader, setModal} from "../../lib/Store/actions/components";
import {voucher} from "../../lib/setting";
import Signature from "../Voucher/EditJobsheet/Signature";


class Index extends Component<any> {


    constructor(props: any) {
        super(props);

        this.state = {
            takesignature: false,
        };

    }

    componentDidMount() {

    }

    setSignature = () => {
        this.setState({takesignature:true})
    }


    render() {

        const {navigation, setDialog, editmode, label, preview, icon, setModal,readonly}: any = this.props;
        const colors = this.props.theme;

        return (
            <View>

                {editmode && <TouchableOpacity onPress={() => {
                    if(!readonly) {
                        setModal({
                            title: 'Signature',
                            visible: true,
                            component: () => <Signature setSignature={this.setSignature}/>
                        })
                    }
                }}>
                    <Card style={[styles.card, {marginBottom: 0}]}>
                        <Card.Content style={{paddingBottom: 0}}>
                            <View style={[styles.grid, styles.middle, styles.mb_5]}>
                                <Paragraph
                                    style={[styles.paragraph, styles.text_sm, styles.green, {marginHorizontal: 5}]}>
                                    {label}
                                </Paragraph>
                            </View>
                            {Boolean(voucher?.data?.signature) && <View>
                                <Image style={{height: 400, width: 300}}
                                       source={{uri: `${voucher.data.signature}`}}/>
                            </View>}
                        </Card.Content>
                    </Card>
                </TouchableOpacity>}


            </View>
        )
    }


}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = (dispatch: any) => ({
    setModal: (dialog: any) => dispatch(setModal(dialog)),
    setLoader: (loader: any) => dispatch(setLoader(loader)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));


