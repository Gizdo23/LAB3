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
    window.innerWidth * 0.5,
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
  stop: function () {  //funkcija za prekid igre
    clearInterval(this.interval);
  },
  clear: function () {  //funkcija čišćenja objekta, koristi se za brisanje starog stanja
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};
function player(width, height, color, x, y, type) {  //funkcija za palicu iliti igrača
  this.type = type;
  this.width = width;
  this.height = height;
  this.speed_x = 0;
  this.speed_y = 0;
  this.x = x;
  this.y = y;
  this.update = function () {  //definira izgled, boju i rub
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
  document.addEventListener("keydown", (event) => {  //sluša pritiske na lijevu i desnu strelicu, služi za pomicanje
    if (event.key == "ArrowLeft") {
      this.speed_x = -8;
      this.speed_y = 0;
    } else if (event.key == "ArrowRight") {
      this.speed_x = 8;
      this.speed_y = 0;
    }
  });
  document.addEventListener("keyup", (event) => {  //sluša kada nema pritisnute strelice, palica tada stoji
    this.speed_x = 0;
  });
  this.newPos = function () {  //izračunava novu poziciju palice
    this.x += this.speed_x;
    this.y -= this.speed_y;
  };
}

function brick(x, y, type) {  //cigla
  this.type = type;
  this.width = 100;
  this.height = 30;
  this.x = x;
  this.y = y;
  this.update = function () {  //izgled cigle, boja i rub
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
  this.newPos = function () {  //nova pozicija cigle, uvijek ista
    this.y = y;
    this.x = x;
  };
}

function ball(x, y, type) {  //loptica
  this.type = type;
  this.width = 100;
  this.height = 30;
  this.y_move = 8;  //brzine kretanja loptice, po x
  this.x_move = 8;  //brzina kretanja loptice po y
  this.x = x;
  this.y = y;
  var random = Math.random() * (160 - (-160)) + (-160);  //računa se početni slučajni kut, da loptica ide prema gore
  var angl1 = Math.cos(random * (Math.PI / 180));
  var angl2 = Math.sin(random * (Math.PI / 180));
  this.x_move = this.x_move * angl1;
  this.y_move = this.y_move * angl2;
  this.y_move = -Math.abs(this.y_move);


  this.update = function () {  //izgled loptice, veličina
    ctx = myGameArea.context;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();
  };
  this.newPos = function () {  //računanje poicije loptice, u ovoj funkciji se i obrađuju sudari
    this.y = this.y + this.y_move;
    this.x = this.x + this.x_move;
    if (this.y <= 15) {
      this.y_move = -this.y_move;
    }
    if (this.y > myGameArea.canvas.height - 15) {  //ako loptica dotakne donji rub igrice ugra je završena
      this.y_move = -this.y_move;
      //myGameArea.clear();
      ctx = myGameArea.context;
      let maksbod = getBodoviCount();
      let trenbod = 28 - bricks.length;
      if(trenbod > maksbod){
        setBodoviCount();
      }
      ctx.save();
      ctx.font = "70px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "middle";
      ctx.fillText(  //ispisuje se poruka game over na sredini ekrana
        "GAME OVER",
        myGameArea.canvas.width / 2 - 160,
        myGameArea.canvas.height / 2
      );
      ctx.restore();
      myGameArea.stop();
    }
    if (bricks.length == 0) {  //ako su unište sve cigle, igrač pobjeđuje te se ispisuje "winner" na sredini ekrana
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
    if (this.x < 15 || this.x > myGameArea.canvas.width - 15) {  //računa se dali se loptica sudarila sa rubom ekrana
      this.x_move = -this.x_move;
    }
    if (  //računa se dali se loptica sudarila sa palicom
      this.y + 15 >= myGamePiece.y - myGamePiece.height / 2 &&
      this.y - 15 <= myGamePiece.y + myGamePiece.height / 2 &&
      this.x >= myGamePiece.x - myGamePiece.width / 2 &&
      this.x <= myGamePiece.x + myGamePiece.width / 2
    ) {
      this.y_move = -this.y_move;
    }
    for (let i = 0; i < bricks.length; i++) {  //računa se dali je loptica udarila ciglu, ako ju je udarila cigla se briše i čuje se zvuk
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
        var crash = new Audio('crash.mp3');   //zvuk
        crash.play();
        bricks.splice(i, 1);  //nestajanje cigle
        break;
      }
    }
  };
}

function setBodoviCount() {  //funkcija koja postavlja broj osvojenih bodova u local storage
  if (typeof Storage !== "undefined") {
    let bodovi = 28 - bricks.length;
    localStorage.setItem("bodovi", bodovi);
  }
}

function getBodoviCount() {  //fukcnija koja dohvaća bodove iz local storage
  if (typeof Storage !== "undefined") {
    let bodovi = localStorage.getItem("bodovi");
    return bodovi;
  }
}

function updateGameArea() {  //funkcija za ažuriranje područja igre, poziva funkcije ostalih elemenata
  let bodovi = getBodoviCount();
  if (bodovi == null) {
    bodovi = 0;
  }
  myGameArea.clear();
  ctx = myGameArea.context;
  ctx.save();
  ctx.font = "20px Arial";  //tekst u desnom rubu koji prikazuje trenutne bodove
  ctx.fillStyle = "black";
  ctx.textAlign = "right";
  ctx.fillText(
    "Bodovi: " + (28 - bricks.length),
    myGameArea.canvas.width - 10,
    30
  );
  ctx.fillText(  //prikazuje maksimalan broj bodova
    "Najbolji rezultat: " + bodovi,
    myGameArea.canvas.width - 120,
    30
  );
  ctx.fillText("Kontrole: lijeva i desna strelica", 270, 30);  //prikazuje upute za igranje
  ctx.restore();
  myGamePiece.newPos();  //pozivaju se update i newPos za sve elemente
  myGamePiece.update();
  for (let i = 0; i < bricks.length; i++) {
    bricks[i].newPos();
    bricks[i].update();
  }
  ball1.newPos();
  ball1.update();
}
