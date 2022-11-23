import React, {Component} from "react";
import {FlatList, Image, Keyboard, TouchableOpacity, View} from "react-native";
import {Divider, Paragraph, Text, TextInput, withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../../../lib/navigation_options";
import Search from "../../../../components/SearchBox";
import {styles} from "../../../../theme";
import ListLoader from "../../../../components/ContentLoader/ListLoader";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import AddedInventory from "./AddedInventory";
import {Button, Container, ProIcon} from "../../../../components";
import {getCurrencySign, getStock, log, log2} from "../../../../lib/functions";
import {STATUS} from "../../../../lib/static";
import Avatar from "../../../../components/Avatar";
import InputField from "../../../../components/InputField";
import {setItems, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";
import {setLoader} from "../../../../lib/Store/actions/components";
import {connect} from "react-redux";

class RemoveSerialStock extends Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            stocklist: []
        }
    }


    componentWillMount() {
        const {navigation, route} = this.props;
        getStock(route?.params?.item.itemid, 1).then((response: any) => {
            if (response.status === STATUS.SUCCESS) {
                this.setState({stocklist: Object.values(response.data)})
            }
        });
    }

    renderItem = (itemProps: any) => {
        const {item, index} = itemProps;
        const {theme} = this.props;
        const {colors} = theme;
        const {stocklist} = this.state;
        return <>
            <View>
                <View>
                    <View>
                        <View style={[styles.grid, styles.middle, styles.p_5]}>
                            <Paragraph style={[styles.paragraph, styles.ml_2]}>
                                {item.serialno}
                            </Paragraph>
                            <View style={[styles.ml_auto, {width: 100}]}>
                                <Button compact={true} secondbutton={true} onPress={() => {
                                    stocklist[index].removed = !Boolean(item?.removed);
                                    this.setState({stocklist})
                                }}>
                                    {Boolean(item?.removed) ? "Cancel" : "Remove"}
                                </Button>
                            </View>
                        </View>
                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
                    </View>
                </View>
            </View>
        </>
    }


    render() {
        const {navigation, route,theme:{colors}} = this.props;
        let {updateItem, item} = route.params;
        const {stocklist} = this.state;
        setNavigationOptions(navigation, "Remove Stock",colors);

        let some = stocklist
            .some((si: any) => Boolean(si?.removed))

        return (
            <Container surface={true}>
                <FlatList
                    data={stocklist}
                    scrollIndicatorInsets={{right: 1}}
                    initialNumToRender={10}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.itemid}
                    ListEmptyComponent={<View style={[styles.middle]}><Image
                        style={[{height: 150, width: 150, opacity: 0.5}]}
                        source={require('../../../../assets/noitems.png')}
                    /><Paragraph style={[styles.paragraph,]}>No Records Found</Paragraph></View>}
                    onEndReachedThreshold={0.5}
                    progressViewOffset={100}
                />

                <View style={[styles.px_6, {marginBottom: 20}]}>
                    <Button
                        disable={!some}
                        secondbutton={!some}
                        onPress={() => {
                            if (some) {
                                let removedserials: any = [];

                                stocklist
                                    .filter((si: any) => Boolean(si?.removed))
                                    .forEach((si: any) => {
                                        removedserials = [
                                            ...removedserials,
                                            si.serialno
                                        ]
                                    });

                                item = {
                                    ...item,
                                    removedserials,
                                    productqnt: (item.stockonhand - removedserials.length).toString()
                                }

                                updateItem(item);
                                navigation.goBack();
                            }
                        }}> Apply </Button>
                </View>
            </Container>
        );
    }
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(RemoveSerialStock));

