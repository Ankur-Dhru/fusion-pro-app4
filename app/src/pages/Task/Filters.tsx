import React, {Component, useEffect} from 'react';
import {FlatList, StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import {filterArray, log} from "../../lib/functions";
import {Checkbox, List, Paragraph, Searchbar, Surface, Title,Divider} from "react-native-paper";

import {setModal} from "../../lib/Store/actions/components";
import {styles} from "../../theme";
import {AppBar, Container,Button} from "../../components";
import {defaultvalues} from "../../lib/setting";
const {tickettype,tasktype}:any = defaultvalues;

class Index extends Component<any> {


    filterlist:any = [];

    constructor(props:any) {
        super(props);
        this.filterlist = this.props.list
    }

    componentDidMount() {

    }

    render() {

        const {settings:{tickets,staff}}:any = this.props;
        const {task_types}:any = tickets[tickettype];


        return (

            <View>
                <AppBar back={true} title={'Filters'} isModal={true}></AppBar>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View>
                        <Paragraph style={[styles.px_6,styles.head]}>Task Types</Paragraph>
                        {
                            task_types &&  Object.keys(task_types).map((key:any)=>{
                                let type = task_types[key];

                                return(
                                    <Checkbox.Item
                                        label={type.task_type_name}
                                        mode={'ios'}
                                        color={'green'}
                                        style={[{height:50}]}
                                        status={'checked'}
                                        labelStyle={[]}
                                        onPress={()=> {

                                        }}
                                    />
                                )
                            })
                        }
                    </View>

                    <View>
                        <Paragraph style={[styles.px_6,styles.head]}>Assignee</Paragraph>
                        {
                            staff &&  Object.keys(staff).map((key:any)=>{
                                let staf = staff[key];

                                return(
                                    <Checkbox.Item
                                        label={staf.firstname}
                                        mode={'ios'}
                                        color={'green'}
                                        style={[{height:50}]}
                                        status={'checked'}
                                        labelStyle={[]}
                                        onPress={()=> {

                                        }}
                                    />
                                )
                            })
                        }
                    </View>

                </ScrollView>
                <View style={[styles.px_6,styles.mb_10]}>
                    <Button        onPress={()=> {  }}> Filter  </Button>
                </View>
            </View>

        );
    }
}





const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({
    setModal: (dialog:any) => dispatch(setModal(dialog)),

});
export default connect(mapStateToProps,mapDispatchToProps)(Index);




