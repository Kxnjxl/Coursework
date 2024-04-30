
// screens
const start_screen = document.querySelector('#p-screen');
const game_screen = document.querySelector('#game');
const result_screen = document.querySelector('#result-screen');

//inital values
const cells = document.querySelectorAll('.sudoku-grid-cell');
const number_inputs = document.querySelectorAll('.number');
const player_name = document.querySelector('#player-name');
const game_level = document.querySelector('#game-level');
const game_time = document.querySelector('#game-time');
const pause_icon = document.querySelector('.pausing');
const play_icon = document.querySelector('.playing');
const result_time = document.querySelector('#result-time');

let level_index = 0;
let level = CONSTANT.LEVEL[level_index];
let timer = null;
let pause = false;
let seconds = 0;
let su = undefined;
let su_answer = undefined;
let selected_cell = -1;

// retrieve the game information from storage

const getGameInfo = () => JSON.parse(localStorage.getItem('game'));

// create each 9*9 grid by adding space
const sudokuGameGrid = () => {
    let index = 0;

    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE,2); i++) {
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if (row === 2 || row === 5) cells[index].style.marginBottom = '7px';
        if (col === 2 || col === 5) cells[index].style.marginRight = '7px';

        index++;
    }
}

// keep track of timer
const Timer = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

//clear sudoku cells for new game
const clearSudoku = () => {
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        cells[i].innerHTML = '';
        cells[i].classList.remove('filled');
        cells[i].classList.remove('selected');
    }
}

//generate the new sudoku
const genSudoku = () => {
    // clear old sudoku
    clearSudoku();
    resetCell();
    // generate sudoku puzzle here
    su = sudokuGen(level);
    su_answer = [...su.question];

    seconds = 0;

    saveGameInfo();

    // show sudoku numbers in the cells
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        
        cells[i].setAttribute('data-value', su.question[row][col]);

        if (su.question[row][col] !== 0) {
            cells[i].classList.add('filled');
            cells[i].innerHTML = su.question[row][col];
        }
    }
}

const loadSudoku = () => {
    let game = getGameInfo();

    game_level.innerHTML = CONSTANT.LEVEL_NAME[game.level];

    su = game.su;

    su_answer = su.answer;

    seconds = game.seconds;
    game_time.innerHTML = Timer(seconds);

    level_index = game.level;

    // show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        
        cells[i].setAttribute('data-value', su_answer[row][col]);
        cells[i].innerHTML = su_answer[row][col] !== 0 ? su_answer[row][col] : '';
        if (su.question[row][col] !== 0) {
            cells[i].classList.add('filled');
        }
    }
}
//create hover effect on each cell in the same 9*9 grid and the entire row and column of the selected cell
const hoverCell = (index) => {
    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            cell.classList.add('hover');
        }
    }

    let step = 9;
    while (index - step >= 0) {
        cells[index - step].classList.add('hover');
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        cells[index + step].classList.add('hover');
        step += 9;
    }

    step = 1;
    while (index - step >= 9*row) {
        cells[index - step].classList.add('hover');
        step += 1;
    }

    step = 1;
     while (index + step < 9*row + 9) {
        cells[index + step].classList.add('hover');
        step += 1;
    }
}

//reset each cell by removing the hover effect
const resetCell = () => {
    cells.forEach(e => e.classList.remove('hover'));
}

//check if wrong number has been entered and create a hover effect on the wrong number and same number around the grid/row/column to show why it is wrong
const checkErr = (value) => {
    const addErr = (cell) => {
        if (parseInt(cell.getAttribute('data-value')) === value) {
            cell.classList.add('err');
            cell.classList.add('cell-err');
            setTimeout(() => {
                cell.classList.remove('cell-err');
            }, 500);
        }
    }

    let index = selected_cell;

    let row = Math.floor(index / CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE;

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
            if (!cell.classList.contains('selected')) addErr(cell);
        }
    }

    let step = 9;
    while (index - step >= 0) {
        addErr(cells[index - step]);
        step += 9;
    }

    step = 9;
    while (index + step < 81) {
        addErr(cells[index + step]);
        step += 9;
    }

    step = 1;
    while (index - step >= 9*row) {
        addErr(cells[index - step]);
        step += 1;
    }

    step = 1;
    while (index + step < 9*row + 9) {
        addErr(cells[index + step]);
        step += 1;
    }
}

