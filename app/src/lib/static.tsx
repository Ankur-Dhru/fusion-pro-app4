//const pricingtemplates = {default:{ptname:'Default'},retail:{ptname:'Retail'}};

import {getType} from "./functions";


export enum STATUS {
    SUCCESS = "success",
    ERROR = "error"
}

const pricingType = {
    free: "Free",
    onetime: "One Time",
    recurring: "Recurring",
};

export const assignOption = (label: any, value: any, defaultoption?: any, space?: any, isDisabled?: any, disabled?: any,selected?:any) => {
    return {label, value, space, isDisabled, disabled,selected}
};

export const assignListItem = (title: any, description?: any) => {
    let item: any = {title}
    if (Boolean(description)) {
        item = {
            ...item,
            description
        }
    }
    return item
}

export const options_place: any = [
    {value: 'ourplace', text: "Our Place"},
    {value: 'vendorplace', text: "Vendor Place"},
]

export const defalut_payment_term = [
    assignOption("Due end of month", "endmonth", false),
    assignOption("Due end of next month", "nextendmonth", false),
    assignOption("Due on Receipt", "date", true),
]

export const discountPlaceOption: any = {
    beforetax: "Before Tax",
    aftertax: "After Tax",
    askonplace: "Ask On Place",
};

export const months: any = [
    {value: "1", label: "01 - January"},
    {value: "2", label: "02 - February"},
    {value: "3", label: "03 - March"},
    {value: "4", label: "04 - April"},
    {value: "5", label: "05 - May"},
    {value: "6", label: "06 - June"},
    {value: "7", label: "07 - July"},
    {value: "8", label: "08 - August"},
    {value: "9", label: "09 - September"},
    {value: "10", label: "10 - October"},
    {value: "11", label: "11 - November"},
    {value: "12", label: "12 - December"},
];

export const dateformats: any = [{"label": "dd/MM/yyyy", "value": "dd/MM/yyyy"}, {
    "label": "dd/MM/yy",
    "value": "dd/MM/yy"
}, {"label": "dd-MM-yy", "value": "dd-MM-yy"}, {"label": "dd-MM-yyyy", "value": "dd-MM-yyyy"}, {
    "label": "dd.MM.yy",
    "value": "dd.MM.yy"
}, {"label": "dd.MM.yyyy", "value": "dd.MM.yyyy"}, {"label": "MM/dd/yyyy", "value": "MM/dd/yyyy"}, {
    "label": "MM/dd/yy",
    "value": "MM/dd/yy"
}, {"label": "MM-dd-yy", "value": "MM-dd-yy"}, {"label": "MM-dd-yyyy", "value": "MM-dd-yyyy"}, {
    "label": "MM.dd.yy",
    "value": "MM.dd.yy"
}, {"label": "MM.dd.yyyy", "value": "MM.dd.yyyy"}]

