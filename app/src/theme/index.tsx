import {Dimensions, Platform, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import {platform} from "@haskkor/react-native-recaptchav3/dist/src/constants";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

let fontSize = 12;
if (Platform.OS !== 'web') {
    fontSize = 12;
}

// @ts-ignore
export const styles: any = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    font_xs: {
        transform: [{scale: 1}],
    },
    font_sm: {
        transform: [{scale: 1}],
    },
    font_md: {
        transform: [{scale: 1}],
    },
    font_lg: {
        transform: [{scale: 1}],
    },
    font_xl: {
        transform: [{scale: 1}],
    },
    screenCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexShrink: {
        flexShrink: 1,
    },
    transparent: {backgroundColor: 'transparent'},
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
    h_100: {height: '100%'},
    h_90: {height: Dimensions.get('window').height - 120},
    h_statement: {height: Dimensions.get('window').height - 410},
    h_80: {height: Dimensions.get('window').height - 250},
    flatlistHeight: {height: Dimensions.get('window').height - 160},
    w_100: {width: '100%'},
    mw_100: {maxWidth: '100%'},
    mh_100: {maxHeight: '100%'},
    miw_100: {minWidth: '100%'},
    mih_100: {minHeight: '100%'},
    noRecordFound:{height: Dimensions.get('window').height - 200},
    flexwidth: {alignSelf: 'flex-start'},
    m_0: {margin: 0},
    m_1: {margin: 2},
    m_2: {margin: 4},
    m_3: {margin: 6},
    m_4: {margin: 8},
    m_5: {margin: 10},
    mt_1: {marginTop: hp('0.25%')},
    mt_2: {marginTop: hp('0.5%')},
    mt_3: {marginTop: hp('0.75%')},
    mt_4: {marginTop: hp('1%')},
    mt_5: {marginTop: hp('2%')},
    mb_2: {marginBottom: hp('0.5%')},
    mb_3: {marginBottom: hp('0.75%')},
    mb_4: {marginBottom: hp('1.5%')},
    mb_5: {marginBottom: hp('2%')},
    mb_6: {marginBottom: hp('2.5%')},
    ml_1: {marginLeft: hp('0.5%')},
    mr_1: {marginRight: hp('0.5%')},
    ml_2: {marginLeft: hp('1.5%')},
    mr_2: {marginRight: hp('1.5%')},
    mr_4: {marginRight: hp('2.5%')},
    ml_auto: {marginLeft: 'auto'},
    mr_auto: {marginRight: 'auto'},
    mt_auto: {marginTop: 'auto'},
    mb_auto: {marginBottom: 'auto'},
    mb_10: {marginBottom: hp('2.5%')},
    p_0: {padding: hp('0%')},
    p_1: {padding: hp('0.1%')},
    p_2: {padding: hp('0.2%')},
    p_3: {padding: hp('0.3%')},
    p_4: {padding: hp('0.5%')},

    p_5: {padding: hp('1.5%')},
    pr_5: {paddingRight: hp('1.5%')},
    p_6: {padding: hp('2.5%')},
    pb_4: {paddingBottom: 15},
    py_3: {paddingTop: hp('0.5%'), paddingBottom: hp('0.5%')},
    py_4: {paddingTop: hp('1%'), paddingBottom: hp('1%')},
    py_5: {paddingTop: hp('1.5%'), paddingBottom: hp('1.5%')},
    py_6: {paddingTop: hp('2%'), paddingBottom: hp('2%')},
    py_7: {paddingTop: hp('2.5%'), paddingBottom: hp('2.5%')},
    py_2: {paddingTop: 2, paddingBottom: 2},
    px_4: {paddingLeft: hp('1%'), paddingRight: hp('1%')},
    px_5: {paddingLeft: hp('1.5%'), paddingRight: hp('1.5%')},
    px_6: {paddingLeft: hp('2.5%'), paddingRight: hp('2.5%')},
    pt_15: {paddingTop: 15},
    text_xxs: {fontSize: 9},
    text_xs: {fontSize: 12},
    text_sm: {fontSize: 15},
    text_md: {fontSize: 18},
    text_lg: {fontSize: 20},
    text_xl: {fontSize: 24},
    uppercase: {textTransform: 'capitalize'},
    description: {color: '#888'},
    ellipse: {},
    fieldspace: {paddingBottom: 10, marginBottom: 5, position: 'relative'},
    divider: {},
    hide: {display: 'none'},
    listitem: {paddingVertical: 5},


    left: {justifyContent: 'flex-start'},
    center: {justifyContent: 'center'},
    right: {justifyContent: 'flex-end'},
    top: {alignItems: 'flex-start'},
    middle: {alignItems: 'center'},
    bottom: {alignItems: 'flex-end'},
    m_auto: {margin: 'auto'},
    textCenter: {textAlign: 'center', justifyContent: 'center'},
    textRight: {textAlign: 'right'},
    head: {textTransform: 'capitalize', marginBottom: 3},
    headertitle: {maxWidth: windowWidth - 100, textAlign: 'center'},

    row: {flex: 1, flexDirection: 'row', width: '100%', marginBottom: hp('1.5%')},
    cell: {
        borderRadius: 0, paddingRight: hp('1.5%'), paddingLeft: 0,
        display: 'flex',
        shadowRadius: 0,
        shadowOpacity: 0,
        shadowColor: 'transparent',
        width: 'auto'
    },
    column: {flex: 1, flexDirection: 'column', height: '100%'},
    w_auto: {flex: 2},
    w150: {width: 80},

    roundedIcon: {
        padding: 10,
        backgroundColor: 'black',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    filterBox:{
      borderRadius:5,
        padding:10,
    },

    voucherDropdown: {
        fontSize: 14,
        marginBottom: 5
    },
    paragraph: {
        letterSpacing: -0.1,
        margin: 0,
        padding: 0,
        alignItems: 'center',
        fontSize: 15
    },
    inputLabel: {
        letterSpacing: -0.1,
        margin: 0,
        padding: 0,
        fontSize: 12,
        display: 'flex',
        marginBottom: 0,
        marginTop: 10,
    },

    opacity0: {
        opacity: 0
    },
    opacity1: {
        opacity: 1
    },

    box: {flexGrow: 1, width: 230, height: 130},

    grid: {display: 'flex', flexDirection: 'row', flexWrap: 'wrap'},
    justifyContentSpaceBetween: {justifyContent: "space-between"},
    autoGrid: {flexGrow: 1, flexDirection: 'row',},
    noWrap: {flexWrap: 'nowrap'},
    flexGrow: {flexGrow: 1},
    coverScreen: {height: '100%', width: '100%',flex:1},

    overflow: {overflow: 'scroll'},
    overflowy: {overflow: 'scroll'},

    badge: {backgroundColor: '#126AFB', borderRadius: 4, padding: 5, color: 'white', textTransform: "capitalize"}, //E6EFFE
    busy: {backgroundColor: '#880311'},
    Paid: {backgroundColor: '#29A745'},
    Unpaid: {backgroundColor: '#880311'},
    Inactive: {backgroundColor: '#880311'},
    Waiting: {backgroundColor: '#00358f'},
    Approved: {backgroundColor: '#29A745'},
    Open: {backgroundColor: '#00358f'},
    Delivered: {backgroundColor: '#29A745'},
    'Partial Paid':{backgroundColor: '#126AFB'},

    badgehighest: {backgroundColor: '#FD573A'},
    badgehigh: {backgroundColor: '#FD573A'},
    badgemedium: {backgroundColor: '#fdaa29'},
    badgelow: {backgroundColor: '#126AFB'},
    badgelowest: {backgroundColor: '#126AFB'},

    highest: {color: '#FD573A'},
    high: {color: '#FD573A'},
    medium: {color: '#fdaa29'},
    low: {color: '#126AFB'},
    lowest: {color: '#126AFB'},

    errorText: {color: '#EB4D3D', fontSize: 11},


    relative: {position: 'relative'},
    absolute: {position: 'absolute'},

    flexFont: {
        fontSize: fontSize,
    },
    borderLeftWide: {
        borderLeftColor: '#29a745',
        borderLeftWidth: 3,
    },
    borderRightWide: {
        borderRightColor: '#343A40',
        borderRightWidth: 3,
    },
    input: {
        flexGrow: 1,
        flexShrink: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 0
        // borderColor:'#ccc',
        // borderWidth:1,

    },
    dropdown: {
        paddingHorizontal: 0
    },
    bg_global: {
        backgroundColor: 'rgba(136,136,136,0.09)',
    },
    right_arrow: {
        backgroundColor: '#bbb',
    },
    bg_card: {
        backgroundColor: "#f4f4f4"
    },
    pageContent: {

        padding: hp('1.5%'),
        height: '100%',
        display: 'flex'
    },
    pageSpace: {
        padding: hp('1.5%')
    },
    picker: {
        height: 54,
        borderWidth: 0,
        marginLeft: 13,
        marginRight: 13,
        backgroundColor: 'transparent',
        color: 'white',
    },
    sm: {
        maxWidth: '100%',
        width: 380,
        marginLeft: 'auto',
        marginRight: 'auto',
        maxHeight: '100%',
    },
    md: {
        width: 680,
        maxWidth: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxHeight: '100%',
    },
    lg: {
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        width: 1240,
    },
    full: {
        height: '100%',
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        maxWidth: '100%',
        flex: 1,
        top: 0,
    },

    dialog_title: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        width: '100%',
    },
    dialog_content: {
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        minWidth: 320,
        height: '100%',
    },
    dialog_action: {
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingLeft: hp('1%'),
        paddingRight: hp('1%'),
        paddingTop: hp('1%'),
        paddingBottom: hp('1%'),
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    dialog_header: {
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: hp('1.5%'),
    },
    dialog_headerwithtab: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: hp('1%'),
    },

    justifyContent: {
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },

    appbar: {
        height: 60,
        elevation: 0,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlignVertical: 'center',
    },
    appbartitle: {
        textAlign: 'center',
        elevation: 0,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        width: 'auto',
        fontSize: 14
    },
    caption: {
        fontSize: 13,
        fontWeight: 'bold',

    },

    white: {color: 'white'},
    muted: {
        fontSize: 16,
        color: 'gray'
    },
    italic: {fontStyle: 'italic'},
    red: {color: '#980202'},
    green: {color: '#29A745'},
    yellow: {color: '#a77d29'},
    orange: {color: 'orange'},
    light: {color: '#A7AEB7'},
    tablerow: {minHeight: 30, borderColor: 'transparent', borderBottomWidth: 0},
    tablecell: {
        padding: hp('1.5%'),
        minWidth: 50,
        margin: hp('0.2%'),
        backgroundColor: 'transparent',
    },

    border: {borderColor: '#f3f3f3', borderStyle: 'solid', borderWidth: 1},
    borderTop: {borderTopColor: '#f3f3f32d', borderTopWidth: 1},
    borderBottom: {borderBottomColor: '#f3f3f32d', borderBottomWidth: 1},
    borderLeft: {borderLeftColor: '#f3f3f32d', borderLeftWidth: 1},
    borderRight: {borderRightColor: '#f3f3f32d', borderRightWidth: 1},
    light_paragraph: {
        lineHeight: 14,
        color: "#A7AEB7"
    },
    tab_item: {
        padding: 15,
        marginRight: 5,
        borderBottomWidth: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },

    radiusTop: {borderTopLeftRadius: 5, borderTopRightRadius: 5},
    borderRadius_0: {borderTopLeftRadius: 0, borderTopRightRadius: 0},

    selected: {backgroundColor: '#a77d29'},

    card: {
        elevation: 0,
        borderRadius: 12,
        marginBottom: hp('1.5%')
    },
    overdue:{
        backgroundColor:'#ffe8dc'
    },

    cardContent: {paddingHorizontal: hp('1.5%'), paddingVertical: 0},

    buttonBottom: {
        position: 'absolute',
        bottom: 0
    },
    submitbutton: {
        marginBottom: hp(platform.isIOS ? '0.5%' : '0.5%'),
    },

    shadow: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5
    },

    bg_light: {backgroundColor: '#F2F2F2'},
    bg_dark: {backgroundColor: '#000000'},
    bg_green: {backgroundColor: '#29A745'},
    bg_red: {backgroundColor: '#a72929'},
    bg_light_red: {backgroundColor: '#FFC5C5'},
    bg_yellow: {backgroundColor: '#a77d29'},
    bg_white: {backgroundColor: '#ffffff'},

    buttonContent: {},
    button_lg: {height: 100},
    button: {borderColor: '#343A40'},
    flexButton: {
        margin: hp('0.3%'),
        borderColor: '#343A40',
        justifyContent: 'center',
        flexGrow: 1,
    },
    buttonSelected: {backgroundColor: '#343A40'},

    bold: {fontWeight: 'bold'},
    linethrough: {textDecorationLine: 'line-through'},

    theme: {},

    flex: {flex: 1},

    tag: {height: hp('10%'), width: 200, flexGrow: 1},
    numberInput: {height: hp('4%')},

    payments: {width: wp('40%')},

    inputnumber: {paddingTop: hp('1%'), paddingBottom: '1%'},

    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    fieldError: {
        padding: '0px 10px',
        marginTop: '-5px',
    },
    numbers: {margin: 5, width: 60, height: 60},
    capitalize: {
        textTransform: 'capitalize',
        letterSpacing: 0
    },
    discountlimit: {
        backgroundColor: '#DC3544',
        color: 'white',
        padding: 4,
        fontWeight: 'bold',
        borderRadius: 5,
        textAlign: 'center',
    },
    width320: {
        width: 320,
    },
    padding10: {
        padding: 10,
    },
    paddingLeftRight10: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    marginBottom10: {marginBottom: 10},
    marginTop10: {marginTop: 10},
    marginLeft10: {marginLeft: 10},
    paddingLeft10: {paddingLeft: 10},

    width2x4: {minWidth: '25%', maxWidth: '25%', height: '50%'},
    width2x3: {minWidth: '33.33%', maxWidth: '33.33%', height: '50%'},
    width2x2: {minWidth: '50%', maxWidth: '50%', height: '50%'},
    width2x1: {minWidth: '100%', maxWidth: '100%', height: '50%'},
    width1x4: {minWidth: '25%', maxWidth: '25%', height: '100%'},
    width1x3: {minWidth: '33.33%', maxWidth: '33.33%', height: '100%'},
    width1x2: {minWidth: '50%', maxWidth: '50%', height: '100%'},
    width1x1: {minWidth: '100%', maxWidth: '100%', height: '100%'},

    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 50,
        flexWrap: 'wrap',
    },
    switch: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: 2,
        paddingVertical: 10,
        width: Dimensions.get('window').width / 3,
    },

    noshadow: {
        elevation: 0,
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    zoom: {
        flexGrow: 1,
        maxWidth: '33.3%',
        minWidth: '33.3%',
        borderWidth: 1,
        borderColor: '#ffffff03',
    },

    standaloneRowBack: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
    },

    cancelled: {
        textDecorationLine: 'line-through',
        color: '#a72929',
    },


    root: {flex: 1, padding: 20},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20},
    cellBox: {
        width: 50,
        height: 50,
        borderRadius:5,
        lineHeight: 45,
        fontSize: 24,
        borderWidth: 1,
        borderColor: '#00000030',
        textAlign: 'center',
        margin:5
    },
    focusCell: {
        borderColor: '#000',
    },

    socket: {
        position: 'absolute',
        bottom: 0,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 10,
        zIndex: 999,
        borderWidth: 1,
        borderColor: 'white'
    },
    tags: {
        backgroundColor: "#ccc",
    },
    tagContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    tagInputContainer: {
        flex: 1,
        marginRight: 8,
    },
    tagButton: {
        alignItems: "center",
        justifyContent: "center",
        padding: 6,
        borderRadius: 8
    },
    tagItem: {
        backgroundColor: "#ccc",
        marginRight: 4,
        marginTop: 4,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 4,
        paddingRight: 4,
        borderRadius: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    tagText: {
        color: "white",
        fontSize: 16,
    },
    chartResponseIcon: {
        color: "#3d86f6",
        fontSize: 16,
        transform: [
            {
                rotate: "-140.00deg"
            }
        ],
        alignSelf: "flex-end",
        right: -2,
        top: 28,
        position: "absolute",
        zIndex: -1
    } ,
    attachedListView: {
        paddingLeft: 8,
        paddingRight: 8,
        flexDirection: "row",
        alignSelf: "stretch",
        flexWrap: 'wrap',
        overflow: "scroll"
    },
    attachContainer: {
        flexDirection: "row",
        alignSelf: "flex-start",
        alignItems: "center",
        padding: 4,
        borderWidth: 1,
        borderColor: "rgb(200,200,200)",
        borderRadius: 8,
        marginRight: 4,
        marginTop: 4,
        marginBottom: 4
    },
    attachementtext: {
        color: "rgb(128,128,128)",
        marginRight: 4,
        marginLeft: 4,
        maxWidth: 250,
        overflow: "hidden",
    },
});
