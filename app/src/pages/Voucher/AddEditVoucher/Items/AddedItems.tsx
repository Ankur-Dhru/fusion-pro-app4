import React, {Component} from 'react';
import {
    Dimensions,
    InputAccessoryView,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text, TextInput as TextInputReact,
    TouchableOpacity,
    View
} from 'react-native';
import {styles} from "../../../../theme";

import {Button, InputBox, ProIcon} from "../../../../components";
import {connect} from "react-redux";
import {Dialog, Divider, Paragraph, Surface, TextInput, TextInput as TI, withTheme} from "react-native-paper";

import {
    clone, getCurrencySign,
    getLabel,
    getType,
    isEmpty,
    log,
    objectToArray,
    toCurrency,
    updateComponent
} from "../../../../lib/functions";
import {setItems, setVoucherItems, updateVoucherItems} from "../../../../lib/Store/actions/appApiData";

import EditItem from "./EditItem";


import {setDialog} from "../../../../lib/Store/actions/components";
import {voucher} from "../../../../lib/setting";
import Swipeout from "rc-swipeout";
import {options_itc} from "../../../../lib/static";
import {itemTotalCalculation} from "../../../../lib/voucher_calc";
import InputField from "../../../../components/InputField";



class AddedItems extends Component<any> {

    title: any;
    sheetRef: any;
    scanner: any;
    totals: any = 0;
    moreItemRef: any;
    isShow: any;

    swipeableRef: any;
    row: Array<any> = [];
    prevOpenedRow: any;

    option_notaxreason: any;
    selectedItem: any = ''
    autoFocusRef: any;


    constructor(props: any) {
        super(props);
        this.state = {searchbar: false, updatePrice: false, filters: [], editmode: false, focus: false};

        this.sheetRef = React.createRef()
        this.scanner = React.createRef()
        this.moreItemRef = React.createRef();
        this.swipeableRef = React.createRef();
        this.autoFocusRef = React.createRef();
        this.isShow = false;

        this.option_notaxreason = [];

        if (props.settings?.reason?.notaxreason) {
            this.option_notaxreason = Object.keys(props.settings?.reason?.notaxreason).map((key: any) => {
                let reason = props.settings?.reason?.notaxreason[key];
                return {label: reason, value: key}
            })
        }


        //////// onload calculate all types of item amounts////////

        const {companydetails, settings, voucheritems}: any = props;

        let currentcompany = companydetails.companies[companydetails.currentuser];

        let clientcurrency = voucher.data.currency;
        let companycurrency = currentcompany?.defaultcurrency?.__key;

        voucher.data = itemTotalCalculation({
                ...voucher.data,
                invoiceitems: objectToArray(clone(voucheritems))
            },
            settings.tds,
            settings.tcs,
            clientcurrency,
            companycurrency,
            settings.currency?.[clientcurrency]?.decimalplace,
            settings.currency?.[companycurrency]?.decimalplace,
            false,
            false)

        /////////////////////

    }


    getTotal = () => {
        const {voucheritems} = this.props;
        let total = 0;
        Object.keys(voucheritems).map((key: any) => {
            let item = voucheritems[key];
            if (item.productqnt > 0) {
                total += item.productqnt * (item.productratedisplay || 0)
            }
        })
        return total;
    }

    removeItem = (item: any) => {
        const {voucheritems, updateVoucherItems} = this.props;
        if (!Boolean(item.itemunique)) {
            item.itemunique = item.voucheritemid
        }
        let items = clone(voucheritems);
        delete items[item.itemunique];
        updateVoucherItems(items);
    }

    updateItem = (item: any) => {
        if (!isEmpty(item.updatedserial)) {
            item.updatedserial = item.updatedserial
                .map(({checked, ...data}: any) => {
                    if (!Boolean(checked)) {
                        data.newserial = data.oldserial
                    }
                    return data
                });
            if (!isEmpty(item.serial)) {
                let serial: any = {};
                Object.keys(item.serial).map((key: any) => {
                    let serialItem = item.serial[key];
                    let findUpdated = item.updatedserial.find(({oldserial}: any) => oldserial === serialItem.serialno)
                    serialItem.serialno = findUpdated.newserial;
                    serialItem.mfdno = findUpdated.mfdno;
                    serial[key] = serialItem;
                })
                item.serial = serial;
            }
        }
        const {setVoucherItems} = this.props;

        setVoucherItems(item);
    }

