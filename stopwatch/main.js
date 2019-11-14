(function() {
    const stopwatch = {
        time: 0,
        isRunning: false,
        lapTime: 0,
        laps: [],
        bestLap: 0,
        worstLap: 0,
        lapList: document.querySelector('.laps-list'),
        clock: document.querySelector('.clock'),
        startBtn: document.getElementById('startBtn'),
        lapBtn: document.getElementById('lapBtn')
    };

    stopwatch.start = () => {
        stopwatch.isRunning = true;
        stopwatch.lapTime = stopwatch.time;
        stopwatch.interval = setInterval(() => {
            stopwatch.time++;
            stopwatch.clock.textContent = stopwatch.getTime(stopwatch.time);
        }, 10);
        stopwatch.toggleStartBtn();
        stopwatch.toggleLapBtn();
    };
    stopwatch.stop = () => {
        clearInterval(stopwatch.interval);
        stopwatch.isRunning = false;
        stopwatch.toggleStartBtn();
        stopwatch.toggleLapBtn();
    }
    stopwatch.reset = () => {
        stopwatch.time = 0;
        stopwatch.lapTime = 0;
        stopwatch.laps = [];
        stopwatch.bestLap = 0;
        stopwatch.worstLap = 0;
        stopwatch.lapList.innerHTML = '';
        stopwatch.clock.textContent = stopwatch.getTime(stopwatch.time);
        stopwatch.toggleLapBtn();
    }

    stopwatch.getMilliseconds = (time) => `0${time.toString()}`.slice(-2);
    stopwatch.getSeconds = (time) => `0${Math.floor(time / 100) % 60}`.slice(-2);
    stopwatch.getMinutes = (time) => `0${Math.floor(time / 100 / 60) % 60}`.slice(-2);
    stopwatch.getTime = (time) => `${stopwatch.getMinutes(time)}:${stopwatch.getSeconds(time)}.${stopwatch.getMilliseconds(time)}`;
    stopwatch.getLap = (t) => {
        const time = t - stopwatch.lapTime;
        stopwatch.lapTime = t;
        stopwatch.laps.push(time);
        let li = document.createElement('li');
        li.innerHTML = `<span class="lap-number">#${stopwatch.laps.length}</span>${stopwatch.getTime(time)}`;
        if (stopwatch.laps.length === 1) {
            stopwatch.bestLap = time;
            stopwatch.worstLap = time;
            li.classList.add('best-lap');
        } else {
            if (time < stopwatch.bestLap) {
                [...stopwatch.lapList.children].forEach(i => i.classList.remove('best-lap'));
                stopwatch.bestLap = time;
                li.classList.add('best-lap');
                stopwatch.laps.length === 2 && stopwatch.lapList.lastChild.classList.add('worst-lap');
            }
            if (time > stopwatch.worstLap) {
                [...stopwatch.lapList.children].forEach(i => i.classList.remove('worst-lap'));
                stopwatch.worstLap = time;
                li.classList.add('worst-lap');
            }
        }
        !stopwatch.lapList.childElementCount ? stopwatch.lapList.appendChild(li) : stopwatch.lapList.insertBefore(li, stopwatch.lapList.firstChild);
    };

    stopwatch.toggleStartBtn = () => {
        if (stopwatch.isRunning) {
            startBtn.style.background = '#F64848';
            startBtn.style.color = 'white';
            startBtn.textContent = 'Stop';
        } else {
            startBtn.style.background = '#B7F0AD';
            startBtn.style.color = '#3A3A3A';
            startBtn.textContent = 'Start';
        }
    };
    stopwatch.toggleLapBtn = () => {
        if (stopwatch.isRunning || stopwatch.time === 0) {
            lapBtn.style.color = '#00ABE7';
            lapBtn.textContent = 'Lap';
        } else {
            lapBtn.style.color = '#F64848';
            lapBtn.textContent = 'Reset';
        }
    };

    stopwatch.startBtn.addEventListener('click', () => {
        stopwatch.isRunning ? stopwatch.stop() : stopwatch.start();
    });
    stopwatch.lapBtn.addEventListener('click', () => {
        stopwatch.isRunning ? stopwatch.getLap(stopwatch.time) : stopwatch.time !== 0 && stopwatch.reset();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 's') stopwatch.isRunning ? stopwatch.stop() : stopwatch.start();
        if (e.key === 't' && stopwatch.isRunning) stopwatch.getLap(stopwatch.time);
        if (e.key === 'r' && stopwatch.time !== 0 && !stopwatch.isRunning) stopwatch.reset();
    });
})();