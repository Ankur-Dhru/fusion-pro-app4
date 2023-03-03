import React, {Component, memo, useMemo} from "react";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Container, Menu} from "../../components";
import {Button as PButton, Card, IconButton, Paragraph, Surface, Text, Title, withTheme} from "react-native-paper";
import requestApi, {actions, methods, SUCCESS} from "../../lib/ServerRequest";
import {loginUrl, mainUrl, voucher} from "../../lib/setting";
import {base64Decode, base64Encode, clone, isEmpty, log, uploadFile} from "../../lib/functions";
import {styles} from "../../theme";
import {
    Linking,
    Platform,
    RefreshControl,
    ScrollView,
    TextInput as TextInputReact,
    TextInput,
    TouchableOpacity,
    View,
    KeyboardAvoidingView
} from "react-native";
import ProIcon from "../../components/ProIcon";
import ChatItem from "../../components/ChatItem";
import ImagePicker from "react-native-image-crop-picker";
import {PERMISSIONS, requestMultiple} from "react-native-permissions";
import DocumentPicker from "react-native-document-picker";
import {v4 as uuidv4} from "uuid";
import AttachmentItem from "./AttachmentItem";
import moment from "moment";
import ThumbView from "../Attachment/ThumbView";
import Description from "../../components/Description";
import InputField from "../../components/InputField";
import {platform} from "@haskkor/react-native-recaptchav3/dist/src/constants";
import {KeyboardAccessoryView} from "react-native-keyboard-accessory";


class ViewTickets extends Component<any, any> {

    replyText:any = '';
    scrollView:any = '';
    constructor(props: any) {
        super(props);
        this.state = {
            data: {},
            refreshing: false,
            replyText: "",
        }
        this.scrollView = React.createRef()
    }

    componentDidMount() {
        voucher.data = {files:[]}
        this.loadData();
    }

    loadData = () => {
        const {navigation, route} = this.props;
        const {refreshing} = this.state;
        requestApi({
            method: methods.get,
            action: actions.support,
            other: {url: loginUrl},
            loader: !refreshing,
            queryString: {id: route?.params?.item?.ticket_id},
            showlog: true
        }).then((response: any) => {
            if (response.status === SUCCESS && !isEmpty(response.data)) {
                this.setState({data: response.data[0], refreshing: false})
            }
        })
    }

    conversation = () => {

        try{

            let replyText = this.replyText;

            if(Boolean(replyText)) {
                let {data} = this.state;
                let body: any = {
                    ticket_id: data?.ticket_id,
                    text: base64Encode(replyText)
                };

                if (!isEmpty(voucher?.data?.files)) {
                    body = {...body, attachments: voucher?.data?.files}
                }

                this.replyText = '';
                this.forceUpdate()
                requestApi({
                    method: methods.put,
                    action: actions.support,
                    other: {url: loginUrl},
                    body,
                    loader:false,
                    alert:false,
                    showlog: true
                }).then((response: any) => {
                    if (response.status == SUCCESS) {
                        let conversation = [];
                        if (!isEmpty(data?.conversation)) {
                            conversation = data.conversation
                        }
                        data = {
                            ...data,
                            status: response.data.status,
                            conversation: [
                                ...conversation,
                                {
                                    by: "user",
                                    text: base64Encode(replyText),
                                    date: moment().format('YYYY-MM-DD hh:mm:ss'),
                                    attachments: clone(voucher?.data?.files)
                                }],
                        }
                        voucher.data.files = [];

                        this.setState({data});
                    }
                })
            }

        }
        catch (e) {
            log('e',e)
        }

    }


