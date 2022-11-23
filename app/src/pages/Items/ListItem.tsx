import React, {Component} from 'react';
import {View, ScrollView, FlatList, TouchableOpacity, RefreshControl, Image, Platform} from 'react-native';
import {styles} from "../../theme";

import {Container, AppBar, ProIcon} from "../../components";
import {connect} from "react-redux";
import {
    Paragraph,
    List, Title, Appbar, FAB, Text, Divider, withTheme, ActivityIndicator
} from "react-native-paper";


import {clone, filterArray, loadClients, loadItems, log, objToArray} from "../../lib/functions";

import Search from "../../components/SearchBox";

import {backButton, chevronRight, voucher} from "../../lib/setting";

import NoResultFound from "../../components/NoResultFound";




class ProfileView extends Component<any> {

    title:any;
    initdata:any=[];
    itemlist:any=[];
    skip=0;
    take=50;

    constructor(props:any) {
        super(props);
        let {items}: any = this.props;
        this.itemlist = items || [];
        this.state = {searchbar:false,searchtext:false,filteritems:this.itemlist,isLoading:false,total:0};
    }


    async componentWillMount() {
        await this.getItems().then()
    }


    getItems = async () =>{

        let {items}: any = this.props;

        try {

            this.itemlist = items || [];

            if ((!Boolean(items?.length))) {
                await loadItems(0,5000).then((data: any) => {
                    this.itemlist = data;
                })
            }

            this.setState({
                isLoading: true,
                filteritems: clone(this.itemlist)
            })
        }
        catch (e){
            log('e',e)
        }

    }


    /*handleSearch = async (search: any,skip?:any,take?:any) => {

        if(Boolean(search)){
            this.skip = skip || 0;
            this.take = take || 50;
            this.itemlist = []
        }

        let resultdata: any = []
        await requestApi({
            method: methods.get,
            action: actions.items,
            queryString: {search: search || '', mobile: 1,skip:this.skip,take:this.take},
            loader: Boolean(search),
            showlog:true
        }).then((result: any) => {
            if (result.status === SUCCESS) {
                resultdata = result?.data;
            }

            if(Boolean(result?.data?.length)) {
                this.itemlist = this.itemlist.concat(result.data)
            }

            this.setState({
                searchtext: search || '',
                total:result?.info?.total,
                filteritems: this.itemlist,
                isLoading: true
            },()=>log(this.state))
        });
    }*/

    handleSearch = async (search: any) => {


        this.setState({
            searchtext: search || '',
            filteritems: Boolean(search) ? filterArray(clone(this.itemlist), ['itemname'], search) : this.itemlist,
            isLoading: true
        })
    }


    itemSelection = (item:any) => {
        const {route,navigation}:any = this.props;
        const {searchtext}:any = this.state;

        navigation.navigate('AddEditItem', {
            screen: 'AddEditItem',
            item:{...item},
            getItems:this.getItems,
            searchtext:searchtext
        });
    }

    AddNew = () => {

        const {route,navigation}:any = this.props;
        const {item,}:any = route.params;
        const {searchtext}:any = this.state;

        navigation.navigate('AddEditItem', {
            screen: 'AddEditItem',
            item:item,
            getItems:this.getItems,
            searchtext:searchtext
        });
    }

    renderitems = ({item}:any) => {
        const {colors}:any = this.props.theme;
        return (
            <TouchableOpacity onPress={()=> this.itemSelection(item)} style={[{paddingHorizontal:5}]}>
                <List.Item
                    title={item.itemname}
                    titleNumberOfLines={5}
                    right={props => <List.Icon {...props} icon={()=> <Title>  {chevronRight} </Title>}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        );
    };

    loadMore = () => {
        this.skip = this.skip + 50;
        this.take = 50;
        const {searchtext}:any = this.state

        //this.handleSearch(searchtext,this.skip,this.take).then()
    }

    render() {

        const {filteritems,isLoading,total}:any = this.state;
        const {navigation,theme:{colors}}:any = this.props;

        navigation.setOptions({
            headerTitle:"Items",
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><TouchableOpacity onPress={()=>navigation.goBack()}>{backButton}</TouchableOpacity>,
            headerRight: (props:any) =>
                <View style={[styles.grid]}>
                    <Title
                        onPress={()=>this.AddNew()}>
                        <ProIcon name={'plus'}  />
                    </Title>
                </View>,
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{'Items'}</Title>,
            })
        }

        return (
            <Container  surface={true}>

                <FlatList
                    data={filteritems || []}
                    renderItem={this.renderitems}
                    keyboardShouldPersistTaps={'handled'}
                    scrollIndicatorInsets={{ right: 1 }}
                    initialNumToRender = {50}
                    ListHeaderComponent={<Search autoFocus={false} placeholder={`Search...`}    handleSearch = {this.handleSearch}/>}
                    stickyHeaderIndices={[0]}
                    stickyHeaderHiddenOnScroll={true}
                    invertStickyHeaders={false}
                    onEndReachedThreshold={0.5}

                    ListEmptyComponent={<View style={[styles.center,styles.middle]}>
                        <NoResultFound/>
                        <Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph>
                    </View>}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={() => { this.itemlist=[]; this.skip =   0; this.take = 5000; this.getItems().then()}}
                        />
                    }
                />

            </Container>

        )
    }

}



const mapStateToProps = (state:any) => ({
    items: state.appApiData.items,
})
const mapDispatchToProps = (dispatch:any) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(ProfileView));


