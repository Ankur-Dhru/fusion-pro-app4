import React, {memo, useEffect, useState} from "react";
import {List, withTheme, Divider} from "react-native-paper";
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
import {getCurrentCompanyDetails, getInit, log} from "../../lib/functions";


const Index = (props: any) => {

    const {navigation, ticketsList, theme: {colors}, locations}: any = props;

    const [kotVisible, setKotVisible] = useState(false);

    useEffect(() => {
        let locationId = getCurrentCompanyDetails().locationid
        const kotVisible = locations[locationId]?.industrytype === "foodservices"
        setKotVisible(kotVisible)

    }, [])

    setNavigationOptions(navigation, "Ticket Settings", colors);

    const _deleteVoucherType = (id: any) => {
        deleteSettings("voucher", id, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "form")
            }
        })
    }

    const _navigate = (data?: any) => {
        navigation.navigate("TicketTypesForm", {...data})
    }

    const _renderItem = ({item}: any) => {

        let title = item?.tickettypename;
        if (item?.ticketnumberprefix) {
            title += ` (${item.ticketnumberprefix})`
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
                onPress={() => _navigate({tickettypeid: item.tickettypeid, title: item?.tickettypename})}
            >
                <List.Item
                    title={title}
                    description={`Type : ${item.tickettype}`}
                    right={props => <ListNavRightIcon {...props}/>}
                />
                <Divider style={[styles.divider, {borderBottomColor: colors.divider}]}/>
            </TouchableOpacity>
        </Swipeout>
    }

    return <Container surface={true}>
        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={Object.values(ticketsList).filter(({tickettype}: any) => kotVisible ? true : tickettype !== "kot")}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
    </Container>
}


const mapStateToProps = (state: any) => ({
    ticketsList: state?.appApiData.settings.tickets,
    ticketTypeList: state?.appApiData.settings.staticdata.tickets,
    locations: state?.appApiData.settings.location
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

