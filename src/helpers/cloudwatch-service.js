const AWS = require("aws-sdk");
const logs = new AWS.CloudWatchLogs();
const { getLogMessage } = require('../config/messages');

function getStartTime() {
    const period = parseInt(process.env.POLL_PERIOD_MS);

    return Date.now() - period;
}

function getTimeString()
{
    const startTime = getStartTime();

    let t = new Date(startTime);
    let timeStr = t.toTimeString();

    return timeStr.substring(0, timeStr.indexOf(" "));
}

function getLogStreamNamePrefix(startTime) {
    const pad = val => val < 10 ? `0${val}` : val;

    let t = new Date(startTime);
    let timeStr = t.toTimeString();
    timeStr = timeStr.substring(0, timeStr.indexOf(" "));

    console.log(timeStr);

    // @FIXME we lose logs at date boundaries
    return `${t.getFullYear()}/${pad(t.getMonth() + 1)}/${pad(t.getDate())}/[$LATEST]`;
}

async function getLogsFromLogGroups(groups) {
    const filterPattern = process.env.FILTER_PATTERN;

    let startTime = getStartTime();
    let logStreamNamePrefix = getLogStreamNamePrefix(startTime);

    return groups.map(async g => {
        // If not namespaced, add default Lambda prefix
        let logGroupName = g.indexOf("/") < 0 ? `/aws/lambda/${g}` : g;

        let msg, partial = true;
        try {
            let data = await logs.filterLogEvents({
                logGroupName,
                filterPattern,
                logStreamNamePrefix,
                startTime,
                limit: 100
            }).promise();
            let maxLen = 4000 - g.length - 20;
            msg = data.events.map(e => e.message.substring(0, 300).trim()).join("\n\n").substring(0, maxLen);
            partial = !!data.nextToken || msg.length === maxLen;

        } catch (e) {
            msg = `Failed to poll ${g}; ${e.message}`;
        }
        return msg.length > 0 ? getLogMessage(g, partial, msg) : null;
    });
}

module.exports = {
    getTimeString,
    getLogsFromLogGroups,
}