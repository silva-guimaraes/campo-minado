

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let grid = document.querySelector('#grid');

const ROWS = 10;
const COLUMNS = 20;
const BOMBS = 20;
let gameOver = false;

let fields = Array.from(Array(ROWS), () => Array(COLUMNS));

for (let y = 0; y < fields.length; y++) {
    for (let x = 0; x < fields[y].length; x++) {

        let field = document.createElement('button');
        field.className = 'field';
        field.style.backgroundColor = 'gray';
        field.onclick = () => uncover(x, y);

        fields[y][x] = {
            element: field,
            value: 0,
            clicked: false,
            bomb: false,
        };
        grid.append(field);
    }
}


for (let i = 0; i < BOMBS; i++) {
    let row = getRandomInt(ROWS);
    let column = getRandomInt(COLUMNS);

    if (fields[row][column].bomb) {
        i--;
        continue;
    }

    for (let y = row-1; y <= row+1; y++) {
        for (let x = column-1; x <= column+1; x++) {

            if (x < 0 || x >= COLUMNS)
                continue;
            if (y < 0 || y >= ROWS)
                continue;
            if (fields[y][x].bomb)
                continue;

            fields[y][x].value += 1;
        }
    }
    fields[row][column].bomb = true;
}


function uncover(x, y) {

    let field = fields[y][x];

    if (gameOver) {
        return;
    }

    if (field.clicked) {
        return;
    }

    field.clicked = true;


    if (field.bomb) {
        field.element.innerHTML = '💣';
        field.element.style.backgroundColor = 'red';
        gameOver = true;
        
        // alert('game over');
        return;
    }

    if (field.value > 0) {
        field.element.innerHTML = field.value;
        field.element.style.backgroundColor = 'lightgray';

        if (fields.every((x) => x.every((y) => y.clicked || y.bomb))) {
            gameOver = true;
            alert('vitoria!')
        }

        return;
    }

    field.element.style.backgroundColor = 'lightgray';

    for (let i = y-1; i <= y+1; i++) {
        for (let j = x-1; j <= x+1; j++) {
            if (j < 0 || j >= COLUMNS)
                continue;
            if (i < 0 || i >= ROWS)
                continue;
            uncover(j, i);
        }
    }
}
