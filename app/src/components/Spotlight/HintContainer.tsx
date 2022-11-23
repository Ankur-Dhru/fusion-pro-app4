import React from "react";
import {View} from "react-native";
import {Card, Text} from "react-native-paper";
import {Button} from "../index";
import {styles} from "../../theme";

const HintContainer = (props: any) => {

    const {next, isFirst, isLast, stop, previous, message} = props;
    return <Card style={[styles.card]}>
        <Card.Content>
            <View style={[styles.mb_5]}>
                <Text>{message}</Text>
            </View>
            <View style={[styles.grid, styles.justifyContent]}>
                <View style={[styles.mr_4]}>
                    {
                        !Boolean(isLast) && <Button compact secondbutton onPress={stop}>
                            Skip
                        </Button>
                    }
                </View>
                <View style={[styles.grid]}>
                    {
                        !Boolean(isFirst) && <View style={[styles.mr_1]}>
                            <Button compact secondbutton onPress={previous}>
                                Previous
                            </Button>
                        </View>
                    }
                    <View>
                        {
                            Boolean(isLast) ? <Button compact onPress={stop}>
                                Finish
                            </Button> : <Button compact onPress={next}>
                                Next
                            </Button>
                        }
                    </View>
                </View>
            </View>
        </Card.Content>
    </Card>
}

export default HintContainer;
