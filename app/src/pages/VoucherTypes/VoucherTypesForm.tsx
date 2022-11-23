import React, {memo} from "react";
import {List, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {TouchableOpacity} from "react-native";
import {styles} from "../../theme";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {deleteSettings, putSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {editOptionItem, getInit} from "../../lib/functions";
import {SUCCESS} from "../../lib/ServerRequest";


const VoucherTypesForm = (props: any) => {

    const {navigation, route, voucherList,theme:{colors}}: any = props;

    setNavigationOptions(navigation, "Voucher Types",colors, route);

    const _deleteTaxGroup = (id: any) => {
        deleteSettings("tax", id, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "form")
            }
        })
    }


    const _navigate = (data?: any) => {
        navigation.navigate(data.screen, {
            editData: voucherList[route.params.vouchertypeid], ...data,
            _onSubmit: _onSubmit
        })
    }

    const _onSubmit = (values: any) => {

        voucherList[values.vouchertypeid] = values

        putSettings("voucher", voucherList, true).then((result: any) => {
            if (result.status === SUCCESS) {
                getInit(null, null, null, () => navigation.goBack(), "form", true)
            }
        })
    }


    const _renderItem = ({item}: any) => {
        return <TouchableOpacity
            onPress={() => _navigate(item)}
        >
            <List.Item
                title={item.title}
                right={props => <ListNavRightIcon {...props}/>}
            />
            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
        </TouchableOpacity>
    }


    return <Container surface={true}>
        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={[
                editOptionItem("General", "VoucherTypeGeneral"),
                editOptionItem("Accounting / Discount", "VoucherTypeAccounting"),
            ]}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
    </Container>
}


const mapStateToProps = (state: any) => ({
    voucherList: state?.appApiData.settings.voucher,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(VoucherTypesForm)));

