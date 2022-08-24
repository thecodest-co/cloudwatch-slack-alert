const axios = require('axios');

async function postMessage(text) {
    const hook = process.env.SLACK_WEBHOOK_URL;
    const channel = process.env.SLACK_CHANNEL;
    const username = process.env.SLACK_USER;

    return axios.post(hook, {
        channel,
        username,
        text,
        icon_emoji: ':ghost:',
    });
}

module.exports = {
    postMessage,
};
