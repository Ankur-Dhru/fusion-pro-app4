import React, {Component} from 'react';
import {Platform, ScrollView, TextInput as TextInputReact, TouchableOpacity, View} from 'react-native';
import {styles as theme, styles} from "../../theme";

import {Button, CheckBox, Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Card, Divider, Paragraph, Surface, Title, withTheme} from "react-native-paper";
import Description from "../../components/Description";
import {
    base64Decode,
    base64Encode,
    clone,
    errorAlert,
    getCurrentCompanyDetails, getInit,
    getVoucherTypeData,
    log, retrieveData,
    storeData,
    updateComponent
} from "../../lib/functions";

import requestApi, {actions as act, methods, SUCCESS} from "../../lib/ServerRequest";
import {auth, backButton, current, defaultvalues, voucher} from "../../lib/setting";
import moment from "moment";

import {assignOption, defalut_payment_term} from "../../lib/static";
import Client from "./Client";
import {setAlert, setDialog, setModal} from "../../lib/Store/actions/components";

import HTML from "react-native-render-html";

import Subtask from "./Subtask";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Avatar from "../../components/Avatar";
import {KeyboardAccessoryView} from "react-native-keyboard-accessory";
import InputField from "../../components/InputField"
import FormLoader from "../../components/ContentLoader/FormLoader";
import DeleteButton from "../../components/Button/DeleteButton";
import {v4 as uuidv4} from "uuid";
import {NavigationActions} from "react-navigation";
import JobDetailCard from "./JobDetailCard";
import Signature from "../Voucher/EditJobsheet/Signature";


const {tickettype, tasktype}: any = defaultvalues;


class AddEditTask extends Component<any> {

    title: any;
    initdata: any = {}
    params: any;
    dates: any;
    client: any;
    errorMessage: any = '';


    tasktypeslist: any;
    ticketstatuslist: any;
    taskscreens: any;

    tasktypes_options: any = [];
    ticketstatus_options: any;
    staff_options: any = [{label: 'Unassigned', value: '0'}];
    priority_options: any = [];


    ticketstatus_default: any;
    formfields: any = {default_tab: {fieldsList: {}}};

    validate: any = true;

    paymentterms: any;

    comment: any;
    fieldstypes: any = ['required', 'optional'];

    richText: any;
    richHTML: any;

    scrollView: any

    menuitems: any = [];

    refMorefields: any;
    refSubtasks: any;

    replyText: any;

    assigneetome1: any;
    assigneetome2: any;


    constructor(props: any) {

        super(props);

        const {route}: any = this.props;
        this.params = route.params;

        const {locationid, adminid, defaulttasktype}: any = getCurrentCompanyDetails();

        this.state = {
            isLoad: false,
            editmode: true,
            morefields: false,
            showeditor: false,
            showeditorinput: true
        }

        this.richHTML = props.defaultValue


        defaultvalues.ticketdisplayid = false;

        this.initdata = {
            date: moment().format("YYYY-MM-DD HH:mm:ss"),
            ticketduedate: moment().add('30', 'days').format("YYYY-MM-DD HH:mm:ss"),
            duetime: moment().format('HH:mm:ss'),
            priority: "medium",
            screen: "default_screen",
            locationid: locationid,
            ticketstatus: "",
            defaultdays: "30",
            description: '',
            notes: "",
            reporter: "",
            data: {priority: "medium",},
            staffid: '',
            tasktype: defaulttasktype || tasktype,
            tickettypeid: tickettype,
            subtask: []
        }

    }

    componentDidMount = async () => {

        const {route: {params}}: any = this.props;



        if (Boolean(params) && params?.ticketdisplayid) {
            this.getTaskByLink(this.props)
        }

        const {settings: {tickets, staff, staticdata, paymentterms}}: any = this.props;



        const {ticketstatuslist, task_types, task_screens}: any = tickets[tickettype];
        this.ticketstatuslist = ticketstatuslist;
        this.tasktypeslist = task_types;
        this.taskscreens = task_screens;

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

        task_types && Object.keys(task_types).map((key: any) => {
            let type = task_types[key];
            this.tasktypes_options.push({label: type.task_type_name, value: key})
        });


        staff && Object.keys(staff).filter((key:any)=>{
            return !staff[key].support
        }).map((key: any) => {
            let staf: any = staff[key];
            this.staff_options.push({label: staf.username, value: key})
        });


        staticdata.taskpriority && Object.keys(staticdata.taskpriority).map((key: any) => {
            let priority = staticdata.taskpriority[key];
            this.priority_options.push({label: priority, value: key})
        });

        this.ticketstatus_options = Object.keys(ticketstatuslist).map((key: any) => {
            let status = ticketstatuslist[key];
            if (status.ticketdefault) {
                this.ticketstatus_default = key;
            }
            return status.ticketstatusdisplay ? {
                label: status.ticketstatusname,
                value: key,
                color: status.ticketstatuscolor,
                ...status
            } : false
        }).filter((value: any) => {
            return Boolean(value)
        });

        this.initdata = {
            ...this.initdata,
            ticketstatus: this.ticketstatus_default
        }

        this.getScreen(this.initdata.tasktype)

        Object.keys(this.formfields).map((key: any) => {
            let tab: any = this.formfields[key];
            let fields: any = tab.fieldsList;
            Boolean(fields) && Object.keys(fields).map((key: any) => {
                this.initdata.data[key] = this.initdata.data[key] ? this.initdata.data[key] : ''
            })
        })

        voucher.settings.partyname = 'Client';
        voucher.data = {
            datewithtime: true,
            files: [],
            date: this.initdata.date,
            voucherduedate: this.initdata.ticketduedate
        }


        if (!Boolean(this.params.ticketrelatedid)) {
            this.menuitems = [{label: 'Add Subtask', value: 'addsubtask'}];
        }

        if (Boolean(this.params.ticketdisplayid)) {
            this.getTaskDetails(this.params.ticketdisplayid)
            this.menuitems.push({label: 'Delete', value: 'delete'})
        } else {
            this.setState({isLoad: true})
        }


        this.refMorefields = React.createRef();
        this.scrollView = React.createRef();
        this.refSubtasks = React.createRef();

        this.assigneetome1 = React.createRef();
        this.assigneetome2 = React.createRef();

    }

    componentWillReceiveProps = async (nextProps: Readonly<any>, nextContext: any) => {
        await this.getTaskByLink(nextProps)
    }

