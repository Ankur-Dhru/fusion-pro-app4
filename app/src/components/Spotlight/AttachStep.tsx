import React from "react";


const AttachStep = ({children, index, style}: any) => {
    return <AttachStep index={index} style={style}>
        {children}
    </AttachStep>
}

export default AttachStep;
