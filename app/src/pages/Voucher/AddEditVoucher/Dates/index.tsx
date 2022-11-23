import React, {Component} from 'react';
import {View} from 'react-native';
import {styles} from "../../../../theme";
import {connect} from "react-redux";
import {Card} from "react-native-paper";
import {voucher} from "../../../../lib/setting";
import InputField from "../../../../components/InputField";


class VoucherDate extends Component<any> {

    constructor(props: any) {
        super(props);

    }

    handleDates = () => {
        //voucher.data = {...voucher.data,duedate: moment(voucher.data.date).add(voucher.data.defaultdays, 'days').format("YYYY-MM-DD")}
        this.forceUpdate()
    }

    render() {

        const {navigation, settings, editmode, showDays, showTodayTomorrow,minimumDate} = this.props;
        const dateformat: any = settings.general.dateformat;
        const {date, time, vouchercreatetime} = voucher.data;
        const {duedatetitle, duedate, datetitle}: any = voucher.settings;

        return (
            <View>

                {duedate && <Card style={[styles.card]}>
                    <Card.Content style={{paddingBottom: 0}}>

                        <View>
                            <InputField
                                label={duedatetitle}
                                displaytype={'bottomlist'}
                                inputtype={'datepicker'}
                                mode={'date'}
                                dueterm={true}
                                showDays={showDays}
                                minimumDate={minimumDate}
                                showTodayTomorrow={showTodayTomorrow}
                                selectedValue={voucher?.data?.duedate}
                                editmode={editmode}
                                onChange={(value: any) => {
                                    voucher.data.duedate = value;
                                }}
                            />
                        </View>
                    </Card.Content>
                </Card>}

                {/*<TouchableOpacity  onPress={()=> {editmode?navigation.push('ChangeDates',
                    {
                        screen:'ChangeDates',
                        handleDates: this.handleDates,
                        title:voucher.settings.datetitle,
                        duedate:voucher.settings.duedate,
                    }):''
                }}   style={[styles.py_5]} >
                    <View  style={[styles.px_6]}>
                        <Paragraph style={[styles.paragraph,styles.head,{marginBottom:5}]}>{voucher.settings.datetitle}  </Paragraph>
                        <View style={[styles.row,styles.justifyContent,{marginBottom:3}]}>
                            <View>
                                <Paragraph  style={[styles.paragraph,styles.text_sm,styles.bold]}>{moment(date).format(`${dateformat}`)} {voucher.data.voucherid &&  moment(vouchercreatetime, 'hh:mm A').format('HH:mm')}  </Paragraph>
                                {voucher.settings.duedate &&  <Paragraph style={[styles.paragraph,styles.red]}>Due on {moment(voucher.data.voucherduedate).format(dateformat)}   </Paragraph>}
                            </View>
                            <View>
                                {editmode && <Title>
                                    {chevronRight}
                                </Title>}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>*/}

            </View>
        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(VoucherDate);


