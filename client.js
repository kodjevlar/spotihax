(function spotihax() {
  console.log('spotihax started...');
  let since = localStorage.getItem('spotihaxSince');

  if (!since) {
    since = Date.now();
    localStorage.setItem('spotihaxSince', since);
  }

  function getQueue() {
    return fetch('https://localhost/v1/queue?since=' + since)
      .then(res => res.json());
  }

  function playTrack(track) {
    const url = '/track/' + track.uri.split(':')[2];
    localStorage.setItem('spotihaxSince', track.queuedAt);
    console.log('spotihax: changing to ' + url);
    location.href = url;
  }

  function onSongEnd() {
    return new Promise(function(resolve, reject) {
      const timer = setInterval(function() {
        const progressbar = document.getElementsByClassName('progress-bar-fg')[0];
        const percent = parseFloat(progressbar.style.width);

        console.log('spotihax: song is ' + percent + '% done');

        if (percent > 99) {
          clearInterval(timer);
          setTimeout(() => resolve(), 1000);
        }
      }, 500);
    });
  }

  function play() {
    try {
      document.getElementsByClassName('control-button spoticon-play-32')[0].click();
    } catch (err) {
      console.log('cannot play when its already playing...');
    }
  }

  function pause() {
    try {
      document.getElementsByClassName('control-button spoticon-pause-32')[0].click();
    } catch (err) {
      console.log('cannot pause when its already paused...');
    }
  }

  (async function checkSongEnd() {
    await onSongEnd();
    console.log('Track ended!');
    // check if there is anything in the queue??
    if (queue.length) {
      playTrack(queue[0]);
    } else {
      pause();
    }
    checkSongEnd();
  })();

  (async function run() {
    try {
      queue = await getQueue();

      if (queue.length === 0) {
        console.log('spotihax: queue is empty, or the last track is playing..., watching...');
        setTimeout(run, 5000);
        return;
      }

      const track = queue[0];
      console.log('spotihax: playing next track', track);
      playTrack(track);
    } catch (err) {
      console.log('spotihax: could not get deta', err);
      setTimeout(run, 5000);
    }
  })();
})();
