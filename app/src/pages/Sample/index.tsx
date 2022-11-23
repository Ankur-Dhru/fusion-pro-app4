import React, {Component} from "react";
import {Dimensions, ScrollView, View} from "react-native";
import {Button} from "../../components";
import {styles} from "../../theme";
import Tooltip from "react-native-walkthrough-tooltip";
import {Card, Text} from "react-native-paper";
import InputField from "../../components/InputField";
import {Field, Form} from "react-final-form";
import {required} from "../../lib/static";
import KAccessoryView from "../../components/KAccessoryView";
import {log} from "../../lib/functions";
// @ts-ignore
import {FeaturedPatternLock, PatternProcess} from "react-native-patternlock-authentication"
import PropTypes from "prop-types";



class Index extends Component<any, any> {
    scrollRef: any
    layoutRef: any

    constructor(props: any) {
        super(props);
        this.state = {
            activeStep: 0
        }

        this.scrollRef = React.createRef();
        // this.layoutRef = React.createRef();
    }

    render() {
        const {activeStep} = this.state;

        const {width,} = Dimensions.get('window');
        // return (
        //     <View>
        //         <FeaturedPatternLock
        //             containerDimension={3}
        //             containerWidth={width}
        //             containerHeight={width}
        //             processName={PatternProcess.NEW_PATTERN}
        //             isChangePattern={false}
        //             showHintMessage={true}
        //             dotRadius={10}
        //             dotsColor={'blue'}
        //             movingLineColor={'blue'}
        //             snapDotRadius={15}
        //             lineStrokeWidth={6}
        //             activeLineColor={'blue'}
        //             wrongPatternColor={'red'}
        //             snapDuration={100}
        //             connectedDotsColor={'blue'}
        //             correctPatternColor={'green'}
        //             minPatternLength={4}
        //             newPatternConfirmationMessage={'Enter New Pattern again to Confirm'}
        //             wrongPatternDelayTime={1000}
        //             correctPatternMessage={'Unlocked Successfully.'}
        //             correctPatternDelayTime={1000}
        //             correctPatternDelayDurationMessage={'Pattern Matched'}
        //             wrongPatternDelayDurationMessage={'Wrong Pattern. Try Again.'}
        //             minPatternLengthErrorMessage={'Pattern Length should be greater than 3 '}
        //             wrongPatternMessage={'Re-Draw Your Pattern.'}
        //             changePatternFirstMessage={'Enter Your New Pattern'}
        //             changePatternDelayTime={1000}
        //             changePatternSecondMessage={'Enter New Pattern again to Confirm'}
        //             isEnableHeadingText={true}
        //             enableDotsJoinViration={false}
        //             headingText={'Set New Pattern'}
        //             newPatternDelayDurationMessage={'Pattern Matched'}
        //             newPatternMatchedMessage={'Unlocked Successfully.'}
        //             newPatternDelayTime={1000}
        //             samePatternMatchedMessage={'New Pattern should be different from Previous Pattern'}
        //             hintTextStyle={{
        //                 textAlign: 'center',
        //                 color: 'red',
        //                 fontSize: 14,
        //             }}
        //             headingTextStyle={{
        //                 textAlign: 'center',
        //                 color: 'blue',
        //                 fontSize: 16,
        //                 marginVertical: 30,
        //             }}
        //             hintTextContainerStyle={{
        //                 alignItems: 'center',
        //                 justifyContent: 'center',
        //                 paddingVertical: 10,
        //             }}
        //             onPatternMatch={(data: any) => {
        //                 let patteren: string = ""
        //                 data.map((xy: any) => {
        //                     if (xy.x === 0 && xy.y === 0) {
        //                         patteren += "1"
        //                     } else if (xy.x === 1 && xy.y === 0) {
        //                         patteren += "2"
        //                     } else if (xy.x === 2 && xy.y === 0) {
        //                         patteren += "3"
        //                     } else if (xy.x === 0 && xy.y === 1) {
        //                         patteren += "4"
        //                     } else if (xy.x === 1 && xy.y === 1) {
        //                         patteren += "5"
        //                     } else if (xy.x === 2 && xy.y === 1) {
        //                         patteren += "6"
        //                     } else if (xy.x === 0 && xy.y === 2) {
        //                         patteren += "7"
        //                     } else if (xy.x === 1 && xy.y === 2) {
        //                         patteren += "8"
        //                     } else if (xy.x === 2 && xy.y === 2) {
        //                         patteren += "9"
        //                     }
        //                 })
        //             }}
        //         />
        //
        //     </View>
        // )

        return (
            <View style={[styles.m_3]}>

                <Button onPress={() => {
                    this.scrollRef.current.scrollTo(900)

                    //log("this.layoutRef", this.layoutRef)

                    // this.layoutRef.Marker.measureInWindow((fx, fy, width, height) => {
                    //     log('Component width is: ' + width)
                    //     log('Component height is: ' + height)
                    //     log('X offset to frame: ' + fx)
                    //     log('Y offset to frame: ' + fy)
                    // })

                }}>Start</Button>

                <Form
                    onSubmit={() => {
                    }}
                    initialValues={{}}
                    render={({handleSubmit, submitting, values, ...more}: any) => (
                        <View style={[styles.pageContent]}>
                            <ScrollView ref={this.scrollRef} onScroll={(props: any) => {
                                // log("onScrollEndDrag", props?.nativeEvent?.contentOffset?.y)

                                if (parseInt(props?.nativeEvent?.contentOffset?.y) === 900) {
                                    this.setState({activeStep: 3})
                                }
                                if (parseInt(props?.nativeEvent?.contentOffset?.y) === 1550) {
                                    this.setState({activeStep: 4})
                                }
                            }}>
                                <View>
                                    <Tooltip
                                        content={<Text>Step One</Text>}
                                        isVisible={Boolean(1 === activeStep)}
                                        placement={"bottom"}
                                        onClose={() => {

                                        }}
                                    >
                                        <View style={[{width: "100%"}]}>
                                            <View style={[styles.m_5]}>
                                                <Button onPress={() => {
                                                    this.setState({activeStep: 3})
                                                }}>Step One</Button>
                                            </View>
                                        </View>
                                    </Tooltip>


                                    <Tooltip
                                        content={<View>
                                            <Text>Step One</Text>
                                            <Button onPress={() => {
                                                this.scrollRef.current.scrollTo(1200)
                                                this.setState({activeStep: 25})
                                            }}>Next</Button>
                                        </View>}
                                        isVisible={Boolean(2 === activeStep)}
                                        placement={"top"}
                                        useReactNativeModal={false}
                                        backgroundStyle={{
                                            position: "absolute",
                                            left: -25
                                        }}
                                        onClose={() => {

                                        }}
                                    >
                                        <View style={[{width: "100%"}]}>

                                            <Card style={[styles.card]}>
                                                <Card.Content>
                                                    <View>
                                                        <Field name="country">
                                                            {props => (
                                                                <>
                                                                    <InputField
                                                                        label={'Country'}
                                                                        mode={'flat'}
                                                                        list={[]}
                                                                        value={props.input.value}
                                                                        selectedValue={props.input.value}
                                                                        displaytype={'pagelist'}
                                                                        inputtype={'dropdown'}
                                                                        listtype={'other'}
                                                                        onChange={(value: any) => {
                                                                        }}>
                                                                    </InputField>
                                                                </>
                                                            )}
                                                        </Field>
                                                    </View>
                                                </Card.Content>
                                            </Card>
                                        </View>
                                    </Tooltip>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Tooltip
                                        content={<View>
                                            <Text>Step One</Text>
                                            <Button onPress={() => {
                                                this.scrollRef.current.scrollTo(1800)

                                            }}>Next</Button>
                                        </View>}
                                        isVisible={Boolean(3 === activeStep)}
                                        placement={"top"}
                                        useReactNativeModal={true}
                                        onClose={() => {

                                        }}
                                    >
                                        <View style={[{width: "100%"}]} ref={(ref) => this.layoutRef = ref}>

                                            <Card style={[styles.card]}>
                                                <Card.Content>
                                                    <View>
                                                        <Field name="displayname" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value}
                                                                    label={'One'}
                                                                    returnKeyType={"next"}
                                                                    inputtype={'textbox'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>
                                                </Card.Content>
                                            </Card>
                                        </View>
                                    </Tooltip>

                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Tooltip
                                        content={<View>
                                            <Text>Step One</Text>
                                            <Button onPress={() => {
                                                this.setState({activeStep: 25})
                                            }}>Next</Button>
                                        </View>}
                                        isVisible={Boolean(4 === activeStep)}
                                        placement={"top"}
                                        useReactNativeModal={true}
                                        onClose={() => {

                                        }}
                                    >
                                        <View style={[{width: "100%"}]}>

                                            <Card style={[styles.card]}>
                                                <Card.Content>
                                                    <View>
                                                        <Field name="displayname" validate={required}>
                                                            {props => (
                                                                <InputField
                                                                    {...props}
                                                                    value={props.input.value}
                                                                    label={'Two'}
                                                                    returnKeyType={"next"}
                                                                    inputtype={'textbox'}
                                                                    onChange={(value: any) => {
                                                                        props.input.onChange(value);
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </View>
                                                </Card.Content>
                                            </Card>
                                        </View>
                                    </Tooltip>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                    <Card style={[styles.card]}>
                                        <Card.Content>
                                            <View>
                                                <Field name="displayname" validate={required}>
                                                    {props => (
                                                        <InputField
                                                            {...props}
                                                            value={props.input.value}
                                                            label={'Display Name'}
                                                            returnKeyType={"next"}
                                                            inputtype={'textbox'}
                                                            onChange={(value: any) => {
                                                                props.input.onChange(value);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </View>
                                        </Card.Content>
                                    </Card>

                                </View>
                            </ScrollView>

                            <KAccessoryView>
                                <View style={[styles.submitbutton]}>
                                    <Button disable={more.invalid} secondbutton={more.invalid} onPress={() => {
                                        handleSubmit(values)
                                    }}> Add </Button>
                                </View>
                            </KAccessoryView>
                        </View>
                    )}
                >

                </Form>
            </View>
        );
    }
}

export default Index;
