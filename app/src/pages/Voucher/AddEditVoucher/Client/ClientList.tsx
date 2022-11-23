import React, {Component} from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    PermissionsAndroid,
    Platform,
    SectionList,
    TouchableOpacity,
    View
} from 'react-native';
import {styles} from "../../../../theme";

import {Button, Container, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Divider, List, Paragraph, Text, Title, withTheme} from "react-native-paper";


import {
    clone,
    filterArray,
    findObject,
    loadClients,
    loadContacts,
    log,
    retrieveData,
    storeData
} from "../../../../lib/functions";

import Search from "../../../../components/SearchBox";

import {setContacts, setFavouriteClients, setFavouriteVendors,} from "../../../../lib/Store/actions/appApiData";


import requestApi, {actions, methods, SUCCESS} from "../../../../lib/ServerRequest";
import {backButton, update, voucher} from "../../../../lib/setting";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import ListLoader from "../../../../components/ContentLoader/ListLoader";
import ToggleButtons from "../../../../components/ToggleButton";
import Avatar from "../../../../components/Avatar";
import PhoneAvatar from "../../../../components/Avatar/PhoneAvatar";
import {isVisibleTooltip} from "../../../../lib/Store/store-service";
import Tooltip, {STEPS, TooltipContainer} from "../../../../components/Spotlight/Tooltip";
import NoResultFound from "../../../../components/NoResultFound";


class ProfileView extends Component<any> {

    title: any;
    initdata: any = [];

    sheetRef: any;

    contactRef: any;
    addressRef: any;
    fromSpotlight: boolean = false

    /*contactRefSearch:any;
    addressRefSearch:any;*/

    listof: any = 'server';
    customerlist: any;

    skip = 0;
    take = 50;

    constructor(props: any) {
        super(props);

        this.customerlist = voucher.settings.partyname === 'Client' ? props.clients : props.vendors;

        this.state = {
            filterclients: this.customerlist,
            filteraddressbook: props.contacts,
            searchtext: false,
            isLoading: true,
            listof: 'server',
            hasScrolled: false,
            total: 0,
            isVisible: false,
            listVisible: false,
            addButtonVisible: false
        };

        this.sheetRef = React.createRef()

        this.contactRef = React.createRef()
        this.addressRef = React.createRef()

        /*this.contactRefSearch = React.createRef()
        this.addressRefSearch = React.createRef()*/
        this.fromSpotlight = Boolean(voucher?.type?.fromSpotlight)
    }

    async componentWillMount() {
        const {setFavouriteClients, setFavouriteVendors}: any = this.props;
        retrieveData('fusion-pro-app').then((data: any) => {
            if (voucher.settings.partyname === 'Client') {
                setFavouriteClients(data.companies[data.currentuser]['clients']);
            } else {
                setFavouriteVendors(data.companies[data.currentuser]['vendors']);
            }
        })
        await this.getClients().then(() => {

        })
    }


    gePhonebook = async () => {
        const {contacts}: any = this.props;

        if (!Boolean(contacts.length > 0)) {

            if (voucher.settings.addressbook) {
                if (Platform.OS === "android") {
                    try {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                            {
                                title: "Contacts.",
                                message:
                                    "This app would like to view your contacts.",
                                buttonNeutral: "Ask Me Later",
                                buttonNegative: "Cancel",
                                buttonPositive: "OK"
                            }
                        );
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            await loadContacts()
                        } else {
                            log("Contact permission denied");
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                }

                if (Platform.OS === "ios") {
                    requestMultiple([PERMISSIONS.IOS.CONTACTS]).then(async statuses => {
                        if (statuses[PERMISSIONS.IOS.CONTACTS]) {
                            await loadContacts()
                        }
                    });
                }

            }

        }
    }


