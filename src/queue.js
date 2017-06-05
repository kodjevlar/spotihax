'use strict';
const slack = require('slack');
const bot = slack.rtm.client();
const spotify = require('./spotify');

const queuePattern= /(lira|spela|play|queue|köa)/gi;
const trackUriPattern = /spotify:track:([a-zA-Z0-9]{22})/;
const queue = [];

function getState() {
  return queue;
}

function extractTrackUri(message) {
  const shouldQueue = message.text.match(queuePattern);
  const trackUri = message.text.match(trackUriPattern);

  if (shouldQueue && trackUri) {
    return trackUri[0];
  }

  return null;
}

bot.message(async function handleMessage(message) {
  console.log(message);
  const trackUri = extractTrackUri(message);
  let trackInfo;

  if (!trackUri) {
    console.log('Not gonna play dat');
    return;
  }

  console.log(`I should play ${trackUri} because someone told me this: ${message.text}`);

  try {
    trackInfo = await spotify.lookupTrack(trackUri);
  } catch (err) {
    console.log(`could not lookup track ${trackUri}`, err);
    return;
  }

  const q = {
    uri: trackUri,
    duration: Math.round(trackInfo.duration_ms / 1000),
    name: trackInfo.name,
    queuedAt: Date.now()
  };
  console.log('queued!', q);
  queue.push(q);
});

bot.listen({
  token: process.env.SLACK_TOKEN
});

module.exports = {
  getState
};