    getTaskByLink = async (props:any) => {

        try {
            const {route: {params}, navigation,setDialog}: any = props;

            const {workspace, ticketdisplayid}: any = params;

            if (current.company !== workspace) {
                if(Boolean(current.company) && Boolean(workspace)) {

                    setDialog({
                        title: 'Confirmation',
                        visible: true,
                        component: () => <Paragraph
                            style={[styles.paragraph,]}>{`Are you sure want to switch ${workspace} Workspace ?`}</Paragraph>,
                        actionButton: () => <Button mode={'contained'} onPress={async () => {
                            setDialog({visible: false,})
                            current.company = workspace;
                            current.user = workspace + '-' + current.clientid;
                            this.params.workspace = workspace;

                            await getInit('', navigation, '', async (response: any) => {

                                this.params.ticketdisplayid = ticketdisplayid;
                                this.getTaskDetails(ticketdisplayid)

                            });
                        }}>Yes</Button>
                    })
                }
            }
            else if (Boolean(params) && this.params.ticketdisplayid !== ticketdisplayid) {

                    this.params.ticketdisplayid = ticketdisplayid;
                    this.getTaskDetails(ticketdisplayid);
            }



        }
        catch (e) {
            log('e',e)
        }
    }




    getTaskDetails = async (ticketdisplayid: any) => {


        const {adminid}: any = getCurrentCompanyDetails();
        await requestApi({
            method: methods.get,
            action: act.ticket,
            queryString: {ticketdisplayid: ticketdisplayid, tickettype: defaultvalues.tickettype},
            loader: false,
            loadertype: 'form',
            showlog: false,
        }).then((result) => {

            try {
                if (result.status === SUCCESS) {


                    let data = result.data;

                    if (!Boolean(data.ticketid)) {
                        this.props.navigation.goBack();
                    }

                    let customdata: any = {}
                    data?.custom && Object.keys(data?.custom).map((key: any) => {
                        let custom = data.custom[key];
                        customdata[custom.fieldkey] = Boolean(data[custom.fieldkey]) ? data[custom.fieldkey] : custom.value;
                    })

                    let subtask: any = []
                    data?.sub && Object.keys(data?.sub).map((key: any) => {
                        const {ticketstatus, staffid}: any = data.sub[key];
                        data.sub[key].subid = key;
                        data.sub[key].assignee = staffid;
                        data.sub[key].substatus = ticketstatus;
                        subtask.push(data.sub[key])
                    })


                    this.initdata = {
                        ...this.initdata,
                        ...data,
                        displayname: data.client,
                        data: customdata,
                        subtask: subtask
                    }

                    this.initdata.data = {
                        ...this.initdata.data,
                        client: this.initdata.clientid,
                        assignee: this.initdata.staffid,
                        attachment: this.initdata.attachment,
                        reporter: this.initdata.reporter,
                        notes: this.initdata.notes,
                        priority: this.initdata.priority,
                        description: base64Decode(this.initdata.description)
                    }


                    this.initdata.ticketduetime = moment(this.initdata.ticketduedate)

                    ///////// IF OPEN SUB TASK //////////
                    if (data.ticketrelatedid) {
                        this.initdata.data = {
                            ...this.initdata.data,
                            notes: this.initdata.notes
                        }
                    }

                    voucher.data = {
                        ...voucher.data,
                        voucherid: data.ticketid,
                        date: data.date,
                        voucherduedate: data.ticketduedate,
                        files: data.attachment
                    }


                    if (this.initdata.staffid === 'Unassigned') {
                        this.initdata.staffid = 0
                    }

                    this.comment = {
                        "taskid": data.ticketid,
                        "message": "",
                        "fromstaff": adminid,
                        "tostaff": this.initdata.staffid,
                        "date": moment().format("YYYY-MM-DD HH:mm:ss")
                    }


                    this.getScreen(this.initdata.tasktype)

                }

                const {navigation}: any = this.props;
                const {colors} = this.props.theme;

                //updateComponent(this.assigneetome1,'display',this.initdata.staffid !== 0 ?'none':'flex')


                this.setState({isLoad: true, editmode: true});


            } catch (e) {
                log('e', e)
            }


        });
    }

    deleteTask = () => {
        const {setDialog} = this.props;
        requestApi({
            method: methods.delete,
            action: act.ticket,
            body: {ticketid: this.initdata.ticketid}
        }).then((result) => {
            setDialog({visible: false});
            if (result.status === SUCCESS) {
                if (this.params.getTaskDetails) {
                    this.params.getTaskDetails(this.initdata.ticketrelatedid)
                }
                this.props.navigation.goBack();
                Boolean(this.params?.getTask) && this.params?.getTask()
            }
        });
    }

    deleteComment = (convid: any) => {
        const {setDialog} = this.props;
        requestApi({
            method: methods.delete,
            action: act.conversation,
            body: {convid: convid}
        }).then((result) => {
            setDialog({visible: false});
            if (result.status === SUCCESS) {
                this.getTaskDetails(this.initdata.ticketdisplayid)
            }
        });
    }

    handleClient = (client: any) => {
        this.initdata.data.client = client.clientid
    }

    handleDate = () => {
        const {date, voucherduedate}: any = voucher.data;
        this.initdata = {
            ...this.initdata,
            date: moment(date).format(`YYYY-MM-DD HH:mm:ss`),
            ticketduedate: moment(voucherduedate).format(`YYYY-MM-DD HH:mm:ss`)
        }
    }

    getScreen = (type: any) => {
        if (Boolean(this.tasktypeslist[type])) {
            const {
                type_key,
                create_screen,
                edit_screen,
                task_type_name,
                task_type_icon
            }: any = this.tasktypeslist[type];
            let screen = create_screen;
            if (Boolean(this.initdata.ticketid)) {
                screen = edit_screen;
            }
            this.formfields = this.taskscreens[screen].tabs;
            this.forceUpdate()
        }
    }

    addSubTask = (task: any, key?: any) => {
        const {settings: {staff}}: any = this.props;

        task.staffid = +task.assignee;
        task.substatus = task.ticketstatus;
        task.staff = staff[task?.assignee]?.username;

        if (Boolean(task.ticketdisplayid === 'new')) {
            task.ticketdisplayid = '0';
            this.initdata.subtask.push(clone(task));
        }
        if (Boolean(key)) {
            this.initdata.subtask[key] = task
        }

        this.handleSubmit(true)

        this.forceUpdate()
    }

