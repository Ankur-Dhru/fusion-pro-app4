import React, {Component} from "react";
import {Dimensions, View} from "react-native";
// @ts-ignore
import {FeaturedPatternLock, PatternProcess} from "react-native-patternlock-authentication";
import {withTheme} from "react-native-paper";
import {setNavigationOptions} from "../../lib/navigation_options";
import {Button, Container} from "../../components";
import ViewPattern from "./ViewPattern";
import {styles} from "../../theme";
import {log} from "../../lib/functions";

class Index extends Component<any, any> {

    constructor(props: any) {
        super(props);
        const {route} = this.props;
        this.state = {
            viewPattern: Boolean(route?.params?.pattern),
            pattern: route?.params?.pattern
        }
    }

    render() {
        const {route, navigation, theme: {colors}} = this.props;
        const {viewPattern, pattern} = this.state;
        setNavigationOptions(navigation, "Pattern", colors);
        const {width} = Dimensions.get('window');
        return (
            <Container surface>
                {
                    viewPattern ?
                        <View style={[{flexDirection: "column", flex:1}]}>
                            <View style={[{flex: 1}]}>
                                <View style={{ marginTop: 80,}} >
                                    <ViewPattern
                                        pattern={pattern.toString()}
                                        color={colors.secondary}
                                    />
                                </View>
                            </View>
                            <View style={[styles.mb_5]}>
                                <View style={[styles.grid, styles.justifyContent, styles.m_5]}>
                                    <View style={[{flex: 1}, styles.mr_2]}>
                                        <Button
                                            secondbutton={true}
                                            onPress={() => {
                                                this.setState({viewPattern: false})
                                            }}>
                                            Reset
                                        </Button>
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Button
                                            secondbutton={true}
                                            onPress={() => {
                                                log("typevalue1", pattern);
                                                route?.params?.onChangeTypeValue(pattern, () => {
                                                    navigation.goBack();
                                                });
                                            }}>
                                            Save
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <FeaturedPatternLock
                            containerDimension={3}
                            containerWidth={width}
                            containerHeight={width}
                            processName={PatternProcess.NEW_PATTERN}
                            isChangePattern={false}
                            showHintMessage={true}
                            dotRadius={10}
                            dotsColor={colors.secondary}
                            movingLineColor={colors.secondary}
                            snapDotRadius={15}
                            lineStrokeWidth={6}
                            activeLineColor={colors.secondary}
                            wrongPatternColor={'red'}
                            snapDuration={100}
                            connectedDotsColor={colors.secondary}
                            correctPatternColor={'green'}
                            minPatternLength={4}
                            newPatternConfirmationMessage={'Enter New Pattern again to Confirm'}
                            wrongPatternDelayTime={500}
                            correctPatternMessage={'Unlocked Successfully.'}
                            correctPatternDelayTime={500}
                            correctPatternDelayDurationMessage={''}
                            wrongPatternDelayDurationMessage={'Wrong Pattern. Try Again.'}
                            minPatternLengthErrorMessage={'Pattern Length should be greater than 3 '}
                            wrongPatternMessage={'Re-Draw Your Pattern.'}
                            changePatternFirstMessage={'Enter Your New Pattern'}
                            changePatternDelayTime={500}
                            changePatternSecondMessage={'Enter New Pattern again to Confirm'}
                            isEnableHeadingText={false}
                            enableDotsJoinViration={false}
                            headingText={'Set Pattern'}
                            newPatternDelayDurationMessage={'Pattern Matched'}
                            newPatternMatchedMessage={'Unlocked Successfully.'}
                            newPatternDelayTime={500}
                            samePatternMatchedMessage={'New Pattern should be different from Previous Pattern'}
                            hintTextStyle={{
                                textAlign: 'center',
                                color: 'red',
                                fontSize: 14,
                                marginTop: 40,
                            }}
                            headingTextStyle={{
                                textAlign: 'center',
                                color: colors.secondary,
                                fontSize: 16,
                                marginVertical: 30,
                            }}
                            hintTextContainerStyle={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 10,
                            }}
                            onPatternMatch={(data: any) => {
                                let pattern: string = ""
                                data.map((xy: any) => {
                                    if (xy.x === 0 && xy.y === 0) {
                                        pattern += "1"
                                    } else if (xy.x === 1 && xy.y === 0) {
                                        pattern += "2"
                                    } else if (xy.x === 2 && xy.y === 0) {
                                        pattern += "3"
                                    } else if (xy.x === 0 && xy.y === 1) {
                                        pattern += "4"
                                    } else if (xy.x === 1 && xy.y === 1) {
                                        pattern += "5"
                                    } else if (xy.x === 2 && xy.y === 1) {
                                        pattern += "6"
                                    } else if (xy.x === 0 && xy.y === 2) {
                                        pattern += "7"
                                    } else if (xy.x === 1 && xy.y === 2) {
                                        pattern += "8"
                                    } else if (xy.x === 2 && xy.y === 2) {
                                        pattern += "9"
                                    }
                                });
                                this.setState({viewPattern: true, pattern})
                            }}
                        />
                }
            </Container>
        );
    }
}

export default withTheme(Index);
