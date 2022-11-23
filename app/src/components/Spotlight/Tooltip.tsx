import React, {Component, memo} from "react";
import {withTheme} from "react-native-paper";
import WalkthroughTip from "react-native-walkthrough-tooltip";
import {connect} from "react-redux";
import {View} from "react-native";
import {setActiveStep} from "../../lib/Store/actions/walkthrough";
import TooltipContent from "./TooltipContent";
import {setActiveStepNumber} from "../../lib/Store/store-service";
import {log} from "../../lib/functions";

export enum STEPS {
    SELECT_CLIENT_VENDOR = 1,
    SELECT_OR_ADD_CLIENT_VENDOR = 2,
    ENTER_DISPLAY_NAME = 3,
    ADD_CLIENT_VENDOR = 4,
    SELECT_ASSET_TYPE = 5,
    SELECT_PRODUCT_OR_SERVICE = 6,
    SELECT_OR_ADD_PRODUCT = 7,
    ENTER_PRODUCT_NAME = 8,
    ENTER_HSN_CODE = 9,
    ENTER_SELLING_PRICE = 10,
    SELECT_TAX_RATE = 11,
    SELECT_ITC = 12,
    SELECT_INVENTORY_TYPE = 13,
    ADD_PRODUCT = 14,
    SAVE_INVOICE = 15,
    ADD_PAYMENT = 16,
    GENERATE_INVOICE = 17,

}


const TooltipContainerComponent = withTheme(memo(({
                                                      children,
                                                      walkthroughactivestep,
                                                      stepOrder,
                                                      theme: {colors},
                                                  }: any) => {
    return <View style={[{
        width: "100%",
        borderRadius: 4,
        backgroundColor: walkthroughactivestep === stepOrder ? colors.walkthroughbg : "transparent"
    }]}>
        {children}
    </View>
}))

const mapStateToPropsContainer = (state: any) => ({
    walkthroughactivestep: state.walkthrough?.activeStep
})
const mapDispatchToPropsContainer = (dispatch: any) => ({});

export const TooltipContainer = connect(mapStateToPropsContainer, mapDispatchToPropsContainer)(memo(TooltipContainerComponent));

type TooltipProps = {
    walkthrough: any,
    setActiveStep: Function,
    stepOrder: number,
    message: string,
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'center',
    isCustomVisible?: boolean,
    customVisible?: boolean,
    nextStep?: number,
    delayTime?: number
    allowNext?: boolean
};

class Tooltip extends Component<TooltipProps, any> {

    static defaultProps = {
        allowNext: true,
    };

    constructor(props: any) {
        super(props);
    }

    _onClose = () => {
        const {nextStep, delayTime, allowNext} = this.props;
        if (allowNext) {
            setTimeout(() => setActiveStepNumber(nextStep), delayTime || 500)
        }
    }


    render() {
        const {children, message, walkthrough, stepOrder, placement, isCustomVisible, customVisible} = this.props;

        if (Boolean(stepOrder)) {
            let isVisible = Boolean(stepOrder === walkthrough?.activeStep);
            if (isCustomVisible) {
                isVisible = Boolean(customVisible)
            }

            return (
                <WalkthroughTip
                    content={<TooltipContent message={message}/>}
                    onClose={this._onClose}
                    placement={placement || "top"}
                    arrowSize={{width: 16, height: 16}}
                    isVisible={isVisible}
                >
                    {children}
                </WalkthroughTip>
            );
        }
        return <>{children}</>
    }
}

const mapStateToProps = (state: any) => ({
    walkthrough: state.walkthrough
})
const mapDispatchToProps = (dispatch: any) => ({
    setActiveStep: (activeStep: number) => dispatch(setActiveStep(activeStep)),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(Tooltip));