    getClients = async () => {

        let {clients, vendors}: any = this.props;

        try {

            let isClient = voucher.settings.partyname === 'Client';

            this.customerlist = (isClient ? clients : vendors) || [];

            if ((!Boolean(clients?.length) && voucher.settings.partyname === 'Client') || ((!Boolean(vendors?.length) && voucher.settings.partyname === 'Vendor'))) {
                await loadClients(voucher.settings.partyname).then((data: any) => {
                    this.customerlist = data;
                })
            }

            let lengthRequired = isClient ? 1 : 0;

            let visibleOptions = Boolean(this.customerlist?.length > lengthRequired)

            this.setState({
                isLoading: true,
                filterclients: clone(this.customerlist.filter((client: any) => {
                    return Boolean(client.clientid !== '1')
                })),
                listVisible: visibleOptions,
                addButtonVisible: !visibleOptions
            })
        } catch (e) {
            log('e', e)
        }

    }


    handleSearch = (search?: any) => {


        if (Boolean(search)) {
            this.skip = 0;
            this.take = 50;
            this.customerlist = []
        }

        let resultdata: any = []
        requestApi({
            method: methods.get,
            action: actions.clients,
            queryString: {
                clienttype: voucher.settings.partyname === 'Client' ? 0 : 1,
                phone: search,
                skip: this.skip,
                take: this.take
            },
            loader: Boolean(search),
            showlog: true,
        }).then((result: any) => {

            if (result.status === SUCCESS) {
                resultdata = result?.data;
            }

            if (Boolean(result?.info?.total)) {
                this.customerlist = this.customerlist.concat(resultdata)
            }

            this.setState({
                searchtext: search,
                total: result?.info?.total,
                filterclients: this.customerlist.filter((client: any) => {
                    return Boolean(client.clientid !== '1')
                }) || []
            })
        });


    }

    handleSearchPhonebook = (search: any) => {
        const {contacts}: any = this.props;
        this.setState({
            searchtext: search,
            filteraddressbook: filterArray(contacts, ['displayname', 'phone'], search),
        })
    }


    clientSelection = (client: any) => {

        update.required = true;

        const {navigation}: any = this.props;

        Keyboard.dismiss()

        const {
            route,
            setFavouriteClients,
            favouriteclients,
            setFavouriteVendors,
            favouritevendors,
            companydetails
        }: any = this.props;

        client.phonebook = Boolean(client.phonebook);


        if (!Boolean(this.fromSpotlight)) {
            if (voucher.settings.partyname === 'Client') {
                let found = findObject(favouriteclients, 'displayname', client?.displayname);
                if (!found[0]) {
                    favouriteclients.unshift(client);
                    favouriteclients.length > 5 && favouriteclients.splice(5, 1);
                    companydetails.companies[companydetails.currentuser]['clients'] = favouriteclients;
                    setFavouriteClients(favouriteclients);
                }
            } else {
                let found = findObject(favouritevendors, 'displayname', client?.displayname);
                if (!found[0]) {
                    favouritevendors.unshift(client);
                    favouritevendors.length > 5 && favouritevendors.splice(5, 1);
                    companydetails.companies[companydetails.currentuser]['vendors'] = favouritevendors;
                    setFavouriteVendors(favouritevendors);
                }
            }

            storeData('fusion-pro-app', companydetails).then((r: any) => {
            });
        }


        route.params.handleClient(client, '', true);
    }


    renderClients = (itemProps: any) => {
        const {item, index, listVisible, section, ...itemdata} = itemProps;
        const {colors}: any = this.props.theme;
        if (!Boolean(item?.displayname)) {
            return <></>
        }


        return (
            <Tooltip
                customVisible={index === 0 && listVisible && section?.title !== "Frequently" && isVisibleTooltip(STEPS.SELECT_OR_ADD_CLIENT_VENDOR)}
                message={`Select ${voucher.settings.partyname}
                          From ${voucher.settings.partyname} List`}
                stepOrder={STEPS.SELECT_OR_ADD_CLIENT_VENDOR}
                nextStep={Boolean(voucher?.type?.spotkey === "job") ? STEPS.SELECT_ASSET_TYPE : STEPS.SELECT_PRODUCT_OR_SERVICE}
                isCustomVisible={true}
            >
                <TooltipContainer stepOrder={STEPS.SELECT_OR_ADD_CLIENT_VENDOR}>
                    <TouchableOpacity onPress={() => this.clientSelection(item)}>
                        <List.Item
                            title={item?.displayname}
                            description={item?.phone}
                            left={props => <List.Icon {...props}
                                                      icon={() => <Text> {item?.phonebook ? item?.thumbnailPath ?
                                                              <PhoneAvatar
                                                                  img={item?.thumbnailPath ? {uri: item?.thumbnailPath} : undefined}
                                                                  width={35}
                                                                  height={35}/> :
                                                              <Avatar label={item?.displayname} value={item?.displayname}
                                                                      size={35}/> :
                                                          <Avatar label={item?.displayname} value={item?.displayname}
                                                                  size={35}/>}</Text>}/>}
                        />
                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                    </TouchableOpacity>
                </TooltipContainer>
            </Tooltip>
        );
    };

