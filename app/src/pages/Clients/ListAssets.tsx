import React, {Component} from 'react';
import {FlatList, Image, Platform, RefreshControl, TouchableOpacity, View} from 'react-native';
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


class ListAssets extends Component<any> {

    title: any;
    initdata: any = [];
    assetlist: any = [];
    sheetRef: any;

    constructor(props: any) {
        super(props);
        const {route: {params}}: any = this.props;
        this.state = {searchbar: false, searchtext: false, filters: [], isLoading: true, client: params.client,assetslist:params.assetslist};
        this.sheetRef = React.createRef()
    }


    componentDidMount() {
        // const {assetslist}:any = this.state;
        // !assetslist && this.AddNew();
        // assetslist && this.getAssets(false);
        this.getAssets(false);
    }


    getAssets = (loader = true) => {
        const {client}: any = this.state;

        requestApi({
            method: methods.get,
            action: actions.assets,
            queryString: {clientid: client.clientid},
            alert: false,
            loader: loader,
            showlog: true,
            loadertype: 'list'
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                this.assetlist = objToArray(result.data)
                this.setState({
                    searchtext: '',
                    filters: this.assetlist,
                    isLoading: true
                })
            }
        });
    }


    handleSearch = (search: any) => {
        this.setState({
            searchtext: search,
            filters: search ? filterArray(this.assetlist, ['assetname', 'brand', 'model'], search) : this.assetlist
        })
    }


    clientSelection = (asset: any) => {
        const {navigation, route: {params}}: any = this.props;
        if (Boolean(params.fromJob)) {
            params.selectedAsset(asset);
            //navigation.goBack();
        } else {
            navigation.navigate('AddEditAssets', {
                screen: 'AddEditAssets',
                asset: {...asset},
                getAssets: this.getAssets
            });
        }
    }
    AddNew = () => {
        const {navigation}: any = this.props;
        const {client}: any = this.state;
        navigation.navigate('AddEditAssets', {
            screen: 'AddEditAssets',
            asset: {clientid: client.clientid},
            getAssets: this.getAssets
        });
    }

    renderClients = ({item}: any) => {
        const {colors}: any = this.props.theme;
        return (
            <TouchableOpacity onPress={() => this.clientSelection(item)} style={[{paddingHorizontal: 5}]}>
                <List.Item
                    title={item.assetname}
                    description={Boolean(item?.brand) && item.brand + '   ' + Boolean(item?.model) && item.model}
                    right={props => <List.Icon {...props} icon={() => <Text>  {chevronRight} </Text>}/>}
                />
                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </TouchableOpacity>
        );
    };


    render() {

        const {filters, searchtext, searchbar, isLoading}: any = this.state;

        const {navigation,theme:{colors}}: any = this.props;

        navigation.setOptions({
            headerTitle: 'Assets',
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) =>
                <View style={[styles.grid]}>
                    <Title
                        onPress={() => this.AddNew()}>
                        <ProIcon name={'plus'}/>
                    </Title>
                </View>,
        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{`Assets`}</Title>,
            })
        }

        if (!isLoading) {
            return <ListLoader/>
        }

        return (
            <Container  surface={true}>


                <FlatList
                    keyboardShouldPersistTaps={'handled'}
                    data={filters}
                    renderItem={this.renderClients}
                    scrollIndicatorInsets={{right: 1}}
                    keyExtractor={item => item.assetid}
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
                            onRefresh={() => this.getAssets(false)}
                        />
                    }

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

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ListAssets));


