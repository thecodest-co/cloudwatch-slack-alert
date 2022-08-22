const { postMessage } = require('../../helpers/slack-bot');
const { getTimeString, getLogsFromLogGroups } = require('../../helpers/cloudwatch-service');
const { getPartialMessage, getFaultMessage } = require('../../config/messages');

exports.handler = async () => {
    let checks = getLogsFromLogGroups();
    let timeStr = getTimeString();

    await Promise.all(await checks)
        .then(messages => {
            let valid = messages.filter(m => !!m);
            if (valid.length === 0) return;

            let maxLen = 4000 - timeStr.length - 14;
            let msg = valid.join("\n\n").substring(0, maxLen);
            return postMessage(getPartialMessage(timeStr, msg, maxLen));
        })
        .catch(
            e => postMessage(getFaultMessage(timeStr, e.message))
        );
}