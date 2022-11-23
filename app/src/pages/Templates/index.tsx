import React, {memo, useEffect, useState} from "react";
import {List, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {TouchableOpacity} from "react-native";
import {errorAlert, filterArray, isEmpty, log} from "../../lib/functions";
import {getEmailTemplate, getNotificationTemplate, getPrintingTemplate} from "../../lib/ServerRequest/api";
import {MESSAGE, printerTypes, STATUS} from "../../lib/static";
import Search from "../../components/SearchBox";
import BottomSpace from "../../components/BottomSpace";
import {styles} from "../../theme";


const Index = (props: any) => {

    const {navigation, route, emailtemplategroup, notificationtemplategroup,theme: {colors}}: any = props;
    const [listData, setListData] = useState<any>([]);
    const [filterList, setFilterList] = useState<any>([]);


    const loadPrintingTemplate = () => {
        getPrintingTemplate().then((response: any) => {
            if (response.status === STATUS.SUCCESS) {
                const data = Object.values(response.data).map((t: any) => {
                    let title = t.templatename;
                    let description = "";

                    if (t?.templategroup) {
                        description += `Group : ${t?.templategroup}`
                    }
                    if (t?.type) {
                        description += ` | Type : ${printerTypes[t?.type]}`
                    }

                    return {
                        ...t,
                        title,
                        description
                    }
                });
                setListData(data);
            }
        })
    }

    const loadEmailTemplate = () => {
        getEmailTemplate().then((response: any) => {
            if (response.status === STATUS.SUCCESS) {
                const data = Object.values(response.data).map((t: any) => {
                    let title = t.templatename;
                    let description = "";

                    if (t?.emailgroupid) {

                        description += `Group : ${emailtemplategroup[t?.emailgroupid]?.templategroupname}`
                    }

                    return {
                        ...t,
                        title,
                        description
                    }
                });
                setListData(data);
            }
        })
    }

    const loadNotificationTemplate = () => {
        getNotificationTemplate().then((response: any) => {
            if (response.status === STATUS.SUCCESS) {
                const data = Object.values(response.data).map((t: any) => {
                    let title = t.notificationname;
                    let description = "";

                    if (t?.notificationgroup) {
                        description += `Group : ${notificationtemplategroup[t?.notificationgroup]?.templategroupname}`
                    }

                    return {
                        ...t,
                        title,
                        description
                    }
                });
                setListData(data);
            }
        })
    }

    useEffect(() => {
        if (route.params.templateKey === "printingtemplate") {
            loadPrintingTemplate();
        } else if (route.params.templateKey === "mailTemplate") {
            loadEmailTemplate();
        } else if (route.params.templateKey === "notificationTemplate") {
            loadNotificationTemplate();
        }
    }, [])

    useEffect(() => {
        setFilterList(listData);
    }, [listData])

    setNavigationOptions(navigation, "Units",colors, route);

    const _renderItem = ({item}: any) => {
        return <TouchableOpacity
            onPress={() => errorAlert(MESSAGE.FEATURE_ONLY_WEB)}
        >
            <List.Item
                title={item.title}
                description={item.description}
            />
            <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>
        </TouchableOpacity>
    }


    const _handleSearch = (search: any) => {
        if (!isEmpty(listData)) {
            let filterData = listData;
            if (Boolean(search)) {
                filterData = filterArray(listData, ['title', "description"], search)
            }
            setFilterList(filterData)
        }
    }

    return <Container  surface={true}>
        <FlatList
            keyboardShouldPersistTaps={'handled'}
            scrollIndicatorInsets={{right: 1}}
            data={filterList}
            ListHeaderComponent={<Search autoFocus={false} placeholder={`Search...`} handleSearch={_handleSearch}/>}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />
        <BottomSpace/>
    </Container>
}


const mapStateToProps = (state: any) => ({
    emailtemplategroup: state.appApiData.settings.emailtemplategroup,
    notificationtemplategroup: state.appApiData.settings.notificationtemplategroup,
});

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));