const regExpJson = {
    email: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
    leastOneDigit: /.*[0-9].*/,
    leastOneCAPS: /.*[A-Z].*/,
    leastOneSymbol: /.*[@#$%^&+=!].*/,
    hexCode: /^#[0-9A-F]{6}$/i,
    digitOneDecimalSpace: /^(\d)*(\.)?(\d)*$/
};

export const required = (value: any, label?: any) => {
    let message = "is required"
    if (Boolean(label) && getType(label) === "string") {
        message = `${label} ${message}`
    }
    return value ? undefined : message
}
export const isEmail = (value: any) => (regExpJson.email.test(value) ? undefined : 'is invalid')
export const isHexCode = (value: any) => (regExpJson.hexCode.test(value) ? undefined : 'is invalid')
export const isValidPassword = (value: any) => {
    if (value.length < 8) {
        return 'should be at least 8 characters in length.'
    } else if (!regExpJson.leastOneCAPS.test(value)) {
        return 'must include at least one CAPS!'
    } else if (!regExpJson.leastOneDigit.test(value)) {
        return 'must include at least one number!'
    } else if (!regExpJson.leastOneSymbol.test(value)) {
        return 'must include at least one symbol!'
    }
}
export const matchPassword = (password: any) => (value: any) => {
    if (password !== value) {
        return 'not match with password'
    }
}
export const startWithString = (value: any) => {
    if (value.match(/^\d/)) {
        return 'must start with string'
    }
}
export const mustBeNumber = (value: any) => (isNaN(value) ? 'Must be a number' : undefined)
export const onlyDigitOneDecimal = (value: any) => (regExpJson.digitOneDecimalSpace.test(value) ? undefined : 'is invalid')
export const minLength = (min: any, label?: any) => (value: any) => {
    if (value?.length !== min) {
        let message = `must be ${min} digit`
        if (Boolean(label) && getType(label) === "string") {
            message = `${label} ${message}`
        }
        return message
    }
}

export const composeValidators = (...validators: any) => (value: any) =>
    validators.reduce((error: any, validator: any) => error || validator(value), undefined)

//validate={composeValidators(required, mustBeNumber, minValue(18))}

const vouchers = [
    {
        label: 'Invoice',
        type: 'type1',
        icon: 'file-invoice-dollar',
        screentype: 'sales',
        counter: 0,
        color: '#35d039',
        quickaction: true,
        vouchertypeid: 'b152d626-b614-4736-8572-2ebd95e24173',
        navigationid: "31e6efe1-3920-4331-bc79-a2f7d7040999"
    },
    {
        label: 'Receive Payment',
        type: 'type1',
        icon: 'receipt',
        screentype: 'sales',
        counter: 0,
        color: '#35d039',
        vouchertypeid: 'be0e9672-a46e-4e91-a2bf-815530b22b43',
        navigationid: "b476aaa0-f0eb-460d-b4d7-9dd5136bb196"
    },
    {
        label: 'Credit Note',
        type: 'type1',
        icon: 'message-pen',
        screentype: 'sales',
        counter: 0,
        color: '#35d039',
        vouchertypeid: '8a2c1b35-1781-409c-820e-73e90821735f',
        navigationid: "354fe8d5-4c56-43db-a112-cfd253a3f2a0"
    },
    {
        label: 'Sales Order',
        type: 'type1',
        icon: 'bags-shopping',
        screentype: 'sales',
        counter: 0,
        color: '#35d039',
        vouchertypeid: 'ec6da168-5659-4a2f-9896-6ef4c8598532',
        navigationid: "b81999b0-869c-460d-92c5-aa7966e3babd"
    },
    {
        label: 'Delivery Challan',
        type: 'type1',
        icon: 'truck',
        screentype: 'sales',
        counter: 0,
        color: '#35d039',
        vouchertypeid: '6516aa72-876f-4d7e-a02f-4d0333dd855a',
        navigationid: "f741ca36-7bf3-494c-8d94-2c1ed2ab0291"
    },
    {
        label: 'Estimate',
        type: 'type1',
        icon: 'hand-holding-dollar',
        screentype: 'sales',
        counter: 0,
        quickaction: true,
        color: '#35d039',
        vouchertypeid: 'd7310e31-acee-4cfc-aa4d-4935b150706b',
        navigationid: "a9e957a5-43f9-4b1a-92e6-9d71b6634762"
    },
    {
        label: 'Jobsheet',
        type: 'type1',
        icon: 'ballot-check',
        screentype: 'sales',
        counter: 0,
        color: '#35d039',
        quickaction: true,
        vouchertypeid: 'f3e46b64-f315-4c56-b2d7-58591c09d6e5',
        navigationid: "6e7d3ad2-a91a-4d36-8b58-fe682901d032"
    },
    {
        label: 'Client',
        type: 'type1',
        icon: 'user',
        screentype: 'sales',
        counter: 0,
        quickaction: true,
        color: '#35d039',
        vouchertypeid: '000-000-000',
        vouchertypeid2: '96d1fd0b-359c-4c0a-ad86-354911f3ab6f',
        navigationid: "f2d89d54-8ea4-47a6-8ee2-6972f4ee799d"
    },
    {
        label: 'Bill',
        type: 'type2',
        icon: 'truck-ramp-box',
        screentype: 'purchase',
        counter: 0,
        quickaction: true,
        color: '#8472e9',
        vouchertypeid: '71e9cc99-f2d1-4b47-94ee-7aafd481e3c5',
        navigationid: "9594488a-d2b2-4af0-a12b-0fc0f2c48fbe"
    },
    {
        label: 'Payment Made',
        type: 'type2',
        icon: 'money-bill',
        screentype: 'purchase',
        counter: 0,
        color: '#8472e9',
        vouchertypeid: 'c86a5524-30a4-4954-9303-1cf028f546a7',
        navigationid: "8c107c06-d0b8-480e-835f-64534ffbb029"
    },
    {
        label: 'Purchase Order',
        type: 'type2',
        icon: 'envelope-open-dollar',
        screentype: 'purchase',
        counter: 0,
        color: '#8472e9',
        vouchertypeid: '210bf595-d2ee-4460-a378-c7ba86af4d53',
        navigationid: "2b4883c4-f945-4a9b-9a75-4b3a6ad9453e"
    },
    {
        label: 'Vendor Credit',
        type: 'type2',
        icon: 'circle-dollar-to-slot',
        screentype: 'purchase',
        counter: 0,
        color: '#8472e9',
        vouchertypeid: 'ad7d5565-118f-4684-ae5e-9b158a8d84b8',
        navigationid: "8f6cb4e5-a923-49bb-b926-bbf65dc192ff"
    },
    {
        label: 'Expense',
        type: 'type3',
        icon: 'coins',
        screentype: 'purchase',
        counter: 0,
        quickaction: true,
        color: '#8472e9',
        vouchertypeid: 'ba7f0f54-60da-4f07-b07b-8645632616ac',
        navigationid: "b5987c11-3f37-42d8-9b86-164e3f833caf"
    },
    {
        label: 'Vendor',
        type: 'type2',
        icon: 'user-cowboy',
        screentype: 'purchase',
        counter: 0,
        quickaction: true,
        color: '#8472e9',
        vouchertypeid: '111-111-111',
        vouchertypeid2: '23e37aa8-8926-414d-9702-4ee487a4c016',
        navigationid: "e60b9d7f-b93b-425a-9aec-30e97e64c859"
    },
    {
        label: 'Journal',
        type: 'type5',
        icon: 'clipboard-list',
        screentype: 'account',
        counter: 0,
        color: '#da5454',
        vouchertypeid: '777d6a15-f01b-4d8d-8bf9-c6ae2c7e12a6',
        navigationid: "b907fdad-cba1-4019-aeab-7a3e8a756e57"
    },
    {
        label: 'Party To Party',
        type: 'type5',
        icon: 'clipboard-list',
        screentype: 'account',
        counter: 0,
        color: '#da5454',
        vouchertypeid: '2b0e95e5-b22c-4830-8a15-cb84b61255b6',
        navigationid: "a9cfed8b-3787-4c55-98b9-5fbb4c625af1"
    },
    {
        label: 'Chart of Account',
        type: 'type5',
        icon: 'route-interstate',
        screentype: 'account',
        counter: 0,
        color: '#da5454',
        vouchertypeid: '222-222-222',
        vouchertypeid2: '3e7a4178-5ff5-413d-9d08-7df7e868f3de',
        navigationid: "6808fd75-fe14-464a-954c-3facd24d8cc5"
    },
    {
        label: 'Settings',
        type: 'type5',
        icon: 'gear',
        screentype: 'other',
        counter: 0,
        color: '#54cada',
        vouchertypeid: '555-555-555',
        navigationid: "997da2ee-b258-493b-b7b8-3165bb505580dsdsds"
    },
    {
        label: 'Item',
        type: 'type6',
        icon: 'laptop-mobile',
        screentype: 'inventory',
        counter: 0,
        quickaction: true,
        color: '#54cada',
        vouchertypeid: '333-333-333',
        vouchertypeid2: '782d9266-f190-4a14-b17e-4bf3a43e9912',
        navigationid: "88ee964a-b123-4224-9051-871f6cb7be43"  // Temp Set Item Category Navigation ID
    },
    {
        label: 'Item Category',
        type: 'type6',
        icon: 'boxes-stacked',
        screentype: 'inventory',
        counter: 0,
        color: '#54cada',
        vouchertypeid: '444-444-444',
        vouchertypeid2: 'f46c9201-a98e-450e-ab34-04589527fa0b',
        navigationid: "88ee964a-b123-4224-9051-871f6cb7be43"
    },
    {
        label: 'Inventory Adjustment',
        type: 'type6',
        icon: 'person-carry-box',
        screentype: 'inventory',
        counter: 0,
        color: '#54cada',
        vouchertypeid: '75729cc6-32a5-4291-8097-eef6f508d442',
        navigationid: "b722cf5f-b460-4fb7-a8a1-376a551bc8ca"
    },
];

export const FILTERED_VOUCHER = {data: []};

const inventoryOption: any = {
    specificidentification: {
        name: "Specific Identification",
        // info: "Used by organisations with specifically identifiable invitatory; cost can be directly attributed  and are specifically assigned to the specific unit sold",
        info: "Specific identification required unique serial number, have a Auto generate by system or manual input",
        disabled: false
    },
    fifo: {
        name: "FIFO",
        info: "The earliest purchase goods are removed and expensed first",
        disabled: false
    },
    lifo: {
        name: "LIFO",
        info: "The latest purchased good are removed and expensed first",
        disabled: true
    },
    weightedaverage: {
        name: "Weighted Average",
        info: "The total cost of goods available for sale divided by units available",
        disabled: true
    },
};

const options_itc: any = [
    assignOption("Eligible for ITC", "eligible"),
    assignOption("Ineligible - As per Section 17(5)", "ineligible17"),
    assignOption("Ineligible Others", "ineligibleothers"),
    assignOption("Import of Goods", "goods"),
    assignOption("Import of Service", "service"),
]

const salutation = ["Mr.", "Mrs.", "Ms.", "Miss.", "Dr."];

const taxTypes: any = {
    exclusive: "Exclusive of Tax",
    inclusive: "Inclusive of Tax",
    outofscope: "Out of scope of Tax",
};

export const roundOffOptions: any = {
    disable: "Disabled",
    auto: "Auto",
    up: "UP",
    down: "Down",
};

const units = [
    {value: "1", label: "kg"},
    {value: "2", label: "gm"},
    {value: "3", label: "ltr"},
    {value: "4", label: "pcs"},
];

const ordersources = ["POS", "Online Order", "Food Panda", "Swiggy", "Zomato", "Uber Eats"];

//const discountTypes = ["Direct", "Complimentary", "Coupon", "Offers", "Loyalty", "Non Chargable Voucher"];
const discountTypes = [{value: 'direct', label: "Direct"}];


const cancelKotReason = ["Item spoiled", "Wastage", "Not in stock", "Canceled by user request"];

const printerType = [
    {
        key: "Generic Network Printer",
        value: "EPSON"
    },
    {
        key: "Windows Shared Printer",
        value: "SHARED"
    }
];

const paperWidthList = [
    {
        key: "54 mm",
        value: "54"
    },
    {
        key: "72 mm",
        value: "72"
    },
    {
        key: "76 mm",
        value: "76"
    },
    {
        key: "80 mm",
        value: "80"
    }
];

const pricing: any = {
    "type": "onetime",
    "qntranges": [
        {
            "id": "0",
            "start": 1,
            "end": 10000000000,
            "text": "1 - Infinite"
        },
    ],
    "price": {
        "default": [
            {
                "onetime": {
                    "baseprice": 0
                }
            },
        ],
    },
    "advancestructure": false,
    "setup": false
};

const settingsGroup = (
    title: string,
    options: any[]
) => ({
    title,
    options
})

const settingOptions = (
    navigationid: any,
    label: string,
    icon: string,
    screenName?: any,
    params?: any
) => ({
    label,
    icon,
    screenName,
    params,
    navigationid
})

export const taskReminderListButton = ["Hours", "Days", "Week"];

export const notes: any = {
    creditnote: "Credit Notes",
    debitnote: "Debit Notes",
    adjustment: "Adjustment Notes",
    notaxreason: "No-Tax Reason",
    ordercancelreason: "Order Cancel Reason",
    ticketcancelreason: "Ticket Cancel Reason",
}
export const printerTypes: any = {
    "Web": "Inject/Laser printer",
    "Thermal": "Thermal Printer"
}

export const ticketAssignType: any = ["None", "Optional", "Required"];

export const resetTickets: any = ["Daily", "Monthly", "Yearly"];

const options_preferences: any = [
    settingOptions("c156b6a1-786a-4b41-8aed-ae7dca74b678", "Organization Profile", "building", "OrganizationProfile", {update: true}),
    settingOptions("e8641856-7913-4a6e-96bf-7f514754d874", "Outlet / Location", "outlet", "LocationNavigator", null),
    settingOptions("3e28c725-ddcf-4dfe-8e92-ef627be81b93", "Currency", "dollar-sign", "CurrencyNavigator"),
    settingOptions("4edb89a4-f210-47f8-b370-4a5b3ee356b1", "Units", "box", "UnitsNavigator"),
    settingOptions("373eb47e-b58d-4818-8791-8f2dfb15ebcb", "Payment Method", "credit-card", "PaymentMethodNavigator"),
    settingOptions("c19cc8e4-4a54-4a8c-8fca-36d097aa6772", "Automation", "robot", "Automation"),
    settingOptions("a4a363e6-39f8-4ef2-9984-2c91c3c292b9", "Reasons", "list", "ReasonsNavigator"),
    settingOptions("e6e213be-73fb-49b0-a9b7-edbc2fea09a5", "Printing Templates", "print", "Templates", {
        title: "Printing Templates",
        templateKey: "printingtemplate"
    }),
    settingOptions("11001002", "Email Templates", "envelope", "Templates", {
        title: "Email Templates",
        templateKey: "mailTemplate"
    }),
    settingOptions("147401fa-973f-421c-83c2-a0af53033180", "Notification Templates", "bells", "Templates", {
        title: "Notification Templates",
        templateKey: "notificationTemplate"
    }),
    settingOptions("e0b9800a-45d2-4087-9844-86643a78788e", "Due Date Terms", "calendar", "DueDateTermsNavigator"),
    settingOptions("2001000", "Client's Assets Types", "laptop", "ClientAssetsTypesNavigator"),
];

const options_users_roles: any = [
    settingOptions("0621c51e-9bef-4287-ba36-174c000edad1", "Users", "users", "ListStaff"),
    settingOptions("0621c51e-9bef-4287-ba36-174c000edad1", "Roles", "universal-access"),
];

const options_taxes: any = [
    settingOptions("04b85cdc-7cc5-45bd-ac4e-5260fa5fac8d", "Taxes", "file-invoice", "TaxesNavigator", null),
    settingOptions("7c8311d8-798c-41e3-8ec1-6ce249db3c49", "Tax Deducted as Sources", "ballot", "TdsTcsNavigator", {
        title: "Tax Deducted At Source [TDS]",
        templateKey: "tds"
    }),
    settingOptions("5d103d4f-c4c6-4e2f-9e93-fec43565d72e", "Tax Collected as Sources", "ballot-check", "TdsTcsNavigator", {
        title: "Tax Collected At Source [TCS]",
        templateKey: "tcs"
    }),
];

const options_other: any = [
    settingOptions("897d6d93-79bd-4e82-abc1-a00ccb6a944d", "Voucher Settings", "cart-arrow-down", "VoucherTypeNavigator"),
    settingOptions("3c2829ac-cd8d-46c4-b8c6-5c5e282dee0b", "Ticket Settings", "ticket", "TicketTypesTypeNavigator"),
];

export const location_settings = [
    settingsGroup("Preferences", options_preferences),
    settingsGroup("User & Roles", options_users_roles),
    settingsGroup("Taxes", options_taxes),
    settingsGroup("Others Settings", options_other),
]

const currencyNotes = [
    {value: "10", label: "10"},
    {value: "20", label: "20"},
    {value: "50", label: "50"},
    {value: "100", label: "100"},
    {value: "200", label: "200"},
    {value: "500", label: "500"},
    {value: "2000", label: "2000"},
];

export const orderTypes = [
    {label: 'All', value: '', visible: true},
    {label: 'Tables', value: 'tableorder', visible: true},
    {label: 'Delivery', value: 'delivery'},
    {label: 'Take Away', value: 'pickup'},
    {label: 'QSR', value: 'qsr'}
]

export const currencylist: any = {
    "AED": {"symbol": "AED", "code": "AED", "symbol_native": "د.إ.\u200F", "decimal_digits": 2, "rounding": 0.0},
    "AFN": {"symbol": "AFN", "code": "AFN", "symbol_native": "؋", "decimal_digits": 0, "rounding": 0.0},
    "ALL": {"symbol": "ALL", "code": "ALL", "symbol_native": "Lekë", "decimal_digits": 0, "rounding": 0.0},
    "AMD": {"symbol": "AMD", "code": "AMD", "symbol_native": "֏", "decimal_digits": 0, "rounding": 0.0},
    "ANG": {"symbol": "ANG", "code": "ANG", "symbol_native": "NAf.", "decimal_digits": 2, "rounding": 0.0},
    "AOA": {"symbol": "AOA", "code": "AOA", "symbol_native": "Kz", "decimal_digits": 2, "rounding": 0.0},
    "ARS": {"symbol": "ARS", "code": "ARS", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "AUD": {"symbol": "A$", "code": "AUD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "AWG": {"symbol": "AWG", "code": "AWG", "symbol_native": "Afl.", "decimal_digits": 2, "rounding": 0.0},
    "AZN": {"symbol": "AZN", "code": "AZN", "symbol_native": "\u20BC", "decimal_digits": 2, "rounding": 0.0},
    "BAM": {"symbol": "BAM", "code": "BAM", "symbol_native": "КМ", "decimal_digits": 2, "rounding": 0.0},
    "BBD": {"symbol": "BBD", "code": "BBD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "BDT": {"symbol": "BDT", "code": "BDT", "symbol_native": "৳", "decimal_digits": 2, "rounding": 0.0},
    "BGN": {"symbol": "BGN", "code": "BGN", "symbol_native": "лв.", "decimal_digits": 2, "rounding": 0.0},
    "BHD": {"symbol": "BHD", "code": "BHD", "symbol_native": "د.ب.\u200F", "decimal_digits": 3, "rounding": 0.0},
    "BIF": {"symbol": "BIF", "code": "BIF", "symbol_native": "FBu", "decimal_digits": 0, "rounding": 0.0},
    "BMD": {"symbol": "BMD", "code": "BMD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "BND": {"symbol": "BND", "code": "BND", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "BOB": {"symbol": "BOB", "code": "BOB", "symbol_native": "Bs", "decimal_digits": 2, "rounding": 0.0},
    "BOV": {"symbol": "BOV", "code": "BOV", "symbol_native": "BOV", "decimal_digits": 2, "rounding": 0.0},
    "BRL": {"symbol": "R$", "code": "BRL", "symbol_native": "R$", "decimal_digits": 2, "rounding": 0.0},
    "BSD": {"symbol": "BSD", "code": "BSD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "BTN": {"symbol": "BTN", "code": "BTN", "symbol_native": "Nu.", "decimal_digits": 2, "rounding": 0.0},
    "BWP": {"symbol": "BWP", "code": "BWP", "symbol_native": "P", "decimal_digits": 2, "rounding": 0.0},
    "BYN": {"symbol": "BYN", "code": "BYN", "symbol_native": "Br", "decimal_digits": 2, "rounding": 0.0},
    "BZD": {"symbol": "BZD", "code": "BZD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "CAD": {"symbol": "CA$", "code": "CAD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "CDF": {"symbol": "CDF", "code": "CDF", "symbol_native": "FC", "decimal_digits": 2, "rounding": 0.0},
    "CHE": {"symbol": "CHE", "code": "CHE", "symbol_native": "CHE", "decimal_digits": 2, "rounding": 0.0},
    "CHF": {"symbol": "CHF", "code": "CHF", "symbol_native": "CHF", "decimal_digits": 2, "rounding": 0.0},
    "CHW": {"symbol": "CHW", "code": "CHW", "symbol_native": "CHW", "decimal_digits": 2, "rounding": 0.0},
    "CLF": {"symbol": "CLF", "code": "CLF", "symbol_native": "CLF", "decimal_digits": 4, "rounding": 0.0},
    "CLP": {"symbol": "CLP", "code": "CLP", "symbol_native": "$", "decimal_digits": 0, "rounding": 0.0},
    "CNH": {"symbol": "CNH", "code": "CNH", "symbol_native": "CNH", "decimal_digits": 2, "rounding": 0.0},
    "CNY": {"symbol": "CN¥", "code": "CNY", "symbol_native": "¥", "decimal_digits": 2, "rounding": 0.0},
    "COP": {"symbol": "COP", "code": "COP", "symbol_native": "$", "decimal_digits": 0, "rounding": 0.0},
    "COU": {"symbol": "COU", "code": "COU", "symbol_native": "COU", "decimal_digits": 2, "rounding": 0.0},
    "CRC": {"symbol": "CRC", "code": "CRC", "symbol_native": "\u20A1", "decimal_digits": 2, "rounding": 0.0},
    "CUC": {"symbol": "CUC", "code": "CUC", "symbol_native": "CUC", "decimal_digits": 2, "rounding": 0.0},
    "CUP": {"symbol": "CUP", "code": "CUP", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "CVE": {"symbol": "CVE", "code": "CVE", "symbol_native": "\u200B", "decimal_digits": 2, "rounding": 0.0},
    "CZK": {"symbol": "CZK", "code": "CZK", "symbol_native": "Kč", "decimal_digits": 2, "rounding": 0.0},
    "DJF": {"symbol": "DJF", "code": "DJF", "symbol_native": "Fdj", "decimal_digits": 0, "rounding": 0.0},
    "DKK": {"symbol": "DKK", "code": "DKK", "symbol_native": "kr.", "decimal_digits": 2, "rounding": 0.0},
    "DOP": {"symbol": "DOP", "code": "DOP", "symbol_native": "RD$", "decimal_digits": 2, "rounding": 0.0},
    "DZD": {"symbol": "DZD", "code": "DZD", "symbol_native": "د.ج.\u200F", "decimal_digits": 2, "rounding": 0.0},
    "EGP": {"symbol": "EGP", "code": "EGP", "symbol_native": "ج.م.\u200F", "decimal_digits": 2, "rounding": 0.0},
    "ERN": {"symbol": "ERN", "code": "ERN", "symbol_native": "Nfk", "decimal_digits": 2, "rounding": 0.0},
    "ETB": {"symbol": "ETB", "code": "ETB", "symbol_native": "ብር", "decimal_digits": 2, "rounding": 0.0},
    "EUR": {"symbol": "\u20AC", "code": "EUR", "symbol_native": "\u20AC", "decimal_digits": 2, "rounding": 0.0},
    "FJD": {"symbol": "FJD", "code": "FJD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "FKP": {"symbol": "FKP", "code": "FKP", "symbol_native": "£", "decimal_digits": 2, "rounding": 0.0},
    "GBP": {"symbol": "£", "code": "GBP", "symbol_native": "£", "decimal_digits": 2, "rounding": 0.0},
    "GEL": {"symbol": "GEL", "code": "GEL", "symbol_native": "\u20BE", "decimal_digits": 2, "rounding": 0.0},
    "GHS": {"symbol": "GHS", "code": "GHS", "symbol_native": "GH\u20B5", "decimal_digits": 2, "rounding": 0.0},
    "GIP": {"symbol": "GIP", "code": "GIP", "symbol_native": "£", "decimal_digits": 2, "rounding": 0.0},
    "GMD": {"symbol": "GMD", "code": "GMD", "symbol_native": "D", "decimal_digits": 2, "rounding": 0.0},
    "GNF": {"symbol": "GNF", "code": "GNF", "symbol_native": "FG", "decimal_digits": 0, "rounding": 0.0},
    "GTQ": {"symbol": "GTQ", "code": "GTQ", "symbol_native": "Q", "decimal_digits": 2, "rounding": 0.0},
    "GYD": {"symbol": "GYD", "code": "GYD", "symbol_native": "$", "decimal_digits": 0, "rounding": 0.0},
    "HKD": {"symbol": "HK$", "code": "HKD", "symbol_native": "HK$", "decimal_digits": 2, "rounding": 0.0},
    "HNL": {"symbol": "HNL", "code": "HNL", "symbol_native": "L", "decimal_digits": 2, "rounding": 0.0},
    "HRK": {"symbol": "HRK", "code": "HRK", "symbol_native": "HRK", "decimal_digits": 2, "rounding": 0.0},
    "HTG": {"symbol": "HTG", "code": "HTG", "symbol_native": "G", "decimal_digits": 2, "rounding": 0.0},
    "HUF": {"symbol": "HUF", "code": "HUF", "symbol_native": "Ft", "decimal_digits": 2, "rounding": 0.0},
    "IDR": {"symbol": "IDR", "code": "IDR", "symbol_native": "Rp", "decimal_digits": 0, "rounding": 0.0},
    "ILS": {"symbol": "\u20AA", "code": "ILS", "symbol_native": "\u20AA", "decimal_digits": 2, "rounding": 0.0},
    "INR": {"symbol": "\u20B9", "code": "INR", "symbol_native": "\u20B9", "decimal_digits": 2, "rounding": 0.0},
    "IQD": {"symbol": "IQD", "code": "IQD", "symbol_native": "د.ع.\u200F", "decimal_digits": 0, "rounding": 0.0},
    "IRR": {"symbol": "IRR", "code": "IRR", "symbol_native": "IRR", "decimal_digits": 0, "rounding": 0.0},
    "ISK": {"symbol": "ISK", "code": "ISK", "symbol_native": "ISK", "decimal_digits": 0, "rounding": 0.0},
    "JMD": {"symbol": "JMD", "code": "JMD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "JOD": {"symbol": "JOD", "code": "JOD", "symbol_native": "د.أ.\u200F", "decimal_digits": 3, "rounding": 0.0},
    "JPY": {"symbol": "JP¥", "code": "JPY", "symbol_native": "￥", "decimal_digits": 0, "rounding": 0.0},
    "KES": {"symbol": "KES", "code": "KES", "symbol_native": "Ksh", "decimal_digits": 2, "rounding": 0.0},
    "KGS": {"symbol": "KGS", "code": "KGS", "symbol_native": "сом", "decimal_digits": 2, "rounding": 0.0},
    "KHR": {"symbol": "KHR", "code": "KHR", "symbol_native": "៛", "decimal_digits": 2, "rounding": 0.0},
    "KMF": {"symbol": "KMF", "code": "KMF", "symbol_native": "CF", "decimal_digits": 0, "rounding": 0.0},
    "KPW": {"symbol": "KPW", "code": "KPW", "symbol_native": "KPW", "decimal_digits": 0, "rounding": 0.0},
    "KRW": {"symbol": "\u20A9", "code": "KRW", "symbol_native": "\u20A9", "decimal_digits": 0, "rounding": 0.0},
    "KWD": {"symbol": "KWD", "code": "KWD", "symbol_native": "د.ك.\u200F", "decimal_digits": 3, "rounding": 0.0},
    "KYD": {"symbol": "KYD", "code": "KYD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "KZT": {"symbol": "KZT", "code": "KZT", "symbol_native": "\u20B8", "decimal_digits": 2, "rounding": 0.0},
    "LAK": {"symbol": "LAK", "code": "LAK", "symbol_native": "\u20AD", "decimal_digits": 0, "rounding": 0.0},
    "LBP": {"symbol": "LBP", "code": "LBP", "symbol_native": "ل.ل.\u200F", "decimal_digits": 0, "rounding": 0.0},
    "LKR": {"symbol": "LKR", "code": "LKR", "symbol_native": "රු.", "decimal_digits": 2, "rounding": 0.0},
    "LRD": {"symbol": "LRD", "code": "LRD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "LSL": {"symbol": "LSL", "code": "LSL", "symbol_native": "LSL", "decimal_digits": 2, "rounding": 0.0},
    "LYD": {"symbol": "LYD", "code": "LYD", "symbol_native": "د.ل.\u200F", "decimal_digits": 3, "rounding": 0.0},
    "MAD": {"symbol": "MAD", "code": "MAD", "symbol_native": "د.م.\u200F", "decimal_digits": 2, "rounding": 0.0},
    "MDL": {"symbol": "MDL", "code": "MDL", "symbol_native": "L", "decimal_digits": 2, "rounding": 0.0},
    "MGA": {"symbol": "MGA", "code": "MGA", "symbol_native": "Ar", "decimal_digits": 0, "rounding": 0.0},
    "MKD": {"symbol": "MKD", "code": "MKD", "symbol_native": "ден", "decimal_digits": 2, "rounding": 0.0},
    "MMK": {"symbol": "MMK", "code": "MMK", "symbol_native": "K", "decimal_digits": 0, "rounding": 0.0},
    "MNT": {"symbol": "MNT", "code": "MNT", "symbol_native": "\u20AE", "decimal_digits": 0, "rounding": 0.0},
    "MOP": {"symbol": "MOP", "code": "MOP", "symbol_native": "MOP$", "decimal_digits": 2, "rounding": 0.0},
    "MRO": {"symbol": "MRO", "code": "MRO", "symbol_native": "أ.م.\u200F", "decimal_digits": 0, "rounding": 0.0},
    "MUR": {"symbol": "MUR", "code": "MUR", "symbol_native": "Rs", "decimal_digits": 0, "rounding": 0.0},
    "MWK": {"symbol": "MWK", "code": "MWK", "symbol_native": "MK", "decimal_digits": 2, "rounding": 0.0},
    "MXN": {"symbol": "MX$", "code": "MXN", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "MXV": {"symbol": "MXV", "code": "MXV", "symbol_native": "MXV", "decimal_digits": 2, "rounding": 0.0},
    "MYR": {"symbol": "MYR", "code": "MYR", "symbol_native": "RM", "decimal_digits": 2, "rounding": 0.0},
    "MZN": {"symbol": "MZN", "code": "MZN", "symbol_native": "MTn", "decimal_digits": 2, "rounding": 0.0},
    "NAD": {"symbol": "NAD", "code": "NAD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "NGN": {"symbol": "NGN", "code": "NGN", "symbol_native": "\u20A6", "decimal_digits": 2, "rounding": 0.0},
    "NIO": {"symbol": "NIO", "code": "NIO", "symbol_native": "C$", "decimal_digits": 2, "rounding": 0.0},
    "NOK": {"symbol": "NOK", "code": "NOK", "symbol_native": "kr", "decimal_digits": 2, "rounding": 0.0},
    "NPR": {"symbol": "NPR", "code": "NPR", "symbol_native": "नेरू", "decimal_digits": 2, "rounding": 0.0},
    "NZD": {"symbol": "NZ$", "code": "NZD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "OMR": {"symbol": "OMR", "code": "OMR", "symbol_native": "ر.ع.\u200F", "decimal_digits": 3, "rounding": 0.0},
    "PAB": {"symbol": "PAB", "code": "PAB", "symbol_native": "B\/.", "decimal_digits": 2, "rounding": 0.0},
    "PEN": {"symbol": "PEN", "code": "PEN", "symbol_native": "S\/", "decimal_digits": 2, "rounding": 0.0},
    "PGK": {"symbol": "PGK", "code": "PGK", "symbol_native": "K", "decimal_digits": 2, "rounding": 0.0},
    "PHP": {"symbol": "PHP", "code": "PHP", "symbol_native": "\u20B1", "decimal_digits": 2, "rounding": 0.0},
    "PKR": {"symbol": "PKR", "code": "PKR", "symbol_native": "Rs", "decimal_digits": 0, "rounding": 0.0},
    "PLN": {"symbol": "PLN", "code": "PLN", "symbol_native": "zł", "decimal_digits": 2, "rounding": 0.0},
    "PYG": {"symbol": "PYG", "code": "PYG", "symbol_native": "Gs.", "decimal_digits": 0, "rounding": 0.0},
    "QAR": {"symbol": "QAR", "code": "QAR", "symbol_native": "ر.ق.\u200F", "decimal_digits": 2, "rounding": 0.0},
    "RON": {"symbol": "RON", "code": "RON", "symbol_native": "RON", "decimal_digits": 2, "rounding": 0.0},
    "RSD": {"symbol": "RSD", "code": "RSD", "symbol_native": "RSD", "decimal_digits": 0, "rounding": 0.0},
    "RUB": {"symbol": "RUB", "code": "RUB", "symbol_native": "\u20BD", "decimal_digits": 2, "rounding": 0.0},
    "RWF": {"symbol": "RWF", "code": "RWF", "symbol_native": "RF", "decimal_digits": 0, "rounding": 0.0},
    "SAR": {"symbol": "SAR", "code": "SAR", "symbol_native": "ر.س.\u200F", "decimal_digits": 2, "rounding": 0.0},
    "SBD": {"symbol": "SBD", "code": "SBD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "SCR": {"symbol": "SCR", "code": "SCR", "symbol_native": "SR", "decimal_digits": 2, "rounding": 0.0},
    "SDG": {"symbol": "SDG", "code": "SDG", "symbol_native": "ج.س.", "decimal_digits": 2, "rounding": 0.0},
    "SEK": {"symbol": "SEK", "code": "SEK", "symbol_native": "kr", "decimal_digits": 2, "rounding": 0.0},
    "SGD": {"symbol": "SGD", "code": "SGD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "SHP": {"symbol": "SHP", "code": "SHP", "symbol_native": "£", "decimal_digits": 2, "rounding": 0.0},
    "SLL": {"symbol": "SLL", "code": "SLL", "symbol_native": "Le", "decimal_digits": 0, "rounding": 0.0},
    "SOS": {"symbol": "SOS", "code": "SOS", "symbol_native": "S", "decimal_digits": 0, "rounding": 0.0},
    "SRD": {"symbol": "SRD", "code": "SRD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "SSP": {"symbol": "SSP", "code": "SSP", "symbol_native": "£", "decimal_digits": 2, "rounding": 0.0},
    "STN": {"symbol": "STN", "code": "STN", "symbol_native": "STN", "decimal_digits": 2, "rounding": 0.0},
    "SYP": {"symbol": "SYP", "code": "SYP", "symbol_native": "ل.س.\u200F", "decimal_digits": 0, "rounding": 0.0},
    "SZL": {"symbol": "SZL", "code": "SZL", "symbol_native": "E", "decimal_digits": 2, "rounding": 0.0},
    "THB": {"symbol": "THB", "code": "THB", "symbol_native": "THB", "decimal_digits": 2, "rounding": 0.0},
    "TJS": {"symbol": "TJS", "code": "TJS", "symbol_native": "сом.", "decimal_digits": 2, "rounding": 0.0},
    "TND": {"symbol": "TND", "code": "TND", "symbol_native": "د.ت.\u200F", "decimal_digits": 3, "rounding": 0.0},
    "TOP": {"symbol": "TOP", "code": "TOP", "symbol_native": "T$", "decimal_digits": 2, "rounding": 0.0},
    "TRY": {"symbol": "TRY", "code": "TRY", "symbol_native": "\u20BA", "decimal_digits": 2, "rounding": 0.0},
    "TTD": {"symbol": "TTD", "code": "TTD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "TWD": {"symbol": "NT$", "code": "TWD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "TZS": {"symbol": "TZS", "code": "TZS", "symbol_native": "TSh", "decimal_digits": 0, "rounding": 0.0},
    "UAH": {"symbol": "UAH", "code": "UAH", "symbol_native": "\u20B4", "decimal_digits": 2, "rounding": 0.0},
    "UGX": {"symbol": "UGX", "code": "UGX", "symbol_native": "USh", "decimal_digits": 0, "rounding": 0.0},
    "USD": {"symbol": "US$", "code": "USD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "USN": {"symbol": "USN", "code": "USN", "symbol_native": "USN", "decimal_digits": 2, "rounding": 0.0},
    "UYI": {"symbol": "UYI", "code": "UYI", "symbol_native": "UYI", "decimal_digits": 0, "rounding": 0.0},
    "UYU": {"symbol": "UYU", "code": "UYU", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "UZS": {"symbol": "UZS", "code": "UZS", "symbol_native": "сўм", "decimal_digits": 0, "rounding": 0.0},
    "VEF": {"symbol": "VEF", "code": "VEF", "symbol_native": "Bs.", "decimal_digits": 2, "rounding": 0.0},
    "VND": {"symbol": "\u20AB", "code": "VND", "symbol_native": "\u20AB", "decimal_digits": 0, "rounding": 0.0},
    "VUV": {"symbol": "VUV", "code": "VUV", "symbol_native": "VT", "decimal_digits": 0, "rounding": 0.0},
    "WST": {"symbol": "WST", "code": "WST", "symbol_native": "WS$", "decimal_digits": 2, "rounding": 0.0},
    "XAF": {"symbol": "FCFA", "code": "XAF", "symbol_native": "FCFA", "decimal_digits": 0, "rounding": 0.0},
    "XCD": {"symbol": "EC$", "code": "XCD", "symbol_native": "$", "decimal_digits": 2, "rounding": 0.0},
    "XOF": {"symbol": "CFA", "code": "XOF", "symbol_native": "CFA", "decimal_digits": 0, "rounding": 0.0},
    "XPF": {"symbol": "CFPF", "code": "XPF", "symbol_native": "FCFP", "decimal_digits": 0, "rounding": 0.0},
    "YER": {"symbol": "YER", "code": "YER", "symbol_native": "ر.ي.\u200F", "decimal_digits": 0, "rounding": 0.0},
    "ZAR": {"symbol": "ZAR", "code": "ZAR", "symbol_native": "R", "decimal_digits": 2, "rounding": 0.0},
    "ZMW": {"symbol": "ZMW", "code": "ZMW", "symbol_native": "K", "decimal_digits": 2, "rounding": 0.0}
};

export const unitTypes: any = ["Weight", "Measure", "Volume", "Length", "Area"];

export const countrylist: any = [
    {label: 'Afghanistan', value: 'AF'},
    {label: 'Åland Islands', value: 'AX'},
    {label: 'Albania', value: 'AL'},
    {label: 'Algeria', value: 'DZ'},
    {label: 'American Samoa', value: 'AS'},
    {label: 'AndorrA', value: 'AD'},
    {label: 'Angola', value: 'AO'},
    {label: 'Anguilla', value: 'AI'},
    {label: 'Antarctica', value: 'AQ'},
    {label: 'Antigua and Barbuda', value: 'AG'},
    {label: 'Argentina', value: 'AR'},
    {label: 'Armenia', value: 'AM'},
    {label: 'Aruba', value: 'AW'},
    {label: 'Australia', value: 'AU'},
    {label: 'Austria', value: 'AT'},
    {label: 'Azerbaijan', value: 'AZ'},
    {label: 'Bahamas', value: 'BS'},
    {label: 'Bahrain', value: 'BH'},
    {label: 'Bangladesh', value: 'BD'},
    {label: 'Barbados', value: 'BB'},
    {label: 'Belarus', value: 'BY'},
    {label: 'Belgium', value: 'BE'},
    {label: 'Belize', value: 'BZ'},
    {label: 'Benin', value: 'BJ'},
    {label: 'Bermuda', value: 'BM'},
    {label: 'Bhutan', value: 'BT'},
    {label: 'Bolivia', value: 'BO'},
    {label: 'Bosnia and Herzegovina', value: 'BA'},
    {label: 'Botswana', value: 'BW'},
    {label: 'Bouvet Island', value: 'BV'},
    {label: 'Brazil', value: 'BR'},
    {label: 'British Indian Ocean Territory', value: 'IO'},
    {label: 'Brunei Darussalam', value: 'BN'},
    {label: 'Bulgaria', value: 'BG'},
    {label: 'Burkina Faso', value: 'BF'},
    {label: 'Burundi', value: 'BI'},
    {label: 'Cambodia', value: 'KH'},
    {label: 'Cameroon', value: 'CM'},
    {label: 'Canada', value: 'CA'},
    {label: 'Cape Verde', value: 'CV'},
    {label: 'Cayman Islands', value: 'KY'},
    {label: 'Central African Republic', value: 'CF'},
    {label: 'Chad', value: 'TD'},
    {label: 'Chile', value: 'CL'},
    {label: 'China', value: 'CN'},
    {label: 'Christmas Island', value: 'CX'},
    {label: 'Cocos (Keeling) Islands', value: 'CC'},
    {label: 'Colombia', value: 'CO'},
    {label: 'Comoros', value: 'KM'},
    {label: 'Congo', value: 'CG'},
    {label: 'Congo, The Democratic Republic of the', value: 'CD'},
    {label: 'Cook Islands', value: 'CK'},
    {label: 'Costa Rica', value: 'CR'},
    {label: 'Cote D\'Ivoire', value: 'CI'},
    {label: 'Croatia', value: 'HR'},
    {label: 'Cuba', value: 'CU'},
    {label: 'Cyprus', value: 'CY'},
    {label: 'Czech Republic', value: 'CZ'},
    {label: 'Denmark', value: 'DK'},
    {label: 'Djibouti', value: 'DJ'},
    {label: 'Dominica', value: 'DM'},
    {label: 'Dominican Republic', value: 'DO'},
    {label: 'Ecuador', value: 'EC'},
    {label: 'Egypt', value: 'EG'},
    {label: 'El Salvador', value: 'SV'},
    {label: 'Equatorial Guinea', value: 'GQ'},
    {label: 'Eritrea', value: 'ER'},
    {label: 'Estonia', value: 'EE'},
    {label: 'Ethiopia', value: 'ET'},
    {label: 'Falkland Islands (Malvinas)', value: 'FK'},
    {label: 'Faroe Islands', value: 'FO'},
    {label: 'Fiji', value: 'FJ'},
    {label: 'Finland', value: 'FI'},
    {label: 'France', value: 'FR'},
    {label: 'French Guiana', value: 'GF'},
    {label: 'French Polynesia', value: 'PF'},
    {label: 'French Southern Territories', value: 'TF'},
    {label: 'Gabon', value: 'GA'},
    {label: 'Gambia', value: 'GM'},
    {label: 'Georgia', value: 'GE'},
    {label: 'Germany', value: 'DE'},
    {label: 'Ghana', value: 'GH'},
    {label: 'Gibraltar', value: 'GI'},
    {label: 'Greece', value: 'GR'},
    {label: 'Greenland', value: 'GL'},
    {label: 'Grenada', value: 'GD'},
    {label: 'Guadeloupe', value: 'GP'},
    {label: 'Guam', value: 'GU'},
    {label: 'Guatemala', value: 'GT'},
    {label: 'Guernsey', value: 'GG'},
    {label: 'Guinea', value: 'GN'},
    {label: 'Guinea-Bissau', value: 'GW'},
    {label: 'Guyana', value: 'GY'},
    {label: 'Haiti', value: 'HT'},
    {label: 'Heard Island and Mcdonald Islands', value: 'HM'},
    {label: 'Holy See (Vatican City State)', value: 'VA'},
    {label: 'Honduras', value: 'HN'},
    {label: 'Hong Kong', value: 'HK'},
    {label: 'Hungary', value: 'HU'},
    {label: 'Iceland', value: 'IS'},
    {label: 'India', value: 'IN'},
    {label: 'Indonesia', value: 'ID'},
    {label: 'Iran, Islamic Republic Of', value: 'IR'},
    {label: 'Iraq', value: 'IQ'},
    {label: 'Ireland', value: 'IE'},
    {label: 'Isle of Man', value: 'IM'},
    {label: 'Israel', value: 'IL'},
    {label: 'Italy', value: 'IT'},
    {label: 'Jamaica', value: 'JM'},
    {label: 'Japan', value: 'JP'},
    {label: 'Jersey', value: 'JE'},
    {label: 'Jordan', value: 'JO'},
    {label: 'Kazakhstan', value: 'KZ'},
    {label: 'Kenya', value: 'KE'},
    {label: 'Kiribati', value: 'KI'},
    {label: 'Korea, Democratic People\'S Republic of', value: 'KP'},
    {label: 'Korea, Republic of', value: 'KR'},
    {label: 'Kuwait', value: 'KW'},
    {label: 'Kyrgyzstan', value: 'KG'},
    {label: 'Lao People\'S Democratic Republic', value: 'LA'},
    {label: 'Latvia', value: 'LV'},
    {label: 'Lebanon', value: 'LB'},
    {label: 'Lesotho', value: 'LS'},
    {label: 'Liberia', value: 'LR'},
    {label: 'Libyan Arab Jamahiriya', value: 'LY'},
    {label: 'Liechtenstein', value: 'LI'},
    {label: 'Lithuania', value: 'LT'},
    {label: 'Luxembourg', value: 'LU'},
    {label: 'Macao', value: 'MO'},
    {label: 'Macedonia, The Former Yugoslav Republic of', value: 'MK'},
    {label: 'Madagascar', value: 'MG'},
    {label: 'Malawi', value: 'MW'},
    {label: 'Malaysia', value: 'MY'},
    {label: 'Maldives', value: 'MV'},
    {label: 'Mali', value: 'ML'},
    {label: 'Malta', value: 'MT'},
    {label: 'Marshall Islands', value: 'MH'},
    {label: 'Martinique', value: 'MQ'},
    {label: 'Mauritania', value: 'MR'},
    {label: 'Mauritius', value: 'MU'},
    {label: 'Mayotte', value: 'YT'},
    {label: 'Mexico', value: 'MX'},
    {label: 'Micronesia, Federated States of', value: 'FM'},
    {label: 'Moldova, Republic of', value: 'MD'},
    {label: 'Monaco', value: 'MC'},
    {label: 'Mongolia', value: 'MN'},
    {label: 'Montserrat', value: 'MS'},
    {label: 'Morocco', value: 'MA'},
    {label: 'Mozambique', value: 'MZ'},
    {label: 'Myanmar', value: 'MM'},
    {label: 'Namibia', value: 'NA'},
    {label: 'Nauru', value: 'NR'},
    {label: 'Nepal', value: 'NP'},
    {label: 'Netherlands', value: 'NL'},
    {label: 'Netherlands Antilles', value: 'AN'},
    {label: 'New Caledonia', value: 'NC'},
    {label: 'New Zealand', value: 'NZ'},
    {label: 'Nicaragua', value: 'NI'},
    {label: 'Niger', value: 'NE'},
    {label: 'Nigeria', value: 'NG'},
    {label: 'Niue', value: 'NU'},
    {label: 'Norfolk Island', value: 'NF'},
    {label: 'Northern Mariana Islands', value: 'MP'},
    {label: 'Norway', value: 'NO'},
    {label: 'Oman', value: 'OM'},
    {label: 'Pakistan', value: 'PK'},
    {label: 'Palau', value: 'PW'},
    {label: 'Palestinian Territory, Occupied', value: 'PS'},
    {label: 'Panama', value: 'PA'},
    {label: 'Papua New Guinea', value: 'PG'},
    {label: 'Paraguay', value: 'PY'},
    {label: 'Peru', value: 'PE'},
    {label: 'Philippines', value: 'PH'},
    {label: 'Pitcairn', value: 'PN'},
    {label: 'Poland', value: 'PL'},
    {label: 'Portugal', value: 'PT'},
    {label: 'Puerto Rico', value: 'PR'},
    {label: 'Qatar', value: 'QA'},
    {label: 'Reunion', value: 'RE'},
    {label: 'Romania', value: 'RO'},
    {label: 'Russian Federation', value: 'RU'},
    {label: 'RWANDA', value: 'RW'},
    {label: 'Saint Helena', value: 'SH'},
    {label: 'Saint Kitts and Nevis', value: 'KN'},
    {label: 'Saint Lucia', value: 'LC'},
    {label: 'Saint Pierre and Miquelon', value: 'PM'},
    {label: 'Saint Vincent and the Grenadines', value: 'VC'},
    {label: 'Samoa', value: 'WS'},
    {label: 'San Marino', value: 'SM'},
    {label: 'Sao Tome and Principe', value: 'ST'},
    {label: 'Saudi Arabia', value: 'SA'},
    {label: 'Senegal', value: 'SN'},
    {label: 'Serbia and Montenegro', value: 'CS'},
    {label: 'Seychelles', value: 'SC'},
    {label: 'Sierra Leone', value: 'SL'},
    {label: 'Singapore', value: 'SG'},
    {label: 'Slovakia', value: 'SK'},
    {label: 'Slovenia', value: 'SI'},
    {label: 'Solomon Islands', value: 'SB'},
    {label: 'Somalia', value: 'SO'},
    {label: 'South Africa', value: 'ZA'},
    {label: 'South Georgia and the South Sandwich Islands', value: 'GS'},
    {label: 'Spain', value: 'ES'},
    {label: 'Sri Lanka', value: 'LK'},
    {label: 'Sudan', value: 'SD'},
    {label: 'Surilabel', value: 'SR'},
    {label: 'Svalbard and Jan Mayen', value: 'SJ'},
    {label: 'Swaziland', value: 'SZ'},
    {label: 'Sweden', value: 'SE'},
    {label: 'Switzerland', value: 'CH'},
    {label: 'Syrian Arab Republic', value: 'SY'},
    {label: 'Taiwan, Province of China', value: 'TW'},
    {label: 'Tajikistan', value: 'TJ'},
    {label: 'Tanzania, United Republic of', value: 'TZ'},
    {label: 'Thailand', value: 'TH'},
    {label: 'Timor-Leste', value: 'TL'},
    {label: 'Togo', value: 'TG'},
    {label: 'Tokelau', value: 'TK'},
    {label: 'Tonga', value: 'TO'},
    {label: 'Trinidad and Tobago', value: 'TT'},
    {label: 'Tunisia', value: 'TN'},
    {label: 'Turkey', value: 'TR'},
    {label: 'Turkmenistan', value: 'TM'},
    {label: 'Turks and Caicos Islands', value: 'TC'},
    {label: 'Tuvalu', value: 'TV'},
    {label: 'Uganda', value: 'UG'},
    {label: 'Ukraine', value: 'UA'},
    {label: 'United Arab Emirates', value: 'AE'},
    {label: 'United Kingdom', value: 'GB'},
    {label: 'United States', value: 'US'},
    {label: 'United States Minor Outlying Islands', value: 'UM'},
    {label: 'Uruguay', value: 'UY'},
    {label: 'Uzbekistan', value: 'UZ'},
    {label: 'Vanuatu', value: 'VU'},
    {label: 'Venezuela', value: 'VE'},
    {label: 'Viet Nam', value: 'VN'},
    {label: 'Virgin Islands, British', value: 'VG'},
    {label: 'Virgin Islands, U.S.', value: 'VI'},
    {label: 'Wallis and Futuna', value: 'WF'},
    {label: 'Western Sahara', value: 'EH'},
    {label: 'Yemen', value: 'YE'},
    {label: 'Zambia', value: 'ZM'},
    {label: 'Zimbabwe', value: 'ZW'}
]

export const callingcode = [
    {
        "name": "Afghanistan",
        "dial_code": "+93",
        "code": "AF"
    },
    {
        "name": "Aland Islands",
        "dial_code": "+358",
        "code": "AX"
    },
    {
        "name": "Albania",
        "dial_code": "+355",
        "code": "AL"
    },
    {
        "name": "Algeria",
        "dial_code": "+213",
        "code": "DZ"
    },
    {
        "name": "AmericanSamoa",
        "dial_code": "+1684",
        "code": "AS"
    },
    {
        "name": "Andorra",
        "dial_code": "+376",
        "code": "AD"
    },
    {
        "name": "Angola",
        "dial_code": "+244",
        "code": "AO"
    },
    {
        "name": "Anguilla",
        "dial_code": "+1264",
        "code": "AI"
    },
    {
        "name": "Antarctica",
        "dial_code": "+672",
        "code": "AQ"
    },
    {
        "name": "Antigua and Barbuda",
        "dial_code": "+1268",
        "code": "AG"
    },
    {
        "name": "Argentina",
        "dial_code": "+54",
        "code": "AR"
    },
    {
        "name": "Armenia",
        "dial_code": "+374",
        "code": "AM"
    },
    {
        "name": "Aruba",
        "dial_code": "+297",
        "code": "AW"
    },
    {
        "name": "Australia",
        "dial_code": "+61",
        "code": "AU"
    },
    {
        "name": "Austria",
        "dial_code": "+43",
        "code": "AT"
    },
    {
        "name": "Azerbaijan",
        "dial_code": "+994",
        "code": "AZ"
    },
    {
        "name": "Bahamas",
        "dial_code": "+1242",
        "code": "BS"
    },
    {
        "name": "Bahrain",
        "dial_code": "+973",
        "code": "BH"
    },
    {
        "name": "Bangladesh",
        "dial_code": "+880",
        "code": "BD"
    },
    {
        "name": "Barbados",
        "dial_code": "+1246",
        "code": "BB"
    },
    {
        "name": "Belarus",
        "dial_code": "+375",
        "code": "BY"
    },
    {
        "name": "Belgium",
        "dial_code": "+32",
        "code": "BE"
    },
    {
        "name": "Belize",
        "dial_code": "+501",
        "code": "BZ"
    },
    {
        "name": "Benin",
        "dial_code": "+229",
        "code": "BJ"
    },
    {
        "name": "Bermuda",
        "dial_code": "+1441",
        "code": "BM"
    },
    {
        "name": "Bhutan",
        "dial_code": "+975",
        "code": "BT"
    },
    {
        "name": "Bolivia, Plurinational State of",
        "dial_code": "+591",
        "code": "BO"
    },
    {
        "name": "Bosnia and Herzegovina",
        "dial_code": "+387",
        "code": "BA"
    },
    {
        "name": "Botswana",
        "dial_code": "+267",
        "code": "BW"
    },
    {
        "name": "Brazil",
        "dial_code": "+55",
        "code": "BR"
    },
    {
        "name": "British Indian Ocean Territory",
        "dial_code": "+246",
        "code": "IO"
    },
    {
        "name": "Brunei Darussalam",
        "dial_code": "+673",
        "code": "BN"
    },
    {
        "name": "Bulgaria",
        "dial_code": "+359",
        "code": "BG"
    },
    {
        "name": "Burkina Faso",
        "dial_code": "+226",
        "code": "BF"
    },
    {
        "name": "Burundi",
        "dial_code": "+257",
        "code": "BI"
    },
    {
        "name": "Cambodia",
        "dial_code": "+855",
        "code": "KH"
    },
    {
        "name": "Cameroon",
        "dial_code": "+237",
        "code": "CM"
    },
    {
        "name": "Canada",
        "dial_code": "+1",
        "code": "CA"
    },
    {
        "name": "Cape Verde",
        "dial_code": "+238",
        "code": "CV"
    },
    {
        "name": "Cayman Islands",
        "dial_code": "+ 345",
        "code": "KY"
    },
    {
        "name": "Central African Republic",
        "dial_code": "+236",
        "code": "CF"
    },
    {
        "name": "Chad",
        "dial_code": "+235",
        "code": "TD"
    },
    {
        "name": "Chile",
        "dial_code": "+56",
        "code": "CL"
    },
    {
        "name": "China",
        "dial_code": "+86",
        "code": "CN"
    },
    {
        "name": "Christmas Island",
        "dial_code": "+61",
        "code": "CX"
    },
    {
        "name": "Cocos (Keeling) Islands",
        "dial_code": "+61",
        "code": "CC"
    },
    {
        "name": "Colombia",
        "dial_code": "+57",
        "code": "CO"
    },
    {
        "name": "Comoros",
        "dial_code": "+269",
        "code": "KM"
    },
    {
        "name": "Congo",
        "dial_code": "+242",
        "code": "CG"
    },
    {
        "name": "Congo, The Democratic Republic of the Congo",
        "dial_code": "+243",
        "code": "CD"
    },
    {
        "name": "Cook Islands",
        "dial_code": "+682",
        "code": "CK"
    },
    {
        "name": "Costa Rica",
        "dial_code": "+506",
        "code": "CR"
    },
    {
        "name": "Cote d'Ivoire",
        "dial_code": "+225",
        "code": "CI"
    },
    {
        "name": "Croatia",
        "dial_code": "+385",
        "code": "HR"
    },
    {
        "name": "Cuba",
        "dial_code": "+53",
        "code": "CU"
    },
    {
        "name": "Cyprus",
        "dial_code": "+357",
        "code": "CY"
    },
    {
        "name": "Czech Republic",
        "dial_code": "+420",
        "code": "CZ"
    },
    {
        "name": "Denmark",
        "dial_code": "+45",
        "code": "DK"
    },
    {
        "name": "Djibouti",
        "dial_code": "+253",
        "code": "DJ"
    },
    {
        "name": "Dominica",
        "dial_code": "+1767",
        "code": "DM"
    },
    {
        "name": "Dominican Republic",
        "dial_code": "+1849",
        "code": "DO"
    },
    {
        "name": "Ecuador",
        "dial_code": "+593",
        "code": "EC"
    },
    {
        "name": "Egypt",
        "dial_code": "+20",
        "code": "EG"
    },
    {
        "name": "El Salvador",
        "dial_code": "+503",
        "code": "SV"
    },
    {
        "name": "Equatorial Guinea",
        "dial_code": "+240",
        "code": "GQ"
    },
    {
        "name": "Eritrea",
        "dial_code": "+291",
        "code": "ER"
    },
    {
        "name": "Estonia",
        "dial_code": "+372",
        "code": "EE"
    },
    {
        "name": "Ethiopia",
        "dial_code": "+251",
        "code": "ET"
    },
    {
        "name": "Falkland Islands (Malvinas)",
        "dial_code": "+500",
        "code": "FK"
    },
    {
        "name": "Faroe Islands",
        "dial_code": "+298",
        "code": "FO"
    },
    {
        "name": "Fiji",
        "dial_code": "+679",
        "code": "FJ"
    },
    {
        "name": "Finland",
        "dial_code": "+358",
        "code": "FI"
    },
    {
        "name": "France",
        "dial_code": "+33",
        "code": "FR"
    },
    {
        "name": "French Guiana",
        "dial_code": "+594",
        "code": "GF"
    },
    {
        "name": "French Polynesia",
        "dial_code": "+689",
        "code": "PF"
    },
    {
        "name": "Gabon",
        "dial_code": "+241",
        "code": "GA"
    },
    {
        "name": "Gambia",
        "dial_code": "+220",
        "code": "GM"
    },
    {
        "name": "Georgia",
        "dial_code": "+995",
        "code": "GE"
    },
    {
        "name": "Germany",
        "dial_code": "+49",
        "code": "DE"
    },
    {
        "name": "Ghana",
        "dial_code": "+233",
        "code": "GH"
    },
    {
        "name": "Gibraltar",
        "dial_code": "+350",
        "code": "GI"
    },
    {
        "name": "Greece",
        "dial_code": "+30",
        "code": "GR"
    },
    {
        "name": "Greenland",
        "dial_code": "+299",
        "code": "GL"
    },
    {
        "name": "Grenada",
        "dial_code": "+1473",
        "code": "GD"
    },
    {
        "name": "Guadeloupe",
        "dial_code": "+590",
        "code": "GP"
    },
    {
        "name": "Guam",
        "dial_code": "+1671",
        "code": "GU"
    },
    {
        "name": "Guatemala",
        "dial_code": "+502",
        "code": "GT"
    },
    {
        "name": "Guernsey",
        "dial_code": "+44",
        "code": "GG"
    },
    {
        "name": "Guinea",
        "dial_code": "+224",
        "code": "GN"
    },
    {
        "name": "Guinea-Bissau",
        "dial_code": "+245",
        "code": "GW"
    },
    {
        "name": "Guyana",
        "dial_code": "+595",
        "code": "GY"
    },
    {
        "name": "Haiti",
        "dial_code": "+509",
        "code": "HT"
    },
    {
        "name": "Holy See (Vatican City State)",
        "dial_code": "+379",
        "code": "VA"
    },
    {
        "name": "Honduras",
        "dial_code": "+504",
        "code": "HN"
    },
    {
        "name": "Hong Kong",
        "dial_code": "+852",
        "code": "HK"
    },
    {
        "name": "Hungary",
        "dial_code": "+36",
        "code": "HU"
    },
    {
        "name": "Iceland",
        "dial_code": "+354",
        "code": "IS"
    },
    {
        "name": "India",
        "dial_code": "+91",
        "code": "IN"
    },
    {
        "name": "Indonesia",
        "dial_code": "+62",
        "code": "ID"
    },
    {
        "name": "Iran, Islamic Republic of Persian Gulf",
        "dial_code": "+98",
        "code": "IR"
    },
    {
        "name": "Iraq",
        "dial_code": "+964",
        "code": "IQ"
    },
    {
        "name": "Ireland",
        "dial_code": "+353",
        "code": "IE"
    },
    {
        "name": "Isle of Man",
        "dial_code": "+44",
        "code": "IM"
    },
    {
        "name": "Israel",
        "dial_code": "+972",
        "code": "IL"
    },
    {
        "name": "Italy",
        "dial_code": "+39",
        "code": "IT"
    },
    {
        "name": "Jamaica",
        "dial_code": "+1876",
        "code": "JM"
    },
    {
        "name": "Japan",
        "dial_code": "+81",
        "code": "JP"
    },
    {
        "name": "Jersey",
        "dial_code": "+44",
        "code": "JE"
    },
    {
        "name": "Jordan",
        "dial_code": "+962",
        "code": "JO"
    },
    {
        "name": "Kazakhstan",
        "dial_code": "+77",
        "code": "KZ"
    },
    {
        "name": "Kenya",
        "dial_code": "+254",
        "code": "KE"
    },
    {
        "name": "Kiribati",
        "dial_code": "+686",
        "code": "KI"
    },
    {
        "name": "Korea, Democratic People's Republic of Korea",
        "dial_code": "+850",
        "code": "KP"
    },
    {
        "name": "Korea, Republic of South Korea",
        "dial_code": "+82",
        "code": "KR"
    },
    {
        "name": "Kuwait",
        "dial_code": "+965",
        "code": "KW"
    },
    {
        "name": "Kyrgyzstan",
        "dial_code": "+996",
        "code": "KG"
    },
    {
        "name": "Laos",
        "dial_code": "+856",
        "code": "LA"
    },
    {
        "name": "Latvia",
        "dial_code": "+371",
        "code": "LV"
    },
    {
        "name": "Lebanon",
        "dial_code": "+961",
        "code": "LB"
    },
    {
        "name": "Lesotho",
        "dial_code": "+266",
        "code": "LS"
    },
    {
        "name": "Liberia",
        "dial_code": "+231",
        "code": "LR"
    },
    {
        "name": "Libyan Arab Jamahiriya",
        "dial_code": "+218",
        "code": "LY"
    },
    {
        "name": "Liechtenstein",
        "dial_code": "+423",
        "code": "LI"
    },
    {
        "name": "Lithuania",
        "dial_code": "+370",
        "code": "LT"
    },
    {
        "name": "Luxembourg",
        "dial_code": "+352",
        "code": "LU"
    },
    {
        "name": "Macao",
        "dial_code": "+853",
        "code": "MO"
    },
    {
        "name": "Macedonia",
        "dial_code": "+389",
        "code": "MK"
    },
    {
        "name": "Madagascar",
        "dial_code": "+261",
        "code": "MG"
    },
    {
        "name": "Malawi",
        "dial_code": "+265",
        "code": "MW"
    },
    {
        "name": "Malaysia",
        "dial_code": "+60",
        "code": "MY"
    },
    {
        "name": "Maldives",
        "dial_code": "+960",
        "code": "MV"
    },
    {
        "name": "Mali",
        "dial_code": "+223",
        "code": "ML"
    },
    {
        "name": "Malta",
        "dial_code": "+356",
        "code": "MT"
    },
    {
        "name": "Marshall Islands",
        "dial_code": "+692",
        "code": "MH"
    },
    {
        "name": "Martinique",
        "dial_code": "+596",
        "code": "MQ"
    },
    {
        "name": "Mauritania",
        "dial_code": "+222",
        "code": "MR"
    },
    {
        "name": "Mauritius",
        "dial_code": "+230",
        "code": "MU"
    },
    {
        "name": "Mayotte",
        "dial_code": "+262",
        "code": "YT"
    },
    {
        "name": "Mexico",
        "dial_code": "+52",
        "code": "MX"
    },
    {
        "name": "Micronesia, Federated States of Micronesia",
        "dial_code": "+691",
        "code": "FM"
    },
    {
        "name": "Moldova",
        "dial_code": "+373",
        "code": "MD"
    },
    {
        "name": "Monaco",
        "dial_code": "+377",
        "code": "MC"
    },
    {
        "name": "Mongolia",
        "dial_code": "+976",
        "code": "MN"
    },
    {
        "name": "Montenegro",
        "dial_code": "+382",
        "code": "ME"
    },
    {
        "name": "Montserrat",
        "dial_code": "+1664",
        "code": "MS"
    },
    {
        "name": "Morocco",
        "dial_code": "+212",
        "code": "MA"
    },
    {
        "name": "Mozambique",
        "dial_code": "+258",
        "code": "MZ"
    },
    {
        "name": "Myanmar",
        "dial_code": "+95",
        "code": "MM"
    },
    {
        "name": "Namibia",
        "dial_code": "+264",
        "code": "NA"
    },
    {
        "name": "Nauru",
        "dial_code": "+674",
        "code": "NR"
    },
    {
        "name": "Nepal",
        "dial_code": "+977",
        "code": "NP"
    },
    {
        "name": "Netherlands",
        "dial_code": "+31",
        "code": "NL"
    },
    {
        "name": "Netherlands Antilles",
        "dial_code": "+599",
        "code": "AN"
    },
    {
        "name": "New Caledonia",
        "dial_code": "+687",
        "code": "NC"
    },
    {
        "name": "New Zealand",
        "dial_code": "+64",
        "code": "NZ"
    },
    {
        "name": "Nicaragua",
        "dial_code": "+505",
        "code": "NI"
    },
    {
        "name": "Niger",
        "dial_code": "+227",
        "code": "NE"
    },
    {
        "name": "Nigeria",
        "dial_code": "+234",
        "code": "NG"
    },
    {
        "name": "Niue",
        "dial_code": "+683",
        "code": "NU"
    },
    {
        "name": "Norfolk Island",
        "dial_code": "+672",
        "code": "NF"
    },
    {
        "name": "Northern Mariana Islands",
        "dial_code": "+1670",
        "code": "MP"
    },
    {
        "name": "Norway",
        "dial_code": "+47",
        "code": "NO"
    },
    {
        "name": "Oman",
        "dial_code": "+968",
        "code": "OM"
    },
    {
        "name": "Pakistan",
        "dial_code": "+92",
        "code": "PK"
    },
    {
        "name": "Palau",
        "dial_code": "+680",
        "code": "PW"
    },
    {
        "name": "Palestinian Territory, Occupied",
        "dial_code": "+970",
        "code": "PS"
    },
    {
        "name": "Panama",
        "dial_code": "+507",
        "code": "PA"
    },
    {
        "name": "Papua New Guinea",
        "dial_code": "+675",
        "code": "PG"
    },
    {
        "name": "Paraguay",
        "dial_code": "+595",
        "code": "PY"
    },
    {
        "name": "Peru",
        "dial_code": "+51",
        "code": "PE"
    },
    {
        "name": "Philippines",
        "dial_code": "+63",
        "code": "PH"
    },
    {
        "name": "Pitcairn",
        "dial_code": "+872",
        "code": "PN"
    },
    {
        "name": "Poland",
        "dial_code": "+48",
        "code": "PL"
    },
    {
        "name": "Portugal",
        "dial_code": "+351",
        "code": "PT"
    },
    {
        "name": "Puerto Rico",
        "dial_code": "+1939",
        "code": "PR"
    },
    {
        "name": "Qatar",
        "dial_code": "+974",
        "code": "QA"
    },
    {
        "name": "Romania",
        "dial_code": "+40",
        "code": "RO"
    },
    {
        "name": "Russia",
        "dial_code": "+7",
        "code": "RU"
    },
    {
        "name": "Rwanda",
        "dial_code": "+250",
        "code": "RW"
    },
    {
        "name": "Reunion",
        "dial_code": "+262",
        "code": "RE"
    },
    {
        "name": "Saint Barthelemy",
        "dial_code": "+590",
        "code": "BL"
    },
    {
        "name": "Saint Helena, Ascension and Tristan Da Cunha",
        "dial_code": "+290",
        "code": "SH"
    },
    {
        "name": "Saint Kitts and Nevis",
        "dial_code": "+1869",
        "code": "KN"
    },
    {
        "name": "Saint Lucia",
        "dial_code": "+1758",
        "code": "LC"
    },
    {
        "name": "Saint Martin",
        "dial_code": "+590",
        "code": "MF"
    },
    {
        "name": "Saint Pierre and Miquelon",
        "dial_code": "+508",
        "code": "PM"
    },
    {
        "name": "Saint Vincent and the Grenadines",
        "dial_code": "+1784",
        "code": "VC"
    },
    {
        "name": "Samoa",
        "dial_code": "+685",
        "code": "WS"
    },
    {
        "name": "San Marino",
        "dial_code": "+378",
        "code": "SM"
    },
    {
        "name": "Sao Tome and Principe",
        "dial_code": "+239",
        "code": "ST"
    },
    {
        "name": "Saudi Arabia",
        "dial_code": "+966",
        "code": "SA"
    },
    {
        "name": "Senegal",
        "dial_code": "+221",
        "code": "SN"
    },
    {
        "name": "Serbia",
        "dial_code": "+381",
        "code": "RS"
    },
    {
        "name": "Seychelles",
        "dial_code": "+248",
        "code": "SC"
    },
    {
        "name": "Sierra Leone",
        "dial_code": "+232",
        "code": "SL"
    },
    {
        "name": "Singapore",
        "dial_code": "+65",
        "code": "SG"
    },
    {
        "name": "Slovakia",
        "dial_code": "+421",
        "code": "SK"
    },
    {
        "name": "Slovenia",
        "dial_code": "+386",
        "code": "SI"
    },
    {
        "name": "Solomon Islands",
        "dial_code": "+677",
        "code": "SB"
    },
    {
        "name": "Somalia",
        "dial_code": "+252",
        "code": "SO"
    },
    {
        "name": "South Africa",
        "dial_code": "+27",
        "code": "ZA"
    },
    {
        "name": "South Sudan",
        "dial_code": "+211",
        "code": "SS"
    },
    {
        "name": "South Georgia and the South Sandwich Islands",
        "dial_code": "+500",
        "code": "GS"
    },
    {
        "name": "Spain",
        "dial_code": "+34",
        "code": "ES"
    },
    {
        "name": "Sri Lanka",
        "dial_code": "+94",
        "code": "LK"
    },
    {
        "name": "Sudan",
        "dial_code": "+249",
        "code": "SD"
    },
    {
        "name": "Suriname",
        "dial_code": "+597",
        "code": "SR"
    },
    {
        "name": "Svalbard and Jan Mayen",
        "dial_code": "+47",
        "code": "SJ"
    },
    {
        "name": "Swaziland",
        "dial_code": "+268",
        "code": "SZ"
    },
    {
        "name": "Sweden",
        "dial_code": "+46",
        "code": "SE"
    },
    {
        "name": "Switzerland",
        "dial_code": "+41",
        "code": "CH"
    },
    {
        "name": "Syrian Arab Republic",
        "dial_code": "+963",
        "code": "SY"
    },
    {
        "name": "Taiwan",
        "dial_code": "+886",
        "code": "TW"
    },
    {
        "name": "Tajikistan",
        "dial_code": "+992",
        "code": "TJ"
    },
    {
        "name": "Tanzania, United Republic of Tanzania",
        "dial_code": "+255",
        "code": "TZ"
    },
    {
        "name": "Thailand",
        "dial_code": "+66",
        "code": "TH"
    },
    {
        "name": "Timor-Leste",
        "dial_code": "+670",
        "code": "TL"
    },
    {
        "name": "Togo",
        "dial_code": "+228",
        "code": "TG"
    },
    {
        "name": "Tokelau",
        "dial_code": "+690",
        "code": "TK"
    },
    {
        "name": "Tonga",
        "dial_code": "+676",
        "code": "TO"
    },
    {
        "name": "Trinidad and Tobago",
        "dial_code": "+1868",
        "code": "TT"
    },
    {
        "name": "Tunisia",
        "dial_code": "+216",
        "code": "TN"
    },
    {
        "name": "Turkey",
        "dial_code": "+90",
        "code": "TR"
    },
    {
        "name": "Turkmenistan",
        "dial_code": "+993",
        "code": "TM"
    },
    {
        "name": "Turks and Caicos Islands",
        "dial_code": "+1649",
        "code": "TC"
    },
    {
        "name": "Tuvalu",
        "dial_code": "+688",
        "code": "TV"
    },
    {
        "name": "Uganda",
        "dial_code": "+256",
        "code": "UG"
    },
    {
        "name": "Ukraine",
        "dial_code": "+380",
        "code": "UA"
    },
    {
        "name": "United Arab Emirates",
        "dial_code": "+971",
        "code": "AE"
    },
    {
        "name": "United Kingdom",
        "dial_code": "+44",
        "code": "GB"
    },
    {
        "name": "United States",
        "dial_code": "+1",
        "code": "US"
    },
    {
        "name": "Uruguay",
        "dial_code": "+598",
        "code": "UY"
    },
    {
        "name": "Uzbekistan",
        "dial_code": "+998",
        "code": "UZ"
    },
    {
        "name": "Vanuatu",
        "dial_code": "+678",
        "code": "VU"
    },
    {
        "name": "Venezuela, Bolivarian Republic of Venezuela",
        "dial_code": "+58",
        "code": "VE"
    },
    {
        "name": "Vietnam",
        "dial_code": "+84",
        "code": "VN"
    },
    {
        "name": "Virgin Islands, British",
        "dial_code": "+1284",
        "code": "VG"
    },
    {
        "name": "Virgin Islands, U.S.",
        "dial_code": "+1340",
        "code": "VI"
    },
    {
        "name": "Wallis and Futuna",
        "dial_code": "+681",
        "code": "WF"
    },
    {
        "name": "Yemen",
        "dial_code": "+967",
        "code": "YE"
    },
    {
        "name": "Zambia",
        "dial_code": "+260",
        "code": "ZM"
    },
    {
        "name": "Zimbabwe",
        "dial_code": "+263",
        "code": "ZW"
    }
];

export enum MESSAGE {
    FEATURE_ONLY_WEB = "This feature only available in web view"
}

export enum ACCESS_TYPE {
    VIEW = "view",
    ADD = "add",
    UPDATE = "update",
    DELETE = "delete",
}

export enum TASK_ICONS {
    general = "calendar-check",
    service = "screwdriver-wrench",
    delivery = "paper-plane",
    bug = "bug",
    newfeature = "square-plus",
    improvement = "square-caret-up",
}

export {
    salutation,
    taxTypes,
    units,
    ordersources,
    inventoryOption,
    pricing,
    options_itc,
    discountTypes,
    pricingType,
    cancelKotReason,
    printerType,
    paperWidthList,
    currencyNotes,
    vouchers,
}

