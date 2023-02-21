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

const dayItemOptions = (id: any, title: string, value?: any) => ({id, title, value})

const data = [
    dayItemOptions(DAY_OPTIONS.TODAY, DAY_OPTIONS.TODAY, getStartDateTime(DAY_OPTIONS.TODAY)),
    dayItemOptions(DAY_OPTIONS.YESTERDAY, DAY_OPTIONS.YESTERDAY, getStartDateTime(DAY_OPTIONS.YESTERDAY)),
    dayItemOptions(DAY_OPTIONS.LAST_7_DAY, DAY_OPTIONS.LAST_7_DAY, getStartDateTime(DAY_OPTIONS.LAST_7_DAY)),
    dayItemOptions(DAY_OPTIONS.LAST_30_DAY, DAY_OPTIONS.LAST_30_DAY, getStartDateTime(DAY_OPTIONS.LAST_30_DAY)),
    dayItemOptions(DAY_OPTIONS.THIS_WEEK, DAY_OPTIONS.THIS_WEEK, getStartDateTime(DAY_OPTIONS.THIS_WEEK)),
    dayItemOptions(DAY_OPTIONS.THIS_MONTH, DAY_OPTIONS.THIS_MONTH, getStartDateTime(DAY_OPTIONS.THIS_MONTH)),
    dayItemOptions(DAY_OPTIONS.THIS_QUARTER, DAY_OPTIONS.THIS_QUARTER, getStartDateTime(DAY_OPTIONS.THIS_QUARTER)),
    dayItemOptions(DAY_OPTIONS.LAST_MONTH, DAY_OPTIONS.LAST_MONTH, getStartDateTime(DAY_OPTIONS.LAST_MONTH)),
    dayItemOptions(DAY_OPTIONS.LAST_6_MONTH, DAY_OPTIONS.LAST_6_MONTH, getStartDateTime(DAY_OPTIONS.LAST_6_MONTH)),
    dayItemOptions(DAY_OPTIONS.LAST_12_MONTH, DAY_OPTIONS.LAST_12_MONTH, getStartDateTime(DAY_OPTIONS.LAST_12_MONTH)),
    dayItemOptions(DAY_OPTIONS.THIS_YEAR, DAY_OPTIONS.THIS_YEAR, getStartDateTime(DAY_OPTIONS.THIS_YEAR)),
    dayItemOptions(DAY_OPTIONS.PREVIOUS_QUARTER, DAY_OPTIONS.PREVIOUS_QUARTER, getStartDateTime(DAY_OPTIONS.PREVIOUS_QUARTER)),
    dayItemOptions(DAY_OPTIONS.PREVIOUS_YEAR, DAY_OPTIONS.PREVIOUS_YEAR, getStartDateTime(DAY_OPTIONS.PREVIOUS_YEAR)),
]


class Index extends Component<any> {


    constructor(props:any) {
        super(props);
        this.state = {customdate:false}
    }

    selectItem = (item:any) => {
        const {onSelect,setBottomSheet}:any = this.props;
        onSelect(item);
        setBottomSheet({visible:false});
    }

    customRange = () => {
        this.setState({customdate:true});
    }



    render() {

        const {list}:any = this.props;
        const {customdate}:any = this.state;
        const {colors}:any = this.props.theme;
        let dateformat = store.getState().appApiData.settings.general.date_format.toUpperCase()


        return (

            <View style={[styles.w_100,styles.h_100]}>
                <ScrollView keyboardShouldPersistTaps='handled'>

                    {!customdate && <View>
                        {
                            data.filter((item)=>{
                                if(list){
                                    return list.some((listitem:any)=> item.title === listitem)
                                }
                                return true
                            }).map((item: any) => {

                                return <View><TouchableOpacity onPress={() => {
                                    this.selectItem(item)
                                }} style={[styles.px_6,styles.p_5]}>
                                    <View>
                                        <Paragraph style={[styles.paragraph,styles.bold]}>{item.title}</Paragraph>
                                        <Paragraph>{moment(item?.value?.startdate).format(dateformat)} To {moment(item?.value?.enddate).format(dateformat)}</Paragraph>
                                    </View>
                                </TouchableOpacity>

                                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>

                                </View>
                            })
                        }

                        <View>
                            <TouchableOpacity onPress={() => {
                                this.customRange()
                            }} style={[styles.px_6,styles.p_5]}>
                                <View>
                                    <Paragraph style={[styles.paragraph,styles.bold]}>Custom Range</Paragraph>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View> }


                    {customdate && <>
                        <RangeDatePicker selectItem={this.selectItem} />
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