    // swipeRight = (progress: any, dragX: any) => {
    //     const scale = dragX.interpolate({
    //         inputRange: [-200, 0],
    //         outputRange: [1, 0.5],
    //         extrapolate: 'clamp'
    //     })
    //     return (
    //         <Animated.View style={{width: "100%", justifyContent: 'center'}}>
    //             <Animated.Text style={{
    //                 marginLeft: 'auto',
    //                 color: styles.red.color,
    //                 marginRight: 50,
    //                 fontSize: 15,
    //                 fontWeight: 'bold',
    //                 transform: [{scale}]
    //             }}>Delete Item</Animated.Text>
    //         </Animated.View>
    //     )
    // }

    animatedDelete = (item: any, index: any) => {
        if (this.prevOpenedRow && this.prevOpenedRow !== this.row[index]) {
            this.prevOpenedRow.close();
        }
        this.prevOpenedRow = this.row[index];
        this.removeItem(item);

        this.prevOpenedRow && this.prevOpenedRow.close()
    }


    renderItem = (item: any, index: any) => {
        const {navigation, settings, editmode, hidetitle, theme: {colors}} = this.props;

        if (item?.voucheritemid) {
            item.itemunique = item?.voucheritemid;
        }

        return (

            <>

                <Swipeout
                    right={[
                        {
                            text: 'Delete',
                            onPress: () => {
                                this.removeItem(item);
                            },
                            style: {backgroundColor: styles.red.color, color: 'white'},
                        }
                    ]}
                    autoClose={true}
                    disabled={!editmode}
                    style={{backgroundColor: 'transparent'}}
                >
                    <View key={item.itemunique}>
                        <View style={[styles.mt_4]}>
                            <View>

                                <TouchableOpacity onPress={() => {

                                    if (editmode) {
                                        navigation.navigate('EditItem', {
                                            screen: EditItem,
                                            item: item,
                                            updateItem: this.updateItem,
                                        })
                                    }
                                }}>

                                    <View style={[styles.row, {paddingRight: 4}]}>
                                        {editmode && !hidetitle && <View style={[styles.cell, {paddingLeft: 0}]}>
                                            <TouchableOpacity onPress={() => this.removeItem(item)}>
                                                <ProIcon color={'#a72929'} name={'circle-xmark'}/>
                                            </TouchableOpacity>
                                        </View>}
                                        <View style={[styles.cell, styles.w_auto, {paddingLeft: 0}]}>
                                            <Paragraph
                                                style={[styles.paragraph, styles.text_sm, styles.bold, styles.ellipse]}
                                                numberOfLines={1}>{item.itemname || item.productdisplayname}</Paragraph>
                                            <View style={[styles.middle, styles.row, {marginBottom: 0}]}>
                                                <Text style={[styles.badge, styles.text_xxs, {
                                                    padding: 1,
                                                    textAlignVertical: 'top',
                                                    borderRadius: 2,
                                                    textTransform: 'uppercase',
                                                    backgroundColor: item.itemtype === 'service' ? 'orange' : 'green'
                                                }]}>
                                                    {item.itemtype}
                                                </Text>
                                                {
                                                    !Boolean(voucher?.settings?.outsourcing) &&
                                                    <View style={[styles.grid, {marginLeft: 10}]}>
                                                        <Paragraph style={[styles.paragraph, styles.text_xs]}>
                                                            {item.productqnt} {settings.unit[item.productqntunitid] && settings.unit[item.productqntunitid].unitcode} x
                                                        </Paragraph>

                                                            <Paragraph
                                                                style={[styles.paragraph, styles.text_xs,  {paddingLeft: 5}]}>{toCurrency(item.productratedisplay || '0')}</Paragraph>

                                                        <Paragraph
                                                            style={[styles.paragraph, styles.text_xs]}> each </Paragraph></View>
                                                }
                                            </View>
                                            {Boolean(item.hsn) && <Paragraph
                                                style={[styles.paragraph, styles.muted, styles.text_xs]}>{item.itemtype === 'service' ? 'SAC Code' : 'HSN Code'} : {item.hsn}</Paragraph>}
                                            {Boolean(item.sku) &&
                                                <Paragraph style={[styles.paragraph, styles.muted, styles.text_xs]}>SKU
                                                    : {item.sku}</Paragraph>}


                                            {voucher.settings.eligibleforitc && <Paragraph
                                                style={[styles.paragraph, styles.text_xs]}>{settings?.tax[item?.producttaxgroupid]?.notaxreasonenable ? getLabel(this.option_notaxreason, item.taxreason) : getLabel(options_itc, item.itc)}</Paragraph>}


                                            <View style={[styles.grid, styles.middle]}>

                                                {Boolean(item.serial) && <View style={[styles.w_auto]}>
                                                    <View>
                                                        {
                                                            Object.keys(item.serial).map((key: any) => {
                                                                return (
                                                                    <Paragraph>
                                                                        <Paragraph
                                                                            style={[styles.paragraph, styles.muted, styles.text_xs, styles.mr_2]}>Serial
                                                                            No
                                                                            : {getType(item.serial[key]) === 'object' ? item.serial[key].serialno : item.serial[key]}</Paragraph>
                                                                        {Boolean(item.serial[key].mfdno) && <Paragraph
                                                                            style={[styles.paragraph, styles.muted, styles.text_xs]}> MFD
                                                                            No : {item.serial[key].mfdno}</Paragraph>}
                                                                    </Paragraph>
                                                                )
                                                            })
                                                        }
                                                    </View>
                                                </View>}


                                            </View>

                                        </View>
                                        <View style={[styles.cell, {paddingRight: 0}]}>

                                            <TouchableOpacity onPress={() => {
                                                if (editmode) {
                                                    this.selectedItem = clone(item);
                                                    this.selectedItem.productratedisplay = this.selectedItem.productratedisplay || '0'
                                                    this.setState({updatePrice: true})

                                                }
                                            }}>
                                            <Paragraph
                                                style={[styles.paragraph, styles.text_sm, styles.textRight, styles.bold, Boolean(item.productdiscountvalue !== '0' && item.productdiscountvalue) && {
                                                    textDecorationLine: 'line-through',
                                                    color: styles.red.color
                                                }]}>
                                                {/*{toCurrency(item.productratedisplay * item.productqnt)}*/}
                                                {toCurrency(item.item_total_amount_display || '0')}
                                            </Paragraph>


                                            {Boolean(item.productdiscountvalue !== '0') &&
                                                <>
                                                    <Paragraph
                                                        style={[styles.paragraph, styles.text_sm, styles.textRight, styles.bold]}>
                                                        {toCurrency((item.item_total_amount_display - item.item_total_inline_discount_display))}
                                                    </Paragraph></>}
                                            <Paragraph style={[styles.paragraph, styles.text_xs, styles.textRight]}>
                                                {settings?.tax[item.producttaxgroupid]?.taxgroupname}
                                            </Paragraph>

                                            </TouchableOpacity>
                                        </View>
                                    </View>


                                </TouchableOpacity>

                            </View>

                        </View>

                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>

                    </View>
                </Swipeout>


            </>

        );
    };


