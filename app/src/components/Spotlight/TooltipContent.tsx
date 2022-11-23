import React from "react";
import {Text} from "react-native-paper";
import Button from "../Button";
import {setActiveStep, toggleWalkThrough} from "../../lib/Store/actions/walkthrough";
import {View} from "react-native";
import {connect} from "react-redux";
import {setActiveStepNumber} from "../../lib/Store/store-service";
import {styles} from "../../theme";


const TooltipContent = ({message, disabled, showNext, nextNumber, onNexPress, toggleWalkThrough}: any) => {
    return <View>
        <View>
            <Text style={[styles.p2, {fontSize: 16, fontWeight: "bold"}]}>{message}</Text>
        </View>
        <View style={[styles.mt_5, styles.grid, styles.justifyContent]}>
            <Button
                disabled={disabled}
                secondbutton={disabled}
                onPress={() => toggleWalkThrough()}
                compact
            >
                Skip
            </Button>
            {
                showNext && <Button
                    disabled={disabled}
                    secondbutton={disabled}
                    onPress={() => onNexPress ? onNexPress() : setActiveStepNumber(nextNumber)}
                    compact
                >
                    Next
                </Button>
            }
        </View>

    </View>
}

const mapStateToProps = (state: any) => ({
    walkthrough: state.walkthrough
})
const mapDispatchToProps = (dispatch: any) => ({
    setActiveStep: (activeStep: number) => dispatch(setActiveStep(activeStep)),
    toggleWalkThrough: () => dispatch(toggleWalkThrough()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TooltipContent);

