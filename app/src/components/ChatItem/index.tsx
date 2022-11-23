import React, {Component} from "react";
import {styles} from "../../theme";
import {Card, Paragraph, Text, withTheme} from "react-native-paper";
import {Linking, TouchableOpacity, View} from "react-native";
import ProIcon from "../ProIcon";
import {base64Decode, getCurrentCompanyDetails, isEmpty} from "../../lib/functions";
import Avatar from "../Avatar";
import ThumbView from "../../pages/Attachment/ThumbView";

class Index extends Component<any, any> {

    render() {

        const {conversation,navigation,theme:{colors}} = this.props;
        const {username, adminid}: any = getCurrentCompanyDetails();

        let userName = username, backgroundColor = "#ffffff", textColor = '#000', flexDirection = 'row', marginLeft = 0, marginRight = 64;
        if (conversation?.by == "staff") {
            userName = "Dhru";
            backgroundColor = colors.secondary;
            textColor = "#ffffff";
            flexDirection = "row-reverse"
            if (Boolean(conversation?.l)) {
                backgroundColor = "#ffe279";
            }
            marginLeft = 64;
            marginRight = 0;
        }


        return (


                    <View style={[{marginLeft, marginRight}]}>

                        <View style={[styles.grid,styles.noWrap,{flexDirection:flexDirection}]}>

                            <View style={{marginTop:5}}>
                                <Avatar label={userName} value={userName} size={30}/>
                            </View>

                            <Card style={[styles.card,{marginHorizontal:10,backgroundColor:backgroundColor}]}>
                                <Card.Content style={[styles.cardContent,{paddingTop:10}]}>

                                    <View>
                                        <Paragraph style={[styles.paragraph,{color:textColor}]}>{base64Decode(conversation.text)}</Paragraph>

                                        {
                                            !isEmpty(conversation?.attachments) && <View  style={[styles.grid,styles.middle]}>
                                                {conversation?.attachments.map((item: any,key:any) => {

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

                                        {/*{
                                            !isEmpty(conversation?.attachments) && <View>
                                                {conversation?.attachments.map((attc: any) => {
                                                    return <TouchableOpacity
                                                        onPress={() => {
                                                            Linking.openURL(attc?.download_url).catch((err) => console.error('An' +
                                                                ' error occurred', err))
                                                        }}
                                                        style={[styles.grid, styles.middle]}>
                                                        <ProIcon
                                                            name={"download"}
                                                            size={12}
                                                            align={"center"}
                                                        />
                                                        <Paragraph>{attc.file_name}</Paragraph>
                                                    </TouchableOpacity>
                                                })}
                                            </View>
                                        }*/}
                                    </View>

                                    <Paragraph style={[styles.paragraph,styles.py_4,styles.text_xs,{color:textColor,opacity:0.7}]}>{conversation.date}</Paragraph>

                                </Card.Content>
                            </Card>

                        </View>


                    </View>


        );
    }
}

export default withTheme(Index);
