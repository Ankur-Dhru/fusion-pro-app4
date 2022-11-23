import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import {setDialog} from "../../lib/Store/actions/components";
import {connect} from "react-redux";
import {styles} from "../../theme";
import {Container, ProIcon} from "../../components";
import {Card, Paragraph, withTheme,} from "react-native-paper";

import {clone, filterArray, getVisibleNav, log, retrieveData, storeData,} from "../../lib/functions";

import {setCompany, updateVoucherItems} from "../../lib/Store/actions/appApiData";
import {ACCESS_TYPE, FILTERED_VOUCHER, vouchers} from "../../lib/static";
import Icon from "./Icon";
import {voucher} from "../../lib/setting";
import Search from "../../components/SearchBox";
import {regExpJson2} from "../../lib/validation";
import KeyboardScroll from "../../components/KeyboardScroll";
import HeaderLocation from "../../components/HeaderLocation";
import {store} from "../../App";


class Index extends Component<any> {


    vouchers: any = vouchers;

    vouchersmenufilter: any;
    frequntVouchers: any = {};

    constructor(props: any) {
        super(props);
        this.state = {searchbar: false, gridview: true, searchQuery: '', isLoad: false};
        this.vouchersmenufilter = getVisibleNav(this.vouchers);
        retrieveData('fusion-pro-app').then((data: any) => {
            this.frequntVouchers = data.companies[data.currentuser]['vouchers'] || {};
        });
    }

    handleState = (item: any) => {
        this.setState({...this.state, ...item})
    }

    handleSearch = (search: any) => {
        this.vouchersmenufilter = filterArray(getVisibleNav(this.vouchers), ['label'], search);
        this.forceUpdate()
    }


    handleNavigation = (page: any, item: any, add: any) => {

        const {navigation, vouchers, companydetails, updateVoucherItems}: any = this.props;

        //hideBottomSheet(); 123

        let key = `${item.vouchertypeid}-${add ? 'add' : 'list'}`;

        if (!Boolean(this.frequntVouchers[key])) {
            this.frequntVouchers[key] = item;
        }

        this.frequntVouchers[key].counter = this.frequntVouchers[key].counter + 1;
        this.frequntVouchers[key].add = add;


        companydetails.companies[companydetails.currentuser]['vouchers'] = this.frequntVouchers;

        storeData('fusion-pro-app', companydetails).then((r: any) => {
            store.dispatch(setCompany({companydetails: companydetails}));
        });


        this.vouchersmenufilter = getVisibleNav(this.vouchers);


        let screen: any = '';

        if (!add) {
            screen = 'ListVoucher';
            if (item.vouchertypeid === '000-000-000' || item.vouchertypeid === '111-111-111') {
                screen = 'ListClient';
            } else if (item.vouchertypeid === '222-222-222') {
                screen = 'AccountGroups';
            } else if (item.vouchertypeid === '333-333-333') {
                screen = 'ListItem';
            } else if (item.vouchertypeid === '444-444-444') {
                screen = 'ListCategory';
            }
        } else {
            screen = 'AddEditVoucher';
            if (item.vouchertypeid === '000-000-000' || item.vouchertypeid === '111-111-111') {
                screen = 'AddEditClient';
            } else if (item.vouchertypeid === '222-222-222') {
                screen = 'AddEditAccount';
            } else if (item.vouchertypeid === '333-333-333') {
                screen = 'AddEditItem';
            } else if (item.vouchertypeid === '444-444-444') {
                screen = 'AddEditCategory';
            }
        }

        /////// RESET VOUCHER DATA ////////
        voucher.type = {...item, ...vouchers[item.vouchertypeid]};
        voucher.data = {};
        updateVoucherItems({});
        /////////////////////////

        navigation.push(screen, {
            screen: screen,
            item: {...item, ...vouchers[item.vouchertypeid]},
        });

    }


    componentDidMount() {
        retrieveData('fusion-pro-app').then((data: any) => {
            if (data) {
                this.setState({gridview: data.gridview, isLoad: true})
            } else {
                this.setState({isLoad: true})
            }
        })
    }

    getFilteredVoucherList = (screenType: any) => {
        return clone(this.vouchersmenufilter).filter((item: any) => {
            if (item.screentype === screenType) {

                return (regExpJson2.uuidValidate.test(item.vouchertypeid) || regExpJson2.uuidValidate.test(item.vouchertypeid2)) ? item.accessType[ACCESS_TYPE.VIEW] : true;
            }
            return false
        })
    }

