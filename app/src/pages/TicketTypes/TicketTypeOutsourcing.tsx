import React, {memo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Container} from "../../components";
import {connect} from "react-redux";
import {withTheme} from "react-native-paper";
import PageList from "../../components/PageList";
import {editOptionItem} from "../../lib/functions";

const pageList = [
    editOptionItem("Status", "OutsourcingStatusList"),
    editOptionItem("Custom Field", "OutsourcingCustomFieldList"),
]

const TicketTypeOutsourcing = (props: any) => {

    const {navigation, route,theme:{colors}}: any = props;
    const {editData, _onSubmit} = route?.params;
    setNavigationOptions(navigation, "General",colors, route);

    const _navigate = (data?: any) => {
        navigation.navigate(data.screen, {
            editData, ...data,
            _onSubmit: _onSubmit
        })
    }

    return <Container surface={true}>
        <PageList
            pageList={pageList.filter(({type}: any) => Boolean(type) ? type?.some((check: any) => check == editData?.tickettype) : true)}
            navigate={_navigate}
        />
    </Container>
}

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypeOutsourcing)));

