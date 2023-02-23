import moment from "moment";
import {store} from '../App';

export enum DAY_OPTIONS {
    TODAY = "Today",
    YESTERDAY = "Yesterday",
    LAST_7_DAY = "Last 7 Days",
    LAST_30_DAY = "Last 30 Days",
    THIS_WEEK = "This Week",
    LAST_WEEK = "Last Week",
    THIS_MONTH = "This Month",
    THIS_QUARTER = "This Quarter",
    LAST_MONTH = "Last Month",
    LAST_6_MONTH = "Last 6 Month",
    LAST_12_MONTH = "Last 12 Month",
    THIS_YEAR = "This Year",
    PREVIOUS_QUARTER = "Previous Quarter",
    PREVIOUS_YEAR = "Previous Year",
}

function range(start: any) {
    // @ts-ignore
    return Array(12).fill().map((_, idx) => {
        let check = start + (idx)
        if (check > 12) {
            check = check - 12;
        }
        return check
    })
}

const getQStartAndEnd = (financialMonth: number, previous: boolean) => {
    let currentMonth: any = moment().get("month");
    let startYear = moment().get("year"), endYear = startYear;
    if (previous) {
        if (currentMonth === 0) {
            startYear -= 1;
            endYear -= 1;
            currentMonth = 9;
        } else if (currentMonth === 1) {
            startYear -= 1;
            endYear -= 1;
            currentMonth = 10;
        } else if (currentMonth === 2) {
            startYear -= 1;
            endYear -= 1;
            currentMonth = 11;
        } else {
            currentMonth -= 3;
        }
    }
    let findIndex = range(financialMonth).findIndex((a: any) => a === (currentMonth + 1));
    let position = findIndex % 3
    let startMonth = currentMonth, endMonth = startMonth;
    if (position === 1) {
        if (startMonth == 0) {
            startMonth = 11;
        } else {
            startMonth -= 1
        }
    } else if (position === 2) {
        if (startMonth == 0) {
            startMonth = 10;
        } else {
            startMonth -= 2
        }
    }

    if (startMonth === 10) {
        endMonth = 0
    } else if (startMonth === 11) {
        endMonth = 1
    } else {
        endMonth = startMonth + 2
    }
    if (!previous && startMonth > endMonth) {
        startYear -= 1;
    }
    if (previous && startMonth > endMonth) {
        endYear += 1;
    }
    return {
        startMonth,
        endMonth,
        startYear,
        endYear
    }
}

/**
 * @return {startdate, enddate, starttime, endtime}
 * @param dayOption - pass day option for get date and time default day option is TODAY
 */
