module.exports = {
    getFaultMessage: (timeStr, message) => `*FAULT* ${timeStr}
\`\`\`
${message}
\`\`\``,
    getPartialMessage: (timeStr, message, maxLength) => `*${timeStr}*${message.length === maxLength ? ' [partial]' : ''}
${message}`,
    getLogMessage: (group, partial, message) => `\`${group}${partial ? ' [partial]' : ''}\`
\`\`\`
${message}
\`\`\``,
};
