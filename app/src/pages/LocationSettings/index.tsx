import React, {memo, useEffect, useState} from "react";
import {Platform, ScrollView, TouchableOpacity, View} from "react-native";
import {Container, ProIcon} from "../../components";
import {styles} from "../../theme";
import Search from "../../components/SearchBox";
import {location_settings, MESSAGE} from "../../lib/static";
import {Card, Divider, IconButton, Paragraph, Surface, Title, withTheme} from "react-native-paper";
import Icon from "../Menu/Icon";
import BottomSpace from "../../components/BottomSpace";
import {backButton, chevronRight} from "../../lib/setting";
import {errorAlert, getVisibleNav} from "../../lib/functions";
import {connect} from "react-redux";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';



const Index = (props: any) => {

    const {navigation} = props;
    const {colors}:any = props.theme;

    const [searchText, setSearchText] = useState<string>();
    const [settingData, setSettingData] = useState<any>([]);

    useEffect(() => {
        let newData: any = [];

        location_settings.forEach((ls: any) => {
            let options = getVisibleNav(ls.options)
            if (options.length > 0) {
                newData = [...newData, {...ls, options}]
            }
        })

        setSettingData(newData)
    }, [])

    const _onSearch = (search: string) => {
        setSearchText(search)
    }

    const _handleNavigation = (data: any) => {
        if (data?.screenName) {
            navigation.navigate(data.screenName, data?.params)
        } else {
            errorAlert(MESSAGE.FEATURE_ONLY_WEB)
        }
    }

    navigation.setOptions({
        headerTitle: 'Settings',
        headerLargeTitleStyle:{color:colors.inputbox},
        headerTitleStyle:{color:colors.inputbox},
        headerLeft: () => <Title onPress={() => navigation.goBack()}>{backButton}</Title>
    });

    if (Platform.OS === "android") {
        navigation.setOptions({
            headerCenter: () => <Title style={[styles.headertitle]}>{'Settings'}</Title>,
        })
    }


    return <Container>

        <View>

            <ScrollView keyboardShouldPersistTaps='handled'>
                <View>

                    <Search
                        autoFocus={false}
                        placeholder={`Search...`}
                        handleSearch={_onSearch}
                    />
                </View>


                <View style={[styles.pageContent]}>
                    {
                        settingData
                            ?.map(({title, options}: any) => {

                                let filterOptions = options.filter(({label}: any) => Boolean(searchText) ? label.toLowerCase().includes(searchText?.toLowerCase()) : true)

                                if (filterOptions?.length < 1) {
                                    return <View/>
                                }

                                return <View>

                                    <Card style={[styles.card]}>
                                        <Card.Content style={[styles.cardContent]}>
                                                {
                                                    filterOptions.map((item: any, key: any) => {

                                                        return <>


                                                            <View>

                                                            <TouchableOpacity
                                                                onPress={() => _handleNavigation(item)}>
                                                                <View style={[styles.grid,styles.middle,styles.py_5]}>
                                                                <View>
                                                                    <ProIcon name={item.icon} type={'light'} color={colors.secondary} size={18}/>
                                                                </View>
                                                                <Paragraph  style={[styles.paragraph,styles.ml_2]}> {item.label}  </Paragraph>
                                                                <View style={[styles.ml_auto]}>
                                                                    {chevronRight}
                                                                </View>
                                                                </View>
                                                            </TouchableOpacity>

                                                            {filterOptions.length > key+1 &&  <Divider style={[styles.divider,{borderBottomColor:colors.divider}]}/>}

                                                            </View>

                                                        </>

                                                    })
                                                }
                                        </Card.Content>
                                    </Card>
                                </View>
                            })
                    }

                </View>
            </ScrollView>
        </View>
    </Container>
}

const mapStateToProps = (state: any) => ({})
const mapDispatchToProps = (dispatch: any) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(memo(Index)));