    saveConversation = (message?: any) => {


        this.comment.message = base64Encode(message.replace('\n', '<br/>'));

        this.replyText = '';
        this.forceUpdate()

        requestApi({
            method: Boolean(this.comment.convid) ? methods.put : methods.post,
            action: act.conversation,
            body: this.comment,
            loader: true,
            showlog: false,
        }).then((result) => {
            if (result.status === SUCCESS) {
                this.comment.message = '';
                this.getTaskDetails(this.initdata.ticketdisplayid);
            }
        });
    }

    handleSubmit = (fromSubTask?: any, mainTask?: any) => {

        const {companydetails, setAlert}: any = this.props;


        this.errorMessage = '';

        this.initdata.data = {
            ...this.initdata.data, attachment: voucher.data.files
        }

        //////////// VALIDATION /////////////
        if (!fromSubTask) {
            Object.keys(this.formfields).map((key: any) => {
                let tab: any = this.formfields[key];
                let fields: any = tab.fieldsList;
                Boolean(fields) && Object.keys(fields).map((key: any) => {
                    let field = fields[key]
                    this.initdata[key] = this.initdata.data[key];
                    if (field.required && !Boolean(this.initdata.data[key])) {
                        if (Boolean(this.errorMessage)) {
                            this.errorMessage += `\n`;
                        }
                        this.errorMessage += `${field.displayname} is required`;
                    }
                })
            });
        }

        this.initdata.ticketduedate = moment(this.initdata.ticketduedate).format('YYYY-MM-DD') + ' ' + moment(this.initdata.ticketduetime).format('HH:mm:ss');

        this.initdata = {
            ...this.initdata,
            description: Boolean(this.initdata?.data?.description) && base64Encode(this.initdata.data.description) || '',
            staffid: +this.initdata.data.assignee,
            clientid: this.initdata.data.client,
        }


        if (Boolean(this.errorMessage) && this.validate) {
            errorAlert(this.errorMessage);
        } else {

            if (!Boolean(fromSubTask)) {
                this.initdata.subtask = [];
            }


            requestApi({
                method: Boolean(this.initdata.ticketid) ? methods.put : methods.post,
                action: act.ticket,
                body: this.initdata,
                showlog: true
            }).then((result) => {
                try {
                    if (result.status === SUCCESS) {
                        companydetails['companies'][companydetails.currentuser]['defaulttasktype'] = this.initdata.tasktype;
                        storeData('fusion-pro-app', companydetails).then((r: any) => {});

                        if (this.params.getTaskDetails) {
                            this.params.getTaskDetails(this.initdata.ticketrelatedid)
                        } else if(Boolean(this.params?.ticketdisplayid)) {
                            this.getTaskDetails(this.params?.ticketdisplayid)
                        }

                        if (!Boolean(fromSubTask)) {
                            this.props.navigation.goBack();
                            Boolean(this.params?.getTask) && this.params?.getTask()
                        }
                    }
                } catch (e) {
                    log('e', e)
                }
            });
        }
    }

    clickMenu = (menu: any) => {
        const {navigation, setAlert} = this.props;
        if (menu.value === 'addsubtask') {
            navigation.push('Subtask',
                {
                    screen: 'Subtask',
                    priority_options: this.priority_options,
                    staff_options: this.staff_options,
                    ticketstatus_options: this.ticketstatus_options,
                    addSubTask: this.addSubTask,
                    subtask: false,
                    staffid: this.initdata.data.assignee || this.initdata.assignee,
                })
        } else if (menu.value === 'delete') {
            const {setDialog}: any = this.props;
            setDialog({
                title: 'Confirmation',
                visible: true,
                component: () => <Paragraph style={[styles.paragraph,]}>Are you sure want to delete?</Paragraph>,
                actionButton: () => <Button mode={'contained'} onPress={() => {
                    this.deleteTask()
                }}>OK</Button>
            })
        }
    }

    scrollToBottom = () => {
        //this.scrollView.scrollToEnd({animated: true})
    }

    assigneeToMe = (isReporter: boolean, number: any) => {
        const {theme: {colors}}: any = this.props;

        return <TouchableOpacity onPress={() => {
            const {adminid}: any = getCurrentCompanyDetails();
            if (isReporter) {
                this.initdata.data.reporter = adminid;
            } else {
                this.initdata.data.assignee = adminid;
            }
            updateComponent(number, 'display', adminid !== '0' ? 'none' : 'flex')
            this.forceUpdate();
        }}>
            <Paragraph style={[styles.paragraph, styles.text_xs, {color: colors.secondary,}]}>Assign To Me</Paragraph>
        </TouchableOpacity>
    }

    checkMoreField = () => {
        let moredetail: any = false;
        this.formfields && Object.keys(this.formfields).map((key: any) => {

            let tab: any = this.formfields[key];
            let fields: any = tab.fieldsList;

            fields && Object.keys(fields).map((field: any) => {
                const basic = ['assignee', 'attachment', 'description', 'notes','client'];

                if ((!Boolean(fields[field].required) && !basic.includes(field))) {
                    moredetail = true;
                }
            })
        });
        return moredetail
    }

