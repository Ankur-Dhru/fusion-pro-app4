import React, {memo, useEffect, useState} from "react";
import {List, Title, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container, ProIcon} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {findObject} from "../../lib/functions";
import {TouchableOpacity} from "react-native";
import Swipeout from "rc-swipeout";
import {styles} from "../../theme";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import {deleteSettings, getPaymentGateway} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";

import {useIsFocused} from '@react-navigation/native';
import requestApi, {actions, methods} from "../../lib/ServerRequest";
import BottomSpace from "../../components/BottomSpace";

const Index = (props: any) => {
    const [paymentList, setPaymentList] = useState<any[]>([]);

    const {navigation, chartOfAccountList,theme:{colors}}: any = props;

    setNavigationOptions(navigation, "Payment Method",colors);

    const isFocused = useIsFocused();


    const loadGateway = () => {
        getPaymentGateway().then((response: any) => {
            if (response.status == STATUS.SUCCESS && response.data) {
                let listData: any = [];

                Object.keys(response.data)
                    .filter((gatewayid) => response.data[gatewayid])
                    .forEach((gatewayid: any) => {
                        let {settings, ...other} = response.data[gatewayid];
                        let gateway = Object.keys(other)[0];
                        let displayname = other[gateway].find((item: any) => Boolean(item.input === "displayname"))

                        let find = findObject(chartOfAccountList, 'accountid', settings.paymentaccount);

                        listData.push({
                            gatewayid,
                            gateway,
                            displayname: displayname.value,
                            accountname: find[0]?.accountname,
                            settings,
                            customfields: other[gateway]
                        })
                    })
                setPaymentList(listData);
            }
        })
    }

    useEffect(() => {
        if (isFocused) {
            loadGateway();
        }
    }, [isFocused])


    const _deleteGateway = (gatewayid: any) => {
        requestApi({
            method: methods.delete,
            action: actions.paymentgateway,
            body: {gatewayid},
            showlog: true
        }).then((result) => {
            if (result.status === STATUS.SUCCESS) {
                deleteSettings("paymentgateway", gatewayid, (result: any) => {
                    if (result.status === STATUS.SUCCESS) {
                        loadGateway()
                    }
                })
            }
        })
    }


    const _navigate = (params?: any) => {
        let data = {};
        if (params) {
            data = {payment: params, title: `${params?.displayname}`};
        }
        navigation.navigate("PaymentMethodForm", data)
    }

    navigation.setOptions({
        headerLargeTitleStyle:{color:colors.inputbox},
        headerTitleStyle:{color:colors.inputbox},
        headerRight: (props: any) => {
            return <Title
                onPress={() => _navigate()}>
                <ProIcon name="plus"/>
            </Title>
        }
    });

    const _renderItem = ({item}: any) => {

        let title = item.displayname, description = `Payment : ${item?.settings?.paymentmethod}`;
        if (item?.gateway) {
            title += ` (${item?.gateway})`
        }
        if (item?.accountname) {
            description += ` | Account : ${item?.accountname}`
        }

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteGateway(item?.gatewayid),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            disabled={Boolean(item?.system)}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate(item)}
            >
                <List.Item
                    title={title}
                    titleNumberOfLines={20}
                    description={description}
                    right={props => <ListNavRightIcon {...props}/>}
                />
                <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
            </TouchableOpacity>
        </Swipeout>
    }


    return <Container  surface={true}>

        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={paymentList}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
        <BottomSpace/>
    </Container>
}


const mapStateToProps = (state: any) => ({
    chartOfAccountList: state?.appApiData.settings.chartofaccount
})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

