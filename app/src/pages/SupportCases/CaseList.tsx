import React, {Component, memo} from "react";
import {Button, Container} from "../../components";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {Paragraph, withTheme} from "react-native-paper";
import {loginUrl} from "../../lib/setting";
import {isEmpty, log} from "../../lib/functions";
import {connect} from "react-redux";
import FlatListItems from "../../components/FlatList/FlatListItems";
import SupportItem from "./SupportItem";
import LeftIcon from "./LeftIcon";
import withFocused from "../../components/withFocused";
import {FlatList, Image, RefreshControl, View} from "react-native";
import {styles} from "../../theme";
import ListLoader from "../../components/ContentLoader/ListLoader";
import {CommonActions} from "@react-navigation/native";
import NoResultFound from "../../components/NoResultFound";

class CaseList extends Component<any, any> {


    constructor(props: any) {
        super(props);
        const {route} = props;
        this.state = {
            data: [],
            isLoading: true,
            status: route?.params?.status
        }
    }


    componentDidMount() {
        this.loadData();
    }

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {
        if (Boolean(nextProps.isFocused)) {
            this.loadData(false);
        }
    }


    loadData = (loader: boolean = true) => {

        const {route} = this.props;
        requestApi({
            method: methods.get,
            action: actions.support,
            other: {url: loginUrl},
            loader,
            queryString: {status: route?.params?.status},
            showlog: true,
            successalert: false
        }).then((response: any) => {
            if (response.status === SUCCESS && !isEmpty(response.data)) {
                this.setState({
                    data: response.data.map((item: any) => {
                        let description = `#${item?.ticket_id}`;
                        if (Boolean(item?.status)) {
                            description += ` | ${item?.status}`;
                        }
                        if (Boolean(item?.created)) {
                            description += ` | ${item?.created}`;
                        }
                        let icon, color = "D45743FF";
                        if (item.priority.toString().toLowerCase() === "low") {
                            color = "60ADE3FF";
                        } else if (item.priority.toString().toLowerCase() === "medium") {
                            color = "76B74EFF";
                        }

                        return {
                            item,
                            title: item?.Subject,
                            description,
                            icon: "bookmark",
                            color
                        };
                    })
                })
            }
        })
    }

    _navigate = (params?: any) => {
        const {navigation} = this.props;
        navigation.navigate("ViewTickets", {...params, title: `#${params?.item?.ticket_id}`})
    }

    render() {

        const {navigation}: any = this.props;
        const {data, isLoading, status} = this.state;

        if (!isLoading) {
            return <ListLoader/>
        }

        return (
            <Container surface={true}>

                <FlatList
                    data={data || []}
                    renderItem={(props: any) => <SupportItem
                        {...props}
                        onPress={() => this._navigate(props.item)}
                        left={(leftProps: any) => <LeftIcon {...leftProps} {...props}/>}
                    />}
                    scrollIndicatorInsets={{right: 1}}
                    ListEmptyComponent={<View style={[styles.center, styles.middle, styles.noRecordFound]}>
                        <NoResultFound/>
                        <Paragraph
                            style={[styles.paragraph, styles.mb_5]}>No {status === "closed" ? "resolved" : status} case
                            found</Paragraph>

                        {status !== 'closed' && <Button
                            secondbutton={true}

                            onPress={() => {
                                navigation.navigate("SupportRequest")
                            }}>Create New</Button>}

                    </View>}
                    initialNumToRender={10}

                    onEndReachedThreshold={0.5}
                    progressViewOffset={100}

                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.loadData}
                        />
                    }

                />


            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withFocused(memo(CaseList))));

