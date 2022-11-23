import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import {styles} from "../../../../theme";
import {AppBar, Button, Container, Menu, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import DateTimePicker from '../../../../components/DateTimePicker';
import {defalut_payment_term} from "../../../../lib/static";
import {voucher} from "../../../../lib/setting";
import moment from "moment";
import {withTheme} from "react-native-paper";


class ChangeDates extends Component<any> {

    title: any;
    paymentterms: any;

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        const {paymentterms} = this.props.settings;

        this.paymentterms = Object.keys(paymentterms).map((key: any) => {
            if (Boolean(paymentterms[key])) {
                return {label: paymentterms[key].termname, value: paymentterms[key].termdays}
            }
        }).filter((item: any) => {
            return Boolean(item)
        })

        this.paymentterms = [
            ...this.paymentterms,
            ...defalut_payment_term
        ]

    }


    handleSubmit = () => {
        const {navigation, route} = this.props;

        voucher.data.vouchercreatetime = moment(voucher.data.date).format('HH:mm')

        navigation.goBack();
        route.params.handleDates();
    }


    render() {

        const {navigation, route} = this.props;
        const {colors} = this.props.theme;

        return (
            <Container>

                <AppBar back={true} title={route.params.title} navigation={navigation}></AppBar>

                <ScrollView keyboardShouldPersistTaps='handled'>

                    <View style={[styles.p_5]}>

                        <View style={[styles.mb_5]}>
                            <View>
                                <DateTimePicker date={moment(voucher.data.date).format(`YYYY-MM-DD HH:mm`)}
                                                mode={(voucher.data.voucherid || voucher.data.datewithtime) ? 'datetime' : 'date'}
                                                label={`Date ${voucher.data.voucherid ? ' & Time' : ''}`}
                                                onValueChanged={(value: any) => {
                                                    voucher.data.date = value
                                                    if (voucher.data.voucherid) {
                                                        voucher.data.vouchercreatetime = moment(value).format("HH:mm:ss")
                                                    }
                                                    this.forceUpdate()

                                                }}/>
                            </View>
                        </View>


                        {route.params.duedate && <View>

                            <View>
                                <View style={[styles.row, styles.middle]}>


                                    {this.paymentterms && <View style={[styles.cell, styles.bg_global, {
                                        width: 50,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        borderRadius: 3
                                    }]}>
                                        <Menu menulist={this.paymentterms} onPress={(menu: any) => {
                                            voucher.data.voucherduedate = moment(voucher.data.date).add(menu.value, 'days').format("YYYY-MM-DD")
                                            this.forceUpdate()
                                        }}
                                              width={50}
                                        >
                                            <View style={[{paddingHorizontal: 10}]}><ProIcon
                                                name={'calendar-alt'}/></View>
                                        </Menu>
                                    </View>}

                                    <View style={{width: 10}}></View>

                                    <View style={[styles.cell, styles.w_auto, {paddingRight: 0}]}>
                                        <DateTimePicker
                                            date={moment(voucher.data.voucherduedate).format(`YYYY-MM-DD ${voucher.data.datewithtime ? 'HH:mm:ss' : ''}`)}
                                            mode={voucher.data.datewithtime ? 'datetime' : 'date'} label={'Due Date'}
                                            onValueChanged={(value: any) => {
                                                voucher.data.voucherduedate = value
                                                this.forceUpdate()
                                            }}/>
                                    </View>


                                </View>
                            </View>

                        </View>
                        }


                    </View>

                </ScrollView>

                <View style={[styles.px_6, styles.mb_5, {paddingBottom: 10}]}>
                    <Button onPress={() => {
                        this.handleSubmit()
                    }}> Update </Button>
                </View>

            </Container>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ChangeDates));


