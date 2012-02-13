(function () {
  var canvas;
  var ctx;
  var grid;
  var blockSize = 5;
  var widthInBlocks = 200;
  var heightInBlocks = 100;
  var width = widthInBlocks * blockSize;
  var height = heightInBlocks * blockSize;
  var frameLength = 1;
  var counter = 0;
  var NORTH = 0;
  var EAST = 1;
  var SOUTH = 2;
  var WEST = 3;

  var ants;

  function Ant(x, y) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.direction = EAST;
  }

  Ant.prototype.draw = function () {
    ctx.save();

    //first fill in previous square
    var colour = grid[this.prevY][this.prevX];
    drawCell(colour, this.prevX, this.prevY);

    //then fill in current square yellow
    drawCell('yellow', this.x, this.y);

    ctx.restore();
  };

  Ant.prototype.move = function () {
    this.prevX = this.x;
    this.prevY = this.y;

    var currentColour = grid[this.y][this.x];
    if (currentColour == 'white'/* && (Math.random() < 0.99)*/) {
      this.direction = (this.direction + 3) % 4;
      grid[this.y][this.x] = 'black';
    } else {
      this.direction = (this.direction + 1) % 4;
      grid[this.y][this.x] = 'white';
    }

    switch (this.direction) {
    case NORTH:
      this.y -= 1;
      if (this.y < 0) {
        this.y = heightInBlocks - 1;
      }
      break;
    case EAST:
      this.x += 1;
      if (this.x >= widthInBlocks) {
        this.x = 0;
      }
      break;
    case SOUTH:
      this.y += 1;
      if (this.y >= heightInBlocks) {
        this.y = 0;
      }
      break;
    case WEST:
      this.x -= 1;
      if (this.x < 0) {
        this.x = widthInBlocks - 1;
      }
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

    drawGrid();

    gameLoop();
  }

  setup();

  function drawCell(colour, x, y) {
    ctx.fillStyle = colour;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);

    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(x * blockSize + 0.5, y * blockSize + 0.5, blockSize, blockSize);
  }

  function drawGrid() {
    ctx.clearRect(0, 0, width, height);
    grid.forEach(function (row, y) {
      row.forEach(function (colour, x) {
        drawCell(colour, x, y);
      });
    });
  }

  function draw() {
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

