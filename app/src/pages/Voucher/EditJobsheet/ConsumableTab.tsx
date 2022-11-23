import React, {Component, memo} from "react";
import {Button, Container, ProIcon} from "../../../components";
import {setNavigationOptions} from "../../../lib/navigation_options";
import {Card, Divider, Paragraph, withTheme} from "react-native-paper";
import {connect} from "react-redux";
import {TouchableOpacity, View} from "react-native";
import {styles} from "../../../theme";
import AddedConsumable from "./AddedConsumable";
import {voucher} from "../../../lib/setting";
import {log} from "../../../lib/functions";
import moment from "moment";
import requestApi, {methods, SUCCESS} from "../../../lib/ServerRequest";
import KeyboardScroll from "../../../components/KeyboardScroll";

class ConsumableTab extends Component<any, any> {

    constructor(props: any) {
        super(props);

        const {route} = this.props;

        const {values} = route.params;
        this.state = {
            products: values?.products || []
        }
    }

    _setProducts = (products: any) => {
        this.setState({products},()=>{
            this.handleSubmit()
        })
    }

    _removeProduct = (productIndex: number) => {
        let {products} = this.state;
        products = products.filter((p: any, index: number) => productIndex !== index)
        this._setProducts(products)
    }

    handleSubmit = () => {
        const {navigation} = this.props;
        const {products} = this.state;

        voucher.data = {...voucher.data, products}

        voucher.data.date = moment(voucher.data.date).format('YYYY-MM-DD');

        if (Boolean(voucher.settings.invoiceitems)) {

            ////// CHANGE DATE FORMATE FOR RECEIPT VOUCHER
            let time = moment(voucher.data.vouchercreatetime, 'hh:mm A').format('HH:mm:ss');
            voucher.data.date = voucher.data.date + ' ' + time;

            ///////// IF ADVANCE PAYMENT
            if (voucher.data?.advancepayment) {
                voucher.data.totalamountuseforpayment = voucher.data.vouchertotal = voucher.data.vouchertotaldisplay;
            }
        }

        /////// remove extra json ///////
        delete voucher.data?.clientdetail;
        voucher.data?.invoiceitems.map((item: any) => {
            delete item.itemdetail
        })
        if (Boolean(voucher.data?.voucheritems)) {
            Object.keys(voucher.data?.voucheritems).map((key: any) => {
                delete voucher.data?.voucheritems[key].itemdetail
            })
        }
        /////// remove extra json ///////

        try {

            const {outsourcing, ...postdata} = voucher.data;

            requestApi({
                method: Boolean(voucher.data.voucherid) ? methods.put : methods.post,
                action: voucher.settings.api,
                body: postdata,
                showlog: true
            }).then((result) => {
                if (result.status === SUCCESS) {
                    voucher.data.voucherid = result.data.voucherid;
                }
            });
        } catch (e) {
            log('e', e)
        }
    }


    render() {
        const {navigation, theme: {colors}} = this.props;
        const {products} = this.state;
        setNavigationOptions(navigation, "Consumable Inventory / Service",colors);

        const isDone = voucher.data.voucherstatus === '11a7d9ae-48aa-4f85-b766-33403636dc07';

        return (
            <Container>

                <View style={[styles.pageContent]}>
                    <KeyboardScroll>
                        <Card style={[styles.card]}>
                            <Card.Content>

                                <View>

                                    <AddedConsumable products={products} removeProduct={this._removeProduct} isDone={isDone}/>

                                    {!isDone &&   <View>
                                        <TouchableOpacity onPress={() => {
                                            navigation.push('SearchConsumableItems', {
                                                products,
                                                setProducts: this._setProducts,
                                                handleSubmit:this.handleSubmit
                                            })
                                        }}>

                                            <View style={[styles.grid, styles.middle]}>
                                                <ProIcon color={styles.green.color} action_type={'text'}
                                                         name={'circle-plus'}/>
                                                <Paragraph
                                                    style={[styles.paragraph, styles.text_sm, styles.green, {marginHorizontal: 5}]}>
                                                    Add product or service
                                                </Paragraph>
                                            </View>

                                        </TouchableOpacity>

                                        <Divider
                                            style={[styles.divider, styles.hide, {borderBottomColor: colors.divider}]}/>

                                    </View>}

                                </View>

                            </Card.Content>
                        </Card>

                    </KeyboardScroll>


                    {/*<View style={[styles.submitbutton]}>
                        <Button onPress={() => {
                            this.handleSubmit();
                        }}> {Boolean(voucher.data.voucherid) ? 'Update Consumable' : voucher.settings.addpayment ? 'Proceed to Payment' : `Generate ${voucher.type.label}`} </Button>
                    </View>*/}


                </View>
            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(ConsumableTab)));
