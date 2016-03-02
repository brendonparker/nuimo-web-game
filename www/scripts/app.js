// Matter.js module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events;

// create a Matter.js engine
var engine = Engine.create(document.getElementById('game'), {
    world: {
        gravity: {
            x: 0,
            y: 0
        }
    }
});

engine.render.wireframes = true;
engine.render.options.showVelocity = true;
engine.render.showCollisions = true;
engine.render.showAngleIndicator = true;

//var player1 = Bodies.rectangle(400, 200, 80, 80);
var player1 = Bodies.trapezoid(500, 200, 50, 70, .91);
player1.frictionAir = .03;

var target = Bodies.circle(200, 200, 20);
var score = 0;
target.frictionAir = .03;

// Add the walls
var offset = 5;
World.add(engine.world, [
    Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
    Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true })
]);

// add all of the bodies to the world
World.add(engine.world, [player1, target]);

// run the engine
Engine.run(engine);

function moveTarget(){
    var x = Math.random() * 700 + 50;
    var y = Math.random() * 500 + 50;
    Matter.Body.set(target, { position: { x: x, y: y } });
}

function updateScore(){
    score++;
    document.getElementById('score').innerHTML = score.toString();
}

Events.on(engine, 'collisionActive', function(event){
    var pair = event.pairs[0];
    var idA = pair.bodyA.id;
    var idB = pair.bodyB.id; 
    if((idA == target.id || idB == target.id) && 
       (idA == player1.id || idB == player1.id))
    {
        moveTarget();
        updateScore();
    }
});

function rotate(val){
    var dir = val / 5;
    Matter.Body.rotate(player1, 0.02 * dir);
}

function accelerate(){
    var frc = 0.008;
    var x = Math.sin(Math.PI - player1.angle) * frc;
    var y = Math.cos(Math.PI - player1.angle) * frc;
    Matter.Body.applyForce(player1, player1.position, { x: x, y: y });
}

document.addEventListener('keypress', function(e){
    switch(e.keyCode){
        case 100: // right
            rotate(30);
            break;
        case 97: // left
            rotate(-30);
            break;
        case 119: // go
            accelerate();
            break;
        default:
            break;
    }
});

var socket = io();
var tAcc;
socket.on('rotate', rotate);
socket.on('buttondown', function(){
    tAcc = setInterval(accelerate, 100);   
});
socket.on('buttonup', function(){
    clearInterval(tAcc);   
});