    render() {

        const {voucheritems, navigation, hidetitle, theme: {colors}} = this.props;
        const {updatePrice, focus}: any = this.state;

        const inputAccessoryViewID = 'uniqueID';
        //let addeditems: any = objToArray(voucheritems)
        let addeditems: any = voucher.data.invoiceitems;

        return (
            <>
                {Boolean(addeditems && addeditems.length) && <View style={[styles.mb_4]}>
                    <><View>
                        <Paragraph
                            style={[styles.paragraph, styles.caption]}>{addeditems && addeditems.length} ITEM{addeditems && addeditems.length > 1 ? 'S' : ''}</Paragraph>
                    </View>
                        <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/></>

                    {addeditems && Boolean(addeditems.length) && <View style={[styles.mt_4]}>
                        {
                            addeditems.slice(0, 10).map((item: any, index: any) => {
                                return this.renderItem(item, index)
                            })
                        }
                    </View>}

                    {addeditems && Boolean(addeditems.length > 10) && <View>
                        <TouchableOpacity style={[styles.mt_4, styles.py_5]} onPress={() => {
                            this.isShow = !this.isShow;
                            updateComponent(this.moreItemRef, 'display', this.isShow ? 'flex' : 'none')
                        }}>

                            <View style={[styles.grid, styles.middle]}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>
                                    View More Items
                                </Paragraph>
                                <ProIcon name={`chevron-down`} size={12}/>
                            </View>

                        </TouchableOpacity>

                        <View style={[{display: 'none'}]} ref={this.moreItemRef}>

                            <View style={[styles.mt_4]}>
                                {
                                    addeditems.slice(10, 100).map((item: any, index: any) => {
                                        return this.renderItem(item, index)
                                    })
                                }
                            </View>

                        </View>

                    </View>}

                    {<>
                        {!hidetitle && Boolean(addeditems.length) &&
                            <View style={[styles.py_5, styles.grid, styles.justifyContent]}>
                                <Button onPress={() => {
                                    if (voucher.type.vouchertypeid === 'f3e46b64-f315-4c56-b2d7-58591c09d6e5' &&
                                        Boolean(voucher.data.voucherid)) {
                                        this.props.validate();
                                    }
                                    navigation.goBack()
                                }}> {'Detail View'} </Button>
                                <View>

                                    <Button
                                        onPress={() => {
                                            this.props.validate()
                                        }}> {Boolean(voucher.data.voucherid) ? 'Update' : voucher.settings.addpayment ? 'Proceed to Payment' : `Generate ${voucher.type.label}`} </Button>

                                </View>
                            </View>}
                    </>}

                    <Modal visible={updatePrice && Platform.OS !== 'ios'} transparent={true} onShow={() => {
                        this.autoFocusRef.current.focus()
                    }}>
                        <View>

                            <View>

                                <View style={{height: Dimensions.get('window').height - 370}}></View>

                                <View
                                    style={[styles.grid, styles.middle, {backgroundColor: 'white', marginTop: 'auto'}]}>
                                    <View style={[styles.p_5, styles.w_auto]}>

                                        <TextInput
                                            defaultValue={this.selectedItem.productratedisplay + ''}
                                            label={"Price"}
                                            ref={this.autoFocusRef}
                                            autoFocus={focus}
                                            mode={'flat'}
                                            style={{backgroundColor: colors.backgroundColor}}
                                            dense={true}

                                            keyboardType='numeric'
                                            left={<TextInput.Affix text={getCurrencySign()}/>}
                                            onChange={(value: any) => {

                                            }}
                                            onEndEditing={(e: any) => {
                                                this.selectedItem.productratedisplay = e.nativeEvent.text;
                                                this.updateItem(clone(this.selectedItem));
                                                this.setState({updatePrice: false, focus: false})
                                            }}
                                        />

                                    </View>
                                    <View style={[styles.p_2, {marginLeft: 'auto',marginRight:10}]}>
                                        <Button onPress={() => {

                                        }}>OK</Button>
                                    </View>
                                </View>


                            </View>
                        </View>
                    </Modal>

                    <>
                        {updatePrice && Platform.OS === 'ios' && <><View style={[{display: 'none'}]}><TextInput
                            inputAccessoryViewID={inputAccessoryViewID}
                            autoFocus={true}
                            keyboardType='numeric'
                            value={this.props.reflection}
                            onChange={e => this.props.onChange('reflection', e)}
                        /></View>
                            <InputAccessoryView nativeID={inputAccessoryViewID} backgroundColor={'white'}>
                                <View style={[styles.grid, styles.middle, {backgroundColor: 'white'}]}>
                                    <View style={[styles.p_5, styles.w_auto]}>
                                        <InputField
                                            defaultValue={this.selectedItem?.productratedisplay + ''}
                                            label={"Price"}
                                            divider={false}
                                            inputtype={'textbox'}
                                            keyboardType='numeric'
                                            autoFocus={true}
                                            left={<TextInput.Affix text={getCurrencySign()}/>}
                                            onChange={(value: any) => {

                                            }}
                                            onEndEditing={(e: any) => {
                                                this.selectedItem.productratedisplay = e.nativeEvent.text;
                                                this.updateItem(this.selectedItem);
                                                this.setState({updatePrice: false})
                                            }}
                                        />
                                    </View>
                                    <View style={[styles.p_2, {marginLeft: 'auto',marginRight:10}]}>
                                        <Button onPress={() => {

                                        }}>OK</Button>
                                    </View>
                                </View>
                            </InputAccessoryView>
                        </>}
                    </>


                </View>}
            </>
        )
    }
}


const mapStateToProps = (state: any) => ({
    companydetails: state.appApiData.companydetails,
    items: state.appApiData.items,
    voucheritems: state.appApiData.voucheritems,
    settings: state.appApiData.settings,
})
const mapDispatchToProps = (dispatch: any) => ({
    setItems: (items: any) => dispatch(setItems(items)),
    setDialog: (dialog: any) => dispatch(setDialog(dialog)),
    setVoucherItems: (items: any) => dispatch(setVoucherItems(items)),
    updateVoucherItems: (items: any) => dispatch(updateVoucherItems(items)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AddedItems));


