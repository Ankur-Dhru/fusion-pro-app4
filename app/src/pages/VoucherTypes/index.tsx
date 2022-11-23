import React, {memo} from "react";
import {List, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {TouchableOpacity} from "react-native";
import Swipeout from "rc-swipeout";
import {styles} from "../../theme";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {getInit} from "../../lib/functions";


const Index = (props: any) => {

    const {navigation, voucherList, voucherTypeList,theme:{colors}}: any = props;

    setNavigationOptions(navigation, "Voucher Settings",colors);

    const _deleteVoucherType = (id: any) => {
        deleteSettings("voucher", id, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        })
    }


    const _navigate = (data?: any) => {
        navigation.navigate("VoucherTypesForm", {...data})
    }


    const _renderItem = ({item}: any) => {

        let title = item?.vouchertypename, description = "";
        if (item?.vouchernumberprefix) {
            title += ` (${item.vouchernumberprefix})`
        }
        if (item?.vouchertype && voucherTypeList[item?.vouchertype]?.name) {
            description = `Voucher Type : ${voucherTypeList[item?.vouchertype].name}`;
        }

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteVoucherType(item.vouchertypeid),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={Boolean(item?.issystemaccount)}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate({vouchertypeid: item.vouchertypeid, title: item?.vouchertypename})}
            >
                <List.Item
                    title={title}
                    description={description}
                    right={props => <ListNavRightIcon {...props}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        </Swipeout>
    }


    return <Container surface={true}>
        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={Object.values(voucherList)}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
    </Container>
}


const mapStateToProps = (state: any) => ({
    voucherList: state?.appApiData.settings.voucher,
    voucherTypeList: state?.appApiData.settings.staticdata.vouchertypes,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

