(function () {
  var canvas;
  var ctx;
  var grid;
  var blockSize = 5;
  var widthInBlocks = 200;
  var heightInBlocks = 100;
  var width = widthInBlocks * blockSize;
  var height = heightInBlocks * blockSize;
  var frameLength = 100;
  var counter = 0;
  var NORTH = 0;
  var EAST = 1;
  var SOUTH = 2;
  var WEST = 3;

  var ants;

  function Ant(x, y) {
    this.x = x;
    this.y = y;
    this.direction = SOUTH;
  }

  Ant.prototype.draw = function () {
    ctx.save();
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.x * blockSize, this.y * blockSize, blockSize, blockSize);
    ctx.restore();
  };

  Ant.prototype.move = function () {
    var currentColour = grid[this.y][this.x];
    if (currentColour == 'white') {
      this.direction = (this.direction + 3) % 4;
      grid[this.y][this.x] = 'black';
    } else {
      this.direction = (this.direction + 1) % 4;
      grid[this.y][this.x] = 'white';
    }
    switch (this.direction) {
    case NORTH:
      this.y += 1;
      break;
    case EAST:
      this.x += 1;
      break;
    case SOUTH:
      this.y -= 1;
      break;
    case WEST:
      this.x -= 1;
      break;
    }
  };

  function setup() {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    document.body.appendChild(canvas);

    ctx = canvas.getContext('2d');

    grid = [];
    ants = [];

    for (var i = 0; i < heightInBlocks; i++) {
      row = [];
      for (var j = 0; j < widthInBlocks; j++) {
        row.push('white');
      }
      grid.push(row);
    }
    gameLoop();
  }

  setup();

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    grid.forEach(function (row, y) {
      row.forEach(function (cell, x) {
        ctx.fillStyle = cell;
        ctx.fillRect(x * blockSize + 0.5, y * blockSize + 0.5, blockSize, blockSize);
        ctx.strokeRect(x * blockSize + 0.5, y * blockSize + 0.5, blockSize, blockSize);
      });
    });

    ants.forEach(function (ant) {
      ant.draw();
    });
  }

  function update() {
    ants.forEach(function (ant) {
      ant.move();
    });
  }

  function gameLoop() {
    counter++;
    draw();
    update();
    setTimeout(gameLoop, frameLength);
  }

  $(document).ready(function () {
    $('canvas').click(function (e) {
      var x = Math.floor(e.offsetX / blockSize);
      var y = Math.floor(e.offsetY / blockSize);

      ants.push(new Ant(x, y));
    });
  });
})();

