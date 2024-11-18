var myGamePiece; //polje koje kontrolira igrač, iliti palica
let bricks = []; //lista objekata cigli
var ball1; //lopta
let i = 0;
let startWidth = 40;
let startHeight = 50;
function startGame() {
  myGamePiece = new player(   //poziv funckije igrač, aktivira se jedan igrač
    145,
    25,
    "brown",
    window.innerWidth * 0.65,
    window.innerHeight * 0.9
  );
  while (i < 28) {  //generira se 28 cigli u 2 reda
    var brick1 = new brick(startWidth, startHeight);
    bricks.push(brick1);
    if (i == 13) {
      startWidth = -70;
      startHeight = 85;
    }
    startWidth += 110;
    i++;
  }
  ball1 = new ball(750, 300);  //generira se loptica 
  myGameArea.start();  //pokreće se igra
}
var myGameArea = {  //područje igre, veliki canvas objekt u kojem se događa igra
  canvas: document.createElement("canvas"),
  start: function () {  //daju se početne vrijednosti, dimenzije, duljine intervala
    this.canvas.id = "myGameCanvas";
    this.canvas.width = window.innerWidth * 0.98;
    this.canvas.height = window.innerHeight * 0.98;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  stop: function () {
    clearInterval(this.interval);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};
function player(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speed_x = 0;
  this.speed_y = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = color;
    ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.restore();
  };
  document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowLeft") {
      this.speed_x = -8;
      this.speed_y = 0;
    } else if (event.key == "ArrowRight") {
      this.speed_x = 8;
      this.speed_y = 0;
    }
  });
  document.addEventListener("keyup", (event) => {
    this.speed_x = 0;
  });
  this.newPos = function () {
    /*
          if (this.x - this.width / 2 < 0) this.speed_x = 2;
          else if (this.x + this.width / 2 >= myGameArea.context.canvas.width)
            this.speed_x = -2;
          if (this.y - this.height / 2 < 0) this.speed_y = -2;
          else if (this.y + this.height / 2 >= myGameArea.context.canvas.height)
            this.speed_y = 2;
          this.x += this.speed_x;
          this.y -= this.speed_y;
          */
    this.x += this.speed_x;
    this.y -= this.speed_y;
  };
}

function brick(x, y, type) {
  this.type = type;
  this.width = 100;
  this.height = 30;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "red";
    ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.strokeRect(this.width / -2, this.height / -2, this.width, this.height);
    ctx.restore();
  };
  this.newPos = function () {
    /*
          if(this.y + this.height / 2 >= ball1.y - 15 &&
            this.y - this.height / 2 <= ball1.y + 15 &&
            this.x + this.width / 2 >= ball1.x - 15 &&
            this.x - this.width / 2 <= ball1.x + 15
          ){
            bricks.splice(index,1);
          }else{
          this.y = y;
          this.x = x;
          }
          */
    this.y = y;
    this.x = x;
  };
}

function ball(x, y, type) {
  this.type = type;
  this.width = 100;
  this.height = 30;
  this.y_move = 5;
  this.x_move = 5;
  this.x = x;
  this.y = y;

  this.update = function () {
    ctx = myGameArea.context;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();
  };
  this.newPos = function () {
    this.y = this.y + this.y_move;
    this.x = this.x + this.x_move;
    if (this.y <= 15) {
      this.y_move = -this.y_move;
    }
    if (this.y > myGameArea.canvas.height - 15) {
      this.y_move = -this.y_move;
      //myGameArea.clear();
      ctx = myGameArea.context;
      setBodoviCount();
      ctx.save();
      ctx.font = "70px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "middle";
      ctx.fillText(
        "GAME OVER",
        myGameArea.canvas.width / 2 - 160,
        myGameArea.canvas.height / 2
      );
      ctx.restore();
      myGameArea.stop();
    }
    if (bricks.length == 0) {
      ctx = myGameArea.context;
      ctx.save();
      ctx.font = "70px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "middle";
      ctx.fillText(
        "WINNER !!!",
        myGameArea.canvas.width / 2 - 160,
        myGameArea.canvas.height / 2
      );
      ctx.restore();
      myGameArea.stop();
    }
    if (this.x < 15 || this.x > myGameArea.canvas.width - 15) {
      this.x_move = -this.x_move;
    }
    if (
      this.y + 15 >= myGamePiece.y - myGamePiece.height / 2 &&
      this.y - 15 <= myGamePiece.y + myGamePiece.height / 2 &&
      this.x >= myGamePiece.x - myGamePiece.width / 2 &&
      this.x <= myGamePiece.x + myGamePiece.width / 2
    ) {
      this.y_move = -this.y_move;
    }
    for (let i = 0; i < bricks.length; i++) {
      let brick = bricks[i];
      if (
        this.x + 15 > brick.x - brick.width / 2 &&
        this.x - 15 < brick.x + brick.width / 2 &&
        this.y + 15 > brick.y - brick.height / 2 &&
        this.y - 15 < brick.y + brick.height / 2
      ) {
        if (
          this.x + 15 > brick.x - brick.width / 2 &&
          this.x - 15 < brick.x + brick.width / 2
        ) {
          this.y_move = -this.y_move;
        } else {
          this.x_move = -this.x_move;
        }
        var crash = new Audio('crash.mp3'); 
        crash.play();
        bricks.splice(i, 1);
        break;
      }
    }
  };
}

function setBodoviCount() {
  if (typeof Storage !== "undefined") {
    let bodovi = 28 - bricks.length;
    sessionStorage.setItem("bodovi", bodovi);
  }
}

function getBodoviCount() {
  if (typeof Storage !== "undefined") {
    let bodovi = sessionStorage.getItem("bodovi");
    return bodovi;
  }
}

function updateGameArea() {
  let bodovi = getBodoviCount();
  if (bodovi == null) {
    bodovi = 0;
  }
  myGameArea.clear();
  ctx = myGameArea.context;
  ctx.save();
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "right";
  ctx.fillText(
    "Bodovi: " + (28 - bricks.length),
    myGameArea.canvas.width - 10,
    30
  );
  ctx.fillText(
    "Najbolji rezultat: " + bodovi,
    myGameArea.canvas.width - 120,
    30
  );
  ctx.fillText("Kontrole: lijeva i desna strelica", 270, 30);
  ctx.restore();
  myGamePiece.newPos();
  myGamePiece.update();
  for (let i = 0; i < bricks.length; i++) {
    bricks[i].newPos();
    bricks[i].update();
  }
  ball1.newPos();
  ball1.update();
}