    changeClietList = async (value: any) => {

        try {
            if (value === 'phonebook') {
                await this.gePhonebook()
            }
            this.setState({listof: value});

            /*updateComponent(this.contactRef, 'display', this.listof==='server' ? 'flex' : 'none')
            updateComponent(this.addressRef, 'display', this.listof==='phonebook' ? 'flex' : 'none')
            updateComponent(this.contactRefSearch, 'display', this.listof==='server' ? 'flex' : 'none')
            updateComponent(this.addressRefSearch, 'display', this.listof==='phonebook' ? 'flex' : 'none')*/
        } catch (e) {
            log('e', e)
        }

    }

    handleLoadMore = () => {
        log('load more');
    }

    ListClient = (list: any) => {
        return (
            <FlatList
                keyboardShouldPersistTaps={'handled'}
                data={list}
                renderItem={this.renderClients}
                ListEmptyComponent={<View style={[styles.middle]}><Image
                    style={[{height: 150, width: 150, opacity: 0.5}]}
                    source={require('../../../../assets/noitems.png')}
                /><Paragraph style={[styles.paragraph,]}>Search Client Record</Paragraph></View>}
                keyExtractor={item => item.phone}
            />
        );
    }

    loadMore = () => {
        this.skip = this.skip + 50;
        this.take = 50;
        this.handleSearch('')
    }

    onScroll = () => {
        this.setState({hasScrolled: true})
    }