    render() {

        const {isLoad, editmode}: any = this.state;

        const {navigation, setDialog, setModal, settings: {staff, staticdata}}: any = this.props;

        const {colors} = this.props.theme;
        const {adminid}: any = getCurrentCompanyDetails();

        let title = `Add Task`;
        if (Boolean(this.initdata?.ticketid)) {
            if (Boolean(this.initdata.parentticket)) {
                title = `${this.initdata.parentticket}/`;
                title += `${this.initdata.ticketnumber}`;
            } else {
                title = `${this.initdata.ticketnumber}`;
            }
        }

        if (!isLoad) {
            return <FormLoader/>
        }

        navigation.setOptions({
            headerTitle: title,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) =>
                <View>
                    <Button compact={true} onPress={() => {
                        this.handleSubmit(false, true)
                    }}>{Boolean(this.initdata.ticketid) ? 'Save' : 'Create'}</Button>
                </View>
        });



        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{title}</Title>,
            })
        }

        let ismoreField: any = false
        let hasClient: any = false;
        let hasMorefield: any = false;
        let hasRequired: any = false;

        ///////// check is more field available
        this.formfields && Object.keys(this.formfields).map((key: any) => {

            let tab: any = this.formfields[key];
            let fields: any = tab.fieldsList;



            fields && Object.keys(fields).map((field: any) => {
                const basic = ['notes', 'client', 'priority', 'reporter', 'tags'];

                if ((!Boolean(fields[field].required) && !basic.includes(field))) {
                    ismoreField = true;
                    hasMorefield = true;
                }

                if (Boolean(fields[field].required)) {
                    hasRequired = true;
                }

                if (fields[field].required) {
                    ismoreField = true;
                }
                if (field === 'client') {
                    hasClient = true
                }
            })

        });


        let isAttachment = false;
        let morefields: any = false;
        let subtasks: any = false;


        let status: any = [];

        Boolean(this.initdata.subtask && this.initdata.subtask.length) && this.initdata.subtask.map((task: any) => {

            const {ticketstatuscolor, taskstatus}: any = this.ticketstatuslist[task.ticketstatus];
            status.push({
                label: taskstatus,
                total: 1,
                color: ticketstatuscolor,
                sort: taskstatus === 'open' ? 1 : taskstatus === 'waiting' ? 2 : taskstatus === 'inprocess' ? 3 : taskstatus === 'done' ? 4 : 0
            })
        });

        status.sort(function (a: any, b: any) {
            return b.sort - a.sort
        });

        console.log('this.initdata',this.initdata)

        return (
            <Container>


                <ScrollView
                    keyboardDismissMode={'interactive'}
                    keyboardShouldPersistTaps="handled"
                    ref={ref => {
                        this.scrollView = ref
                    }}
                    onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>

                    <View>


                        <View style={[styles.pageContent, {height: 'auto'}]}>

                            <Card style={[styles.card]}>
                                <Card.Content>
                                    <View>
                                        <View style={[styles.grid, styles.middle, styles.justifyContent]}>

                                            <View>

                                                <InputField
                                                    removeSpace={true}
                                                    label={'Assignee'}
                                                    divider={true}
                                                    displaytype={'pagelist'}
                                                    inputtype={'dropdown'}
                                                    render={() => <View
                                                        style={[styles.grid, styles.middle, styles.noWrap]}>
                                                        <Avatar size={30}
                                                                label={staff[this.initdata.data.assignee]?.username}
                                                                value={this.initdata.data.assignee}/>
                                                        <Paragraph
                                                            style={[styles.paragraph, styles.ml_2]}>{staff[this.initdata.data.assignee]?.username || 'Unassigned'}</Paragraph>
                                                    </View>}
                                                    list={this.staff_options}
                                                    search={false}
                                                    listtype={'staff'}
                                                    selectedLabel={staff[this.initdata.data.assignee]?.username}
                                                    selectedValue={this.initdata.data.assignee || '0'}
                                                    onChange={(value: any) => {
                                                        this.initdata.data.assignee = value;
                                                        updateComponent(this.assigneetome1, 'display', value !== '0' ? 'none' : 'flex')
                                                    }}
                                                />


                                                {(!Boolean(this.initdata.staffid)) &&
                                                    <View style={{marginLeft: 42, display: 'flex'}}
                                                          ref={this.assigneetome1}>
                                                        {this.assigneeToMe(false, this.assigneetome1)}
                                                    </View>}
                                            </View>

                                            <InputField
                                                removeSpace={true}
                                                label={'Status'}
                                                divider={true}
                                                displaytype={'bottomlist'}
                                                inputtype={'dropdown'}
                                                render={() => {
                                                    let statustext = this.ticketstatuslist[this.initdata.ticketstatus]?.ticketstatusname;
                                                    let statuscolor = this.ticketstatuslist[this.initdata.ticketstatus]?.ticketstatuscolor;
                                                    return (<View style={[styles.paragraph, styles.badge, {
                                                        backgroundColor: statuscolor,
                                                        paddingLeft: 10
                                                    }]}>
                                                        <Paragraph
                                                            style={{paddingRight: 5, color: 'white'}}>{statustext}
                                                            <ProIcon name={'chevron-down'} action_type={'text'}
                                                                     color={'white'} size={12}/></Paragraph>
                                                    </View>)
                                                }}
                                                list={this.ticketstatus_options}
                                                search={false}
                                                listtype={'task_status'}

                                                selectedValue={this.initdata['ticketstatus']}
                                                onChange={(value: any,more:any) => {
                                                    this.initdata['ticketstatus'] = value;

                                                    if (this.initdata.signaturerequired && (more.taskstatus === 'done')) {
                                                        setModal({
                                                            title: 'Signature',
                                                            visible: true,
                                                            component: () => <Signature />
                                                        })
                                                    }

                                                }}


                                            />

                                        </View>
                                    </View>
                                </Card.Content>
                            </Card>

                            {
                                (Boolean(this.initdata?.jobdisplayid) &&
                                    Boolean(this.initdata?.jobnumber) &&
                                    Boolean(this.initdata?.jobdisplayid !== null) &&
                                    Boolean(this.initdata?.jobnumber !== null)) &&
                                <JobDetailCard {...this.initdata} navigation={navigation}  />
                            }

                            <Card style={[styles.card]}>
                                <Card.Content>

                                    {/*{
                                        (Boolean(this.initdata?.jobdisplayid) &&
                                            Boolean(this.initdata?.jobnumber) &&
                                            Boolean(this.initdata?.jobdisplayid !== null) &&
                                            Boolean(this.initdata?.jobnumber !== null)) && <>

                                            <TouchableOpacity
                                                style={[styles.grid]}
                                                onPress={() => {

                                                    voucher.type = getVoucherTypeData("vouchertypeid", "f3e46b64-f315-4c56-b2d7-58591c09d6e5", this.initdata.jobdisplayid, 1231);

                                                    voucher.data = {};

                                                    navigation.navigate('EditJobsheet', {
                                                        screen: 'EditJobsheet',
                                                    });
                                                }}
                                            >
                                                <Paragraph style={[{
                                                    color: colors.secondary
                                                }]}>
                                                    {this.initdata.jobnumber}
                                                </Paragraph>
                                            </TouchableOpacity>
                                        </>
                                    }*/}


                                    <View style={[styles.mb_3]}>
                                        <TextInputReact
                                            onChangeText={(e: any) => {
                                                this.initdata.data['notes'] = e
                                            }}
                                            defaultValue={'' + this.initdata.data['notes']}
                                            placeholder={'Add Task Summary'}
                                            multiline={true}
                                            placeholderTextColor={colors.inputLabel}
                                            style={[styles.input, styles.mb_5, {
                                                backgroundColor: colors.backgroundColor,
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                color: colors.inputbox
                                            }]}
                                        />
                                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                                    </View>

                                    <View>
                                        <View>
                                            <Description
                                                label={`Add Description`}
                                                html={this.initdata.data['description']}
                                                editmode={editmode}
                                                navigation={navigation}
                                                onChange={(value: any) => {
                                                    this.initdata.data['description'] = value
                                                }}
                                            />
                                        </View>
                                        <Divider
                                            style={[styles.divider, styles.hide, {borderBottomColor: colors.divider}]}/>
                                    </View>

                                </Card.Content>
                            </Card>

                            {<View>
                                <InputField
                                    label={'Add Attachment'}
                                    divider={true}
                                    onChange={(value: any) => {
                                        this.forceUpdate()
                                    }}
                                    inputtype={'attachment'}
                                    navigation={navigation}
                                />
                            </View>}


                            <Card style={[styles.card]}>
                                <Card.Content>

                                    {<InputField
                                        label={'Task Type'}
                                        divider={true}
                                        displaytype={'bottomlist'}
                                        inputtype={'dropdown'}
                                        list={this.tasktypes_options}
                                        editmode={!Boolean(this.initdata.ticketid)}
                                        search={false}
                                        listtype={'task_type'}
                                        selectedValue={this.initdata.tasktype}

                                        onChange={(value: any) => {
                                            this.initdata.tasktype = value
                                            this.getScreen(value)
                                        }}
                                    />}


                                    <View style={[styles.grid, styles.justifyContent]}>
                                        <View style={{width: '49%'}}>
                                            <InputField
                                                label={'Due Date'}
                                                displaytype={'bottomlist'}
                                                inputtype={'datepicker'}
                                                mode={'date'}
                                                selectedValue={this.initdata.ticketduedate}
                                                onChange={(value: any) => {
                                                    this.initdata.ticketduedate = value;
                                                }}
                                            />
                                        </View>
                                        <View style={{width: '49%'}}>
                                            <InputField
                                                label={"Due Time"}
                                                displaytype={'bottomlist'}
                                                inputtype={'datepicker'}
                                                mode={'time'}
                                                editmode={editmode}
                                                selectedValue={this.initdata.ticketduetime}
                                                onChange={(value: any) => {
                                                    this.initdata.ticketduetime = value;
                                                }}
                                            />
                                        </View>
                                    </View>


                                    {hasClient && <Client
                                        label={`Client`}
                                        navigation={this.props.navigation}
                                        editmode={!Boolean(this.initdata?.ticketid) || true}
                                        initdata={this.initdata}
                                        handleClient={this.handleClient}/>}

                                </Card.Content>

                            </Card>
                            {
                                ismoreField && this.checkMoreField() && <Card style={[styles.card]}>
                                    <Card.Content>

                                        {this.fieldstypes.map((value: any) => {

                                            return (
                                                <View>

                                                    {value === 'optional' && <View>
                                                        {hasMorefield && this.checkMoreField() &&
                                                            <TouchableOpacity onPress={() => {
                                                                morefields = !morefields;
                                                                updateComponent(this.refMorefields, 'display', morefields ? 'flex' : 'none')
                                                            }}
                                                                              style={[styles.grid, styles.mt_4, styles.middle, styles.justifyContent]}>
                                                                <Paragraph style={[styles.paragraph, styles.caption,]}>
                                                                    More Detail
                                                                </Paragraph>
                                                                <Paragraph>
                                                                    <ProIcon
                                                                        name={!morefields ? 'chevron-down' : 'chevron-up'}
                                                                        action_type={'text'} size={16}/>
                                                                </Paragraph>
                                                            </TouchableOpacity>
                                                        }
                                                    </View>}

                                                    {<View style={{display: value === 'required' ? 'flex' : 'none'}}
                                                           ref={this.refMorefields}>
                                                        {

                                                            this.formfields && Object.keys(this.formfields).map((key: any) => {

                                                                let tab: any = this.formfields[key];
                                                                let fields: any = tab.fieldsList;

                                                                if(!Boolean(fields)){
                                                                    return <></>
                                                                }

                                                                return <View>
                                                                    {/* {Object.keys(this.formfields).length > 1 &&  <Paragraph  style={[styles.paragraph, styles.head, styles.bold]}>{tab.tabName}</Paragraph>}*/}
                                                                    <View>
                                                                        {
                                                                            Object.keys(fields).map((field: any) => {
                                                                                const {
                                                                                    type,
                                                                                    name,
                                                                                    displayname,
                                                                                    required,
                                                                                    encrypted,
                                                                                    isValidateWithRegEx,
                                                                                    fieldtype,
                                                                                    validatewithregex,
                                                                                    key,
                                                                                    options
                                                                                } = fields[field];

                                                                                if (field === 'attachment') {
                                                                                    isAttachment = true;
                                                                                }

                                                                                const basic = ['notes', 'assignee', 'client', 'description', 'priority', 'attachment', 'reporter','tags','date'];

                                                                                if ((value === 'required' && required) || (value !== 'required' && !required)) {
                                                                                    return <View key={key}>
                                                                                        {
                                                                                            (type && !basic.includes(field)) ?
                                                                                                <View>
                                                                                                    {
                                                                                                        (type === "text" || type === "password" || type === "textarea") &&
                                                                                                        <InputField
                                                                                                            label={`${displayname} ${required ? '' : ''}`}
                                                                                                            defaultValue={this.initdata.data[key] ? this.initdata.data[key] + '' : ''}
                                                                                                            inputtype={'textbox'}
                                                                                                            secureTextEntry={type === "password"}
                                                                                                            onChange={(value: any) => {
                                                                                                                this.initdata.data[field] = value
                                                                                                            }}
                                                                                                        />
                                                                                                    }

                                                                                                    {
                                                                                                        (type === "dropdown") &&
                                                                                                        <InputField
                                                                                                            label={`${displayname} ${required ? '' : ''}`}
                                                                                                            selectedValue={this.initdata.data[field]}
                                                                                                            selectedLabel={this.initdata.data[field] || `Select ${displayname}`}
                                                                                                            displaytype={'pagelist'}
                                                                                                            inputtype={'dropdown'}
                                                                                                            listtype={'other'}
                                                                                                            list={options && options.map((t: any) => assignOption(t, t))}
                                                                                                            onChange={(value: any) => {
                                                                                                                this.initdata.data[field] = value
                                                                                                            }}
                                                                                                        />
                                                                                                    }






                                                                                                    {
                                                                                                        type === 'checkboxgroup' &&
                                                                                                        <View
                                                                                                            style={{marginLeft: -25}}><CheckBox
                                                                                                            value={Boolean(this.initdata.data[key])}
                                                                                                            label={`${displayname} ${required ? '' : ''}`}
                                                                                                            onChange={(value: any) => {
                                                                                                                this.initdata.data[field] = value
                                                                                                            }}/>

                                                                                                        </View>
                                                                                                    }


                                                                                                    {
                                                                                                        type === 'checkbox' &&
                                                                                                        <View>
                                                                                                            <InputField
                                                                                                                label={`${displayname} ${required ? '' : ''}`}
                                                                                                                selectedValue={this.initdata.data[field]}
                                                                                                                selectedLabel={this.initdata.data[field] || `Select ${displayname}`}
                                                                                                                displaytype={'pagelist'}
                                                                                                                inputtype={'dropdown'}
                                                                                                                listtype={'other'}
                                                                                                                multiselect={true}
                                                                                                                list={options && options.map((t: any) => assignOption(t, t))}
                                                                                                                onChange={(value: any) => {
                                                                                                                    this.initdata.data[field] = value
                                                                                                                }}
                                                                                                            />
                                                                                                        </View>
                                                                                                    }



                                                                                                    {
                                                                                                        type === 'radio' &&
                                                                                                        <InputField
                                                                                                            label={`${displayname} ${required ? '' : ''}`}
                                                                                                            selectedValue={this.initdata.data[field]}
                                                                                                            selectedLabel={this.initdata.data[field] || `Select ${displayname}`}
                                                                                                            displaytype={'bottomlist'}
                                                                                                            inputtype={'dropdown'}
                                                                                                            listtype={'other'}
                                                                                                            list={options && options.map((t: any) => assignOption(t, t))}
                                                                                                            onChange={(value: any) => {
                                                                                                                this.initdata.data[field] = value
                                                                                                            }}
                                                                                                        />

                                                                                                    }


                                                                                                    {
                                                                                                        (type === "date") &&

                                                                                                        <InputField
                                                                                                            label={`${displayname} ${required ? '' : ''}`}
                                                                                                            divider={false}
                                                                                                            displaytype={'bottomlist'}
                                                                                                            inputtype={'datepicker'}
                                                                                                            mode={'date'}
                                                                                                            dueterm={false}
                                                                                                            defaultValue={this.initdata.data[field]}
                                                                                                            onChange={(value: any) => {
                                                                                                                this.initdata.data[field] = value
                                                                                                            }}
                                                                                                        />

                                                                                                    }

                                                                                                    {
                                                                                                        (type === "tag" || type === "tags") &&
                                                                                                        <InputField
                                                                                                            label={`${displayname} ${required ? '' : ''}`}
                                                                                                            mode={'flat'}
                                                                                                            divider={false}
                                                                                                            defaultValue={this.initdata.data[field]}
                                                                                                            displaytype={'tags'}
                                                                                                            key={uuidv4()}
                                                                                                            inputtype={'tags'}
                                                                                                            onChange={(value: any) => {
                                                                                                                this.initdata.data[field] = value;
                                                                                                                this.forceUpdate()
                                                                                                            }}>
                                                                                                        </InputField>
                                                                                                    }


                                                                                                </View>
                                                                                                :
                                                                                                <View>

                                                                                                    {Boolean(field === 'priority') &&
                                                                                                        <InputField
                                                                                                            label={`Priority`}
                                                                                                            fullView={false}
                                                                                                            mode={'flat'}
                                                                                                            displaytype={'bottomlist'}
                                                                                                            inputtype={'dropdown'}
                                                                                                            listtype={'priority'}
                                                                                                            list={this.priority_options}
                                                                                                            selectedLabel={staticdata.taskpriority[this.initdata.data.priority]}
                                                                                                            selectedValue={this.initdata.data.priority}
                                                                                                            onChange={(value: any) => {
                                                                                                                this.initdata.data.priority = value
                                                                                                            }}>
                                                                                                        </InputField>
                                                                                                    }

                                                                                                    {Boolean(field === 'reporter') &&
                                                                                                        <>
                                                                                                            <InputField
                                                                                                                removeSpace={true}
                                                                                                                label={`Reporter`}
                                                                                                                mode={'flat'}
                                                                                                                displaytype={'bottomlist'}
                                                                                                                inputtype={'dropdown'}
                                                                                                                listtype={'staff'}
                                                                                                                key={uuidv4()}
                                                                                                                selectedLabel={staff[this.initdata.data.reporter]?.username || 'Unassigned'}
                                                                                                                selectedValue={this.initdata.data.reporter || '0'}
                                                                                                                list={this.staff_options}
                                                                                                                onChange={(value: any) => {
                                                                                                                    this.initdata.data.reporter = value;
                                                                                                                    updateComponent(this.assigneetome2, 'display', value !== '0' ? 'none' : 'flex')
                                                                                                                }}>
                                                                                                            </InputField>
                                                                                                            <View
                                                                                                                style={{display: 'flex'}}
                                                                                                                ref={this.assigneetome2}>
                                                                                                                {this.assigneeToMe(true, this.assigneetome2)}
                                                                                                            </View>
                                                                                                        </>
                                                                                                    }

                                                                                                    {(Boolean(field === 'tag') || Boolean(field === 'tags')) &&
                                                                                                        <>
                                                                                                            <InputField
                                                                                                                label={`${displayname} ${required ? '' : ''}`}
                                                                                                                mode={'flat'}
                                                                                                                divider={false}
                                                                                                                defaultValue={this.initdata.data[field]}
                                                                                                                displaytype={'tags'}
                                                                                                                key={uuidv4()}
                                                                                                                inputtype={'tags'}
                                                                                                                onChange={(value: any) => {
                                                                                                                    this.initdata.data[field] = value;
                                                                                                                    this.forceUpdate()
                                                                                                                }}>
                                                                                                            </InputField>
                                                                                                        </>
                                                                                                    }


                                                                                                </View>

                                                                                        }
                                                                                    </View>
                                                                                } else {
                                                                                    return <View></View>
                                                                                }

                                                                            })
                                                                        }
                                                                    </View>
                                                                </View>

                                                            })
                                                        }
                                                    </View>}
                                                </View>
                                            )

                                        })}

                                    </Card.Content>
                                </Card>
                            }


                            {!this.initdata.ticketrelatedid && editmode && <View style={[styles.mb_4]}>
                                {


                                    <View>
                                        <View>

                                            {Boolean(this.initdata?.ticketid) && !this.initdata.ticketrelatedid &&
                                                <Card style={[styles.card, {marginBottom: 0}]}>
                                                    <Card.Content>
                                                        <View
                                                            style={[styles.grid, styles.middle, styles.justifyContent]}>
                                                            <Paragraph style={[styles.paragraph, styles.caption]}>
                                                                Sub Task
                                                            </Paragraph>
                                                            <Paragraph>
                                                                <TouchableOpacity onPress={() => {
                                                                    navigation.push('Subtask',
                                                                        {
                                                                            screen: 'Subtask',
                                                                            priority_options: this.priority_options,
                                                                            staff_options: this.staff_options,
                                                                            ticketstatus_options: this.ticketstatus_options,
                                                                            addSubTask: this.addSubTask,
                                                                            subtask: false,
                                                                            staffid: this.initdata.data.assignee || this.initdata.assignee,
                                                                        })
                                                                }}>
                                                                    <ProIcon name={'plus'} align={'right'} size={18}/>
                                                                </TouchableOpacity>
                                                            </Paragraph>
                                                        </View>

                                                        <View style={[styles.grid]}>
                                                            {
                                                                status.map((st: any) => {
                                                                    return <View style={{
                                                                        backgroundColor: st.color,
                                                                        width: `${100 / status.length}%`,
                                                                        height: 1
                                                                    }}></View>
                                                                })
                                                            }
                                                        </View>

                                                    </Card.Content>
                                                </Card>}


                                            {Boolean(this.initdata.subtask && this.initdata.subtask.length) &&
                                                <View ref={this.refSubtasks} style={[{
                                                    marginLeft: 15,
                                                    borderLeftWidth: 2,
                                                    borderLeftColor: "#ccc",
                                                    borderStyle: "solid",
                                                    paddingTop: 15
                                                }]}>


                                                    <View>
                                                        {
                                                            this.initdata.subtask.map((subtask: any, key: any) => {

                                                                let statustext = this.ticketstatuslist[subtask.ticketstatus]?.ticketstatusname;
                                                                let statuscolor = this.ticketstatuslist[subtask.ticketstatus]?.ticketstatuscolor;

                                                                return (
                                                                    <View style={[{position: "relative"}]}>

                                                                        <View style={[{
                                                                            position: "absolute",
                                                                            backgroundColor: "#ccc",
                                                                            height: 2,
                                                                            top: '45%',
                                                                            left: 0,
                                                                            width: 15,

                                                                        }]}/>


                                                                        {this.initdata?.subtask?.length === (key + 1) &&
                                                                            <View style={[{
                                                                                position: "absolute",
                                                                                borderLeftWidth: 4,
                                                                                borderLeftColor: "#f4f4f4",
                                                                                borderStyle: "solid",
                                                                                left: -3,
                                                                                width: 15,
                                                                                top: '45%',
                                                                                marginTop: 2,
                                                                                bottom: 0
                                                                            }]}/>}

                                                                        <View style={[{
                                                                            paddingLeft: 15,
                                                                            paddingRight: 5
                                                                        }]}>
                                                                            <TouchableOpacity

                                                                                onPress={() => {

                                                                                    if (Boolean(subtask.ticketdisplayid !== '0')) {
                                                                                        navigation.push('AddEditTask', {
                                                                                            screen: 'AddEditTask',
                                                                                            ticketdisplayid: subtask.ticketdisplayid,
                                                                                            ticketrelatedid: this.initdata.ticketrelatedid,
                                                                                            getTaskDetails: this.getTaskDetails
                                                                                        });
                                                                                    } else {
                                                                                        navigation.push('Subtask',
                                                                                            {
                                                                                                screen: 'Subtask',
                                                                                                priority_options: this.priority_options,
                                                                                                staff_options: this.staff_options,
                                                                                                ticketstatus_options: this.ticketstatus_options,
                                                                                                addSubTask: this.addSubTask,
                                                                                                subtask: clone(subtask),
                                                                                                key: key + '',

                                                                                            })
                                                                                    }
                                                                                }}

                                                                                style={{marginBottom: 5}}>

                                                                                <Card style={[styles.card]}>
                                                                                    <Card.Content>
                                                                                        <View>
                                                                                            <Paragraph
                                                                                                style={[theme.paragraph, theme.text_sm, theme.ellipse]}>{subtask.notes} </Paragraph>
                                                                                        </View>

                                                                                        <View>
                                                                                            <View>


                                                                                                <View>
                                                                                                    <View
                                                                                                        style={[theme.grid, theme.justifyContent, theme.bottom, {
                                                                                                            marginBottom: 0,
                                                                                                            width: '100%'
                                                                                                        }]}>


                                                                                                        <View
                                                                                                            style={[theme.text_xs, {opacity: 0.6}]}>
                                                                                                            <Paragraph>{subtask.ticketnumber ? subtask.ticketnumber : 'New Task'}</Paragraph>
                                                                                                            {<Paragraph
                                                                                                                style={[styles.paragraph, styles.muted, styles.text_xs]}>Assignee
                                                                                                                : {staff[subtask?.assignee]?.username || 'Unassign'}</Paragraph>}
                                                                                                        </View>

                                                                                                        <View
                                                                                                            style={[theme.grid, theme.middle]}>

                                                                                                            <Paragraph
                                                                                                                style={[{color: `${theme[subtask.priority]?.color}`}]}>
                                                                                                                <MaterialCommunityIcons
                                                                                                                    color={theme[subtask.priority]?.color}
                                                                                                                    name={`${subtask.priority === 'highest' ? 'chevrons-up' : subtask.priority === 'high' ? 'chevron-up' : subtask.priority === 'low' ? 'chevron-down' : subtask.priority === 'lowest' ? 'chevrons-down' : 'equal'}`}
                                                                                                                    size={15}/>
                                                                                                            </Paragraph>

                                                                                                            {subtask.age &&
                                                                                                                <View>
                                                                                                                    <Paragraph
                                                                                                                        style={[styles.paragraph, styles.text_xxs, {opacity: 0.5}]}>{subtask.age} ago</Paragraph>
                                                                                                                </View>}

                                                                                                            <View
                                                                                                                style={[styles.badge, styles.m_0, styles.p_0, {
                                                                                                                    backgroundColor: statuscolor,
                                                                                                                    width: 'auto',
                                                                                                                    marginHorizontal: 5
                                                                                                                }]}>
                                                                                                                <Paragraph
                                                                                                                    style={[styles.paragraph, styles.text_xs, {color: 'white'}]}>  {statustext}  </Paragraph>
                                                                                                            </View>

                                                                                                            <Avatar
                                                                                                                label={subtask.staff}
                                                                                                                value={subtask.staff}
                                                                                                                size={30}/>

                                                                                                        </View>


                                                                                                    </View>
                                                                                                </View>

                                                                                            </View>


                                                                                        </View>
                                                                                    </Card.Content>
                                                                                </Card>

                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View>
                                                                )
                                                            })
                                                        }


                                                    </View>
                                                </View>}

                                        </View>
                                    </View>
                                }
                            </View>}

                            {Boolean(this.initdata.ticketid) && <View>

                                {this.initdata.conversation && <View>

                                    <Card style={[styles.card]}>
                                        <Card.Content>

                                            <Paragraph style={[styles.paragraph, styles.caption]}>Comments</Paragraph>

                                            {
                                                Object.keys(this.initdata.conversation).map((key: any) => {
                                                    let message = this.initdata.conversation[key];

                                                    return (
                                                        <View style={[styles.row, styles.py_5, {marginBottom: 0}]}>

                                                            <View style={[styles.cell]}>
                                                                <Avatar label={message.fromstaffname}
                                                                        value={message.fromstaff}/>
                                                            </View>
                                                            <View style={[styles.cell, styles.w_auto, {marginLeft: 5}]}>
                                                                <Paragraph style={[styles.paragraph]}>
                                                                    <Paragraph
                                                                        style={[styles.bold]}>{message.fromstaffname}</Paragraph>
                                                                    <Paragraph
                                                                        style={[styles.text_xs, {opacity: 0.4}]}> {message.createdago} {message.createdago !== 'just now' ? 'ago' : ''}</Paragraph>
                                                                </Paragraph>
                                                                {adminid === message.fromstaff ? <Description
                                                                    label={`Comment`}
                                                                    title={false}
                                                                    editmode={true}
                                                                    hideDivider={true}
                                                                    html={base64Decode(message.message)}
                                                                    onChange={(value: any) => {
                                                                        message.message = value;
                                                                        this.comment = {
                                                                            ...this.comment, ...message,
                                                                            convid: key
                                                                        }
                                                                        this.saveConversation(this.comment.message)
                                                                    }}
                                                                /> : <HTML baseStyle={{color: colors.inputLabel}}
                                                                           source={{html: base64Decode(message.message) || ''}}/>}
                                                            </View>
                                                            <View style={[styles.cell, {paddingRight: 0}]}>
                                                                {adminid === message.fromstaff &&
                                                                    <DeleteButton
                                                                        title={'Delete this comment?'}
                                                                        render={() => <ProIcon name={'trash'}
                                                                                               action_type={'text'}
                                                                                               size={14}
                                                                                               color={styles.red.color}/>}
                                                                        message={''}
                                                                        onPress={(index: any) => {
                                                                            if (index === 0) {
                                                                                this.deleteComment(key)
                                                                            }
                                                                        }}
                                                                    />}
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }

                                        </Card.Content>

                                    </Card>
                                </View>}

                            </View>}

                            {Boolean(this.initdata.ticketid) && !Boolean(this.initdata.jobdisplayid) && editmode &&
                                <View>
                                    <View>

                                        <DeleteButton
                                            title={'Delete this task?'}
                                            message={'Deleting permanently erases the task, including all subtasks and attachments'}
                                            onPress={(index: any) => {
                                                if (index === 0) {
                                                    this.deleteTask()
                                                }
                                            }}
                                        />

                                    </View>
                                </View>}


                        </View>

                    </View>


                </ScrollView>

                <KeyboardAccessoryView alwaysVisible={true} hideBorder={true} avoidKeyboard={true}
                                       androidAdjustResize={true} heightProperty={"minHeight"}>

                    <View>
                        {Boolean(this.initdata.ticketid) && <Surface>

                            <View style={[styles.grid, styles.bottom, styles.px_5, {
                                paddingVertical: 10,
                                paddingLeft: 10
                            }]}>

                                <View style={[styles.w_auto]}>

                                    <View>
                                        <TextInputReact
                                            onChangeText={(value: any) => {
                                                this.replyText = value
                                            }}
                                            onFocus={() => {
                                                this.scrollView.scrollToEnd({animated: true})
                                            }}
                                            defaultValue={this.replyText}
                                            placeholder={'Add a comment'}
                                            key={uuidv4()}
                                            multiline={true}
                                            placeholderTextColor={colors.inputLabel}
                                            style={[styles.py_5, {
                                                paddingLeft: 5,
                                                color: colors.inputbox,
                                                maxHeight: 200,/*backgroundColor:colors.screenbg,borderRadius:30*/
                                            }]}
                                            {...this.props}
                                        />
                                    </View>
                                </View>

                                <View>
                                    <TouchableOpacity
                                        onPress={() => Boolean(this.replyText) && this.saveConversation(this.replyText)}>
                                        <View style={[{
                                            backgroundColor: colors.secondary,
                                            borderRadius: 50,
                                            height: 40,
                                            width: 40,
                                            paddingRight: 5
                                        }, styles.center]}>
                                            <ProIcon name="paper-plane" size={16} color={'white'}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </Surface>
                        }

                    </View>

                </KeyboardAccessoryView>

            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({
    setAlert: (alert: any) => dispatch(setAlert(alert)),
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setModal: (modal: any) => dispatch(setModal(modal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddEditTask));