//remove the err tag to remove the err hover effect
const removeErr = () => cells.forEach(e => e.classList.remove('err'));

//save information of the game to local storage for retrieval if necessary 
const saveGameInfo = () => {
    
    let game = {
        level: level_index,
        seconds: seconds,
        su: {
            original: su.original,
            question: su.question,
            answer: su_answer
        }
    }
    localStorage.setItem('game', JSON.stringify(game));
}

//remove the game info from local storage
const removeGameInfo = () => {
    localStorage.removeItem('game');
    document.querySelector('#option-continue').style.display = 'none';
}

//check if the game is a win/completed
const isGameWin = () => sudokuCheck(su_answer);

//show the result screen
const showResult = () => {
    clearInterval(timer);
    result_screen.classList.add('active');
    result_time.innerHTML = Timer(seconds);
}

//input the selected number to the cell
const inputNumberSudoku = () => {
    number_inputs.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!cells[selected_cell].classList.contains('filled')) {
                cells[selected_cell].innerHTML = index + 1;
                cells[selected_cell].setAttribute('data-value', index + 1);
                // add to answer
                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE;
                su_answer[row][col] = index + 1;
                // save game
                saveGameInfo()
                // -----
                removeErr();
                checkErr(index + 1);
                cells[selected_cell].classList.add('zoom-in');
                setTimeout(() => {
                    cells[selected_cell].classList.remove('zoom-in');
                }, 500);

                // check game win
                if (isGameWin()) {
                    removeGameInfo();
                    showResult();
                }
                // ----
            }
        })
    })
}

const cellsSudoku = () => {
    cells.forEach((e, index) => {
        e.addEventListener('click', () => {
            if (!e.classList.contains('filled')) {
                cells.forEach(e => e.classList.remove('selected'));

                selected_cell = index;
                e.classList.remove('err');
                e.classList.add('selected');
                resetCell();
                hoverCell(index);
            }
        })
    })
}

//starts the game by showing the start screen followed by the other screen
const startGame = () => {
    start_screen.classList.remove('active');
    game_screen.classList.add('active');

    game_level.innerHTML = CONSTANT.LEVEL_NAME[level_index];

    Timer(seconds);

    timer = setInterval(() => {
        if (!pause) {
            seconds = seconds + 1;
            game_time.innerHTML = Timer(seconds);
        }
    }, 1000);
}

//on clicking new game resets the game screens to the inital screen and resets the timer
const NewGame = () => {
    clearInterval(timer);
    pause = false;
    play_icon.classList.remove('active');
    pause_icon.classList.add('active');
    pause = false;
    start_screen.classList.add('active');
    game_screen.classList.remove('active');
    result_screen.classList.remove('active');
}

//the following code add's clicking functions
document.querySelector('#option-levels').addEventListener('click', (e) => {
    level_index = level_index + 1 > CONSTANT.LEVEL.length - 1 ? 0 : level_index + 1;
    level = CONSTANT.LEVEL[level_index];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[level_index];
});

document.querySelector('#option-play').addEventListener('click', () => {
        genSudoku();
        startGame();
});



pause_icon.addEventListener('click', () => {
    pause_icon.classList.remove('active');
    play_icon.classList.add('active');
    pause = true;
});

play_icon.addEventListener('click', () => {
    play_icon.classList.remove('active');
    pause_icon.classList.add('active');
    pause = false;
});

document.querySelector('#new-game').addEventListener('click', () => {
    NewGame();
});

document.querySelector('#new-game-2').addEventListener('click', () => {
    console.log('object');
    NewGame();
});

document.querySelector('#delete-btn').addEventListener('click', () => {
    cells[selected_cell].innerHTML = '';
    cells[selected_cell].setAttribute('data-value', 0);

    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;

    su_answer[row][col] = 0;

    removeErr();
})
// main, start game
const init = () => {
    const game = getGameInfo();

    document.querySelector('#option-continue').style.display = 'none';

    sudokuGameGrid();
    cellsSudoku();
    inputNumberSudoku();

}

init();