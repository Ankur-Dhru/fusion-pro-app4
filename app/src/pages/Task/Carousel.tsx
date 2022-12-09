import * as React from 'react';
import {Card, Paragraph, withTheme} from 'react-native-paper';
import {styles as theme} from "../../theme";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {Dimensions, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {findObject, isAfterDate, log} from "../../lib/functions";
import {ProIcon} from "../../components";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {defaultvalues} from "../../lib/setting";
import Avatar from "../../components/Avatar";
import {TASK_ICONS} from "../../lib/static";

const horizontalMargin = 20;
const slideWidth = 280;

const sliderWidth = Dimensions.get('window').width;
const itemWidth = slideWidth + horizontalMargin * 2;
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');


const COLUMN_WIDTH = Dimensions.get('window').width * 0.6;

class Index extends React.Component<any> {

    _carousel: any;
    onEndReachedCalledDuringMomentum: any;

    initdata: any

    constructor(props: any) {
        super(props);
        this.state = {
            activeSlide: 0,
            data: props.data
        }
        this._carousel = React.createRef()
    }

    addEditTask = (ticketdisplayid?: any, ticketrelatedid?: any) => {

        const {navigation, getTask}: any = this.props;
        navigation.push('AddEditTask', {
            screen: 'AddEditTask',
            ticketdisplayid: ticketdisplayid,
            ticketrelatedid: ticketrelatedid,
            getTask: getTask,
        });
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        this.setState({data: nextProps.data})
    }

    onEndReached = (status: any) => {

        const {data}: any = this.state

        let skip: any;

        data.map((value: any) => {
            if (value.id === status) {
                skip = value.skip + 20;
            }
        });

        requestApi({
            method: methods.get,
            action: actions.ticket,
            queryString: {
                kanban: 0,
                tickettype: defaultvalues.tickettype,
                status: status,
                withstatus: true,
                skip: skip
            },
            loader: false,

        }).then((result: any) => {
            if (result.status === SUCCESS) {
                let tasklist: any = result.data?.result || {};

                if (Boolean(tasklist)) {
                    let findobj = findObject(data, 'id', status)
                    let rows = findobj[0].rows;
                    rows = rows.concat(tasklist[status])

                    data.map((value: any) => {
                        if (value.id === status) {
                            value.rows = rows;
                            value.skip = skip;
                        }
                    });
                    this.setState({data: data})
                }
            }

        });

    }

    renderItem = ({item}: any) => {

        const {tasktypes}: any = this.props;
        const icon = TASK_ICONS[tasktypes[item?.tasktype]?.type_key];

        return (
            <TouchableOpacity onPress={() => this.addEditTask(item?.ticketdisplayid, item?.ticketrelatedid)}>
                {item && <Card style={[theme.card]}>
                    <Card.Content style={[{paddingVertical:10,paddingHorizontal:10}]}>
                        <View>
                            <View>
                                <View>
                                    <Paragraph style={[theme.paragraph, theme.text_sm, theme.ellipse]}>{item.notes}</Paragraph>
                                </View>
                                <View>
                                    <View>
                                        <View>
                                            <View style={[theme.grid, theme.justifyContent, {
                                                marginBottom: 0,
                                                width: '100%'
                                            }]}>
                                                <Paragraph
                                                    style={[theme.grid, theme.text_xs, theme.justifyContent, theme.middle]}>
                                                    {Boolean(icon) && <ProIcon name={icon} size={12}  action_type={'text'}/>}
                                                    <Text> {item.ticketnumber}</Text>
                                                </Paragraph>

                                                <View style={[theme.grid, theme.middle]}>
                                                    <Paragraph
                                                        style={[theme.paragraph, theme.text_xs, {opacity: 0.5}]}>{item.createdago} ago</Paragraph>

                                                    <View style={{marginHorizontal: 5}}>
                                                        <ProIcon color={theme[item.priority]?.color}
                                                                 action_type={'text'}
                                                                 name={`${item.priority === 'highest' ? 'chevrons-up' : item.priority === 'high' ? 'chevron-up' : item.priority === 'low' ? 'chevron-down' : item.priority === 'lowest' ? 'chevrons-down' : 'equals'}`}
                                                                 size={10}/>
                                                    </View>
                                                    {
                                                        Boolean(item?.staff) && <Avatar label={item?.staff} value={item?.staff} size={28}/>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>}
            </TouchableOpacity>
        );
    };


    renderColumn = ({item, layoutProps}: any) => {

        const {getTask}:any = this.props

        return (
            <View style={styles.column} {...layoutProps}>

                <View style={[styles.columnHeader, theme.badge, {backgroundColor: item.color, borderRadius: 3}]}>
                    <Paragraph  style={[styles.columnName, theme.px_5, {color: 'white'}]}>{item.name} ({item.total})</Paragraph>
                </View>


                <FlatList
                    data={item.rows}
                    scrollIndicatorInsets={{right: 1}}
                    renderItem={this.renderItem}
                    keyExtractor={(item: any) => item?.ticketid}
                    initialNumToRender={10}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => {getTask(false)}}
                        />
                    }
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {
                        this.onEndReachedCalledDuringMomentum = false;
                    }}
                    onEndReached={() => {
                        if (!this.onEndReachedCalledDuringMomentum && ((item.skip + 20) < item.total)) {
                            this.onEndReached(item.id)    // LOAD MORE DATA
                            this.onEndReachedCalledDuringMomentum = true;
                        }
                    }}
                />

            </View>
        );
    };


    render() {

        const {activeSlide, data}: any = this.state;
        const {theme:{colors}}:any = this.props

        return (
            <>
                <Carousel
                    ref={(c) => {
                        this._carousel = c;
                    }}
                    layout={'default'}
                    data={data}
                    activeSlideAlignment={'start'}
                    inactiveSlideScale={1}
                    renderItem={this.renderColumn}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}

                    /*lockScrollTimeoutDuration={100}
                    lockScrollWhileSnapping={false}*/
                    /*onSnapToItem={(index) => this.setState({activeSlide: index})}*/
                />

                <View style={[{position: "absolute", bottom: -20, left: 0, right: 0}]}>
                    <Pagination
                        dotsLength={data.length}
                        activeDotIndex={activeSlide}
                        containerStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
                        dotStyle={{
                            width: 5,
                            height: 5,
                            borderRadius: 5,
                            marginHorizontal: 0,
                            marginVertical: 0,
                            backgroundColor: colors.inputbox
                        }}
                        inactiveDotStyle={{
                            // Define styles for inactive dots here
                        }}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.6}
                    />
                </View>


            </>
        );
    }
}

export default withTheme(Index)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    hederName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    board: {},
    column: {
        borderRightWidth: 0.2,
        borderRightColor: '#8888882b',
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginLeft: 12,
        backgroundColor: theme.bg_global.backgroundColor,
        borderRadius: 5,
        marginTop: 5,
        height: '95%'
    },
    columnHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    columnName: {},
    addColumn: {
        marginRight: 12,
        padding: 12,
        minWidth: COLUMN_WIDTH,
    },
    card: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#F6F7FB',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
        paddingVertical: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addCard: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(233, 233, 233)',
        borderRadius: 4,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#F5F6F8',
    },

});