    render() {

        const {
            filterclients,
            filteraddressbook,
            searchtext,
            isLoading,
            listof,
            total,
            isVisible,
            addButtonVisible,
            listVisible
        }: any = this.state;

        const {navigation, favouriteclients, favouritevendors, contacts, theme: {colors}}: any = this.props;

        let phoenlist = !Boolean(searchtext) ? contacts : [];
        if (Boolean(filteraddressbook) && Boolean(filteraddressbook.length)) {
            phoenlist = filteraddressbook
        }


        navigation.setOptions({
            headerTitle: voucher.settings.partyname,
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerCenter: () => <View>{voucher.settings.addressbook &&
                <ToggleButtons onValueChange={this.changeClietList}></ToggleButtons>}</View>,
            headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>,
            headerRight: (props: any) => <Title
                onPress={() => {
                    navigation.navigate('AddEditClient', {
                        screen: 'AddEditClient',
                        item: {vouchertypeid: voucher.settings.partyname === 'Client' ? '000-000-000' : '111-111-111'},
                        clientSelection: this.clientSelection,
                        searchtext:searchtext
                    })
                }}>
                <ProIcon name={'plus'}/>
            </Title>

        });

        if (Platform.OS === "android") {
            navigation.setOptions({
                headerCenter: () => <View>{voucher.settings.addressbook &&
                    <ToggleButtons onValueChange={this.changeClietList}></ToggleButtons>}</View>,
            })
        }
        let frequentList = voucher.settings.partyname === 'Client' ? favouriteclients : favouritevendors

        frequentList = frequentList.filter((item: any) => {
            if (!voucher.settings.addressbook) {
                return !item.phonebook
            }
            return true
        })

        let contactlist: any = [];


        if (Boolean(filterclients?.length)) {
            contactlist = [{title: `${voucher.settings.partyname} List`, data: filterclients}];
        }

        if (!Boolean(searchtext) && Boolean(frequentList?.length)) {
            contactlist.unshift({title: 'Frequently', data: frequentList})
        }


        return (
            <Container surface={true}>

                {/*<View ref={this.contactRefSearch} style={{display:this.listof === 'server'?'flex':'none'}}>
                    <Search autoFocus={false} placeholder={`Search client...`} timeout={500}   disableKeypress={false} handleSearch = {this.handleSearch}/>
                </View>
                <View ref={this.addressRefSearch} style={{display:this.listof === 'phonebook'?'flex':'none'}}>
                    <Search autoFocus={false} placeholder={`Search phonebook...`} timeout={500} disableKeypress={false} handleSearch = {this.handleSearch}/>
                </View>*/}

                <View>

                    {!isLoading ? <ListLoader/> : <>
                        {<View style={[styles.flatlistHeight]}>

                            {listof === 'server' && <View ref={this.contactRef}>
                                <Search autoFocus={false} placeholder={`Search...`} disabledefaultload={true}
                                        disableKeypress={true} handleSearch={this.handleSearch}/>
                                {<SectionList
                                    sections={contactlist}
                                    keyboardShouldPersistTaps={'handled'}
                                    keyExtractor={(item, index) => item + index}
                                    renderItem={(props: any) => this.renderClients({listVisible, ...props})}
                                    renderSectionHeader={({section: {title, data}}) => (
                                        <Paragraph
                                            style={[styles.paragraph, styles.caption, Boolean(data.length) && styles.p_5, {
                                                backgroundColor: colors.surface,
                                                paddingBottom: 0,
                                                marginTop: 0
                                            }]}> {Boolean(data.length) && title}</Paragraph>
                                    )}
                                    initialNumToRender={50}
                                    scrollIndicatorInsets={{right: 1}}
                                    progressViewOffset={100}
                                    ListEmptyComponent={<View
                                        style={[styles.center, styles.middle, styles.noRecordFound]}>
                                        <NoResultFound/>
                                        <Paragraph
                                            style={[styles.paragraph, styles.mb_5]}>No {voucher.settings.partyname} found</Paragraph>
                                        <Tooltip
                                            message={`Add ${voucher.settings.partyname}`}
                                            stepOrder={STEPS.SELECT_OR_ADD_CLIENT_VENDOR}
                                            isCustomVisible={true}
                                            customVisible={addButtonVisible && isVisibleTooltip(STEPS.SELECT_OR_ADD_CLIENT_VENDOR)}
                                        >
                                            <Button
                                                secondbutton={true}
                                                onPress={() => {
                                                    navigation.navigate('AddEditClient', {
                                                        screen: 'AddEditClient',
                                                        item: {vouchertypeid: voucher.settings.partyname === 'Client' ? '000-000-000' : '111-111-111'},
                                                        clientSelection: this.clientSelection,
                                                        searchtext:searchtext
                                                    })
                                                }}>Add {voucher.settings.partyname}</Button>
                                        </Tooltip>
                                    </View>}
                                    onEndReachedThreshold={0.5}
                                    /*onScroll={this.onScroll}*/
                                    onEndReached={({distanceFromEnd}) => {
                                        (((Boolean(total) && Boolean(filterclients?.length <= total)) || !Boolean(total)) && !Boolean(searchtext)) && this.loadMore();
                                    }}
                                />}


                            </View>}


                            {listof === 'phonebook' && <View ref={this.addressRef}>

                                <Search autoFocus={false} placeholder={`Search...`} timeout={500}
                                        disableKeypress={false} handleSearch={this.handleSearchPhonebook}/>

                                <View>
                                    {this.ListClient(phoenlist?.filter((item: any) => {
                                        return Boolean(item.phonebook)
                                    }))}
                                </View>
                            </View>}

                        </View>}


                    </>}

                </View>

            </Container>

        )
    }

}


const mapStateToProps = (state: any) => ({
    contacts: voucher.settings.addressbook ? state.appApiData.contacts : [],
    clients: state.appApiData.clients,
    vendors: state.appApiData.vendors,
    favouriteclients: state.appApiData.favouriteclients,
    favouritevendors: state.appApiData.favouritevendors,
    companydetails: state.appApiData.companydetails,
})
const mapDispatchToProps = (dispatch: any) => ({
    setContacts: (contacts: any) => dispatch(setContacts(contacts)),
    setFavouriteClients: (clients: any) => dispatch(setFavouriteClients(clients)),
    setFavouriteVendors: (vendors: any) => dispatch(setFavouriteVendors(vendors)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(ProfileView));


