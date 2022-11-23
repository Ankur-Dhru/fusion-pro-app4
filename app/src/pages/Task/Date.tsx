import React, {Component} from 'react';
import {View, Text, ScrollView, DatePickerAndroid, TouchableOpacity} from 'react-native';
import {styles} from "../../theme";

import {connect} from "react-redux";
import {
    Appbar,
    Card,
    DataTable,
    Paragraph,
    Searchbar,
    Title,
    List,
    Surface,
    TextInput,
    withTheme,
    Divider
} from "react-native-paper";

import {chevronRight, defaultvalues, voucher} from "../../lib/setting";

import moment from "moment";
import {log} from "../../lib/functions";
import {ProIcon} from "../../components";


class Client extends Component<any> {

    initdata:any;
    constructor(props:any) {
        super(props);
        this.initdata = props.initdata
    }

    componentDidMount() {

    }

    handleDates = () => {
        const {handleDate} = this.props;
        handleDate()
        this.forceUpdate()
    }



    render() {

        const {navigation,route,settings,editmode} = this.props
        const { colors } = this.props.theme;
        const dateformat:any = settings.general.dateformat;

        return (
            <View>
                <TouchableOpacity  onPress={()=> {editmode?navigation.push('ChangeDates',
                    {
                        screen:'ChangeDates',
                        handleDates: this.handleDates,
                        title:'Date',
                        duedate:voucher.data.voucherduedate,
                    })
                :''}}>
                    <View>
                        <Paragraph style={[styles.paragraph,styles.text_xs,{marginBottom:5}]}>Due Date </Paragraph>
                        <View style={[styles.row,styles.justifyContent,{marginBottom:3}]}>
                            <View>
                                {/*<Paragraph  style={[styles.paragraph,styles.text_sm]}>{moment(voucher.data?.date).format(`${dateformat} HH:mm:ss`)}   </Paragraph>*/}
                                {<Paragraph style={[styles.paragraph,styles.red]}>Due on {moment(voucher.data.voucherduedate).format(`${dateformat} HH:mm:ss`)}   </Paragraph>}
                            </View>
                            <View>
                                {editmode && <Title>
                                    {chevronRight}
                                </Title>}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]} />
            </View>

        )
    }

}



const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(Client));


