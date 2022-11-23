import * as React from 'react';
import {Title, withTheme} from 'react-native-paper';
import {styles} from "../../theme";
import {Container, ProIcon} from "../../components";
import {TouchableOpacity, View} from "react-native";
import {getCurrentCompanyDetails, log, log2, updateComponent} from "../../lib/functions";

import {setDialog, setModal} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import Task from "./TaskList"
import {defaultvalues} from "../../lib/setting";
import Animated from "react-native-reanimated";
import Avatar from "../../components/Avatar";
import ClientAvatar from "../../components/ClientAvatar";


class Index extends React.Component<any> {

    isFilter: any = false;
    filterRef: any;
    tempdata: any;

    constructor(props: any) {
        super(props);
        this.filterRef = React.createRef();
        if (defaultvalues.ticketdisplayid) {
            this.addEditTask(defaultvalues.ticketdisplayid)
        }
    }

    taskRef = (data: any) => {
        this.tempdata = data;
    }

    addEditTask = (ticketdisplayid?: any) => {
        const {navigation}: any = this.props;
        navigation.navigate('AddEditTask', {

            ticketdisplayid: ticketdisplayid,
            getTask: this.tempdata?.getTask
        });
    }

   /* componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        const {route:{params}}: any = nextProps;
        if(Boolean(params)){
            this.addEditTask(params.taskid)
        }
    }*/




    render() {


        const {navigation,  theme:{colors}}: any = this.props;
        const {username, adminid}: any = getCurrentCompanyDetails();


        navigation.setOptions({
            headerTitle: 'Task',
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft: () => <View><ClientAvatar  navigation={navigation}/></View>,
            headerRight: (props: any) =>
                <View style={[styles.grid,styles.px_5,  styles.middle]}>
                    <Title
                        onPress={() => {
                            this.isFilter = !this.isFilter;
                            updateComponent(this.filterRef, 'display', this.isFilter ? 'flex' : 'none')
                        }}>
                        <ProIcon name="filter" size={14} type={'regular'}/>
                    </Title>

                    <Title onPress={() => { this.addEditTask() }}>
                        <ProIcon name="plus"/>
                    </Title>
                </View>,
        });


        return (
            <Container surface={true}>
                <Task filterRef={this.filterRef} navigation={navigation} taskRef={this.taskRef}/>
            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({
    notify: state.appApiData.notify,
    connection: state.appApiData.connection,
});
const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setModal: (dialog: any) => dispatch(setModal(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));
