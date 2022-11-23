import React, {Component} from 'react';
import {Platform, ScrollView, View,} from 'react-native';
import {styles} from "../../theme";

import {Button, CheckBox, Container} from "../../components";
import {connect} from "react-redux";
import {Title, withTheme} from "react-native-paper";
import {log} from "../../lib/functions";
import {Field, Form} from "react-final-form";

import {assignOption, required} from "../../lib/static";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import BottomSpace from "../../components/BottomSpace"
import {backButton} from "../../lib/setting";
import InputField from "../../components/InputField";
import FormLoader from "../../components/ContentLoader/FormLoader";
import moment from "moment";
import AssetsForm from "./AssetsForm";
import KeyboardScroll from "../../components/KeyboardScroll";


class AddEditasset extends Component<any> {

    refstate: any;
    title: any;
    initdata: any = {
        "brand": "",
        "model": "",
        "assettype": "",
        "assetname": "",
        "assetid": "",
        "basefield": "",
        "date": moment().format("YYYY-MM-DD HH:mm:ss"),
        "data": {},
        "deleted": "0"
    }

    params: any;

    constructor(props: any) {
        super(props);
        const {route}: any = this.props;
        const {asset}: any = route.params;

        this.params = route.params;

        this.refstate = React.createRef();
        this.initdata = {...this.initdata, ...asset}
        this.state = {isLoading: false, editmode: true, brand: [], model: []}
    }

    async componentDidMount() {

        await requestApi({
            method: methods.get,
            action: actions.tag,
            queryString: {tagtype: 'brand,model'},
            loader: false,
            showlog: true,
            loadertype: 'form'
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.setState({isLoading: true, brand: result.data?.brand, model: result.data?.model})
            } else {
                this.setState({isLoading: true})
            }
        });


        if (Boolean(this.initdata.assetid)) {
            await requestApi({
                method: methods.get,
                action: actions.assets,
                queryString: {assetid: this.initdata.assetid, clientid: 0},
                loader: false,
                showlog: true,
                loadertype: 'form'
            }).then((result: any) => {
                if (result.status === SUCCESS) {
                    this.setState({isLoading: true}, () => {
                        this.initdata = {...this.initdata, ...result.data[this.initdata.assetid]}
                    })
                }
            });
        }


    }


    handleSubmit = (values: any) => {


        delete values.customfield;
        delete values.brandtagrequired;

        requestApi({
            method: Boolean(this.initdata.assetid) ? methods.put : methods.post,
            action: actions.assets,
            body: values
        }).then((result) => {
            if (result.status === SUCCESS) {
                this.props.navigation.goBack();
                if (Boolean(this.params.getAssets)) {
                    this.params.getAssets()
                }
            }
        });
    }

    render() {

        const {route, navigation, settings: {assettype},theme:{colors}}: any = this.props;


        const {asset}: any = route.params;

        const {isLoading, brand, model}: any = this.state;

        const option_assettype = Object.keys(assettype).map((k) => assignOption(assettype[k].assettypename, k));
        const option_brand = brand && brand.map((k: any) => assignOption(k, k)) || [];
        const option_model = model && model.map((k: any) => assignOption(k, k)) || [];

        let title = `Add Assets`;
        if (Boolean(asset?.assetid)) {
            title = `${asset.assetname}`;
            this.initdata.customfield = assettype[asset.assettype].customfield;
        }

        navigation.setOptions({
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{title}</Title>,
            })
        }

        if (!isLoading) {
            return <FormLoader/>
        }

        navigation.setOptions({
            headerTitle: title,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
        });


        return (
            <Container>


                <Form
                    onSubmit={this.handleSubmit}
                    initialValues={{...this.initdata}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (

                        <View style={[styles.pageContent]}>
                            <KeyboardScroll>



                                    <AssetsForm
                                        values={values}
                                        assettype={assettype}
                                        navigation={navigation}
                                    />


                            </KeyboardScroll>

                            <View style={[styles.submitbutton]}>
                                <Button  disable={more.invalid} secondbutton={more.invalid}   onPress={() => {
                                    handleSubmit(values)
                                }}>   {Boolean(asset.assetid) ? 'Update' : 'Add'} </Button>
                            </View>

                        </View>
                    )}
                >

                </Form>

            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddEditasset));


