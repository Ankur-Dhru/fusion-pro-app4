import React, {memo} from "react";
import {List, Title, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Button, Container, ProIcon} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {getInit, log, toCurrency} from "../../lib/functions";
import {TouchableOpacity, View} from "react-native";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import { styles } from "../../theme";
import BottomSpace from "../../components/BottomSpace";
import {voucher} from "../../lib/setting";
import KAccessoryView from "../../components/KAccessoryView";
import requestApi, {actions as act, methods, SUCCESS} from "../../lib/ServerRequest";

const Index = (props: any) => {


    const {currencyList, navigation,theme:{colors}}: any = props;
    setNavigationOptions(navigation, "Currency",colors);


    const _navigate = (params?: any) => {
        let data ={};
        if (params) {
            data = {currency:params, title: `${params?.__key}`};
        }
        navigation.navigate("CurrencyForm", data)
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
        const {colors}:any = props.theme;
        return <TouchableOpacity
            onPress={() => {
                _navigate({...item, currency:item?.__key})
            }}
        >
            <List.Item
                title={`${item?.__key}`}
                description={toCurrency(item.rate, item?.__key, item?.decimalplace)}
                right={props => <ListNavRightIcon {...props}/>}
            />
            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
        </TouchableOpacity>
    }

    const updateLiveCurrencyRate = () => {

        let currencies = (Object.keys(currencyList).map((key) => key).join(','));

        requestApi({
            method: methods.get,
            action: act.currency,
            queryString:{currency:currencies},
            loader:true,
            showlog:true,
        }).then((result) => {
            if (result.status === SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        });
    }


    return <Container  surface={true}>

        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={Object.keys(currencyList).map((key) => ({__key: key, ...currencyList[key]}))}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />

        <View style={[styles.submitbutton,styles.mb_5,styles.px_5]}>
            <Button   onPress={() => {updateLiveCurrencyRate()}}> Update Live currency rate </Button>
        </View>



    </Container>
}


const mapStateToProps = (state: any) => ({
    currencyList: state?.appApiData.settings.currency
})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

