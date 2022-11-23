import {
        compareInwardOutward,
    discountCalc,
    findPercentageAmount,
    fullDiscount,
    getFloatValue,
    getRoundOffValue,
    grandTotal,
    inclusiveTaxCalc,
    taxCalc,
    taxtype
} from "./voucher_calc";
import {clone, log} from "./functions";


// fun: Item Calculation
//CHANGE_CODE_DATE - [REMOVE_LOG - 03.05.2021]
export const expenseItemCalculation = (
    process: string,
    item: any,
    total_amount_display: any,
    total_amount: any,
    global_discount_value: any,
    global_discount_type: any,
    voucher_tax_type: any,
    currentDecimalPlace: any,
    companyDecimalPlace: any,
    isDiscountAfterTax: any,
    isReverseCharge?:any
) => {

    // CHANGE_CODE_DATE:[CHANGE_QNT - 25.04.2021] - change qnt param because addon come with  itemqnt * addonqnt and
    //  item come item qnt
    let {
        item_qnt,
        productqnt,
        productrate,
        productratedisplay,
        productdiscountvalue,
        productdiscounttype,
        producttaxgroupid,
        product_discount_amount_display,
        product_discount_amount,
        product_global_discount_amount_display,
        product_global_discount_amount,
        product_total_discount_amount_display,
        product_total_discount_amount,
        product_taxable_amount_display,
        product_taxable_amount,
        product_tax_amount_display,
        product_tax_amount,
        product_tax_object_display,
        product_tax_object,
        product_inclusive_taxable_display,
        product_inclusive_taxable,
        item_total_inclusive,
        item_total_inclusive_display,
        item_total_inline_discount,
        item_total_inline_discount_display,
        item_total_global_discount,
        item_total_global_discount_display,
        item_amount_for_subtotal_display,
        item_amount_for_subtotal
    } = item;

    if (item_qnt) {
        productqnt = item_qnt;
    }

    if (!Boolean(product_inclusive_taxable_display)) {
        product_inclusive_taxable_display = 0;
    }
    if (!Boolean(product_inclusive_taxable)) {
        product_inclusive_taxable = 0;
    }
    if (!Boolean(item_total_inline_discount)) {
        item_total_inline_discount = 0;
    }
    if (!Boolean(item_total_inline_discount_display)) {
        item_total_inline_discount_display = 0;
    }
    if (!Boolean(item_total_global_discount)) {
        item_total_global_discount = 0;
    }
    if (!Boolean(item_total_global_discount_display)) {
        item_total_global_discount_display = 0;
    }
    if (!Boolean(item_total_inclusive)) {
        item_total_inclusive = 0;
    }
    if (!Boolean(item_total_inclusive_display)) {
        item_total_inclusive_display = 0;
    }


    let return_object: any = {},
        product_qnt: number = getFloatValue(productqnt),
        product_discount_value: number = productdiscountvalue,
        product_discount_type: string = productdiscounttype,
        product_global_discount_value: number = global_discount_value,
        product_global_discount_type: string = global_discount_type,
        product_tax_group_id: string = producttaxgroupid,
        voucher_total_amount_for_discount: number = 0,
        voucher_total_amount_for_discount_display: number = 0,
        product_rate: number = getFloatValue(productrate),
        product_rate_display: number = getFloatValue(productratedisplay),
        for_tax: number = 0,
        for_tax_display: number = 0;


    if (!Boolean(product_tax_object)) {
        product_tax_object = [];
    }
    if (!Boolean(product_tax_object_display)) {
        product_tax_object_display = [];
    }

   /* product_discount_amount = product_discount_amount;
    product_discount_amount_display = product_discount_amount_display;
    product_global_discount_amount = product_global_discount_amount;
    product_global_discount_amount_display = product_global_discount_amount_display;
    product_total_discount_amount = product_total_discount_amount;
    product_total_discount_amount_display = product_total_discount_amount_display;*/

    return_object.item_total_amount = getFloatValue(product_qnt * product_rate, companyDecimalPlace);
    return_object.item_total_amount_display = getFloatValue(product_qnt * product_rate_display, currentDecimalPlace);

    if (!Boolean(item_amount_for_subtotal_display)) {
        return_object.item_amount_for_subtotal_display = return_object.item_total_amount_display;

    }
    if (!Boolean(item_amount_for_subtotal)) {
        return_object.item_amount_for_subtotal = return_object.item_total_amount;
    }


    if (process === "inline") {
        product_taxable_amount = product_rate;

        product_taxable_amount_display = product_rate_display;
        for_tax = product_taxable_amount;
        for_tax_display = product_taxable_amount_display;

        return_object.item_amount_for_subtotal_display = return_object.item_total_amount_display - getFloatValue(fullDiscount(return_object.item_total_amount_display, product_discount_value, product_discount_type), companyDecimalPlace);
        return_object.item_amount_for_subtotal = return_object.item_total_amount - getFloatValue(fullDiscount(return_object.item_total_amount, product_discount_value, product_discount_type), companyDecimalPlace);

    } else {
        for_tax = product_taxable_amount;
        for_tax_display = product_taxable_amount_display;

        let new_taxable = product_taxable_amount,
            new_taxable_display = product_taxable_amount_display;

        product_taxable_amount = new_taxable > 0 ? new_taxable : product_rate;
        product_taxable_amount_display = new_taxable_display > 0 ? new_taxable_display : product_rate_display;
    }


    /*product_tax_amount = product_tax_amount;
    product_tax_amount_display = product_tax_amount_display;*/

    // SET LAST VALUE START
    if (total_amount_display) {
        voucher_total_amount_for_discount_display = total_amount_display;
    }

    if (total_amount) {
        voucher_total_amount_for_discount = total_amount;
    }

    // SET LAST VALUE END

    // PRODUCT INLINE DISCOUNT START
    if (process === "inline") {
        const {discount: discountdisplay} = discountCalc(product_discount_value, product_taxable_amount_display, product_qnt, 0, false, product_discount_type, currentDecimalPlace);

        product_discount_amount_display = discountdisplay
        product_total_discount_amount_display = product_discount_amount_display;
        product_taxable_amount_display = product_taxable_amount_display - product_discount_amount_display;

        const {discount} = discountCalc(product_discount_value, product_taxable_amount, product_qnt, 0, false, product_discount_type, companyDecimalPlace);
        product_discount_amount = discount;
        product_total_discount_amount = product_discount_amount;
        product_taxable_amount = product_taxable_amount - product_discount_amount;

        if (voucher_tax_type === taxtype.inclusive) {
            return_object.item_total_inline_discount = getFloatValue(fullDiscount(item_total_inclusive, product_discount_value, product_discount_type), companyDecimalPlace);
            return_object.item_total_inline_discount_display = getFloatValue(fullDiscount(item_total_inclusive_display, product_discount_value, product_discount_type), currentDecimalPlace);
        } else {
            return_object.item_total_inline_discount = getFloatValue(fullDiscount(return_object.item_total_amount, product_discount_value, product_discount_type), companyDecimalPlace);
            return_object.item_total_inline_discount_display = getFloatValue(fullDiscount(return_object.item_total_amount_display, product_discount_value, product_discount_type), currentDecimalPlace);
        }

    }
    // PRODUCT INLINE DISCOUNT END

    // PRODUCT GLOBAL DISCOUNT START
    if (process === "global") {

        let product_amount_display = product_taxable_amount_display,
            product_amount = product_taxable_amount;

        if (isDiscountAfterTax && !isReverseCharge) {
            product_amount_display = product_taxable_amount_display + (product_tax_amount_display / product_qnt);
            product_amount = product_taxable_amount + (product_tax_amount / product_qnt);
        }

        const {discount: discountdisplay} = discountCalc(product_global_discount_value, product_amount_display, product_qnt, voucher_total_amount_for_discount_display, true, product_global_discount_type, currentDecimalPlace);
        product_global_discount_amount_display = discountdisplay;
        const {discount} = discountCalc(product_global_discount_value, product_amount, product_qnt, voucher_total_amount_for_discount, true, product_global_discount_type, companyDecimalPlace);
        product_global_discount_amount = discount;

        product_total_discount_amount_display += product_global_discount_amount_display;
        product_total_discount_amount += product_global_discount_amount;


        product_taxable_amount_display = product_taxable_amount_display - product_global_discount_amount_display;
        product_taxable_amount = product_taxable_amount - product_global_discount_amount;

        if (!isDiscountAfterTax) {
            if (voucher_tax_type === taxtype.exclusive) {
                let itemprice = return_object.item_total_amount - item_total_inline_discount;
                let itempricedisplay = return_object.item_total_amount_display - item_total_inline_discount_display;
                return_object.item_total_global_discount = getFloatValue(fullDiscount(itemprice, global_discount_value, global_discount_type, voucher_total_amount_for_discount_display), companyDecimalPlace);
                return_object.item_total_global_discount_display = getFloatValue(fullDiscount(itempricedisplay, global_discount_value, global_discount_type, voucher_total_amount_for_discount), currentDecimalPlace);
            } else if (voucher_tax_type === taxtype.inclusive) {
                return_object.item_total_global_discount = getFloatValue(fullDiscount(item_total_inclusive, global_discount_value, "%"), companyDecimalPlace);
                return_object.item_total_global_discount_display = getFloatValue(fullDiscount(item_total_inclusive_display, global_discount_value, "%"), currentDecimalPlace);
            }
        } else {
            if (voucher_tax_type === taxtype.inclusive) {
                return_object.item_total_global_discount = getFloatValue(fullDiscount(item_total_inclusive + item.item_total_tax_amount, global_discount_value, "%"), companyDecimalPlace);
                return_object.item_total_global_discount_display = getFloatValue(fullDiscount(item_total_inclusive_display + item.item_total_tax_amount, global_discount_value, "%"), currentDecimalPlace);
            }
        }

    }
    // PRODUCT GLOBAL DISCOUNT END

    // PRODUCT INCLUSIVE TAX START
    if (process === "inclusive") {
        product_taxable_amount_display = inclusiveTaxCalc(product_tax_group_id, product_taxable_amount_display, currentDecimalPlace)
        product_taxable_amount = inclusiveTaxCalc(product_tax_group_id, product_taxable_amount, companyDecimalPlace)

        // CHANGE_CODE_DATE [TOTAL INCLUSIVE - 24.04.2021] = find total inclusive after qnt and rate multiply
        return_object.item_total_inclusive = getFloatValue(inclusiveTaxCalc(product_tax_group_id, return_object.item_total_amount, companyDecimalPlace), companyDecimalPlace);
        return_object.item_total_inclusive_display = getFloatValue(inclusiveTaxCalc(product_tax_group_id, return_object.item_total_amount_display, currentDecimalPlace), companyDecimalPlace);

    }
    // PRODUCT INCLUSIVE TAX END

    // PRODUCT TAX START
    if (process === "tax") {


        const {
            totalTax: totalTaxDisplay,
            taxes: taxesDisplay,
            taxableValue: taxableValueDisplay
        } = taxCalc(product_tax_group_id, for_tax_display, product_qnt, voucher_tax_type, companyDecimalPlace, product_rate_display - product_total_discount_amount_display);


        product_tax_object_display = taxesDisplay;
        product_taxable_amount_display = taxableValueDisplay;
        product_tax_amount_display = totalTaxDisplay;

        const {
            totalTax,
            taxes,
            taxableValue
        } = taxCalc(product_tax_group_id, for_tax, product_qnt, voucher_tax_type, companyDecimalPlace, product_rate - product_total_discount_amount);

        product_tax_object = taxes;
        product_taxable_amount = taxableValue;
        product_tax_amount = totalTax;

        product_inclusive_taxable_display = product_taxable_amount_display;
        product_inclusive_taxable = product_taxable_amount;

        if (!isDiscountAfterTax && voucher_tax_type === taxtype.exclusive) {

            let amountfortaxdisplay = return_object.item_total_amount_display - (item_total_inline_discount_display + item_total_global_discount_display)
            //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
            const {
                // totalTax: totalTaxDisplay,
                taxes: taxesDisplay,
                // taxableValue: taxableValueDisplay
            } = taxCalc(product_tax_group_id, amountfortaxdisplay, 1, voucher_tax_type, companyDecimalPlace, product_rate_display - product_total_discount_amount_display);

            product_tax_object_display = taxesDisplay;

            let amountfortax = return_object.item_total_amount - (item_total_inline_discount + item_total_global_discount);
            //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
            const {
                // totalTax,
                taxes,
                // taxableValue
            } = taxCalc(product_tax_group_id, amountfortax, 1, voucher_tax_type, companyDecimalPlace, product_rate - product_total_discount_amount);

            product_tax_object = taxes;
        } else if (voucher_tax_type === taxtype.inclusive) {
            let amountfortaxdisplay = item_total_inclusive_display - (item_total_inline_discount_display)
            if (!isDiscountAfterTax) {
                amountfortaxdisplay -= item_total_global_discount_display
            }
            const {
                totalTax: totalTaxDisplay,
                taxes: taxesDisplay,
                taxableValue: taxableValueDisplay
            } = taxCalc(product_tax_group_id, amountfortaxdisplay, 1, voucher_tax_type, companyDecimalPlace);

            product_tax_object_display = taxesDisplay;
            return_object.item_total_taxable_amount_display = taxableValueDisplay;
            return_object.item_total_tax_amount_display = totalTaxDisplay;

            let amountfortax = item_total_inclusive - (item_total_inline_discount);

            if (!isDiscountAfterTax) {
                amountfortax -= item_total_global_discount
            }
            const {
                totalTax,
                taxes,
                taxableValue
            } = taxCalc(product_tax_group_id, amountfortax, 1, voucher_tax_type, companyDecimalPlace);

            if (Boolean(product_discount_value) && Boolean(product_discount_type) && product_discount_value !== 0) {
                let display_subtotal = getFloatValue(((item_total_inclusive_display + totalTaxDisplay) - item_total_inline_discount_display), currentDecimalPlace),
                    subtotal = getFloatValue(((item_total_inclusive + totalTax) - item_total_inline_discount), companyDecimalPlace)
                if (product_discount_type === "%") {
                    const v1_display = getFloatValue(fullDiscount(return_object.item_total_amount_display, product_discount_value, product_discount_type), currentDecimalPlace);
                    const v1 = getFloatValue(fullDiscount(return_object.item_total_amount, product_discount_value, product_discount_type), currentDecimalPlace);
                    const v2_display = getFloatValue(return_object.item_total_amount_display - v1_display, currentDecimalPlace);
                    const v2 = getFloatValue(return_object.item_total_amount - v1, currentDecimalPlace);

                    const difference_display = getFloatValue(v2_display - display_subtotal, currentDecimalPlace)
                    const difference = getFloatValue(v2 - subtotal, currentDecimalPlace)
                    if (Math.abs(difference_display) < 0.03) {
                        display_subtotal += difference_display;
                    }
                    if (Math.abs(difference) < 0.03) {
                        subtotal += difference;
                    }
                }
                return_object.item_amount_for_subtotal_display = getFloatValue(display_subtotal, currentDecimalPlace);
                return_object.item_amount_for_subtotal = getFloatValue(subtotal, companyDecimalPlace);
            }


            return_object.item_total_taxable_amount = taxableValue;
            return_object.item_total_tax_amount = totalTax;
            product_tax_object = taxes;
        }
    }
    // PRODUCT TAX END

    // FOR CALCULATION DATA START
    return_object.product_qnt = product_qnt;

    return_object.product_total_price_display = product_qnt * product_rate_display;
    return_object.product_total_price = product_qnt * product_rate;

    return_object.product_discount_amount_display = product_discount_amount_display;
    return_object.product_discount_amount = product_discount_amount;

    return_object.product_global_discount_amount_display = product_global_discount_amount_display;
    return_object.product_global_discount_amount = product_global_discount_amount;

    return_object.product_total_discount_amount_display = product_total_discount_amount_display;
    return_object.product_total_discount_amount = product_total_discount_amount;

    return_object.product_taxable_amount_display = product_taxable_amount_display;
    return_object.product_taxable_amount = product_taxable_amount;

    return_object.product_tax_amount_display = product_tax_amount_display;
    return_object.product_tax_amount = product_tax_amount;

    return_object.product_tax_object_display = product_tax_object_display;
    return_object.product_tax_object = product_tax_object;


    return_object.product_amount_display = getFloatValue(product_taxable_amount_display + (product_tax_amount_display / product_qnt));
    return_object.product_amount = getFloatValue(product_taxable_amount + (product_tax_amount / product_qnt));
    // FOR CALCULATION DATA END

    // POST SET
    return_object.productratetaxabledisplay = getFloatValue(product_taxable_amount_display);
    return_object.productratetaxable = getFloatValue(product_taxable_amount);

    return_object.pricedisplay = getFloatValue(product_qnt * product_rate_display, currentDecimalPlace);
    return_object.price = getFloatValue(product_qnt * product_rate, companyDecimalPlace);


    return_object.producttaxabledisplay = getFloatValue(product_taxable_amount_display * product_qnt, currentDecimalPlace);
    return_object.producttaxableamount = getFloatValue(product_taxable_amount * product_qnt, companyDecimalPlace);

    return_object.productdiscountamountdisplay1 = product_discount_amount_display;
    return_object.productdiscountamount1 = product_discount_amount;

    //CHANGE_CODE_DATE [FOR_INLINE - 22-04-2021] - for inline discount by akashbhai
    return_object.product_inclusive_taxable_display = product_inclusive_taxable_display;
    return_object.product_inclusive_taxable = product_inclusive_taxable;
    //CHANGE_CODE_DATE [REMOVE DISCOUNT - 23-04-2021] - Remove discount from price new by akashbhai
    if (voucher_tax_type === "inclusive") {

        return_object.pricedisplaynew = getFloatValue(item_total_inclusive_display, currentDecimalPlace);
        return_object.pricenew = getFloatValue(item_total_inclusive, companyDecimalPlace);

        if (!isDiscountAfterTax && Boolean(global_discount_value) && parseFloat(global_discount_value) !== 0) {

            //CHANGE_CODE_DATE [REMOVE DISCOUNT - 23-04-2021] - By Akashbhai for Taxable Amount Set
            //CHANGE_CODE_DATE [REMOVE FOR lEDGER MISMATCH - 24-04-2021] - By Akashbhai for Taxable Amount Set
            //DISPLAY
            // let inclusiveAmountDisplay = getFloatValue(item_total_inclusive_display, currentDecimalPlace);
            // let discountAmountDisplay = discountCalc(product_global_discount_value, inclusiveAmountDisplay, product_qnt, voucher_total_amount_for_discount_display, true, global_discount_type, currentDecimalPlace).discount
            // let amountForTaxDisplay = inclusiveAmountDisplay - discountAmountDisplay;
            // let taxAmountDisplay = taxCalc(product_tax_group_id, amountForTaxDisplay, product_qnt, voucher_tax_type, currentDecimalPlace, product_rate_display - product_total_discount_amount_display).totalTax
            // let rateDiscountAmountDisplay = discountCalc(product_global_discount_value, product_rate_display, product_qnt, voucher_total_amount_for_discount_display, true, global_discount_type, currentDecimalPlace).discount
            // let totalAmountDisplay = product_rate_display - rateDiscountAmountDisplay;
            // inclusiveAmountDisplay = inclusiveAmountDisplay + getFloatValue((totalAmountDisplay + getFloatValue(discountAmountDisplay, currentDecimalPlace)) - (inclusiveAmountDisplay + taxAmountDisplay), currentDecimalPlace);
            return_object.pricedisplaynew = getFloatValue(item_total_inclusive_display, currentDecimalPlace);
            // MAIN
            // let inclusiveAmount = getFloatValue(item_total_inclusive, companyDecimalPlace);
            // let discountAmount = discountCalc(product_global_discount_value, inclusiveAmount, product_qnt, voucher_total_amount_for_discount, true, global_discount_type, companyDecimalPlace).discount
            // let amountForTax = inclusiveAmount - discountAmount;
            // let taxAmount = taxCalc(product_tax_group_id, amountForTax, product_qnt, voucher_tax_type, companyDecimalPlace, product_rate - product_total_discount_amount).totalTax
            // let rateDiscountAmount = discountCalc(product_global_discount_value, product_rate, product_qnt, voucher_total_amount_for_discount, true, global_discount_type, companyDecimalPlace).discount
            // let totalAmount = product_rate - rateDiscountAmount;
            // let leftAmount = (totalAmount + getFloatValue(discountAmount, companyDecimalPlace));
            // let rightAmount = getFloatValue(inclusiveAmount + taxAmount, companyDecimalPlace);
            // let adjustAmount = getFloatValue(leftAmount - rightAmount, companyDecimalPlace);
            //
            //
            // if (adjustAmount > 0) {
            //     inclusiveAmount = inclusiveAmount + adjustAmount
            // }
            return_object.pricenew = getFloatValue(item_total_inclusive, companyDecimalPlace);
        }

        // return_object.pricedisplaynew = getFloatValue(product_inclusive_taxable_display * product_qnt) + getFloatValue(return_object.productdiscountamountdisplay1 * product_qnt);
        // return_object.pricenew = getFloatValue(product_inclusive_taxable * product_qnt) + getFloatValue(return_object.productdiscountamount1 * product_qnt);

    } else {
        return_object.pricedisplaynew = getFloatValue(return_object.item_total_amount_display, currentDecimalPlace);
        return_object.pricenew = getFloatValue(return_object.item_total_amount, companyDecimalPlace);
    }


    return_object.productdiscountamountdisplay2 = product_global_discount_amount_display;
    return_object.productdiscountamount2 = product_global_discount_amount;

    if (!Boolean(product_global_discount_amount_display)) {
        product_global_discount_amount_display = 0
    }
    return_object.productdiscountamountdisplay = product_discount_amount_display + product_global_discount_amount_display;
    if (!Boolean(product_global_discount_amount)) {
        product_global_discount_amount = 0
    }
    return_object.productdiscount1 = product_discount_amount + product_global_discount_amount;

    return_object.productamountdisplay = getFloatValue((product_taxable_amount_display + (product_tax_amount_display / product_qnt)) * product_qnt);
    return_object.productamount = getFloatValue((product_taxable_amount + (product_tax_amount / product_qnt)) * product_qnt);

    return_object.taxobjdisplay = product_tax_object_display;
    return_object.taxobj = product_tax_object;

    return_object.producttaxamountdisplay = getFloatValue(product_tax_amount_display);
    return_object.producttaxamount = getFloatValue(product_tax_amount);

    return_object.productamountdisplay1 = 0;
    return_object.productamount1 = 0;

    log("ITEM", clone({...item, ...return_object}))

    return clone({...item, ...return_object});
}

