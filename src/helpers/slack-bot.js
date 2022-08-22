const axios = require("axios");

async function postMessage(text) {
    const hook = process.env.SLACK_WEBHOOK_URL;
    const channel = process.env.SLACK_CHANNEL;
    const username = process.env.SLACK_USER;
    const icon_emoji = process.env.SLACK_ICON;

    return axios.post(hook, {
        channel, username, icon_emoji,
        text
    });
}

module.exports = {
    postMessage,
};