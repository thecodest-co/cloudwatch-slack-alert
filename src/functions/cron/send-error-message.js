const { postMessage } = require('../../helpers/slack-bot');
const { getTimeString, getLogsFromLogGroups } = require('../../helpers/cloudwatch-service');
const { getPartialMessage, getFaultMessage } = require('../../config/messages');

exports.handler = async () => {
    const groups = process.env.LOG_GROUPS.split(' ');

    const checks = getLogsFromLogGroups(groups);
    const timeStr = getTimeString();

    await Promise.all(await checks)
        .then((messages) => {
            const valid = messages.filter((m) => !!m);
            if (valid.length === 0) {
                return;
            }

            const maxLen = 4000 - timeStr.length - 14;
            const msg = valid.join('\n\n').substring(0, maxLen);
            postMessage(getPartialMessage(timeStr, msg, maxLen));
        })
        .catch((e) => postMessage(getFaultMessage(timeStr, e.message)));
};
