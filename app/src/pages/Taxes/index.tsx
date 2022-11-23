import React, {memo} from "react";
import {List, Title, withTheme,Divider} from "react-native-paper";
import FlatList from "../../components/FlatList";
import {Container, ProIcon} from "../../components";
import {setNavigationOptions} from "../../lib/navigation_options";
import {connect} from "react-redux";
import {TouchableOpacity} from "react-native";
import Swipeout from "rc-swipeout";
import {styles} from "../../theme";
import ListNavRightIcon from "../../components/ListNavRightIcon";
import BottomSpace from "../../components/BottomSpace";
import {deleteSettings} from "../../lib/ServerRequest/api";
import {STATUS} from "../../lib/static";
import {getInit, log} from "../../lib/functions";


const Index = (props: any) => {


    const {navigation, taxList,theme:{colors}}: any = props;

    setNavigationOptions(navigation, "Taxes",colors);

    const _deleteTaxGroup = (id: any) => {
        deleteSettings("tax", id, (result: any) => {
            if (result.status === STATUS.SUCCESS) {
                getInit(null, null, null, null, "list", true)
            }
        })
    }


    const _navigate = (data?: any) => {
        navigation.navigate("TaxGroupForm", {...data})
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

        let title = item?.taxgroupname;

        return <Swipeout
            right={[
                {
                    text: 'Delete',
                    onPress: () => _deleteTaxGroup(item.taxgroupid),
                    style: {backgroundColor: styles.red.color, color: 'white'},
                }
            ]}
            autoClose={true}
            style={{backgroundColor: 'transparent'}}
        >

            <TouchableOpacity
                onPress={() => _navigate({taxes: item, title})}
            >
                <List.Item
                    title={title}
                    titleStyle={[styles.caption]}
                    description={() => {
                        return <>{
                            item?.taxes?.map(({taxname, taxpercentage}: any) => {
                                return <List.Item
                                    style={{padding: 0, margin: 0}}
                                    title={''}
                                    description={`${taxname} (${taxpercentage}%)`}
                                />
                            })
                        }</>
                    }}
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
            data={Object.values(taxList)}
            accessible={true}
            renderItem={_renderItem}
            initialNumToRender={20}
        />

    </Container>
}


const mapStateToProps = (state: any) => ({
    taxList: state?.appApiData.settings.tax
})

const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

