import React, {Component} from 'react';
import {FlatList, Image, Platform, RefreshControl, TouchableOpacity, View} from 'react-native';
import {styles} from "../../theme";

import {Container, ProIcon} from "../../components";
import {connect} from "react-redux";
import {Divider, List, Paragraph, Title, withTheme} from "react-native-paper";

import {filterArray} from "../../lib/functions";

import Search from "../../components/SearchBox";


import {setLoader} from "../../lib/Store/actions/components";


import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {backButton, chevronRight} from "../../lib/setting";
import ListLoader from "../../components/ContentLoader/ListLoader";
import FlatListItems from "../../components/FlatList/FlatListItems";


class ProfileView extends Component<any> {

    title: any;
    initdata: any = [];
    accountlist: any = [];
    sheetRef: any;

    constructor(props: any) {
        super(props);
        this.state = {searchbar: false, searchtext: false, filters: [], isLoading: false};
        this.sheetRef = React.createRef()
    }


    componentDidMount() {
        this.getAccounts(false);
    }


    getAccounts = (loader = true) => {

        const {route} = this.props;

        requestApi({
            method: methods.get,
            action: actions.chartofaccount,
            alert: false,
            loader: loader,
            loadertype: 'list',
            showlog:true
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.accountlist = result.data.filter(({accounttype}:any)=>accounttype===route.params.title)
                this.setState({
                    searchtext: '',
                    filters: this.accountlist,
                    isLoading: true
                })
            }
        });
    }


    handleSearch = (search: any) => {
        this.setState({
            searchtext: search,
            filters: search ? filterArray(this.accountlist, ['accountname'], search) : this.accountlist
        })
    }


    clientSelection = (account: any) => {
        const {navigation}: any = this.props;
        navigation.navigate('AddEditAccount', {
            screen: 'AddEditAccount',
            account: {...account},
            getAccounts: this.getAccounts
        });
    }

    AddNew = () => {
        const {navigation}: any = this.props;
        navigation.navigate('AddEditAccount', {
            screen: 'AddEditAccount',
            getAccounts: this.getAccounts
        });
    }


    renderClients = ({item}: any) => {
        const {colors}:any = this.props.theme;
        return (
            <TouchableOpacity onPress={() => this.clientSelection(item)} style={[{paddingHorizontal: 5}]}>
                <List.Item
                    title={item.accountname}
                    titleStyle={[styles.bold]}
                    titleNumberOfLines={2}
                    description={item.accountinfo}
                    descriptionNumberOfLines={5}
                    right={props => <List.Icon {...props}
                                               icon={() => <Title> {chevronRight} </Title>}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        );
    };


    render() {

        const {filters, searchtext, searchbar, isLoading}: any = this.state;

        const {navigation,theme:{colors}}: any = this.props;

        navigation.setOptions({
            headerTitle: 'Accounts',
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) =>
                <Title
                    onPress={() => this.AddNew()}>
                    <ProIcon name="plus"/>
                </Title>
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{`Accounts`}</Title>,
            })
        }



        return (
            <Container  surface={true}>


                <FlatListItems
                    data={filters}
                    isLoading={isLoading}
                    handleSearch = {this.handleSearch}
                    renderItem={this.renderClients}
                    keyExt={'accountid'}
                    onRefresh={() => this.getAccounts(false)}

                />


            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({
    setLoader: (loader: any) => dispatch(setLoader(loader)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ProfileView));