export const getStartDateTime = (dayOption?: DAY_OPTIONS) => {
    let dateFormat = "YYYY-MM-DD", timeFormat = "hh:mm A"
    let date = moment();

    let financialfirstmonth = parseInt(store?.getState()?.appApiData?.settings?.general?.financialfirstmonth || '4');
    // let financialfirstmonth = 4;

    let startdate: any = date.startOf("day"),
        enddate: any = date.endOf("day"), thisQuarterMonths, previousQuarterMonths,
        label: any = date.startOf("day").format('DD MMMM, YYYY');


    // YESTERDAY
    if (dayOption === DAY_OPTIONS.YESTERDAY) {
        startdate = moment().subtract(1, 'day');
        enddate = moment().subtract(1, 'day')
        label = moment().subtract(1, 'day').format('DD MMMM, YYYY')
    } else
        // LAST 7 DAYS
    if (dayOption === DAY_OPTIONS.LAST_7_DAY) {
        startdate = moment().subtract(6, 'day');
        enddate = moment();
        label = startdate.format('DD') +' - '+ enddate.format('DD') + ' ' + enddate.format('MMMM, YYYY')
    } else
        // LAST 30 DAYS
    if (dayOption === DAY_OPTIONS.LAST_30_DAY) {
        startdate = moment().subtract(29, 'day');
        enddate = moment();
        label = startdate.format('DD MMMM') +' - '+ enddate.format('DD MMMM, YYYY')
    } else
        // THIS WEEK
    if (dayOption === DAY_OPTIONS.THIS_WEEK) {
        startdate = moment().startOf('week');
        enddate = moment().endOf('week');
        label = 'Week of '+ startdate.format('DD') + ' ' + enddate.format('MMMM, YYYY')
    } else
        // THIS WEEK
    if (dayOption === DAY_OPTIONS.LAST_WEEK) {
        startdate = moment().startOf('week').subtract(7, 'day');
        enddate = moment().endOf('week').subtract(7, 'day');
        label = 'Week of '+ startdate.format('DD') + ' ' + enddate.format('MMMM, YYYY')
    } else
        // THIS MONTH
    if (dayOption === DAY_OPTIONS.THIS_MONTH) {
        startdate = moment().startOf('month');
        enddate = moment().endOf('month');
        label =   startdate.format('MMMM, YYYY')
    } else
        // THIS QUARTER
    if (dayOption === DAY_OPTIONS.THIS_QUARTER) {
        thisQuarterMonths = getQStartAndEnd(financialfirstmonth, false);
        startdate = moment({M: thisQuarterMonths.startMonth}).year(thisQuarterMonths.startYear).startOf('month');
        enddate = moment({M: thisQuarterMonths.endMonth}).year(thisQuarterMonths.endYear).endOf('month')
        label =   startdate.format('MMMM') + ' - ' + enddate.format('MMMM, YYYY')
    } else
        // LAST MONTH
    if (dayOption === DAY_OPTIONS.LAST_MONTH) {
        startdate = moment().subtract(1, 'month').startOf('month');
        enddate = moment().subtract(1, 'month').endOf('month');
        label =   startdate.format('MMMM, YYYY')
    } else
        // LAST 6 MONTH
    if (dayOption === DAY_OPTIONS.LAST_6_MONTH) {
        startdate = moment().subtract(5, 'month').startOf('month');
        enddate = moment().endOf('month');
        label =   startdate.format('MMMM') + ' - ' + enddate.format('MMMM, YYYY')
    } else
        // LAST 12 MONTH
    if (dayOption === DAY_OPTIONS.LAST_12_MONTH) {
        startdate = moment().subtract(11, 'month').startOf('month');
        enddate = moment().endOf('month');
        label =   startdate.format('MMMM') + ' - ' + enddate.format('MMMM, YYYY')
    } else
        // THIS YEAR
    if (dayOption === DAY_OPTIONS.THIS_YEAR) {
        startdate = moment({M: financialfirstmonth - 1}).subtract(12, 'month').startOf('month');
        enddate = moment({M: financialfirstmonth - 1}).subtract(1, 'month').endOf('month');
        label =   enddate.format('YYYY')
        // THIS YEAR SET USING FINANCIAL MONTH
        if (moment().get("month") + 1 >= financialfirstmonth) {
            startdate = moment({M: financialfirstmonth - 1}).startOf('month');
            enddate = moment({M: financialfirstmonth - 1, y: moment().year() + 1}).subtract(1, 'month').endOf('month');
            label =   enddate.format('YYYY')
        }
    } else
        // PREVIOUS QUARTER
    if (dayOption === DAY_OPTIONS.PREVIOUS_QUARTER) {
        previousQuarterMonths = getQStartAndEnd(financialfirstmonth, true);
        startdate = moment({M: previousQuarterMonths.startMonth}).year(previousQuarterMonths.startYear).startOf('month');
        enddate = moment({M: previousQuarterMonths.endMonth}).year(previousQuarterMonths.startYear).endOf('month');
        label =   startdate.format('MMMM') + ' - ' + enddate.format('MMMM, YYYY')
    } else
        // PREVIOUS YEAR
    if (dayOption === DAY_OPTIONS.PREVIOUS_YEAR) {
        startdate = moment({M: financialfirstmonth - 1}).subtract(24, 'month').startOf('month');
        enddate = moment({M: financialfirstmonth - 1}).subtract(1, 'month').subtract(12, 'month').endOf('month');
        label =   enddate.format('YYYY')
        // PREVIOUS YEAR SET USING FINANCIAL MONTH
        if (moment().get("month") + 1 >= financialfirstmonth) {
            startdate = moment({M: financialfirstmonth - 1}).subtract(12, 'month').startOf('month');
            enddate = moment({M: financialfirstmonth - 1}).subtract(1, 'month').endOf('month');
            label =   enddate.format('YYYY')
        }
    }

    return {
        startdate: startdate.format(dateFormat),
        enddate: enddate.format(dateFormat),
        datefrom: enddate.format(dateFormat),
        dateto: startdate.format(dateFormat),
        label:label,
        starttime: date.startOf("day").format(timeFormat),
        endtime: date.endOf("day").format(timeFormat)
    };
}
