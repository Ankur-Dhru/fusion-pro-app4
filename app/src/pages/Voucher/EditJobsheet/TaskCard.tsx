import React, {memo, useEffect, useState} from "react";
import {styles} from "../../../theme";
import {Card, Paragraph, Text, Title, withTheme} from "react-native-paper";
import {View} from "react-native";
import {chevronRight, voucher} from "../../../lib/setting";
import ListNavRightIcon from "../../../components/ListNavRightIcon";
import {connect} from "react-redux";
import {isEmpty, log} from "../../../lib/functions";

const TaskCard = memo(({staff, navigation, values,ticketsList}: any) => {

    const [subTaskCount, setSubTaskCount] = useState(0);

    useEffect(()=>{
        if(!isEmpty(values?.subtasklist)){
            setSubTaskCount(Object.values(values?.subtasklist)?.length-1)
        }

    }, [values])

    let currentTicket = ticketsList[values?.tickettypeid];

    let status = currentTicket?.ticketstatuslist[values?.taskstatus]?.ticketstatusname;
    let color = currentTicket?.ticketstatuslist[values?.taskstatus]?.ticketstatuscolor;


    if (voucher?.data?.voucherid) {
        return <>

            <Card style={[styles.card,!isEmpty(values?.subtasklist) && {marginBottom: 0}]} onPress={() => {
                navigation.push('AddEditTask', {
                    screen: 'AddEditTask',
                    ticketdisplayid: values.ticketdisplayid,
                });
            }}>
                <Card.Content>
                    <Text
                        style={[styles.caption, styles.mb_2]}>{values.ticketprefix}{values.ticketdisplayid}</Text>

                    <View style={[styles.grid,styles.middle, styles.justifyContent]}>
                        <View style={[styles.w_auto]}>
                            <Paragraph style={[styles.paragraph]}>{values?.tasksummary} </Paragraph>
                            {/*{Boolean(staff[values?.reporter]?.username) && <Text  style={[styles.muted,styles.text_xs]}>Reporter : {staff[values?.reporter]?.username}</Text>}*/}
                            {<Text style={[styles.muted,styles.text_xs]}>Assignee : {staff[values?.assignee]?.username || 'Unassign'}</Text>}
                        </View>

                        <View style={[styles.grid,styles.middle]}>
                            <View>
                                <View style={[styles.badge, {
                                    padding: 0,
                                    textAlign: 'center',
                                    backgroundColor:color,
                                }, styles.px_4, styles.text_xs,styles.ml_auto]}>
                                    <Paragraph style={[styles.paragraph,styles.text_xs,{color:'white'}]}>{status}</Paragraph>
                                </View>
                            </View>

                            <View>
                                {chevronRight}
                            </View>
                        </View>


                    </View>
                </Card.Content>
            </Card>

            {!isEmpty(values?.subtasklist) &&  <View style={[{
                marginLeft: 16,
                borderLeftWidth: 2,
                borderLeftColor: "#ccc",
                borderStyle: "solid",
                paddingTop:12
            }]}>

                {
                    Object.values(values?.subtasklist).map((sbt: any,index:number) => {

                        let currentTicket = ticketsList[values?.tickettypeid];

                        let status = currentTicket?.ticketstatuslist[sbt?.ticketstatus]?.ticketstatusname;
                        let color = currentTicket?.ticketstatuslist[sbt?.ticketstatus]?.ticketstatuscolor;

                        return <View style={[{position: "relative"}]}>
                            {
                                index===subTaskCount && <View style={[{
                                    position: "absolute",
                                    borderLeftWidth: 2,
                                    borderLeftColor: "#f4f4f4",
                                    borderStyle: "solid",
                                    height: "50%",
                                    left: -2,
                                    width: 12,
                                    top: "51.5%"
                                }]}/>
                            }

                            <View style={[{
                                position: "absolute",
                                backgroundColor: "#ccc",
                                height: 2,
                                left: 0,
                                width: 12,
                                top: "50%"
                            }]}/>

                            <Card style={[styles.card,{marginLeft: 12}]}
                                  onPress={() => {
                                      navigation.push('AddEditTask', {
                                          screen: 'AddEditTask',
                                          ticketdisplayid: sbt.ticketdisplayid,
                                      });
                                  }}>
                                <Card.Content>
                                    <Text
                                        style={[styles.caption, styles.mb_2]}>{sbt.ticketprefix}{sbt.ticketdisplayid}</Text>
                                    <View style={[styles.grid,styles.middle, styles.justifyContent]}>

                                        <View style={[styles.w_auto]}>
                                            <Paragraph style={[styles.paragraph]}>{sbt?.notes} </Paragraph>
                                            {/*{Boolean(staff[sbt?.reporter]?.username) && <Text style={[styles.muted,styles.text_xs]}>Reporter : {staff[sbt?.reporter]?.username}</Text>}*/}
                                            {<Text style={[styles.muted,styles.text_xs]}>Assignee : {staff[sbt?.staffid]?.username  || 'Unassign'}</Text>}
                                        </View>

                                        <View style={[styles.grid,styles.middle]}>
                                            <View>
                                                <View style={[styles.badge, {
                                                    padding: 0,
                                                    textAlign: 'center',
                                                    backgroundColor:color,
                                                }, styles.px_4, styles.text_xs,styles.ml_auto]}>
                                                    <Paragraph style={[styles.paragraph,styles.text_xs,{color:'white'}]}>{status}</Paragraph>
                                                </View>
                                            </View>

                                            <View>
                                                {chevronRight}
                                            </View>
                                        </View>

                                    </View>
                                </Card.Content>
                            </Card>
                        </View>

                    })
                }
            </View>}
        </>
    }
    return <View></View>
})


const mapStateToProps = (state: any) => ({
    staff: state.appApiData.settings.staff,
    ticketsList: state?.appApiData.settings.tickets,

})
const mapDispatchToProps = (dispatch: any) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(TaskCard));

