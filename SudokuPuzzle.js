const newGrid = (size) => {
    let puz = new Array(size);

    for (let i = 0; i < size; i++) {
        puz[i] = new Array(size);  
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        puz[Math.floor(i/size)][i%size] = CONSTANT.UNASSIGNED;
    }

    return puz;
}

// check duplicate number in col
const noRepCol = (grid, col, value) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        if (grid[row][col] === value) return false;
    }
    return true;
}

// check duplicate number in row
const noRepRow = (grid, row, value) => {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
        if (grid[row][col] === value) return false;
    }
    return true;
}

// check duplicate number in 3x3 box
const noRepBox = (grid, box_row, box_col, value) => {
    for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
        for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
            if (grid[row + box_row][col + box_col] === value) return false;
        }
    }
    return true;
}

// check in row, col and 3x3 box
const noRep = (grid, row, col, value) => {
    return noRepCol(grid, col, value) && noRepRow(grid, row, value) && noRepBox(grid, row - row%3, col - col%3, value) && value !== CONSTANT.UNASSIGNED;
}

// find unassigned cell
const findUnassignedPos = (grid, pointer) => {
    for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
        for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === CONSTANT.UNASSIGNED) {
                pointer.row = row;
                pointer.col = col;
                return true;
            }
        }
    }
    return false;
}

// shuffle puzay
const shuffleArray = (puz) => {
    let current_index = puz.length;

    while (current_index !== 0) {
        let rand_index = Math.floor(Math.random() * current_index);
        current_index -= 1;

        let temp = puz[current_index];
        puz[current_index] = puz[rand_index];
        puz[rand_index] = temp;
    }

    return puz;
}

// check puzzle is complete
const idGridFull = (grid) => {
    return grid.every((row, i) => {
        return row.every((value, j) => {
            return value !== CONSTANT.UNASSIGNED;
        });
    });
}

const sudokuCreate = (grid) => {
    let unassigned_pointer = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pointer)) return true;

    let number_list = shuffleArray([...CONSTANT.NUMBERS]);

    let row = unassigned_pointer.row;
    let col = unassigned_pointer.col;

    number_list.forEach((num, i) => {
        if (noRep(grid, row, col, num)) {
            grid[row][col] = num;

            if (idGridFull(grid)) {
                return true;
            } else {
                if (sudokuCreate(grid)) {
                    return true;
                }
            }

            grid[row][col] = CONSTANT.UNASSIGNED;
        }
    });

    return idGridFull(grid);
}

const sudokuCheck = (grid) => {
    let unassigned_pointer = {
        row: -1,
        col: -1
    }

    if (!findUnassignedPos(grid, unassigned_pointer)) return true;

    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (noRep(grid, i, j, num)) {
                if (idGridFull(grid)) {
                    return true;
                } else {
                    if (sudokuCreate(grid)) {
                        return true;
                    }
                }
            }
        })
    })

    return idGridFull(grid);
}

const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

const removeCells = (grid, level) => {
    let res = [...grid];
    let attemps = level;
    while (attemps > 0) {
        let row = rand();
        let col = rand();
        while (res[row][col] === 0) {
            row = rand();
            col = rand();
        }
        res[row][col] = CONSTANT.UNASSIGNED;
        attemps--;
    }
    return res;
}

// generate sudoku base on level
const sudokuGen = (level) => {
    let sudoku = newGrid(CONSTANT.GRID_SIZE);
    let check = sudokuCreate(sudoku);
    if (check) {
        let question = removeCells(sudoku, level);
        return {
            original: sudoku,
            question: question
        }
    }
    return undefined;
}