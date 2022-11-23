import React, {Component} from 'react';
import {View, ScrollView, DatePickerAndroid, TouchableOpacity} from 'react-native';
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
    Text,
    withTheme,
    Divider
} from "react-native-paper";


import {chevronRight, defaultvalues, voucher} from "../../lib/setting";

import {ProIcon} from "../../components";


class Client extends Component<any> {

    initdata:any;
    constructor(props:any) {
        super(props);
        this.initdata = props.initdata
    }

    componentDidMount() {
        voucher.settings.partyname = 'Client';
    }




    handleClient = (client:any) => {
        const {navigation,handleClient} = this.props;
        handleClient(client)
        navigation.goBack();
        this.initdata = client;
        this.forceUpdate()
    }



    render() {

        const {navigation,label,editmode} = this.props
        const { colors } = this.props.theme;

        return (
            <View  style={[{marginVertical:10}]}>
                <TouchableOpacity  onPress={()=> {editmode?navigation.navigate('ClientList',{handleClient:this.handleClient,title:'Client List'}):''}}>
                    <View>
                        <Text style={[styles.inputLabel]}>{label}</Text>
                        <View style={[styles.row,styles.justifyContent,{marginBottom:0}]}>
                            <View>
                                {Boolean(this.initdata?.displayname) && <Paragraph style={[styles.paragraph,styles.text_sm]}>{this.initdata.displayname}</Paragraph>}
                                {!Boolean(this.initdata?.displayname) && <Paragraph style={[styles.paragraph,styles.text_sm,{color:`${colors.text}2d`}]}>Select Client</Paragraph>}
                                {Boolean(this.initdata?.phone) &&  <Paragraph style={[styles.paragraph,styles.muted]}>{this.initdata.phone}</Paragraph> }
                            </View>
                            <View>
                                <Paragraph style={{margin:0,padding:0}}>
                                    {editmode && chevronRight}
                                </Paragraph>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
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


