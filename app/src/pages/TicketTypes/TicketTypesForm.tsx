import React, {memo, useEffect, useState} from "react";
import {withTheme} from "react-native-paper";
import {Container} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {putTickets} from "../../lib/ServerRequest/api";
import {editOptionItem} from "../../lib/functions";
import PageList from "../../components/PageList";

const pageList = [
    editOptionItem("General", "TicketTypeGeneral", true),
    editOptionItem("Settings", "TicketTypeSettings", true, ["kot"]),
    editOptionItem("Task Type", "TicketTypeTaskType", false, ["task"]),
    editOptionItem("Ticket Status", "TicketTypeTicketStatus", true),
    editOptionItem("Kanban Board", "TicketTypeKanbanBoard", false, ["task"]),
    editOptionItem("Screens", "TicketTypeScreens", false, ["task"]),
    // editOptionItem("Outsourcing", "TicketTypeOutsourcing", false, ["task"]),
]

const TicketTypesForm = (props: any) => {

    const {navigation, route, ticketsList,theme:{colors}}: any = props;

    setNavigationOptions(navigation, "Ticket Types",colors, route);

    const [editData, setEditData] = useState<any>({})

    useEffect(() => {
        setEditData(ticketsList[route.params.tickettypeid])
    }, [ticketsList])

    const _navigate = (data?: any) => {
        navigation.navigate(data.screen, {
            editData, ...data,
            _onSubmit: _onSubmit
        })
    }


    const _onSubmit = (values: any) => {
        putTickets(values.tickettypeid, values).then(() => {
            navigation.goBack()
        })
    }

    return <Container surface={true}>
        <PageList
            pageList={pageList.filter(({type}: any) => Boolean(type) ? type?.some((check: any) => check == editData?.tickettype) : true)}
            navigate={_navigate}
        />
    </Container>
}


const mapStateToProps = (state: any) => ({
    ticketsList: state?.appApiData.settings.tickets,
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(TicketTypesForm)));

