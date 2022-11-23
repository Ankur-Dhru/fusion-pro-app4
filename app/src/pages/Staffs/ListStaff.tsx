import React, {Component} from 'react';
import {FlatList, Platform, RefreshControl, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Divider, List, Paragraph, Text, Title, withTheme} from "react-native-paper";
import {filterArray, objToArray} from "../../lib/functions";

import Search from "../../components/SearchBox";


import {setLoader} from "../../lib/Store/actions/components";


import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {backButton, chevronRight} from "../../lib/setting";
import ListLoader from "../../components/ContentLoader/ListLoader";
import NoResultFound from "../../components/NoResultFound";


class ProfileView extends Component<any> {

    title: any;
    initdata: any = [];
    stafflist: any = [];
    sheetRef: any;

    constructor(props: any) {
        super(props);
        this.state = {searchbar: false, searchtext: false, filters: [], isLoading: false};
        this.sheetRef = React.createRef()
    }


    componentDidMount() {
        this.getStaffs(false);
    }


    getStaffs = (loader = true) => {
        requestApi({
            method: methods.get,
            action: actions.staff,
            alert: false,
            loader: loader,
            showlog: true,
            loadertype: 'list'
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.stafflist = objToArray(result.data)
                this.setState({
                    searchtext: '',
                    filters: this.stafflist,
                    isLoading: true
                })
            }
        });
    }


    handleSearch = (search: any) => {
        this.setState({
            searchtext: search,
            filters: search ? filterArray(this.stafflist, ['username', 'firstname', 'lastname'], search) : this.stafflist
        })
    }


    staffSelection = (staff: any) => {
        const {navigation}: any = this.props;
        navigation.navigate('AddEditStaff', {
            screen: 'AddEditStaff',
            staff: {...staff},
            getStaffs: this.getStaffs
        });
    }

    AddNew = () => {
        const {navigation}: any = this.props;
        navigation.navigate('AddEditStaff', {
            screen: 'AddEditStaff',
        });
    }

    sentInvitation = (body: any) => {
        requestApi({
            method: methods.post,
            action: actions.invitation,
            body,
        }).then((result) => {
            if (result.status === SUCCESS) {

            }
        });
    }

    renderClients = ({item}: any) => {
        const {colors}: any = this.props.theme;
        return (
            <TouchableOpacity onPress={() => this.staffSelection(item)} style={[{paddingHorizontal: 5}]}>
                <List.Item
                    title={item.firstname + ' ' + item.lastname}
                    description={item.email}
                    right={props => <>
                        <View style={[styles.grid, styles.bottom]}>
                            {item.status === "Invite" && <View style={[{paddingRight: 0}]}>
                                {<TouchableOpacity onPress={() => {
                                    this.sentInvitation({
                                        "email": item.email,
                                        "first_name": item.firstname,
                                        "last_name": item.lastname
                                    })
                                }}>
                                    <View style={[styles.grid, styles.middle]}>
                                        <ProIcon color={styles.green.color} size={14} name={'paper-plane'}/>
                                        <Paragraph style={[styles.paragraph, styles.text_sm, styles.green]}>
                                            Invite
                                        </Paragraph>
                                    </View>
                                </TouchableOpacity>}
                            </View>}
                            <List.Icon {...props} icon={() => <Text>  {chevronRight} </Text>}/>
                        </View>

                    </>}
                />
                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </TouchableOpacity>
        );
    };


    render() {

        const {filters, isLoading}: any = this.state;

        const {navigation, theme: {colors}}: any = this.props;

        navigation.setOptions({
            headerTitle: 'Staffs',
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) =>
                <Title
                    onPress={() => this.AddNew()}>
                    <ProIcon name="plus"/>
                </Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{`Staffs`}</Title>,
            })
        }

        if (!isLoading) {
            return <ListLoader/>
        }

        return (
            <Container surface={true}>

                <FlatList
                    data={filters}
                    renderItem={this.renderClients}
                    scrollIndicatorInsets={{right: 1}}
                    keyExtractor={item => item.staffid}
                    initialNumToRender={10}
                    ListHeaderComponent={<Search autoFocus={false} placeholder={`Search...`}
                                                 handleSearch={this.handleSearch}/>}
                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
                    invertStickyHeaders={false}
                    progressViewOffset={100}
                    ListEmptyComponent={<View style={[styles.middle]}>
                        <NoResultFound/>
                        <Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph>
                    </View>}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => this.getStaffs(false)}
                        />
                    }

                />


            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({
    setLoader: (loader: any) => dispatch(setLoader(loader)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ProfileView));


