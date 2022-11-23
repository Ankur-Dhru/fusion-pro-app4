import React, {Component} from 'react';
import {View, ScrollView, FlatList, TouchableOpacity, RefreshControl, Image, Platform, Alert} from 'react-native';
import {styles} from "../../theme";

import {Container, AppBar, ProIcon} from "../../components";
import {connect} from "react-redux";
import {
    Paragraph,
    List, Title, Appbar, FAB, Divider, withTheme
} from "react-native-paper";

import {clone, filterArray, findObject, getInit, log, objToArray, retrieveData} from "../../lib/functions";

import Search from "../../components/SearchBox";

import {
    setClients,setVendors,

} from "../../lib/Store/actions/appApiData";


import {setDialog, setLoader} from "../../lib/Store/actions/components";


import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {backButton, chevronRight, voucher} from "../../lib/setting";
import Icon from "react-native-fontawesome-pro";
import ListLoader from "../../components/ContentLoader/ListLoader";
import FlatListItems from "../../components/FlatList/FlatListItems";



class ListCategory extends Component<any> {

    title:any;
    initdata:any=[];
    categorylist:any = [];
    sheetRef:any;

    constructor(props:any) {
        super(props);
        this.state = {searchbar:false,searchtext:false,filters:objToArray(props.itemgroups),isLoading:true};
        this.categorylist = objToArray(props.itemgroups);
        this.sheetRef = React.createRef()
    }


    handleSearch = (search?:any) => {
        this.setState({searchtext:search,filters: search ? filterArray(this.categorylist,['itemgroupname'],search):this.categorylist})
    }

    getInitData = () => {
        retrieveData('fusion-pro-app').then(async (data: any) => {
            await getInit(data, this.props.navigation, '', (response: any) => {
                this.categorylist = objToArray(this.props.itemgroups);
                this.handleSearch()
            },'list');
        })
    }


    categorySelection = (category:any) => {
        const {navigation}:any = this.props;
        navigation.navigate('AddEditCategory', {
            screen: 'AddEditCategory',
            category:{...category},
            getInitData:this.getInitData
        });
    }

    AddNew = () => {
        const {navigation}:any = this.props;
        navigation.navigate('AddEditCategory', {
            screen: 'AddEditCategory',
            getInitData:this.getInitData
        });
    }



    renderItems = ({item}:any) => {
        const {colors}:any = this.props.theme;
        return (
            <TouchableOpacity onPress={()=> this.categorySelection(item)} style={[{paddingHorizontal:5}]}>
                <List.Item
                    title={item.itemgroupname}
                    titleNumberOfLines={2}
                    right={props => <List.Icon {...props} icon={()=> <Title>  {chevronRight} </Title>}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        );
    };



    render() {

        const {filters,isLoading}:any = this.state;

        const {navigation,theme:{colors}}:any = this.props;

        navigation.setOptions({headerTitle:'Category',
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerLeft:()=><Title onPress={()=>navigation.goBack()}>{backButton}</Title>,
            headerRight: (props:any) =>
                <Title
                    onPress={()=>this.AddNew()}>
                    <ProIcon name="plus"  />
                </Title>
        });

        if(Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <Title style={[styles.headertitle]}>{`Category`}</Title>,
            })
        }



        return (
            <Container  surface={true}>

                <FlatListItems
                    data={filters}
                    handleSearch={this.handleSearch}
                    isLoading={isLoading}
                    renderItem={this.renderItems}
                    keyExt={'categoryid'}
                    onRefresh={() => { this.categorylist=[];   this.getInitData()}}
                />



            </Container>

        )
    }

}



const mapStateToProps = (state:any) => ({
    itemgroups: state.appApiData.settings.itemgroup,
})
const mapDispatchToProps = (dispatch:any) => ({
    setLoader: (loader:any) => dispatch(setLoader(loader)),
});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(ListCategory));


