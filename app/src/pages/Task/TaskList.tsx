import React, {useEffect} from 'react';
import {ScrollView, View} from 'react-native';

// @ts-ignore
import {AppBar, Container, Menu, ProIcon} from "../../components";
import {setDialog, setModal} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {Searchbar, withTheme} from "react-native-paper";
import {styles, styles as theme} from "../../theme";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {log} from "../../lib/functions";


import {defaultvalues} from "../../lib/setting";
import Carousel from "./Carousel";
import ListLoader from "../../components/ContentLoader/ListLoader";
import {v4 as uuidv4} from "uuid";
import InputField from "../../components/InputField";
import Search from "../../components/SearchBox";


let tickettype: any = defaultvalues.tickettype;


class TaskList extends React.Component<any> {

    tasktypes_options: any;
    staff_options: any;
    tasktypes: any
    staff: any;

    ticketstatuslist: any;
    kanabanstatuslist: any

    filterRef: any;
    isFilter: any = false;

    initcolumns: any = [];

    constructor(props: any) {
        super(props);

        this.state = {
            showfilter: true
        }


        const {settings: {tickets, staff}}: any = props;

        this.ticketstatuslist = {};
        this.tasktypes = {};

        if (Boolean(tickets)) {
            this.ticketstatuslist = tickets[tickettype]?.ticketstatuslist;
            this.kanabanstatuslist = tickets[tickettype]?.kanbanstatuslist;
            this.tasktypes = tickets[tickettype].task_types;
        }


        this.tasktypes_options = [{label: 'Any', value: 'all'}]
        this.tasktypes && Object.keys(this.tasktypes).map((key: any) => {
            let type = this.tasktypes[key];
            this.tasktypes_options.push({label: type.task_type_name, value: key})
        });

        this.staff_options = [{label: 'Any', value: 'all'}, {label: 'Unassigned', value: 'unassigned'}]

        staff && Object.keys(staff).filter((key:any)=>{
            return !staff[key].support
        }).map((key: any) => {
            let staf: any = staff[key];
            this.staff_options.push({label: staf.username, value: key})
        });

        Object.keys(this.ticketstatuslist).map((keys: any, index: any) => {
            let status = this.ticketstatuslist[keys];

            let columnname: any = status.ticketstatusname;

            Object.keys(this.kanabanstatuslist).map((key: any) => {

                const {taskstatus, kanbandisplay}: any = this.kanabanstatuslist[key];
                const cname = this.kanabanstatuslist[key].columnname;
                const ccolor = this.kanabanstatuslist[key].columncolur;


                if (kanbandisplay && taskstatus === keys) {
                    this.initcolumns.push({
                        id: status.key,
                        name: cname,
                        color: ccolor,
                        rows: []
                    })
                    columnname = status.columnname;
                }
            })
        });

        this.state = {
            filter: {kanban: true, tickettype: tickettype, display: 'all', search: '', tasktype: '', assignee: ''},
            data: this.initcolumns,
            isLoading: true
        }

        this.filterRef = React.createRef();

    }

    componentDidMount() {
        this.getTask(false);
        this.props.taskRef(this)
    }

