export const regExpJson2 = {
    email: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
    leastOneDigit: /.*[0-9].*/,
    leastOneCAPS: /.*[A-Z].*/,
    leastOneSymbol: /.*[@#$%^&+=!].*/,
    alphabet: /^[a-zA-Z]+$/,
    hexCode:/^#[0-9A-F]{6}$/i,
    uuidValidate:/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    alphaNumericSpace: /^[a-z\d\s]+$/i
};

export const validEmail = (errorObject: any, key: string, value: string) => {
    if (!Boolean(value)) {
        errorObject = validRequired(errorObject, key, value, "Please enter email");
    } else if (!regExpJson2.email.test(value)) {
        errorObject[key] = "Please enter valid email";
    }
    return errorObject;
}


export const validPassword = (errorObject: any, key: string, value: string, isNew?: boolean) => {
    if (!Boolean(value)) {
        let message: string;
        message = isNew ? "Please enter new password" : "Please enter password";
        errorObject = validRequired(errorObject, key, value, message);
    } else if (value.length < 8) {
        errorObject[key] = "Password should be at least 8 characters in length.";
    } else if (!regExpJson2.leastOneCAPS.test(value)) {
        errorObject[key] = "Password must include at least one CAPS!";
    } else if (!regExpJson2.leastOneDigit.test(value)) {
        errorObject[key] = "Password must include at least one number!";
    } else if (!regExpJson2.leastOneSymbol.test(value)) {
        errorObject[key] = "Password must include at least one symbol!";
    }
    return errorObject;
}


export const validRequired = (errorObject: any, key: any, value: string, errorMessage: string) => {
    if (!Boolean(value)) {
        errorObject[key] = errorMessage;
    }
    return errorObject;
}
