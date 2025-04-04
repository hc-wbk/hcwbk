var pos_status = 'empty', grid_array = [], start = [0, 0], must = [0, 0], rows, cols;

var start_pos = document.getElementById('start_pos'),
  end_pos = document.getElementById('end_pos'),
  baned_pos = document.getElementById('baned_pos'),
  row_col_submit = document.getElementById('row_col_submit'),
  row = document.getElementById('row'),
  col = document.getElementById('col'),
  grid = document.getElementById('grid'),
  run = document.getElementById('run');

start_pos.addEventListener('click', function () { //监听位置按钮
  console.log('start');
  if (pos_status == 'start_pos') pos_status = 'empty';
  else pos_status = 'start_pos';
  console.log(pos_status);
})
end_pos.addEventListener('click', function () {
  console.log('end');
  if (pos_status == 'end_pos') pos_status = 'empty';
  else pos_status = 'end_pos';
  console.log(pos_status);
})
baned_pos.addEventListener('click', function () {
  console.log('banned');
  if (pos_status == 'baned_pos') pos_status = 'empty';
  else pos_status = 'baned_pos';
  console.log(pos_status);
})


row_col_submit.addEventListener('click', function () {//创建网格
  must[0] = must[1] = 0;
  rows = parseInt(row.value);
  cols = parseInt(col.value);
  console.log('size row & col:', rows, cols);
  creatgrid(rows, cols);
})

function creatgrid(rows, cols){//构建网格函数
  console.log('funciton size row & col:', rows, cols);
  grid_array = new Array(rows);
  for (let i = 0; i < rows; i++)
    grid_array[i] = new Array(cols).fill(1);
  grid.innerHTML = '';
  grid.style.gridTemplateRows = `repeat(${rows},1fr)`;
  grid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  grid.style.gap = '2px';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.textContent = `${r + 1},${c + 1}`;
      cell.style.backgroundColor = 'white';
      cell.style.aspectRatio = '1';
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      // 添加点击事件
      cell.addEventListener('click',() => select_pos(r,c,cell));
      
      grid.appendChild(cell);
    }
  }
}

function select_pos(r, c, cell) { //点击网格事件
  if (pos_status == 'empty') return;
  else if (grid_array[r][c] != 1) {
    if (grid_array[r][c] == -1) must[1] = 0;
    else if (grid_array[r][c] == 2) must[0] = 0;
    cell.style.backgroundColor = 'white';
    grid_array[r][c] = 1;
  }
  else if (pos_status == 'start_pos' && !must[0]) {
    must[0] = 1;
    cell.style.backgroundColor = 'lightblue';
    grid_array[r][c] = 2;
    start = [r, c];
  }
  else if (pos_status == 'end_pos' && !must[1]) {
    must[1] = 1;
    cell.style.backgroundColor = 'lightpink';
    grid_array[r][c] = -1;
  }
  else if (pos_status == 'baned_pos') {
    cell.style.backgroundColor = 'gray';
    grid_array[r][c] = 0;
  }
}

run.addEventListener('click', function () { //走迷宫
  if (!(must[0] && must[1])) {
    alert("select start and end");
    return;
  }
  let bfs = [], p = 0, sign = 0;
  bfs.push([-1, start[0], start[1]]);
  grid_array[start[0]][start[1]] = 0;
  while (p < bfs.length) {
    console.log(bfs);
    console.log(grid_array[bfs[p][1]][bfs[p][2]]);
    let r = bfs[p][1], c = bfs[p][2];
    if (r - 1 >= 0 && grid_array[r - 1][c]) {
      bfs.push([p, r - 1, c]);
      if (grid_array[r - 1][c] == -1) {
        sign = 1;
        break;
      } 
      grid_array[r - 1][c] = 0;
    }
    if (r + 1 < rows && grid_array[r + 1][c]) {
      bfs.push([p, r + 1, c]);
      if (grid_array[r + 1][c] == -1) {
        sign = 1;
        break;
      } 
      grid_array[r + 1][c] = 0;
    }
    if (c - 1 >= 0 && grid_array[r][c - 1]) {
      bfs.push([p, r, c - 1]);
      if (grid_array[r][c - 1] == -1) {
        sign = 1;
        break;
      } 
      grid_array[r][c - 1] = 0;
    }
    if (c + 1 < cols && grid_array[r][c + 1]) {
      bfs.push([p, r, c + 1]);
      if (grid_array[r][c + 1] == -1) {
        sign = 1;
        break;
      } 
      grid_array[r][c + 1] = 0;
    }
    p++;
  }
  if (sign) {
    let back = p;
    while (bfs[back][0] != -1) {
      document.querySelector(`[data-row="${bfs[back][1]}"][data-col="${bfs[back][2]}"]`).style.backgroundColor = 'yellow';
      back = bfs[back][0];
    }
    return;
  }
  else
    alert("can not get");
})