    render() {

        const {navigation, route, theme:{colors}} = this.props;
        const {data, replyText, attachment, refreshing} = this.state;

        setNavigationOptions(navigation, "Support Request",colors, route)
        let statusIcon = "clock", statusIconColor = "rgba(167,174,183,1)";
        let isResolved = false;
        if (data?.status?.toString().toLowerCase() === "awaiting your response") {
            statusIcon = "exclamation-circle";
            statusIconColor = "rgba(230,131,57,1)";
        } else if (data?.status?.toString().toLowerCase() === "resolved") {
            isResolved = true;
            statusIcon = "circle-check";
            statusIconColor = "rgba(118,183,78,1)";
        }


        let menuOptions: any = []
        if (Boolean(data?.product?.product_id)) {
            menuOptions = [
                ...menuOptions,
                {label: "Update Login Credential", value: "credential"},
            ]
        }
        if (!isResolved) {
            menuOptions = [
                ...menuOptions,
                {label: "Close Case", value: "close"},
            ]
        }



        navigation.setOptions({
            headerLargeTitleStyle:{color:colors.inputbox},
            headerTitleStyle:{color:colors.inputbox},
            headerRight: (props: any) =>
                <Menu
                    menulist={menuOptions}
                    onPress={(menu: any) => {
                        if (menu.value == "credential") {
                            navigation.navigate("LoginCredential", {
                                ...data.product
                            })
                        } else if (menu?.value == "close") {
                            requestApi({
                                method: methods.get,
                                other: {url: `${mainUrl}${data.resolved_url}`},
                                showlog: true
                            }).then((response) => {
                                if (response.status === SUCCESS) {
                                    navigation.goBack();
                                }
                            })
                        }
                    }}
                    width={50}
                >
                    <View style={[{paddingHorizontal: 16}]}><ProIcon size={24} name={'ellipsis-vertical'}
                                                                     type={"light"}/></View>
                </Menu>,
        });


        return (
            <Container>

                        <ScrollView
                            ref={ref => {this.scrollView = ref}}
                            onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                            refreshControl={<RefreshControl
                                tintColor={"#9e9e9e"}
                                refreshing={refreshing}
                                onRefresh={() => {
                                    this.setState({refreshing: true}, () => this.loadData());
                                }}
                            />}

                        >
                            <View style={[styles.pageContent,{height: 'auto'}]}>
                                <Card style={[styles.card]}>
                                    <Card.Content>
                                        <Paragraph style={[styles.caption,styles.paragraph]}>{data.Subject}</Paragraph>

                                        <View style={[styles.grid, styles.middle]}>
                                            <ProIcon
                                                name={statusIcon}
                                                size={12}
                                                align={"left"}
                                            />
                                            <Paragraph style={[styles.paragraph, {marginLeft:-15}]}>{statusIcon} {data.status}</Paragraph>
                                        </View>

                                        <Paragraph style={[styles.paragraph]}>Created on {data.created_date}</Paragraph>
                                        <Paragraph style={[styles.paragraph]}>Last action {data.created}</Paragraph>
                                        <Paragraph style={[styles.paragraph]}>{data.type}</Paragraph>

                                    </Card.Content>
                                </Card>
                                <Card style={[styles.card]}>
                                    <Card.Content>

                                        <Paragraph style={[styles.caption,styles.paragraph]}>Description</Paragraph>
                                        <View>
                                            <Paragraph>{base64Decode(data.description)}</Paragraph>

                                            <View>

                                            {
                                                !isEmpty(data?.attachments) && <View  style={[styles.grid,styles.middle]}>
                                                    {data?.attachments.map((item: any,key:any) => {

                                                        let extentation = item.file_name ? item.file_name.split('.').pop() : '';

                                                        return (
                                                            <View key={key} style={[styles.relative,styles.mt_5,styles.mr_2]}>

                                                                <TouchableOpacity onPress={() => {
                                                                    navigation.push('FullView', {
                                                                        screen: 'FullView',
                                                                        item: item
                                                                    })
                                                                }}>
                                                                    <ThumbView source={{...item, uri: `https://${item.download_url.replace('http://', '').replace('https://', '')}`}} extentation={extentation}/>
                                                                </TouchableOpacity>

                                                            </View>
                                                        )
                                                    })}
                                                </View>
                                            }

                                            </View>

                                        </View>

                                    </Card.Content>
                                </Card>
                                {
                                    !isEmpty(data.conversation) && <>
                                        <View>
                                            <View>
                                            {/*<Paragraph style={[styles.caption,styles.paragraph]}>Conversation</Paragraph>*/}
                                            {
                                                data.conversation.map((con: any, index: number) => {
                                                    return <ChatItem conversation={con} navigation={navigation} key={index}/>
                                                })
                                            }
                                            </View>
                                        </View>
                                    </>
                                }
                            </View>

                        </ScrollView>


                    <KeyboardAccessoryView alwaysVisible={true}   hideBorder={true} avoidKeyboard={true} androidAdjustResize={true} heightProperty={"minHeight"} >

                        {
                            !Boolean(isResolved) && <Surface>

                                <View  style={[styles.grid,styles.bottom,  styles.px_5,{paddingVertical:10,paddingLeft:10}]}>

                                    <View style={[styles.w_auto]}>


                                        <TextInputReact
                                            onChangeText={(value:any) => {
                                                this.replyText = value
                                            }}
                                            defaultValue={this.replyText}
                                            placeholder={'Reply...'}
                                            key={uuidv4()}
                                            multiline={true}
                                            onFocus={()=>{
                                                this.scrollView.scrollToEnd({animated: true})
                                            }}

                                            placeholderTextColor={colors.inputLabel}
                                            style={[styles.py_5,{paddingLeft:5,color:colors.inputbox,maxHeight:200,/*backgroundColor:colors.screenbg,borderRadius:30*/}]}
                                            {...this.props}
                                        />

                                        <View>

                                            <InputField
                                                removeSpace={true}
                                                label={''}
                                                divider={false}
                                                key={uuidv4()}
                                                preview={true}
                                                hideLabel={true}
                                                onChange={(value:any)=>{

                                                }}
                                                inputtype={'attachment'}
                                                editmode={true}
                                                navigation={navigation}
                                            />

                                        </View>

                                    </View>


                                    <View style={[styles.center,{width:50,height:40}]}>
                                        {<View>
                                            <InputField
                                                removeSpace={true}
                                                label={''}
                                                divider={false}
                                                icon={true}
                                                key={uuidv4()}
                                                preview={false}
                                                hideLabel={false}
                                                onChange={(value:any)=>{
                                                    this.forceUpdate()
                                                }}
                                                inputtype={'attachment'}
                                                navigation={navigation}
                                            />
                                        </View>}
                                    </View>

                                    <View>
                                        <TouchableOpacity onPress={() => this.conversation()}>
                                            <View style={[{backgroundColor:  colors.secondary , borderRadius: 50,height:40,width:40,paddingRight:5},styles.center]}>
                                                <ProIcon name="paper-plane"  size={16} color={'white'}    />
                                            </View>
                                        </TouchableOpacity>
                                    </View>

                                </View>



                            </Surface>
                        }

                    </KeyboardAccessoryView>


            </Container>
        );
    }
}

export default withTheme(ViewTickets);
