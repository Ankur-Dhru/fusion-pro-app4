import React, {Component} from 'react';
import {View, ScrollView, TouchableOpacity, RefreshControl, Image, Platform, SectionList} from 'react-native';
import {styles} from "../../theme";

import {Container, AppBar, ProIcon} from "../../components";
import {connect} from "react-redux";
import {
    Paragraph,
    List, Title, FAB, Appbar, Text,
    Divider, withTheme
} from "react-native-paper";

import {clone, filterArray, findObject, loadClients, log, objToArray, updateComponent} from "../../lib/functions";

import Search from "../../components/SearchBox";

import {
    setClients,setVendors,

} from "../../lib/Store/actions/appApiData";


import {setDialog, setLoader} from "../../lib/Store/actions/components";


import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import BottomSpace from "../../components/BottomSpace";
import Icon from "react-native-fontawesome-pro";
import {auth, backButton, chevronRight, voucher} from "../../lib/setting";
import ListLoader from "../../components/ContentLoader/ListLoader";
import Avatar from "../../components/Avatar";

import FlatListItems from "../../components/FlatList/FlatListItems"


class ProfileView extends Component<any> {

    title:any;
    initdata:any=[];
    customerlist:any = [];
    sheetRef:any;
    type:any = '...';
    skip:any=50;
    take:any=50;
    search:any;

    constructor(props:any) {
        super(props);
        this.state = {filterclients:false,searchtext:false,searchbar:false,isLoading:false,total:0};
        this.sheetRef = React.createRef()
    }


    async componentWillMount() {
        await this.getClients(false).then(()=>{})
    }


    getClients = async (loader=true,refresh=false) =>{

        let {route,clients,vendors}: any = this.props;

        try {
            const {item}: any = route.params;
            this.type = 'Vendor';
            if (item.vouchertypeid === '000-000-000') {
                this.type = 'Client';
            }

            this.customerlist = (this.type === 'Client'?clients:vendors) || [];

            if ((!Boolean(clients?.length) && this.type === 'Client') || ((!Boolean(vendors?.length) && this.type === 'Vendor')) || refresh) {
                await loadClients(this.type,0,5000).then((data: any) => {
                    this.customerlist = data;
                })
            }
            this.setState({
                searchtext: '',
                filterclients: this.customerlist,
                isLoading: true
            });
        }
        catch (e){
            log('e',e)
        }

    }



    /*handleSearch = (search?:any) => {


        if(Boolean(search)){
            this.skip = 0;
            this.take = 50;
            this.customerlist=[]
        }


        let resultdata: any = []
        requestApi({
            method: methods.get,
            action: actions.clients,
            queryString: {clienttype: this.type === 'Client' ? 0 : 1, phone: search,skip:this.skip,take:this.take},
            loader: Boolean(search),
            showlog: true,
        }).then((result: any) => {

            if (result.status === SUCCESS) {
                resultdata = result?.data;
            }

            if(Boolean(resultdata?.length)) {
                this.customerlist = this.customerlist.concat(resultdata)
            }

            this.setState({
                searchtext: search,
                total:result?.info?.total,
                filterclients: this.customerlist || []
            })
        });


    }*/


    handleSearch = async (search: any) => {

        this.setState({
            searchtext: search || '',
            filterclients: Boolean(search) ? filterArray(clone(this.customerlist), ['displayname'], search) : this.customerlist,
            isLoading: true
        })
    }


    clientSelection = (client:any) => {
        const {route,navigation}:any = this.props;
        const {item}:any = route.params;
        navigation.navigate('ClientOverview', {
            screen: 'ClientOverview',
            client:{...client},
            item:{...item,vouchertypeid:item.vouchertypeid},
            getClients:this.getClients
        });
    }

    AddNew = () => {

        const {route,navigation}:any = this.props;
        const {item}:any = route.params;
        const {searchtext}:any = this.state;

        navigation.navigate('AddEditClient', {
            screen: 'AddEditClient',
            item:item,
            getClients:this.getClients,
            searchtext:searchtext
        });
    }


    renderClients = ({item}:any) => {
        const {colors}:any = this.props.theme;

        if(item?.clientid === '1' || !Boolean(item)){
            return <View></View>
        }

        return (
            <TouchableOpacity onPress={()=> this.clientSelection(item)} >
                <List.Item
                    title={item.displayname}
                    description={item.phone}
                    left={props => <List.Icon {...props} icon={()=> <Title> {this.type === 'Client' ? <Avatar label={item.displayname} value={item.displayname} size={35}/> : <Avatar label={item.displayname} value={item.displayname} size={35}/>}</Title>}/>}
                    right={props => <List.Icon {...props} icon={()=> chevronRight}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        );
    };

    loadMore = () => {
        this.skip = this.skip + 50;
        this.take = 50;
        this.handleSearch('')
    }


    render() {

        const {filterclients,searchbar,searchtext,isLoading,total}:any = this.state;

        const {navigation,settings,options,theme:{colors}}:any = this.props;


        navigation.setOptions({
            headerTitle:this.type,
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
                headerCenter: () => <Title style={[styles.headertitle]}>{this.type}</Title>,
            })
        }



        return (
            <Container  surface={true}>

                <FlatListItems
                    isLoading={isLoading}
                    handleSearch = {this.handleSearch}
                    data={Boolean(filterclients?.length) && filterclients?.filter((client:any)=> {
                        return client.clientid !== '1'
                    } )}
                    renderItem={this.renderClients}
                    onRefresh={() => { this.customerlist=[]; this.skip =   0; this.take = 5000; this.getClients(false,true)}}
                    keyExt={'clientid'}
                    initialNumToRender={50}
                    onEndReachedThreshold={0.5}
                    /*loadMore={Boolean(filterclients?.length < total) && this.loadMore}*/
                />

            </Container>

        )
    }

}



const mapStateToProps = (state:any) => {
    return {
        clients: state.appApiData.clients,
        vendors: state.appApiData.vendors,
    }
}
const mapDispatchToProps = (dispatch:any) => ({

});

export default connect(mapStateToProps,mapDispatchToProps)(withTheme(ProfileView));


