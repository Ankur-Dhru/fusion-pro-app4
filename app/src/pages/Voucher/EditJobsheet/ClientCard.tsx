import React, {memo, useEffect, useState} from "react";
import {styles} from "../../../theme";
import {Card, Paragraph, Text, withTheme} from "react-native-paper";
import {TouchableOpacity, View} from "react-native";
import {voucher} from "../../../lib/setting";
import InputField from "../../../components/InputField";
import ClientDetail from "../AddEditVoucher/Client/ClientDetail";
import {v4 as uuidv4} from "uuid";
import {VictoryBar, VictoryStack} from "victory-native";
import moment from "moment";
import {clone, isEmpty, log, toCurrency} from "../../../lib/functions";
import {Field} from "react-final-form";
import {connect} from "react-redux";
import {assignOption} from "../../../lib/static";

const ClientCard = memo(({
                             editmode,
                             navigation,
                             settings,
                             editModeClient,
                             form,
                             values,
                             warrantylist,
                             handleSubmit,
                             vouchers
                         }: any) => {

    const location = settings.location[voucher.data.locationid]?.locationname;

    const [options_warranty, setOptionsWarranty] = useState<any>([])
    const [days, setDays] = useState<any>({totalDays: 0, remainingDays: 0, remainingDaysBar: 0, totalDaysBar: 0});

    useEffect(() => {

        let date = voucher.data.date;
        let dueDate = voucher?.data?.voucherduedate;
        let dueDateMoment = moment(dueDate).endOf("days");
        let dateMoment = moment(date).startOf("days");
        let currentDateMoment = moment().startOf("days");
        let totalDays = dueDateMoment.diff(dateMoment, "days");
        let remainingDays = dueDateMoment.diff(currentDateMoment, "days");
        let remainingDaysBar = totalDays - remainingDays
        if (remainingDays < 0) {
            remainingDays = 0;
            remainingDaysBar = totalDays;
        }
        setDays(clone({
            totalDays, remainingDays, remainingDaysBar, totalDaysBar: remainingDays
        }))

        let options_warranty = warrantylist.map((wrty: any) => assignOption(wrty, wrty));

        setOptionsWarranty(options_warranty)

    }, [values])

    const getMessage = () => {
        if (days.remainingDays) {
            let day = days.remainingDays === 1 ? "Day" : "Days"
            return `Remains ${days.remainingDays} ${day}`
        }
        return '';
    }

    const voucherDetail = (item: any) => {
        if (item.vouchertypeid) {
            voucher.type = {...item, ...vouchers[item.vouchertypeid]};
            navigation?.navigate('AddEditVoucher', {
                screen: 'AddEditVoucher',
                doNotSetBackData: true
            });
        }
    }

    return <>
        <Card style={[styles.card]}>
            <Card.Content style={{paddingBottom: 0}}>
                <View style={[styles.grid, styles.justifyContent, styles.middle]}>
                    <View style={{width: '50%'}}>
                        <View style={[styles.fieldspace]}>
                            <Text style={[styles.inputLabel]}>Location</Text>
                            <View
                                style={[styles.row, styles.justifyContent, {marginBottom: 5}]}>
                                <Paragraph
                                    style={[styles.paragraph]}>{location}</Paragraph>
                            </View>
                        </View>
                    </View>
                    {
                        <View style={{width: '50%'}}>
                            <InputField
                                label={'Date'}
                                divider={true}
                                displaytype={'bottomlist'}
                                inputtype={'datepicker'}
                                mode={'date'}
                                key={uuidv4()}
                                dueterm={false}
                                editmode={editmode}
                                selectedValue={voucher?.data?.date}
                                onChange={(value: any) => {
                                    voucher.data.date = value;
                                    form.change("date", value);
                                }}
                            />
                        </View>
                    }
                </View>
            </Card.Content>
        </Card>


        <ClientDetail editmode={Boolean(editModeClient)} navigation={navigation} form={form}
                      handleSubmit={handleSubmit}/>

        {
            Boolean(voucher?.settings?.assettype) && <Card style={[styles.card]}>
                <Card.Content style={{paddingBottom: 0}}>

                    <View style={[styles.grid, styles.middle, styles.justifyContent]}>

                        <View style={[styles.w_auto]}>
                            <Field name="warranty">
                                {props => {
                                    return (<InputField
                                        label={`Order Type`}
                                        mode={'flat'}
                                        editmode={Boolean(editmode)}
                                        hideDivider={true}
                                        morestyle={styles.voucherDropdown}
                                        list={options_warranty}
                                        key={uuidv4()}
                                        value={props.input.value}
                                        selectedValue={props.input.value}
                                        selectedLabel={"Select Order Type"}
                                        displaytype={'bottomlist'}
                                        inputtype={'dropdown'}
                                        listtype={'other'}
                                        onChange={(value: any) => {
                                            props.input.onChange(value);
                                        }}>
                                    </InputField>)
                                }}
                            </Field>
                        </View>

                        {!isEmpty(voucher.data.receipt) && <View>

                            <View>
                                {
                                    Object.keys(voucher.data.receipt).map((key: any) => {
                                        const obj = voucher.data.receipt[key];
                                        return (
                                            <View>
                                                <View>
                                                    <View>

                                                        <TouchableOpacity onPress={() => voucherDetail({
                                                            voucherdisplayid: obj.voucherdisplayid,
                                                            voucherid: obj.voucherid,
                                                            vouchertypeid: obj.vouchertypeid
                                                        })}>

                                                            <View style={[styles.fieldspace]}>
                                                                <Text style={[styles.inputLabel]}>Advance
                                                                    Payment {obj.voucherprefix}{obj.voucherdisplayid}</Text>
                                                                <View style={[{marginBottom: 5}]}>
                                                                    <Paragraph
                                                                        style={[styles.paragraph, styles.textRight]}>{toCurrency(obj.amount)}</Paragraph>
                                                                </View>
                                                            </View>

                                                        </TouchableOpacity>

                                                    </View>

                                                </View>


                                            </View>
                                        )

                                    })
                                }
                            </View>

                        </View>}

                    </View>

                </Card.Content>
            </Card>
        }


        <Card style={[styles.card]}>
            <Card.Content>
                <InputField
                    removeSpace={true}
                    label={'Est. Delivery Date'}
                    divider={false}
                    displaytype={'bottomlist'}
                    inputtype={'datepicker'}
                    mode={'date'}
                    key={uuidv4()}
                    dueterm={false}
                    minimumDate={voucher?.data?.date}
                    showDays={true}
                    fromJob={true}
                    showTodayTomorrow={!Boolean(voucher?.data?.voucherid)}
                    message={getMessage()}
                    editmode={editmode}
                    selectedValue={voucher?.data?.voucherduedate}
                    onChange={(value: any) => {
                        voucher.data.voucherduedate = value;
                        voucher.data.ticketduedate = value;
                        voucher.data.duedate = value;
                        form.change("voucherduedate", value)
                    }}
                />

                <View>

                    <VictoryStack
                        horizontal={true}
                        colorScale={["#c41a1a", "#EDEDEF"]}
                        height={1}
                        padding={{top: 0, left: 0, right: 60, bottom: 0}}
                    >
                        <VictoryBar
                            data={[days.remainingDaysBar]}
                            barWidth={5}
                        />

                        <VictoryBar
                            data={[days.totalDaysBar]}
                            barWidth={5}
                        />
                    </VictoryStack>
                </View>

            </Card.Content>
        </Card>
    </>


})


const mapStateToProps = (state: any) => ({
    warrantylist: state?.appApiData.settings.staticdata.warranty,
    vouchers: state.appApiData.settings.voucher,
})
const mapDispatchToProps = (dispatch: any) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ClientCard));
