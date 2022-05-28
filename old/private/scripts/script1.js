let canvas1 = document.getElementById("canvas1");
let canvas2 = document.getElementById("canvas2");
let canvas3 = document.getElementById("canvas3");

drawGuy();
drawBike();
drawHouse();

function drawGuy()
{
    let ctx = canvas1.getContext("2d");

    ctx.fillStyle = "#90CAD7";
    ctx.strokeStyle = "#22545F"
    ctx.lineWidth = 2;

    // head
    ctx.moveTo(30, 150);
    ctx.bezierCurveTo(30, 60, 170, 60, 170, 150);
    ctx.bezierCurveTo(170, 235, 30, 235, 30, 150);
    ctx.stroke();
    ctx.fill();

    // eye
    ctx.beginPath();
    ctx.ellipse(60, 125, 12, 7, 0, 0, Math.PI * 2.0);
    ctx.stroke();

    // eye
    ctx.beginPath();
    ctx.ellipse(120, 125, 12, 7, 0, Math.PI, 0);
    ctx.ellipse(120, 125, 12, 7, Math.PI, Math.PI, 0);
    ctx.stroke();

    // pupil
    ctx.fillStyle = "#22545F";
    ctx.beginPath();
    ctx.ellipse(57, 125, 7, 3, Math.PI / 2.0, 0, Math.PI * 2.0);
    ctx.fill();

    // pupil
    ctx.beginPath();
    ctx.ellipse(117, 125, 7, 3, Math.PI / 2.0, 0, Math.PI * 2.0);
    ctx.fill();

    // nose
    ctx.beginPath();
    ctx.moveTo(90, 130);
    ctx.lineTo(70, 165);
    ctx.lineTo(90, 165);
    ctx.stroke();

    // mouth
    ctx.beginPath();
    ctx.ellipse(85, 185, 30, 10, 0.2,0, Math.PI * 2.0);
    ctx.stroke();

    // hat
    ctx.strokeStyle = "#000000"
    ctx.fillStyle = "#396693";
    ctx.beginPath()
    ctx.moveTo(20, 80);
    ctx.bezierCurveTo(10, 110, 190, 110, 175, 80);
    ctx.bezierCurveTo(180, 60, 20, 60, 20, 80);
    ctx.moveTo(60, 15);
    ctx.bezierCurveTo(60, 0, 130, 0, 130, 15);
    ctx.bezierCurveTo(130, 30, 60, 30, 60, 15);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath()
    ctx.moveTo(60, 15);
    ctx.lineTo(60, 70);
    ctx.bezierCurveTo(60, 90, 130, 90, 130, 70);
    ctx.lineTo(130, 15);
    ctx.bezierCurveTo(130, 30, 60, 30, 60, 15);
    ctx.fill();
    ctx.stroke();
}

function drawBike()
{
    let ctx = canvas2.getContext("2d");

    ctx.fillStyle = "#90CAD7";
    ctx.strokeStyle = "#22545F"
    ctx.lineWidth = 1.5;

    //wheels
    ctx.beginPath();
    ctx.arc(70, 120, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(250, 120, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // frame
    ctx.moveTo(70, 120);
    ctx.lineTo(117, 60);
    ctx.lineTo(240, 60);
    ctx.lineTo(160, 120);
    ctx.closePath();
    ctx.moveTo(85, 40);
    ctx.lineTo(120, 40);
    ctx.moveTo(102, 40)
    ctx.lineTo(160, 120);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(160, 120, 15, 0, Math.PI * 2.0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(140, 103);
    ctx.lineTo(148, 111);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(172, 130);
    ctx.lineTo(180, 137);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(250, 120);
    ctx.lineTo(240, 30);
    ctx.lineTo(200, 40);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(240, 30);
    ctx.lineTo(265, 6);
    ctx.stroke();
}

function drawHouse()
{
    let ctx = canvas3.getContext("2d");

    ctx.fillStyle = "#975b5b";
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 1.5;

    // external
    ctx.moveTo(20, 135);
    ctx.lineTo(280, 135);
    ctx.lineTo(280, 300);
    ctx.lineTo(20, 300);
    ctx.closePath();
    ctx.lineTo(150, 10);
    ctx.lineTo(280,135);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // windows
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.fillRect(30, 150, 50, 30);
    ctx.fillRect(82, 150, 50, 30);
    ctx.fillRect(220, 150, 50, 30);
    ctx.fillRect(168, 150, 50, 30);
    ctx.fillRect(30, 182, 50, 30);
    ctx.fillRect(82, 182, 50, 30);
    ctx.fillRect(220, 182, 50, 30);
    ctx.fillRect(168, 182, 50, 30);
    ctx.fillRect(220, 220, 50, 30);
    ctx.fillRect(168, 220, 50, 30);
    ctx.fillRect(220, 252, 50, 30);
    ctx.fillRect(168, 252, 50, 30);

    // door
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(50, 240);
    ctx.ellipse(80, 240, 30, 20, 0, Math.PI, 0);
    ctx.lineTo(110, 300);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(80, 300);
    ctx.lineTo(80, 220);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(73, 275, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(87, 275, 3, 0, Math.PI * 2);
    ctx.stroke();

    // chimney
    ctx.fillStyle = "#975b5b";
    ctx.beginPath();
    ctx.moveTo(210, 100);
    ctx.lineTo(210, 50);
    ctx.bezierCurveTo(210, 45, 230, 45, 230, 50);
    ctx.lineTo(230, 100);
    ctx.fill();
    ctx.stroke();
    ctx.moveTo(210, 50);
    ctx.bezierCurveTo(210, 55, 230, 55, 230, 50);
    ctx.stroke();
}