    render() {



        const {searchbar, gridview, searchQuery, isLoad}: any = this.state;
        const {navigation, list, settings, companydetails, theme: {colors}}: any = this.props;

        navigation.setOptions({headerShown: true, headerTitle: () => <HeaderLocation/>})

        if (!isLoad) {
            return <View></View>
        }

        FILTERED_VOUCHER.data = this.vouchersmenufilter
        navigation.setOptions({
            headerLargeTitleStyle: {color: colors.inputbox},
            headerTitleStyle: {color: colors.inputbox},
            headerRight: (props: any) =>
                <TouchableOpacity style={{marginRight: 15}}
                                  onPress={() => {
                                      this.setState({gridview: !gridview});
                                      companydetails.gridview = !gridview;
                                      storeData('fusion-pro-app', companydetails).then((r: any) => {
                                      });
                                  }}>
                    <ProIcon name={gridview ? 'rectangle-list' : 'table-cells'}/>
                </TouchableOpacity>
        });

        const salesvoucher = this.getFilteredVoucherList("sales");
        const purchasevoucher = this.getFilteredVoucherList("purchase");
        const accountvoucher = this.getFilteredVoucherList("account");
        const othervoucher = this.getFilteredVoucherList("other");
        const inventory = this.getFilteredVoucherList("inventory");


        return (
            <Container>
                <View>
                    <Search timeout={100} autoFocus={false} placeholder={`Search...`} handleSearch={this.handleSearch}/>
                </View>

                <KeyboardScroll>
                    <View style={[styles.pageContent]}>
                        {Boolean(salesvoucher.length) && <Card style={[styles.card]}>

                            <Card.Content>

                                <View>
                                    <Paragraph style={[styles.paragraph, styles.pb_4, styles.caption]}>Sales</Paragraph>
                                </View>

                                <View>
                                    <View>
                                        <View style={[styles.grid]}>
                                            {
                                                salesvoucher.map((item: any, key: any) => {

                                                    return (
                                                        <Icon gridview={gridview} item={item}
                                                              length={salesvoucher.length} key={key}
                                                              handleNavigation={this.handleNavigation}/>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>

                            </Card.Content>

                        </Card>}
                        {Boolean(purchasevoucher.length) && <Card style={[styles.card]}>

                            <Card.Content>
                                <View>
                                    <Paragraph
                                        style={[styles.paragraph, styles.pb_4, styles.caption]}>Purchase</Paragraph>
                                </View>

                                <View>
                                    <View>
                                        <View style={[styles.grid]}>
                                            {
                                                purchasevoucher.map((item: any, key: any) => {
                                                    return (
                                                        <Icon gridview={gridview} item={item}
                                                              length={purchasevoucher.length} key={key}
                                                              handleNavigation={this.handleNavigation}/>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>

                            </Card.Content>

                        </Card>}

                        {Boolean(accountvoucher.length) && <Card style={[styles.card]}>
                            <Card.Content>
                                <View>
                                    <Paragraph
                                        style={[styles.paragraph, styles.pb_4, styles.caption]}>Accounts</Paragraph>
                                </View>

                                <View>
                                    <View>
                                        <View style={[styles.grid]}>
                                            {
                                                accountvoucher.map((item: any, key: any) => {
                                                    return (
                                                        <Icon gridview={gridview} item={item}
                                                              length={accountvoucher.length} key={key}
                                                              handleNavigation={this.handleNavigation}/>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>}

                        {Boolean(inventory.length) && <Card style={[styles.card]}>

                            <Card.Content>
                                <View>
                                    <Paragraph
                                        style={[styles.paragraph, styles.pb_4, styles.caption]}>Inventory</Paragraph>
                                </View>

                                <View>
                                    <View>
                                        <View style={[styles.grid]}>
                                            {
                                                inventory.map((item: any, key: any) => {
                                                    return (
                                                        <Icon gridview={gridview} item={item} length={inventory.length}
                                                              key={key}
                                                              handleNavigation={this.handleNavigation}/>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>

                            </Card.Content>

                        </Card>}

                    </View>
                </KeyboardScroll>
            </Container>
        );
    }
}


const mapStateToProps = (state: any) => ({
    vouchers: state.appApiData.settings.voucher,
    settings: state.appApiData.settings,
    companydetails: state.appApiData.companydetails,
});
const mapDispatchToProps = (dispatch: any) => ({
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Index));

