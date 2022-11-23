import React, {Component, memo} from "react";
import {Modal, TouchableOpacity, View} from "react-native";
import {Title} from "react-native-paper";
import {styles} from "../../theme";
import {vouchers} from "../../lib/static";
import {log} from "../../lib/functions";
import {setActiveStep, toggleWalkThrough} from "../../lib/Store/actions/walkthrough";
import {connect} from "react-redux";

const getGuideItem = (key: string, label: string, voucherIndex?: any) => ({key, label, voucherIndex});

const skipKey = "skip";

const guideItems = [
    getGuideItem("fifo", "Create Bill With Fifo Item", 8),
    getGuideItem("specificidentification", "Create Bill With Serial Item", 8),
    getGuideItem("invoice", "Create Invoice", 0),
    getGuideItem("job", "Create Jobsheet", 6),
    getGuideItem(skipKey, "Skip"),
]

class GuideOptions extends Component<any, any> {

    render() {

        const {handleNavigation, walkthroughenable, toggleWalkThrough, setActiveStep} = this.props;


        return (
            <Modal visible={walkthroughenable}>
                <View
                    style={[{marginBottom: 0, justifyContent: "space-evenly"}, styles.column]}>
                    {guideItems.map((item: any) => {
                        const {key, label, voucherIndex} = item
                        return <TouchableOpacity
                            key={key}
                            onPress={() => {
                                if (key !== skipKey) {
                                    setActiveStep(1);
                                    handleNavigation("Voucher", {
                                        ...vouchers[voucherIndex],
                                        fromSpotlight: true,
                                        spotkey:key,
                                    }, true);
                                } else {
                                    toggleWalkThrough();
                                }
                            }}
                            style={{
                                width: "100%",
                                flex: key == skipKey ? 0 : 1,
                                borderBottomColor: "#ccc",
                                borderBottomWidth: 1,
                                borderStyle: "solid",
                                justifyContent: "center",
                                alignContent: "center",
                                height: 48
                            }}>
                            <Title style={{textAlign: "center"}}>{label}</Title>
                        </TouchableOpacity>
                    })}
                </View>
            </Modal>
        );
    }
}


const mapStateToProps = (state: any) => ({
    walkthroughenable: state.walkthrough.enable
})
const mapDispatchToProps = (dispatch: any) => ({
    toggleWalkThrough: () => dispatch(toggleWalkThrough()),
    setActiveStep: (activeStep: number) => dispatch(setActiveStep(activeStep)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(GuideOptions));
