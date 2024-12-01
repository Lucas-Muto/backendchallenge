function isWithinLast12Months(date) {
    const now = new Date();
    const twelveMonthsAgo = new Date(now);
    twelveMonthsAgo.setMonth(now.getMonth() - 12);
    return date >= twelveMonthsAgo;
}

function conflictsWithPeriod(infractionDate, travelDate) {
    const infraction = new Date(infractionDate);
    const travel = new Date(travelDate);
    
    const oneYearBefore = new Date(travel);
    oneYearBefore.setFullYear(travel.getFullYear() - 1);
    
    const oneYearAfter = new Date(travel);
    oneYearAfter.setFullYear(travel.getFullYear() + 1);
    
    return infraction >= oneYearBefore && infraction <= oneYearAfter;
}

module.exports = {
    isWithinLast12Months,
    conflictsWithPeriod
}; 