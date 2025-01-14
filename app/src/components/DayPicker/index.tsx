import React, {Component} from "react";

import {DAY_OPTIONS, getStartDateTime} from "../../lib/dayoptions";
import {styles} from "../../theme";
import {TouchableOpacity, View} from "react-native";
import {Divider, List, Paragraph, withTheme} from "react-native-paper";
import moment from "moment";
import {store} from "../../App";
import {ScrollView} from "react-native-gesture-handler";
import {setBottomSheet} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import RangeDatePicker from "../../components/DateTimePickerModal/RangeDatePicker"
import DateTimePicker from "../InputField/DateTimePicker";

const dayItemOptions = (id: any, title: string, value?: any) => ({id, title, value})

const data = [
    dayItemOptions(DAY_OPTIONS.TODAY, DAY_OPTIONS.TODAY, getStartDateTime(DAY_OPTIONS.TODAY)),
    dayItemOptions(DAY_OPTIONS.YESTERDAY, DAY_OPTIONS.YESTERDAY, getStartDateTime(DAY_OPTIONS.YESTERDAY)),
    dayItemOptions(DAY_OPTIONS.LAST_7_DAY, DAY_OPTIONS.LAST_7_DAY, getStartDateTime(DAY_OPTIONS.LAST_7_DAY)),
    dayItemOptions(DAY_OPTIONS.LAST_30_DAY, DAY_OPTIONS.LAST_30_DAY, getStartDateTime(DAY_OPTIONS.LAST_30_DAY)),
    dayItemOptions(DAY_OPTIONS.THIS_WEEK, DAY_OPTIONS.THIS_WEEK, getStartDateTime(DAY_OPTIONS.THIS_WEEK)),
    dayItemOptions(DAY_OPTIONS.LAST_WEEK, DAY_OPTIONS.LAST_WEEK, getStartDateTime(DAY_OPTIONS.LAST_WEEK)),
    dayItemOptions(DAY_OPTIONS.THIS_MONTH, DAY_OPTIONS.THIS_MONTH, getStartDateTime(DAY_OPTIONS.THIS_MONTH)),
    dayItemOptions(DAY_OPTIONS.LAST_MONTH, DAY_OPTIONS.LAST_MONTH, getStartDateTime(DAY_OPTIONS.LAST_MONTH)),
    dayItemOptions(DAY_OPTIONS.THIS_QUARTER, DAY_OPTIONS.THIS_QUARTER, getStartDateTime(DAY_OPTIONS.THIS_QUARTER)),
    dayItemOptions(DAY_OPTIONS.PREVIOUS_QUARTER, DAY_OPTIONS.PREVIOUS_QUARTER, getStartDateTime(DAY_OPTIONS.PREVIOUS_QUARTER)),
    dayItemOptions(DAY_OPTIONS.LAST_6_MONTH, DAY_OPTIONS.LAST_6_MONTH, getStartDateTime(DAY_OPTIONS.LAST_6_MONTH)),
    dayItemOptions(DAY_OPTIONS.LAST_12_MONTH, DAY_OPTIONS.LAST_12_MONTH, getStartDateTime(DAY_OPTIONS.LAST_12_MONTH)),
    dayItemOptions(DAY_OPTIONS.THIS_YEAR, DAY_OPTIONS.THIS_YEAR, getStartDateTime(DAY_OPTIONS.THIS_YEAR)),
    dayItemOptions(DAY_OPTIONS.PREVIOUS_YEAR, DAY_OPTIONS.PREVIOUS_YEAR, getStartDateTime(DAY_OPTIONS.PREVIOUS_YEAR)),
]


class Index extends Component<any> {


    constructor(props:any) {
        super(props);
        this.state = {customrange:false,customdate:false}
    }

    selectDateRange = (item:any) => {

        const {onSelect,setBottomSheet}:any = this.props;
        onSelect(item);
        setBottomSheet({visible:false});
    }

    selectDate = (item:any) => {

        const {onSelect,setBottomSheet}:any = this.props;
        let date = {"id":"Custom Date","title":"Custom Date","value":{"startdate":item.value,"enddate":item.value,"datefrom":item.value,"dateto":item.value,"label":moment(item.value).format('DD MMMM, YYYY'),"starttime":"12:00 AM","endtime":"11:59 PM"}}
        onSelect(date);
        setBottomSheet({visible:false});
    }

    customRange = () => {
        this.setState({customrange:true});
    }

    customDate = () => {
        this.setState({customdate:true});
    }



    render() {

        const {list}:any = this.props;

        const {customdate,customrange}:any = this.state;
        const {colors}:any = this.props.theme;
        let dateformat = store.getState().appApiData.settings.general.date_format.toUpperCase()


        return (

            <View style={[styles.w_100,styles.h_100]}>
                <ScrollView keyboardShouldPersistTaps='handled'>

                    {(!customdate && !customrange) && <View style={[styles.grid,styles.p_5]}>
                        {
                            data.filter((item)=>{
                                if(list){
                                    return list.some((listitem:any)=> item.title === listitem)
                                }
                                return true
                            }).map((item: any) => {

                                return <View style={[{width:'50%'}]}>
                                    <TouchableOpacity onPress={() => {
                                    this.selectDateRange(item)
                                }} style={[styles.px_6,styles.p_5,styles.m_2,styles.bg_light,{borderRadius:5}]}>
                                    <View>
                                        <Paragraph style={[styles.paragraph,styles.textCenter,styles.bold]}>{item.title}</Paragraph>
                                        {/*<Paragraph>{moment(item?.value?.startdate).format(dateformat)} To {moment(item?.value?.enddate).format(dateformat)}</Paragraph>*/}
                                    </View>
                                </TouchableOpacity>


                                </View>
                            })
                        }

                        <View style={[styles.w_100]}>
                            <TouchableOpacity onPress={() => {
                                this.customDate()
                            }} style={[styles.px_6,styles.p_5,styles.m_2,styles.bg_light,{borderRadius:5}]}>
                                <Paragraph style={[styles.paragraph,styles.textCenter,styles.bold]}>Custom Date</Paragraph>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.mb_5,styles.w_100]}>
                            <TouchableOpacity onPress={() => {
                                this.customRange()
                            }} style={[styles.px_6,styles.p_5,styles.m_2,styles.bg_light,{borderRadius:5}]}>
                                <Paragraph style={[styles.paragraph,styles.textCenter,styles.bold]}>Custom Date Range</Paragraph>
                            </TouchableOpacity>
                        </View>

                    </View> }


                    {customrange && <>
                        <RangeDatePicker selectItem={this.selectDateRange} />
                    </>}

                    {customdate && <>
                        <DateTimePicker onSelect={this.selectDate} />
                    </>}

                </ScrollView>
            </View>

        );
    }
}


const mapStateToProps = (state:any) => ({

})
const mapDispatchToProps = (dispatch:any) => ({
    setBottomSheet: (dialog:any) => dispatch(setBottomSheet(dialog)),
});
export default connect(mapStateToProps,mapDispatchToProps)(withTheme(Index));