export const expenseCalculation = (values: any,
                                   tds: any,
                                   tcs: any,
                                   currentCurrency: any,
                                   companyCurrency: any,
                                   currentDecimalPlace: any,
                                   companyDecimalPlace: any,
                                   isDiscountAfterTax: any,
                                   isTypeTicket?: boolean,) => {
    let globaltax: any = []

    const {globaldiscountvalue, vouchertransitionaldiscount, discounttype, vouchertaxtype} = values;

    if (values.invoiceitems) {

        let total = grandTotal(values, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);

        // inline Discount
        values.invoiceitems = values.invoiceitems
            .filter((item:any)=>{
                return Boolean(item?.productqnt)
            })
            .map((item: any, index: any) => {
                if (vouchertaxtype === "inclusive" &&
                    !isDiscountAfterTax) {
                    item = expenseItemCalculation("inclusive", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                }

                item = expenseItemCalculation("inline", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);

                if (vouchertaxtype === "inclusive" &&
                    isDiscountAfterTax) {
                    item = expenseItemCalculation("inclusive", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                }

                if (Boolean(item.itemaddon)) {
                    item.itemaddon = item.itemaddon.map((ai: any) => {

                        ai.item_qnt = item.productqnt * ai.productqnt

                        if (vouchertaxtype === "inclusive" &&
                            !isDiscountAfterTax) {
                            ai = expenseItemCalculation("inclusive", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                        }

                        ai = expenseItemCalculation("inline", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                        if (vouchertaxtype === "inclusive" &&
                            isDiscountAfterTax) {
                            ai = expenseItemCalculation("inclusive", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                        }
                        return ai;
                    });
                    values.invoiceitems[index].itemaddon = item.itemaddon;
                }

                return item
            })

        if (!isTypeTicket) {

            if (vouchertaxtype === "inclusive" && !isDiscountAfterTax) {
                values.invoiceitems = values.invoiceitems.map((item: any, index: any) => {

                    //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
                    // const {
                    //     productqnt,
                    // } = item;

                    //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
                    // let qnt: any = getFloatValue(productqnt);
                    //itemqnt: any = qnt;


                    item = expenseItemCalculation("inclusive", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);


                    if (Boolean(item.itemaddon)) {
                        item.itemaddon = item.itemaddon.map((ai: any) => {
                            ai.item_qnt = item.productqnt * ai.productqnt
                            ai = expenseItemCalculation("inclusive", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                            return ai;
                        })
                        values.invoiceitems[index].itemaddon = item.itemaddon;
                    }

                    return item
                })
            }

            // Global Discount
            if (Boolean(vouchertransitionaldiscount) && !isDiscountAfterTax) {
                total = grandTotal(values, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);

                values.invoiceitems = values.invoiceitems.map((item: any, index: any) => {
                    item = expenseItemCalculation("global", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);

                    if (Boolean(item.itemaddon)) {
                        item.itemaddon = item.itemaddon.map((ai: any) => {
                            ai.item_qnt = item.productqnt * ai.productqnt
                            return expenseItemCalculation("global", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax)
                        });
                        values.invoiceitems[index].itemaddon = item.itemaddon;
                    }

                    return item
                })
            }

            // TAX CAL
            values.invoiceitems = values.invoiceitems.map((item: any, index: any) => {

                //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
                // const {
                //     productqnt,
                // } = item;

                //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
                // let qnt: any = getFloatValue(productqnt);
                //itemqnt: any = qnt;
                //
                //
                // if (vouchertaxtype === "inclusive" &&
                //     !isDiscountAfterTax) {
                //     item = newItemCalculation("inclusive", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                // }

                item = expenseItemCalculation("tax", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax)

                //CHANGE_CODE_DATE: [CHANGE_TAX - 22/04/2021]
                item.product_tax_object_display.forEach((itemTax: any) => {
                    const taxIndex: any = globaltax.findIndex((taxItem: any) => taxItem.taxid === itemTax.taxid);

                    if (taxIndex === -1) {
                        const {taxprice, taxablerate, ...otherData} = itemTax;
                        globaltax = [
                            ...globaltax,
                            {
                                ...otherData,
                                taxpricedisplay: taxprice,
                                taxableratedisplay: taxablerate
                            }
                        ]
                    } else {
                        let addedTax = itemTax.taxprice,
                            sumtaxon = itemTax.taxablerate;
                        if (globaltax[taxIndex].taxpricedisplay) {
                            addedTax += globaltax[taxIndex].taxpricedisplay;
                        }
                        if (globaltax[taxIndex].taxableratedisplay) {
                            sumtaxon += globaltax[taxIndex].taxableratedisplay;
                        }
                        globaltax = globaltax.map((itemTax: any, index: any) => {
                            return {
                                ...itemTax,
                                taxpricedisplay: index === taxIndex ? addedTax : itemTax.taxpricedisplay,
                                taxableratedisplay: index === taxIndex ? sumtaxon : itemTax.taxableratedisplay
                            }
                        })
                    }

                })

                //CHANGE_CODE_DATE: [ROUND_OFF - 18/04/2021] - for fix round off issue given by akashbhai
                //CHANGE_CODE_DATE: [CHANGE_TAX - 22/04/2021]
                item.product_tax_object.forEach((itemTax: any) => {
                    const taxIndex: any = globaltax.findIndex((taxItem: any) => taxItem.taxid === itemTax.taxid);
                    if (taxIndex === -1) {
                        globaltax = [
                            ...globaltax,
                            itemTax
                        ]
                    } else {
                        let addedTax = itemTax.taxprice,
                            sumtaxon = itemTax.taxablerate;
                        if (globaltax[taxIndex].taxprice) {
                            addedTax += globaltax[taxIndex].taxprice;
                        }
                        if (globaltax[taxIndex].taxablerate) {
                            sumtaxon += globaltax[taxIndex].taxablerate;
                        }
                        globaltax = globaltax.map((itemTax: any, index: any) => {
                            return {
                                ...itemTax,
                                taxprice: index === taxIndex ? addedTax : itemTax.taxprice,
                                taxablerate: index === taxIndex ? sumtaxon : itemTax.taxablerate
                            }
                        })
                    }
                })

                if (Boolean(item.itemaddon)) {
                    item.itemaddon = item.itemaddon.map((ai: any) => {

                        ai.item_qnt = item.productqnt * ai.productqnt

                        // if (vouchertaxtype === "inclusive" &&
                        //     !isDiscountAfterTax) {
                        //     ai = newItemCalculation("inclusive", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                        // }
                        ai = expenseItemCalculation("tax", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax)
                        // ai.product_tax_object.forEach((itemTax: any) => {
                        //     itemTax.taxablerate = itemTax.taxablerate * itemqnt;
                        //     itemTax.taxprice = itemTax.taxprice * itemqnt;
                        // });
                        ai.product_tax_object_display.forEach((itemTax: any) => {
                            //CHANGE_CODE_DATE: [CHANGE_TAX - 22/04/2021]
                            const taxIndex: any = globaltax.findIndex((taxItem: any) => taxItem.taxid === itemTax.taxid);
                            //itemTax.taxableratedisplay = itemTax.taxableratedisplay * itemqnt;
                            //itemTax.taxprice = itemTax.taxprice * itemqnt;
                            if (taxIndex === -1) {
                                const {taxprice, taxablerate, ...otherData} = itemTax;
                                globaltax = [
                                    ...globaltax,
                                    {
                                        ...otherData,
                                        taxpricedisplay: taxprice,
                                        taxableratedisplay: taxablerate
                                    }
                                ]
                            } else {
                                //CHANGE_CODE_DATE: [ISSUE_IN_MULTI_CURRENCY - 05.05.2021]
                                let addedTax = itemTax.taxprice,
                                    sumtaxon = itemTax.taxablerate;
                                if (globaltax[taxIndex].taxprice) {
                                    addedTax += globaltax[taxIndex].taxpricedisplay;
                                }
                                if (globaltax[taxIndex].taxablerate) {
                                    sumtaxon += globaltax[taxIndex].taxableratedisplay;
                                }

                                globaltax = globaltax.map((itemTax: any, index: any) => {
                                    return {
                                        ...itemTax,
                                        taxpricedisplay: index === taxIndex ? addedTax : itemTax.taxpricedisplay,
                                        taxableratedisplay: index === taxIndex ? sumtaxon : itemTax.taxableratedisplay
                                    }
                                })
                            }
                        });

                        //CHANGE_CODE_DATE: [ROUND_OFF - 18/04/2021] - for fix round off issue given by akashbhai
                        //CHANGE_CODE_DATE: [CHANGE_TAX - 22/04/2021]
                        ai.product_tax_object.forEach((itemTax: any) => {
                            const taxIndex: any = globaltax.findIndex((taxItem: any) => taxItem.taxid === itemTax.taxid);
                            //itemTax.taxablerate = itemTax.taxablerate * itemqnt;
                            //itemTax.taxprice = itemTax.taxprice * itemqnt;
                            if (taxIndex === -1) {
                                globaltax = [
                                    ...globaltax,
                                    itemTax
                                ]
                            } else {
                                let addedTax = itemTax.taxprice,
                                    sumtaxon = itemTax.taxablerate;
                                if (globaltax[taxIndex].taxprice) {
                                    addedTax += globaltax[taxIndex].taxprice;
                                }
                                if (globaltax[taxIndex].taxablerate) {
                                    sumtaxon += globaltax[taxIndex].taxablerate;
                                }

                                globaltax = globaltax.map((itemTax: any, index: any) => {
                                    return {
                                        ...itemTax,
                                        taxprice: index === taxIndex ? addedTax : itemTax.taxprice,
                                        taxablerate: index === taxIndex ? sumtaxon : itemTax.taxablerate
                                    }
                                })
                            }
                        });
                        return ai;
                    })
                    values.invoiceitems[index].itemaddon = item.itemaddon;
                }

                return item
            })

            // Global Discount
            if (Boolean(vouchertransitionaldiscount) && isDiscountAfterTax) {
                total = grandTotal(values, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax);
                values.invoiceitems = values.invoiceitems.map((item: any, index: any) => {

                    item = expenseItemCalculation("global", item, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax, values?.reversecharge);

                    if (Boolean(item.itemaddon)) {
                        item.itemaddon = item.itemaddon.map((ai: any) => {
                            ai.item_qnt = item.productqnt * ai.productqnt
                            return expenseItemCalculation("global", ai, total.totalAmountForDiscountDisplay, total.totalAmountForDiscount, globaldiscountvalue, discounttype, vouchertaxtype, currentDecimalPlace, companyDecimalPlace, isDiscountAfterTax, values?.reversecharge);
                        });
                        values.invoiceitems[index].itemaddon = item.itemaddon;
                    }

                    return item
                })
            }
        }

        let inlinediscountamountdisplay: number = 0,
            globaldiscountamountdisplay: number = 0,
            subtotalamountdisplay: number = 0,
            taxbleamountdisplay: number = 0,
            totaldiscountdisplay: number = 0,
            taxamountdisplay: number = 0,
            totalamountwithoutroundoffdisplay: number = 0,
            inlinediscountamount: number = 0,
            globaldiscountamount: number = 0,
            subtotalamount: number = 0,
            taxbleamount: number = 0,
            totaldiscount: number = 0,
            taxamount: number = 0,
            totalamountwithoutroundoff: number = 0;

        values.inclusive_subtotal_display = 0;
        values.inclusive_subtotal = 0;
        values.invoiceitems.forEach((item: any) => {
            //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
            const {
                productqnt,
                //productratedisplay,
                //productrate,
                price,
                pricedisplay
            } = item;

            let qnt: any = getFloatValue(productqnt),
                itemqnt: any = qnt;

            if (Boolean(item.itemaddon)) {
                item.itemaddon.forEach((ai: any) => {

                    //ai.item_qnt = item.productqnt * ai.productqnt
                    //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
                    // const {
                    //     // productqnt,
                    //     // productratedisplay,
                    //     // productrate
                    // } = ai;

                    //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set comment
                    //let qnt: any = getFloatValue(productqnt);


                    if (!Boolean(ai.item_total_global_discount_display)) {
                        ai.item_total_global_discount_display = 0
                    }
                    if (!Boolean(ai.item_total_global_discount)) {
                        ai.item_total_global_discount = 0
                    }

                    // // INLINE DISCOUNT
                    // inlinediscountamountdisplay += ((ai.productdiscountamountdisplay1 * qnt) * itemqnt);
                    // inlinediscountamount += ((ai.productdiscountamount1 * qnt) * itemqnt);
                    //
                    // // GLOBAL DISCOUNT
                    // globaldiscountamountdisplay += ((ai.productdiscountamountdisplay2 * qnt) * itemqnt)
                    // globaldiscountamount += ((ai.productdiscountamount2 * qnt) * itemqnt)
                    //
                    // // TOTAL DISCOUNT
                    // totaldiscountdisplay += ((ai.productdiscountamountdisplay * qnt) * itemqnt);
                    // totaldiscount += ((ai.productdiscountamount * qnt) * itemqnt);

                    if (!isDiscountAfterTax && vouchertaxtype === taxtype.exclusive) {
                        inlinediscountamountdisplay += (ai.item_total_inline_discount_display);
                        // values.voucherinlinediscountdisplay = getFloatValue(inlinediscountamountdisplay, currentDecimalPlace);
                        inlinediscountamount += (ai.item_total_inline_discount);
                        // values.voucherinlinediscount = getFloatValue(inlinediscountamount, companyDecimalPlace);

                        globaldiscountamountdisplay += (ai.item_total_global_discount_display)
                        // values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                        // values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                        globaldiscountamount += (ai.item_total_global_discount)
                        // values.voucherglobaldiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
                        // values.voucherdiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
                    } else if (!isDiscountAfterTax && vouchertaxtype === taxtype.inclusive) {

                        inlinediscountamountdisplay += (ai.item_total_inline_discount_display);
                        // values.voucherinlinediscountdisplay = getFloatValue(inlinediscountamountdisplay, currentDecimalPlace);
                        inlinediscountamount += (ai.item_total_inline_discount);
                        // values.voucherinlinediscount = getFloatValue(inlinediscountamount, companyDecimalPlace);

                        globaldiscountamountdisplay += (ai.item_total_global_discount_display)
                        // values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                        // values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                        globaldiscountamount += (ai.item_total_global_discount)
                        // values.voucherglobaldiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
                        // values.voucherdiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);

                        // values.inclusive_subtotal_display = (item.item_total_taxable_amount_display + item.item_total_tax_amount_display)
                        // values.inclusive_subtotal = (item.item_total_taxable_amount + item.item_total_tax_amount)

                        values.inclusive_subtotal_display += getFloatValue(ai.item_amount_for_subtotal_display, currentDecimalPlace)
                        values.inclusive_subtotal += getFloatValue(ai.item_amount_for_subtotal, companyDecimalPlace)

                    } else {

                        // inlinediscountamountdisplay += ((ai.productdiscountamountdisplay1 * qnt) * itemqnt);
                        // inlinediscountamount += ((ai.productdiscountamount1 * qnt) * itemqnt);
                        //
                        // globaldiscountamountdisplay += ((ai.productdiscountamountdisplay2 * qnt) * itemqnt)
                        // globaldiscountamount += ((ai.productdiscountamount2 * qnt) * itemqnt)
                        //
                        // // TOTAL DISCOUNT
                        // totaldiscountdisplay += ((ai.productdiscountamountdisplay * qnt) * itemqnt);
                        // totaldiscount += ((ai.productdiscount1 * qnt) * itemqnt);.

                        inlinediscountamountdisplay += ((ai.productdiscountamountdisplay1 * ai.item_qnt));
                        inlinediscountamount += ((ai.productdiscountamount1 * ai.item_qnt) * itemqnt);

                        globaldiscountamountdisplay += ((ai.productdiscountamountdisplay2 * ai.item_qnt))
                        globaldiscountamount += ((ai.productdiscountamount2 * ai.item_qnt) * itemqnt)

                        // TOTAL DISCOUNT
                        totaldiscountdisplay += ((ai.productdiscountamountdisplay * ai.item_qnt));
                        totaldiscount += ((ai.productdiscount1 * ai.item_qnt));
                    }

                    // SUBTOTAL
                    // subtotalamountdisplay += ((productratedisplay * qnt) * itemqnt)
                    // subtotalamount += ((productrate * qnt) * itemqnt)
                    subtotalamountdisplay += ((ai.pricedisplay))
                    subtotalamount += ((ai.price))

                    // TAXABLE AMOUNT
                    taxbleamountdisplay += ai.producttaxabledisplay;
                    taxbleamount += ai.producttaxableamount;

                    // TAX AMOUNT
                    taxamountdisplay += ai.producttaxamountdisplay * itemqnt;
                    taxamount += ai.producttaxamount * itemqnt;

                    // TOTAL WITHOUT ROUND OFF

                    // totalamountwithoutroundoffdisplay += (getFloatValue(ai.productamountdisplay, currentDecimalPlace) * itemqnt);
                    // totalamountwithoutroundoff += (getFloatValue(ai.productamount, companyDecimalPlace) * itemqnt);

                    // CHANGE_CODE_DATE [ ADDON_SUMMARY - 25.04.2021] - add for new addon summary by me


                })
            }


            //CHANGE_CODE_DATE: [ERROR_NAN - 18/04/2021] - call undefine error solve
            if (!Boolean(item.item_total_global_discount_display)) {
                item.item_total_global_discount_display = 0
            }
            if (!Boolean(item.item_total_global_discount)) {
                item.item_total_global_discount = 0
            }
            //CHANGE_CODE_DATE: [SET_ROUND_OFF - 18/04/2021] - SET ROUND OFF EVERYWHERE BY AKASHBHAI
            // INLINE DISCOUNT
            // GLOBAL DISCOUNT
            if (!isDiscountAfterTax && vouchertaxtype === taxtype.exclusive) {
                inlinediscountamountdisplay += item.item_total_inline_discount_display;
                values.voucherinlinediscountdisplay = getFloatValue(inlinediscountamountdisplay, currentDecimalPlace);
                inlinediscountamount += item.item_total_inline_discount;
                values.voucherinlinediscount = getFloatValue(inlinediscountamount, companyDecimalPlace);

                globaldiscountamountdisplay += item.item_total_global_discount_display
                values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                globaldiscountamount += item.item_total_global_discount
                values.voucherglobaldiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
                values.voucherdiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);

                log("INLINE", inlinediscountamountdisplay)
                log("global", globaldiscountamount)
            } else if (vouchertaxtype === taxtype.inclusive) {
                inlinediscountamountdisplay += item.item_total_inline_discount_display;
                values.voucherinlinediscountdisplay = getFloatValue(inlinediscountamountdisplay, currentDecimalPlace);
                inlinediscountamount += item.item_total_inline_discount;
                values.voucherinlinediscount = getFloatValue(inlinediscountamount, companyDecimalPlace);

                globaldiscountamountdisplay += item.item_total_global_discount_display
                values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                globaldiscountamount += item.item_total_global_discount
                values.voucherglobaldiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
                values.voucherdiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);

                // values.inclusive_subtotal_display = (item.item_total_taxable_amount_display + item.item_total_tax_amount_display)
                // values.inclusive_subtotal = (item.item_total_taxable_amount + item.item_total_tax_amount)

                values.inclusive_subtotal_display += getFloatValue(item.item_amount_for_subtotal_display, currentDecimalPlace)
                values.inclusive_subtotal += getFloatValue(item.item_amount_for_subtotal, companyDecimalPlace)

            } else {

                inlinediscountamountdisplay += item.productdiscountamountdisplay1 * qnt;
                values.voucherinlinediscountdisplay = getFloatValue(inlinediscountamountdisplay, currentDecimalPlace);
                inlinediscountamount += item.productdiscountamount1 * qnt;
                values.voucherinlinediscount = getFloatValue(inlinediscountamount, companyDecimalPlace);

                globaldiscountamountdisplay += (item.productdiscountamountdisplay2 * qnt)
                values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                globaldiscountamount += (item.productdiscountamount2 * qnt)
                values.voucherglobaldiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
                values.voucherdiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);

                // TOTAL DISCOUNT
                totaldiscountdisplay += item.productdiscountamountdisplay * productqnt;
                values.vouchertotaldiscountamountdisplay = getFloatValue(totaldiscountdisplay, currentDecimalPlace);
                totaldiscount += item.productdiscount1 * productqnt;
                values.vouchertotaldiscountamount = getFloatValue(totaldiscount, companyDecimalPlace);
            }

            // SUBTOTAL
            subtotalamountdisplay += pricedisplay;
            values.vouchersubtotaldisplay = getFloatValue(subtotalamountdisplay, currentDecimalPlace);
            subtotalamount += price;
            values.vouchersubtotal = getFloatValue(subtotalamount, companyDecimalPlace);

            // TAXABLE AMOUNT
            taxbleamountdisplay += item.producttaxabledisplay;
            values.vouchertaxabledisplay = getFloatValue(taxbleamountdisplay, currentDecimalPlace);
            taxbleamount += item.producttaxableamount;
            values.vouchertaxable = getFloatValue(taxbleamount, companyDecimalPlace);

            // TAX AMOUNT
            taxamountdisplay += item.producttaxamountdisplay;
            values.vouchertaxdisplay = getFloatValue(taxamountdisplay, currentDecimalPlace);
            taxamount += item.producttaxamount;
            values.vouchertax = getFloatValue(taxamount, companyDecimalPlace);

            // const tstype = values.selectedtdstcs === "TDS";
            // if ((tstype && Boolean(values.tdsaccount)) || (!tstype && Boolean(values.tcsaccount))) {
            //
            //     const percentagevalue = tstype ? tds[values.tdsaccount].tdsrate : tcs[values.tcsaccount].tcsrate
            //
            //     // const percentagevalue = values.tdstcsvalue.replaceAll("%", "")
            //     let amountDisplay = subtotalamountdisplay - inlinediscountamountdisplay,
            //         amount = subtotalamount - inlinediscountamount;
            //
            //     if (vouchertaxtype === "inclusive") {
            //         amountDisplay = amountDisplay - taxamountdisplay;
            //         amount = amount - taxamount;
            //     }
            //
            //     if (!isDiscountAfterTax || values.selectedtdstcs === "TCS") {
            //         amountDisplay = amountDisplay - globaldiscountamountdisplay;
            //         amount = amount - globaldiscountamount;
            //     }
            //
            //     if (values.selectedtdstcs === "TCS") {
            //         amountDisplay += taxamountdisplay
            //         amount += taxamount
            //     }
            //     if (!isNaN(percentagevalue)) {
            //         let tdstcsAmountDisplay = (amountDisplay * percentagevalue) / 100,
            //             tdstcsAmount = (amount * percentagevalue) / 100;
            //         if (values.selectedtdstcs === "TDS") {
            //             tdstcsAmountDisplay = -Math.abs(tdstcsAmountDisplay);
            //             tdstcsAmount = -Math.abs(tdstcsAmount);
            //         }
            //         values.tdstcsamountdisplay = getFloatValue(tdstcsAmountDisplay, currentDecimalPlace);
            //         values.tdstcsamount = getFloatValue(tdstcsAmount, companyDecimalPlace);
            //
            //         if (tstype) {
            //             values.tdsamountdisplay = values.tdstcsamountdisplay;
            //             values.tdsamount = values.tdstcsamount;
            //         } else {
            //             values.tcsamountdisplay = values.tdstcsamountdisplay;
            //             values.tcsamount = values.tdstcsamount;
            //         }
            //
            //         subtotalamountdisplay = subtotalamountdisplay + values.tdstcsamountdisplay;
            //         subtotalamount = subtotalamount + values.tdstcsamount;
            //     }
            // }
        })

        // if (!isDiscountAfterTax && discounttype === "$" && vouchertaxtype === taxtype.exclusive) {
        //     totaldiscount = 0;
        //     totaldiscountdisplay=0;
        //     globaldiscountamountdisplay = globaldiscountvalue;
        //     globaldiscountamount = globaldiscountvalue;
        //
        //     values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        //     values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
        //     values.voucherglobaldiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
        //     values.voucherdiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
        // }
        //CHANGE_CODE_DATE - [SET_FOR_REMOVE_WARNING - 03.05.2021] = set "discounttype === "$"
        if (!isDiscountAfterTax && vouchertaxtype === taxtype.exclusive && discounttype === "$") {
            if (globaldiscountvalue !== values.voucherglobaldiscount) {
                let differencedisplay = getFloatValue(globaldiscountvalue - values.voucherglobaldiscountdisplay, companyDecimalPlace);
                globaldiscountamountdisplay = values.voucherglobaldiscount + differencedisplay
                values.voucherglobaldiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                values.voucherdiscountdisplay = getFloatValue(globaldiscountamountdisplay, currentDecimalPlace);
                let difference = getFloatValue(globaldiscountvalue - values.voucherglobaldiscount, companyDecimalPlace);
                globaldiscountamount = values.voucherglobaldiscount + difference
                values.voucherglobaldiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
                values.voucherdiscount = getFloatValue(globaldiscountamount, companyDecimalPlace);
            }
        }
        if (!isDiscountAfterTax && vouchertaxtype === taxtype.exclusive) {
            // TOTAL DISCOUNT
            // TOTAL DISCOUNT
            totaldiscountdisplay += (inlinediscountamountdisplay + globaldiscountamountdisplay);
            values.vouchertotaldiscountamountdisplay = getFloatValue(totaldiscountdisplay, currentDecimalPlace);
            totaldiscount += (inlinediscountamount + globaldiscountamount);
            values.vouchertotaldiscountamount = getFloatValue(totaldiscount, companyDecimalPlace);


        } else if (!isDiscountAfterTax && vouchertaxtype === taxtype.inclusive) {
            // TOTAL DISCOUNT
            // TOTAL DISCOUNT

            totaldiscountdisplay += (inlinediscountamountdisplay + globaldiscountamountdisplay);
            values.vouchertotaldiscountamountdisplay = getFloatValue(totaldiscountdisplay, currentDecimalPlace);
            totaldiscount += (inlinediscountamount + globaldiscountamount);
            values.vouchertotaldiscountamount = getFloatValue(totaldiscount, companyDecimalPlace);

        }

        globaltax = globaltax.map((taxdata: any) => {
            if (vouchertaxtype !== "inclusive") {
                taxdata.taxableratedisplay = getFloatValue(taxdata.taxableratedisplay, companyDecimalPlace);
                taxdata.taxablerate = getFloatValue(taxdata.taxablerate, companyDecimalPlace);
                taxdata.taxprice = getFloatValue(taxdata.taxablerate * parseFloat(taxdata.taxpercentage) / 100, companyDecimalPlace)
                taxdata.taxpricedisplay = getFloatValue(taxdata.taxableratedisplay * parseFloat(taxdata.taxpercentage) / 100, currentDecimalPlace)
            } else {
                taxdata.taxableratedisplay = getFloatValue(taxdata.taxableratedisplay, companyDecimalPlace);
                taxdata.taxablerate = getFloatValue(taxdata.taxablerate, companyDecimalPlace);
                taxdata.taxprice = getFloatValue(taxdata.taxprice, companyDecimalPlace)
                taxdata.taxpricedisplay = getFloatValue(taxdata.taxpricedisplay, currentDecimalPlace)
            }
            return taxdata;
        })

        // TOTAL WITHOUT ROUND OFF
        if (vouchertaxtype !== "inclusive") {
            totalamountwithoutroundoffdisplay = values.vouchersubtotaldisplay - (isNaN(totaldiscountdisplay) ? 0 : totaldiscountdisplay);
            totalamountwithoutroundoff = values.vouchersubtotal - (isNaN(totaldiscount) ? 0 : totaldiscount);
        } else {
            totalamountwithoutroundoffdisplay = values.vouchertaxabledisplay + values.vouchertaxdisplay;
            totalamountwithoutroundoff = values.vouchertaxable + values.vouchertax;

            if (vouchertaxtype === taxtype.inclusive) {


                // FUN: set for round of and total

                let subtotaldisplay = values.inclusive_subtotal_display,
                    subtotal = values.inclusive_subtotal,
                    disaountdisplay = 0, discount = 0;

                values.vouchersubtotaldisplay = subtotaldisplay + inlinediscountamountdisplay;
                values.vouchersubtotal = subtotal + inlinediscountamount;
                // GLOBAL DISCOUNT

                if (Boolean(globaldiscountvalue)) {
                    //CHANGE_CODE_DATE = [REMOVE_FIX_DISCOUNT_IN_INCLUSIVE- 25.04.2021]
                    // akashbhai
                    disaountdisplay = fullDiscount(subtotaldisplay, globaldiscountvalue, "%");
                    discount = fullDiscount(subtotal, globaldiscountvalue, "%");
                }

                totalamountwithoutroundoffdisplay = subtotaldisplay - disaountdisplay;
                totalamountwithoutroundoff = subtotal - discount;

            }
        }

        if (vouchertaxtype === "exclusive") {
            // totalamountwithoutroundoffdisplay = totalamountwithoutroundoffdisplay + values.vouchertaxdisplay;
            globaltax.forEach((t: any) => {
                //CHANGE_CODE_DATE - [MULTICURRENCY_ISSUE - 27.04.2021]
                if (!Boolean(values?.reversecharge)) {
                    totalamountwithoutroundoffdisplay = totalamountwithoutroundoffdisplay + getFloatValue(t.taxpricedisplay, currentDecimalPlace);
                }
            })
        }
        //CHANGE_CODE_DATE - [ROUND_ISSUE - 27.04.2021] - set round issue by me compare with zoho
        // item 17 qnt - rate 1 and global discount 13.16%



        values.totalwithoutroundoffdisplay = getFloatValue(totalamountwithoutroundoffdisplay, currentDecimalPlace);

        if (vouchertaxtype === "exclusive") {
            // totalamountwithoutroundoff = totalamountwithoutroundoff + values.vouchertax;
            //CHANGE_CODE_DATE - [MULTICURRENCY_ISSUE - 27.04.2021]
            globaltax.forEach((t: any) => {
                if (!Boolean(values?.reversecharge)) {
                    totalamountwithoutroundoff = totalamountwithoutroundoff + getFloatValue(t.taxprice, companyDecimalPlace);
                }
            })
        }
        values.totalwithoutroundoff = getFloatValue(totalamountwithoutroundoff, companyDecimalPlace);
        if (Boolean(+values.adjustmentamount)) {
            values.totalwithoutroundoffdisplay = getFloatValue(values.totalwithoutroundoffdisplay + parseFloat(values.adjustmentamount), currentDecimalPlace);
            values.totalwithoutroundoff = getFloatValue(values.totalwithoutroundoff + parseFloat(values.adjustmentamount), companyDecimalPlace);
        }

        //CHANGE_CODE_DATE - [APPLY_TCS_TDS - 26.04.2021]
        // TCS APPLIED ON BEFORE ROUND OF VALUE
        // TDS APPLIED OF SUBTOTAL - DISCOUNT

        const isTDS = values.selectedtdstcs === "TDS";
        if (Boolean(tds) || Boolean(tcs)) {

            if ((isTDS && Boolean(values.tdsaccount)) || (!isTDS && Boolean(values.tcsaccount))) {

                if (isTDS) {
                    const percentagevalue = tds[values.tdsaccount]?.tdsrate
                    if (vouchertaxtype === taxtype.exclusive) {
                        let subtotalAmountDisplay = values.vouchersubtotaldisplay,
                            subtotalAmount = values.vouchersubtotal;
                        if (!isDiscountAfterTax) {
                            subtotalAmountDisplay -= values.voucherglobaldiscountdisplay
                            subtotalAmount -= values.voucherglobaldiscount
                        }
                        let tdsAmountDisplay = getFloatValue(findPercentageAmount(subtotalAmountDisplay, percentagevalue), currentDecimalPlace);
                        let tdsAmount = getFloatValue(findPercentageAmount(subtotalAmount, percentagevalue), currentDecimalPlace);

                        values.tdstcsamountdisplay = tdsAmountDisplay;
                        values.tdstcsamount = tdsAmount;

                        values.tdsamountdisplay = values.tdstcsamountdisplay;
                        values.tdsamount = values.tdstcsamount;

                        values.totalwithoutroundoffdisplay = getFloatValue(values.totalwithoutroundoffdisplay - tdsAmountDisplay, currentDecimalPlace)
                        values.totalwithoutroundoff = getFloatValue(values.totalwithoutroundoff - tdsAmount, currentDecimalPlace)
                    } else {
                        let subtotalAmountDisplay = 0, subtotalAmount = 0;
                        values.invoiceitems.forEach((item: any) => {
                            if (Boolean(item.itemaddon)) {
                                item.itemaddon.forEach((ai: any) => {
                                    subtotalAmountDisplay += item.item_total_inclusive
                                    subtotalAmount += item.item_total_inclusive_display
                                })
                            }
                            subtotalAmountDisplay += item.item_total_inclusive
                            subtotalAmount += item.item_total_inclusive_display
                        })

                        if (!isDiscountAfterTax) {
                            subtotalAmountDisplay -= values.voucherglobaldiscountdisplay
                            subtotalAmount -= values.voucherglobaldiscount
                        }
                        let tdsAmountDisplay = getFloatValue(findPercentageAmount(subtotalAmountDisplay, percentagevalue), currentDecimalPlace);
                        let tdsAmount = getFloatValue(findPercentageAmount(subtotalAmount, percentagevalue), currentDecimalPlace);

                        values.tdstcsamountdisplay = tdsAmountDisplay;
                        values.tdstcsamount = tdsAmount;

                        values.tdsamountdisplay = values.tdstcsamountdisplay;
                        values.tdsamount = values.tdstcsamount;

                        values.totalwithoutroundoffdisplay = getFloatValue(values.totalwithoutroundoffdisplay - tdsAmountDisplay, currentDecimalPlace)
                        values.totalwithoutroundoff = getFloatValue(values.totalwithoutroundoff - tdsAmount, currentDecimalPlace)
                    }

                } else {
                    // TCS CALCULATION
                    const percentagevalue = tcs[values.tcsaccount]?.tcsrate

                    let tcsAmountDisplay = getFloatValue(findPercentageAmount(values.totalwithoutroundoffdisplay, percentagevalue), currentDecimalPlace);
                    values.totalwithoutroundoffdisplay = getFloatValue(values.totalwithoutroundoffdisplay + tcsAmountDisplay, currentDecimalPlace)
                    values.tdstcsamountdisplay = getFloatValue(tcsAmountDisplay, currentDecimalPlace);
                    values.tcsamountdisplay = values.tdstcsamountdisplay;

                    let tcsAmount = getFloatValue(findPercentageAmount(values.totalwithoutroundoff, percentagevalue), companyDecimalPlace);
                    values.totalwithoutroundoff = getFloatValue(values.totalwithoutroundoff + tcsAmount, currentDecimalPlace)
                    values.tdstcsamount = getFloatValue(tcsAmount, companyDecimalPlace);
                    values.tcsamount = values.tdstcsamount;
                }


                //
                // let amountDisplay = subtotalamountdisplay - inlinediscountamountdisplay,
                //     amount = subtotalamount - inlinediscountamount;
                //
                // if (vouchertaxtype === "inclusive") {
                //     amountDisplay = amountDisplay - taxamountdisplay;
                //     amount = amount - taxamount;
                // }
                //
                // if (!isDiscountAfterTax || values.selectedtdstcs === "TCS") {
                //     amountDisplay = amountDisplay - globaldiscountamountdisplay;
                //     amount = amount - globaldiscountamount;
                // }
                //
                // if (values.selectedtdstcs === "TCS") {
                //     amountDisplay += taxamountdisplay
                //     amount += taxamount
                // }
                // if (!isNaN(percentagevalue)) {
                //     let tdstcsAmountDisplay = (amountDisplay * percentagevalue) / 100,
                //         tdstcsAmount = (amount * percentagevalue) / 100;
                //     if (values.selectedtdstcs === "TDS") {
                //         tdstcsAmountDisplay = -Math.abs(tdstcsAmountDisplay);
                //         tdstcsAmount = -Math.abs(tdstcsAmount);
                //     }
                //     values.tdstcsamountdisplay = getFloatValue(tdstcsAmountDisplay, currentDecimalPlace);
                //     values.tdstcsamount = getFloatValue(tdstcsAmount, companyDecimalPlace);
                //
                //     if (tstype) {
                //         values.tdsamountdisplay = values.tdstcsamountdisplay;
                //         values.tdsamount = values.tdstcsamount;
                //     } else {
                //         values.tcsamountdisplay = values.tdstcsamountdisplay;
                //         values.tcsamount = values.tdstcsamount;
                //     }
                //
                //     subtotalamountdisplay = subtotalamountdisplay + values.tdstcsamountdisplay;
                //     subtotalamount = subtotalamount + values.tdstcsamount;
                // }
            }
        }


        // TOTAL ROUND OFF

        values.vouchertotaldisplay = getRoundOffValue(values.roundoffselected, values.totalwithoutroundoffdisplay, currentDecimalPlace);
        values.vouchertotal = getRoundOffValue(values.roundoffselected, values.totalwithoutroundoff, companyDecimalPlace);

        // ROUND OFF AMOUNT
        values.voucherroundoffdisplay = getFloatValue(values.vouchertotaldisplay - values.totalwithoutroundoffdisplay, currentDecimalPlace);
        values.voucherroundoff = getFloatValue(values.vouchertotal - values.totalwithoutroundoff, companyDecimalPlace);

        //CHANGE_CODE_DATE = [INCLUSIVE SETTING - 24.04.2021] - setting for inclusive by akashbhai
        // if (vouchertaxtype === taxtype.inclusive && !isDiscountAfterTax) {
        //     let checkedTaxList: any = [], total_for_match = 0;
        //     globaltax.forEach((tax: any) => {
        //         const added = checkedTaxList.some((id: any) => tax.taxgroupid === id);
        //         if (!added) {
        //             checkedTaxList = [...checkedTaxList, tax.taxgroupid];
        //             total_for_match += tax.taxablerate;
        //         }
        //         total_for_match += tax.taxprice;
        //     })
        //     let compareTotal = getFloatValue(total_for_match, companyDecimalPlace);
        //     if (getFloatValue(values.totalwithoutroundoff, companyDecimalPlace) !== compareTotal) {
        //         const set_amount = getFloatValue(getFloatValue(values.totalwithoutroundoff, companyDecimalPlace) - compareTotal, companyDecimalPlace);
        //         values.invoiceitems[0].pricedisplaynew = values.invoiceitems[0].pricedisplaynew + set_amount
        //         values.invoiceitems[0].pricenew = values.invoiceitems[0].pricenew + set_amount
        //     }
        // } else {
        //
        // }

        if (values.invoiceitems && values.invoiceitems.length > 0 && values.invoiceitems[0].pricenew) {
            compareInwardOutward(values, globaltax, companyDecimalPlace)
        }
    }

    //CHANGE_CODE_DATE: [FOR_TAX_ISSUE - 18/04/2021] - SET FOR TAX ISSUE
    //LIKE SET ITEM 10
    // SET 2 ITEM WITH 5 5 RATE
    // let taxMatched = true;
    // if (step == 0) {
    //     globaltax.forEach((a: any) => {
    //         let {taxablerate, taxpercentage, taxprice} = a;
    //         const check = (taxablerate * parseFloat(taxpercentage)) / 100
    //         console.log("taxprice", getFloatValue(taxprice, companyDecimalPlace));
    //         console.log("check", getFloatValue(check, companyDecimalPlace));
    //         if (getFloatValue(taxprice, companyDecimalPlace) !== getFloatValue(check, companyDecimalPlace)) {
    //             taxMatched = false
    //         }
    //     })
    // }

    values.globaltax = globaltax;


    log("FINAL Expense", clone(values))

    return clone(values)
}
