(function() {
    const board = {
        body: document.querySelector('.board'),
        message: document.getElementById('boardMessage'),
        openStack: [],
        cellsFound: [],
        isActive: false,
        bestScore: Infinity
    };
    board.tiles = board.body.children;
    board.length = board.body.childElementCount;
    board.getSeq = () => {
        const arr = [];
        for (let i = 0; i < board.length; i++) {
            arr.push([Math.random(), Math.ceil(i / 2)]);
        }
        return arr.sort((a, b) => a[0] - b[0]).map(n => n[1]);
    };
    board.seq = board.getSeq();
    board.openCell = (n) => {
        if (!board.isActive) {
            board.message.textContent = 'Go! Go! Go! Time is ticking!';
            board.isActive = true;
        }
        board.startTime = !board.startTime ? Date.now() : board.startTime;
        let num = board.seq[n - 1];
        board.tiles[n - 1].firstChild.classList.add('open');
        setTimeout(() => board.tiles[n - 1].firstChild.textContent = num, 250);
        if (num === 0) {
            [...board.tiles].forEach(i => {
                i.firstChild.classList.add('open');
                i.firstChild.classList.add('missed');
                board.blink('#F64848');
            });
            setTimeout(board.reset, 500);
        } else if (!board.openStack.length) {
            board.openStack.push(board.tiles[n - 1]);
        } else {
            let openedCell = board.openStack.pop();
            if (openedCell.firstChild.textContent == num) {
                openedCell.firstChild.classList.add('found');
                board.tiles[n - 1].firstChild.classList.add('found');
                board.blink('#B7F0AD');
                board.cellsFound.push(openedCell, board.tiles[n - 1]);
                board.cellsFound.length === board.length - 1 && board.end();
            } else {
                openedCell.firstChild.classList.add('missed');
                board.tiles[n - 1].firstChild.classList.add('missed');
                board.blink('#F64848');
                setTimeout(() => {
                    board.closeCell(n);
                    board.closeCell(openedCell.id.match(/\d+/)[0]);
                }, 500);
            }
        }
    };
    board.closeCell = (n) => {
        board.tiles[n - 1].firstChild.classList.remove('open');
        board.tiles[n - 1].firstChild.classList.remove('missed');
        board.tiles[n - 1].firstChild.classList.remove('found');
        board.tiles[n - 1].firstChild.textContent = '';
    };
    board.reset = () => {
        [...board.tiles].forEach(i => board.closeCell(i.id.match(/\d+/)[0]));
        board.openStack = [];
        board.cellsFound = [];
    };
    board.restart = () => {
        board.reset();
        board.message.textContent = 'Click any tile to start and beware of zero!';
        board.openStack = [];
        board.cellsFound = [];
        board.startTime = 0;
        board.isActive = false;
        board.seq = board.getSeq();
    };
    board.end = () => {
        let zero = board.tiles[board.seq.indexOf(0)];
        setTimeout(() => zero.firstChild.textContent = 0, 250);
        zero.firstChild.classList.add('open');
        zero.firstChild.classList.add('found');
        const finishTime = ((Date.now() - board.startTime) / 1000).toFixed(2);
        board.bestScore = Number(finishTime) < Number(board.bestScore) ? finishTime : board.bestScore;
        board.message.innerHTML = `Congrats! You did it in ${finishTime} seconds! <br />${finishTime == board.bestScore ? 'This is your best score so far!' : `Your best score so far is ${board.bestScore} seconds.`}<br /><a href="#" id="restartLink">Click here to play again</a>`;
    };
    board.blink = (color) => {
        setTimeout(() => document.body.style.background = color, 100);
        setTimeout(() => document.body.style.background = '#FCBF49', 250);
    };

    document.addEventListener('click', (e) => {
        if (e.target.id === 'restartLink') {
            e.preventDefault();
            board.restart();
        } else {
            ([...e.target.classList].includes('cell-number') && ![...e.target.classList].includes('open')) && board.openCell(e.target.parentElement.id.match(/\d+/)[0]); 
        }
    });
    document.addEventListener('keydown', (e) => {
        if(e.key > 0 && e.key < 10) {
            !board.cellsFound.length === board.length - 1 && board.openCell(e.key);
        }
    });
})();