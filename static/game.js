var socket = io();
socket.on('message', function(data) {
  console.log(data);
});


var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;

var context = canvas.getContext('2d');

var mouseDownPos = {
  x: new Array(),
  y: new Array(),
  currColor: new Array()
}

var mouseUp = true;
mouseDownPos.currColor.push("rgb(255, 204, 0)");

//listen for OK button being pressed to reset color
setTimeout(function(){
  document.getElementById('Ok').addEventListener("click", function(){
    mouseDownPos.currColor.push(currentColor.style.backgroundColor);
  })
}, 1000 );

//listen and record mouse movements when left button is held down
canvas.addEventListener("mousemove", function(e){
  if (e.which == 1){
    mouseUp = false;
    mouseDownPos.x.push(e.pageX - 15);
    mouseDownPos.y.push(e.pageY - 13);
    mouseDownPos.currColor.push(currentColor.style.backgroundColor);
  }
});

//listen for the mouse to be released

canvas.addEventListener("mouseup", function(){
  mouseUp = true;
  mouseDownPos.x = [];
  mouseDownPos.y = [];
  mouseDownPos.currColor = [];
  socket.emit('mouseUp', mouseUp);
})


socket.emit('new player');

setInterval(function() {
  socket.emit('mouseDownPos', mouseDownPos);
  mouseDownPos.x = [];
  mouseDownPos.y = [];
  mouseDownPos.currColor = [];
}, 1000 / 60);



socket.on('state', function(players) {
  //context.clearRect(0, 0, 800, 600);
  console.log(player);
  context.lineJoin = "round";
  context.lineWidth = 5;
  for (var id in players) {
    var player = players[id];
    //console.log(player.currColor);
    for(var i = 0; i < player.x.length; i++){
      console.log(player);
      context.beginPath();
      if(player.mouseUp == false){
        context.moveTo(player.x[i-1], player.y[i-1]);
      }
      else{
        context.moveTo(player.x[i]-1, player.y[i]);
      }
      context.lineTo(player.x[i], player.y[i]);
      context.closePath();
      context.strokeStyle = player.currColor[i];
      context.stroke();
    }
  }
 });
 
