import React, {Component} from 'react';
import {
    View,
    ScrollView,
    DatePickerAndroid,
    TouchableOpacity,
    TextInput as TextInputReact,
    Platform
} from 'react-native';
import {styles as theme, styles} from "../../theme";

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

import {backButton, defaultvalues, nav, voucher} from "../../lib/setting";

import moment from "moment";
import {clone, errorAlert, log} from "../../lib/functions";
import {AppBar, Button, Container, InputBox, ProIcon} from "../../components";
import Dropdown2 from "../../components/Dropdown2";
import {setAlert, setDialog} from "../../lib/Store/actions/components";
import Avatar from "../../components/Avatar";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import InputField from "../../components/InputField";

const {tickettype}:any = defaultvalues;

class Subtask extends Component<any> {


    params:any
    initsubtask:any = {
        assignee: '',
        notes: "",
        priority: "medium",
        subid: "0",
        ticketdisplayid:'new',
        ticketstatus: "5dd70fc5-037f-463a-824f-af7185f4b394",
        substatus: "5dd70fc5-037f-463a-824f-af7185f4b394",
        ticketdate: moment().format("YYYY-MM-DD HH:mm:ss"),
        tickettime: moment().format("HH:mm:ss")
    }
    errorMessage:any;

    constructor(props:any) {
        super(props);
        const {route}:any = this.props;
        this.params = route.params;

        this.initsubtask = {
            ...this.initsubtask,assignee:this.params.staffid+'',staffid:this.params.staffid+''
        }
    }

    componentDidMount() {

    }

    handleTask = () => {

        const {setAlert}:any = this.props;

        this.errorMessage='';

        if (!Boolean(this.initsubtask.notes)) {
            this.errorMessage += `Notes is required`;
        }
        if (!Boolean(this.initsubtask.assignee)) {
            this.errorMessage += `Assignee is required`;
        }


        if(Boolean(this.errorMessage)){
            errorAlert(this.errorMessage);
        }
        else {
            this.params.addSubTask(this.initsubtask,this.params.key);
            this.props.navigation.goBack()
        }
    }



    render() {

        const {navigation,settings:{tickets,staff,staticdata}}:any = this.props;

        const {colors} = this.props.theme;

        const {ticketstatuslist}:any = tickets[tickettype];

        let {priority_options,staff_options,ticketstatus_options,subtask}:any = this.params;

        if(subtask){
            this.initsubtask = subtask
        }

        let title = `Add Sub Task`;
        if (Boolean(this.initsubtask?.ticketdisplayid!=='new' && this.initsubtask?.ticketdisplayid!=='0')){
            title = `${this.initsubtask.ticketnumber}`;
        }9

        navigation.setOptions({
            headerTitle:title,
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
            headerRight: (props:any) =>
                <Button   compact={true}  onPress={()=>{ this.handleTask() }}>{Boolean(this.initsubtask.ticketdisplayid === 'new')?'Save':'Update'} </Button>
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{title}</Title>,
            })
        }


        return (
            <Container>

                {/*<AppBar  back={true} isModal={false} title={title} navigation={navigation}>
                    <Button mode={'text'} onPress={()=>{ this.handleTask()  }}>   {Boolean(this.initsubtask.ticketdisplayid === 'new')?'Save':'Update'} </Button>
                </AppBar>*/}

                <ScrollView >


                    <View  style={[styles.pageContent]}>


                        <Card style={[styles.card]}>
                            <Card.Content>
                                <View style={[styles.grid,styles.middle,styles.justifyContent]}>

                                    <InputField
                                        removeSpace={true}
                                        label={'Assignee'}
                                        divider={true}
                                        displaytype={'pagelist'}
                                        inputtype={'dropdown'}

                                        render={()=>  <View style={[styles.grid,styles.middle,styles.noWrap]}>
                                            <Avatar size={30} label={staff[this.initsubtask.assignee]?.username} value={this.initsubtask.assignee}  />
                                            <Paragraph style={[styles.paragraph,styles.ml_2]}>{staff[this.initsubtask.assignee]?.username || 'Unassigned'}</Paragraph>
                                        </View>
                                            }
                                        list={staff_options}
                                        search={true}
                                        listtype={'staff'}
                                        selectedLabel={staff[this.initsubtask.assignee]?.username}
                                        selectedValue={this.initsubtask.assignee || '0'}
                                        onChange={(value: any) => {
                                            this.initsubtask.assignee=value
                                        }}
                                    />


                                    <InputField
                                        removeSpace={true}
                                        label={'Status'}
                                        divider={true}
                                        displaytype={'bottomlist'}
                                        inputtype={'dropdown'}
                                        render={()=> {
                                            let statustext = ticketstatuslist[this.initsubtask.ticketstatus]?.ticketstatusname;
                                            let statuscolor = ticketstatuslist[this.initsubtask.ticketstatus]?.ticketstatuscolor;
                                            return (<View style={[styles.paragraph, styles.badge, {backgroundColor: statuscolor,paddingLeft: 10}]}>
                                                <Paragraph style={[{paddingRight: 5, color: 'white'}]}>{statustext} <ProIcon name={'chevron-down'} color={'white'}  action_type={'text'}  size={12}/></Paragraph>
                                            </View>)
                                        }}
                                        list={ticketstatus_options}
                                        search={false}
                                        listtype={'task_status'}
                                        /*selectedLabel={tasktypeslist[this.initdata.tasktype].task_type_name}*/
                                        selectedValue={this.initsubtask.ticketstatus}
                                        onChange={(value: any) => {
                                            this.initsubtask.ticketstatus=value
                                        }}
                                    />

                                </View>
                            </Card.Content>
                        </Card>


                        <Card style={[styles.card]}>
                            <Card.Content>

                                {this.initsubtask.age && <View>
                                    <Paragraph style={[styles.paragraph,{opacity:0.5}]}>{this.initsubtask.age} {this.initsubtask.age!=='just now'?'ago':''}</Paragraph>
                                </View>}

                                <View style={[styles.mb_5]}>
                                    <TextInputReact
                                        onChangeText={(e:any) => { this.initsubtask.notes=e }}
                                        defaultValue={this.initsubtask?.notes}
                                        placeholder={'Add Task Summary'}
                                        multiline={true}
                                        placeholderTextColor={colors.inputLabel}
                                        style={[styles.input,styles.mb_5,{backgroundColor:colors.backgroundColor,fontSize:16,color:colors.inputbox,fontWeight:'bold'}]}
                                    />
                                    <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
                                </View>



                                <View>
                                    <InputField
                                        label={`Priority`}
                                        fullView={false}
                                        mode={'flat'}
                                        displaytype={'bottomlist'}
                                        inputtype={'dropdown'}
                                        listtype={'priority'}
                                        list={priority_options}
                                        selectedLabel={staticdata.taskpriority[this.initsubtask.priority]}
                                        selectedValue={this.initsubtask.priority}
                                        onChange={(value: any) => {
                                            this.initsubtask.priority = value
                                        }}>
                                    </InputField>
                                </View>

                            </Card.Content>
                        </Card>


                    </View>
                </ScrollView>




               {/* <View style={[styles.px_6,styles.mb_10]}>
                    <Button       onPress={()=>{ this.handleTask()  }}>   {Boolean(this.initsubtask.ticketdisplayid === 'new')?'Add':'Update'} </Button>
                </View>*/}

            </Container>

        )
    }

}



const mapStateToProps = (state:any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch:any) => ({
    setAlert: (alert: any) => dispatch(setAlert(alert)),
    setDialog: (alert: any) => dispatch(setDialog(alert)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(Subtask));


