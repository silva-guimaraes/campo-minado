

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let grid = document.querySelector('#grid');

const ROWS = 10;
const COLUMNS = 20;
const BOMBS = 20;
let gameOver = false;

// criar array 2d de todos os campos
let fields = Array.from(Array(ROWS), () => Array(COLUMNS));

// popular esses campos com um objeto para conter informações
for (let y = 0; y < fields.length; y++) {
    for (let x = 0; x < fields[y].length; x++) {

        let field = document.createElement('button');
        field.className = 'field';
        field.style.backgroundColor = 'gray';
        // campos seram postos de acordo como eles permanecem dentro da nossa array
        field.onmousedown = (event) => uncover(x, y, event.which);

        fields[y][x] = {
            element: field,
            value: 0,
            uncovered: false,
            bomb: false,
            flag: false,
        };
        grid.append(field);
    }
}


// popular bombas
for (let i = 0; i < BOMBS; i++) {
    let row = getRandomInt(ROWS);
    let column = getRandomInt(COLUMNS);

    // não por bomba aqui caso haja alguma
    if (fields[row][column].bomb) {
        i--;
        continue;
    }

    // aumentar nível de risco em campos adjacentes
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


window.oncontextmenu = () => false;

 
// acionado toda vez que o usuário clica em um campo.
// também serve como uma função recursiva para desocultar campos vazios.
function uncover(x, y, which) {

    let field = fields[y][x];

    // não fazer nada caso jogo já tenha terminado
    if (gameOver) {
        return;
    }

    // não desocultar campos já desocultados. impede que a recursão entre em um 
    // loop infinito
    if (field.uncovered && which == -1) {
        return;
    }


    // por/remover bandeiras
    // 3 == botão direito
    if (which == 3 && !field.uncovered) {
        field.element.style.backgroundColor = field.flag ? 'gray' : 'blue';
        field.flag = !field.flag;
        return;
    }

    if (field.flag) {
        return;
    }

    // chording
    // chording é quando o jogador aperta em um campo de risco N e caso haja
    // N bandeiras adjacentes, todos os outros campos são desocultados automaticamente
    if (field.uncovered && field.value > 0) {

        let adjacentFlags = 0

        // contar bandeiras adjacentes
        for (let i = y-1; i <= y+1; i++) {
            for (let j = x-1; j <= x+1; j++) {

                if (i == y && j == x)
                    continue;
                if (j < 0 || j >= COLUMNS)
                    continue;
                if (i < 0 || i >= ROWS)
                    continue;

                if (fields[i][j].flag)
                    adjacentFlags++;
            }
        }

        // descobrir campos adjacentes se numero de baideiras é 
        // igual ao risco do campo
        if (adjacentFlags == field.value) {
            for (let i = y-1; i <= y+1; i++) {
                for (let j = x-1; j <= x+1; j++) {

                    if (i == y && j == x)
                        continue;
                    if (j < 0 || j >= COLUMNS)
                        continue;
                    if (i < 0 || i >= ROWS)
                        continue;
                    if (fields[i][j].flag)
                        continue;

                    uncover(j, i, -1);
                }
            }
        }
    }

    field.uncovered = true;

    // 3 tipos de campos existem no campo minado: campos com bomba, campos com risco e
    // campos vazios

    // caso esse campo seja uma bomba
    if (field.bomb) {
        field.element.innerHTML = '💣';
        field.element.style.backgroundColor = 'red';
        gameOver = true;
        
        // alert('game over');
        return;
    }

    // caso esse campo tenha risco.
    // quando desocultando campos vazios recursivamente é preciso parar em campos
    // de risco
    if (field.value > 0) {
        field.element.innerHTML = field.value;
        field.element.style.backgroundColor = 'lightgray';

        // verifica se todos os campos que não sejam bombas foram desocultados
        if (fields.every((x) => x.every((y) => y.uncovered || y.bomb))) {
            gameOver = true;
            alert('vitoria!')
        }

        return;
    }

    // else o campos é vazio:

    field.element.style.backgroundColor = 'lightgray';

    // um campo vazio nunca possui uma bomba por perto.
    // desocultar campos adjacentes:
    for (let i = y-1; i <= y+1; i++) {
        for (let j = x-1; j <= x+1; j++) {
            if (j < 0 || j >= COLUMNS)
                continue;
            if (i < 0 || i >= ROWS)
                continue;
            uncover(j, i, -1);
        }
    }
}
