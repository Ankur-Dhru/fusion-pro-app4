import React, {Component} from "react";
import {groupErrorAlert, log} from "../../../../lib/functions";

class Index extends Component<any, any> {

    componentWillReceiveProps(nextProps: Readonly<any>, nextContext: any) {

        /*log("componentWillReceiveProps this.props", {
            dirtySinceLastSubmit: this.props.dirtySinceLastSubmit,
            modifiedSinceLastSubmit: this.props.modifiedSinceLastSubmit,
            dirty: this.props.dirty,
            submitting: this.props.submitting,
            hasSubmitErrors: this.props.hasSubmitErrors,
            hasValidationErrors: this.props.hasValidationErrors,
        })
        log("componentWillReceiveProps nextProps", {
            dirtySinceLastSubmit: nextProps.dirtySinceLastSubmit,
            modifiedSinceLastSubmit: nextProps.modifiedSinceLastSubmit,
            dirty: nextProps.dirty,
            submitting: nextProps.submitting,
            hasSubmitErrors: nextProps.hasSubmitErrors,
            hasValidationErrors: nextProps.hasValidationErrors,
        })*/

        if ((Boolean(nextProps.submitFailed) && Boolean(this.props.submitFailed !== nextProps.submitFailed))
            || (!Boolean(nextProps.dirtySinceLastSubmit) && Boolean(this.props.dirtySinceLastSubmit !== nextProps.dirtySinceLastSubmit))) {
            // if (!Boolean(nextProps.dirtySinceLastSubmit) &&  && Boolean(this.props.dirtySinceLastSubmit !== nextProps.dirtySinceLastSubmit)) {
            // nextProps?.scrollRef?.current?.scrollTo(0);
            const {submitFailed, touched, errors, initialValues, ...others} = nextProps;
            // groupErrorAlert({submitFailed, touched, errors});
        }
    }

    render() {

        return <></>
    }
}

export default Index;
