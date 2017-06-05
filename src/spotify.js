'use strict';
const fetch = require('node-fetch');

function lookupTrack(uri) {
  return fetch('https://api.spotify.com/v1/tracks/' + uri.split(':')[2])
    .then(res => res.json());
}

module.exports = {
  lookupTrack
};