    componentWillUnmount() {
        this.props.taskRef()
    }


    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        //this.getTask(false)
    }

    getTask = (loader = true) => {

        const {filter}: any = this.state;

        requestApi({
            method: methods.get,
            action: actions.ticket,
            queryString: {...filter},
            loader: loader,
            loadertype: 'list'
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                let tasklist: any = result.data?.result || {};

                ////// SET ID FOR KANBAN
                let data: any = []

                Boolean(Object.keys(tasklist).length > 0) && Object.keys(tasklist).map((key: any, index: any) => {
                    let list = tasklist[key];
                    list.map((value: any, key: any) => {
                        list[key] = {...value, id: value.ticketid, name: value.notes}
                    })
                })

                //////// CREATE JSON ARRAY FOR KANBAN
                this.initcolumns.map((item: any, index: any) => {
                    data.push({
                        id: item.id,
                        name: item.name,
                        color: item.color,
                        total: result.data.extra[item.id]?.total || 0,
                        skip: 0,
                        rows: Boolean(tasklist[item.id]) ? tasklist[item.id] : []
                    })
                });

                this.setState({data: data, isLoading: true})
            }

        });
    }


    handleSearch = (search: any) => {
        const {filter}: any = this.state;
        if (search !== null) {
            this.setState({filter: {...filter, search: search}}, () => this.getTask())
        }
    }


    menuItemClick = (item: any) => {
        const {filter}: any = this.state;
        this.setState({filter: {...filter, tasktype: item.value}}, () => this.getTask())
    }
    menuItemClick2 = (item: any) => {
        const {filter}: any = this.state;
        this.setState({filter: {...filter, assignee: item.value}}, () => this.getTask())
    }
    menuItemClick3 = (item: any) => {
        const {filter}: any = this.state;
        if (item.value === 'recentlyupdated') {
            this.setState({filter: {...filter, recently: 1}}, () => this.getTask())
        } else {
            this.setState({filter: {...filter, display: item.value, recently: 0}}, () => this.getTask())
        }
    }

    render() {

        const {settings, navigation, filterRef, settings: {staff}}: any = this.props;
        const {data, filter, isLoading, showfilter}: any = this.state;

        const {colors}: any = this.props.theme;

        if (!isLoading) {
            return <ListLoader/>
        }


        return (
            <>

                {<View  ref={filterRef}>
                    <View>
                        <Search autoFocus={false}  placeholder={`Search...`} handleSearch = {this.handleSearch}/>
                    </View>

                    <View style={[theme.px_5]}>

                        <ScrollView style={[styles.noWrap]} horizontal={true} contentContainerStyle={{minWidth:'100%'}}>
                            <View style={[theme.grid, theme.middle, theme.justifyContent,theme.noWrap,theme.w_100]}>
                            {this.tasktypes_options && <View style={[styles.mr_2,styles.w_auto]}>
                                <InputField
                                    label={'Type'}
                                    divider={true}
                                    displaytype={'bottomlist'}
                                    inputtype={'bottommenu'}
                                    list={this.tasktypes_options}
                                    search={false}
                                    key={uuidv4()}
                                    listtype={'task_type'}
                                    selectedValue={filter.tasktype || 'all'}
                                    onChange={(value: any) => {
                                        this.menuItemClick({value: value === "all" ? "" : value})
                                    }}
                                />
                            </View>}
                            {staff && <View  style={[styles.mr_2,styles.w_auto]}>
                                <InputField
                                    label={'Assignee'}
                                    divider={true}
                                    displaytype={'bottomlist'}
                                    inputtype={'bottommenu'}
                                    list={this.staff_options}
                                    search={false}
                                    key={uuidv4()}
                                    listtype={'staff'}
                                    selectedValue={filter.assignee || 'all'}
                                    selectedLabel={"Assignee"}
                                    onChange={(value: any) => {
                                        this.menuItemClick2({value: value === "all" ? "" : value})
                                    }}
                                />
                                {/*<Menu*/}
                                {/*    menulist={this.staff_options}*/}
                                {/*    onPress={(menu: any) => this.menuItemClick2(menu)}*/}
                                {/*    width={'auto'}>*/}
                                {/*    <View style={[theme.grid,theme.middle]}>*/}
                                {/*        <Text style={{color: colors.inputLabel}}>Assignee :*/}
                                {/*        {staff[filter.assignee]?.username || 'All'} </Text>*/}
                                {/*        <ProIcon name={'chevron-down'}  action_type={'text'} size={10}/>*/}
                                {/*    </View>*/}
                                {/*</Menu>*/}
                            </View>}
                            {<View style={[,styles.w_auto]}>
                                <InputField
                                    label={'Category'}
                                    divider={true}
                                    displaytype={'bottomlist'}
                                    inputtype={'bottommenu'}
                                    list={[{label: 'All Task', value: 'all'}, {
                                        label: 'Master Task',
                                        value: 'onlymaster'
                                    }, {label: 'Sub Task', value: 'onlysub'}, {
                                        label: 'Recently Updated',
                                        value: 'recentlyupdated'
                                    }]}
                                    search={false}
                                    key={uuidv4()}
                                    listtype={'other'}
                                    selectedValue={filter.display || 'all'}
                                    selectedLabel={"Select Type"}
                                    onChange={(value: any) => {
                                        this.menuItemClick3({value: value === "all" ? "" : value})
                                    }}
                                />

                            </View>}
                        </View>
                        </ScrollView>

                    </View>


                </View>}


                <Carousel
                    data={data}
                    tasktypes={this.tasktypes}
                    getTask={this.getTask}
                    navigation={navigation}
                />


            </>
        );
    }
}



const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
    companydetails: state.appApiData.companydetails,
    notify: state.appApiData.notify,
});
const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setModal: (dialog: any) => dispatch(setModal(dialog)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TaskList));

