
const BLACK = '#000000';
const line_color = '#FFFFFF';
const line_width = 15;

var current_x = 0;
var current_y = 0;
var prev_x = 0;
var prev_y = 0;

var canvas;
var context;

var drawing_imported=true

console.log(drawing_imported);


function prepareCanvas() {

    // console.log('Preparing Canvas');
    canvas = document.getElementById('my-canvas');
    context = canvas.getContext('2d');

    context.fillStyle = BLACK;
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.strokeStyle = line_color;
    context.lineWidth = line_width;
    context.lineJoin = 'round';

    var ispainting = false;

    document.addEventListener('mousedown', function (event) {

        // console.log('CLICK'); //this gets added to the console everytime we click. basically mouse down. when mousedown the function gets executed.
        // console.log('Mouse Pressed');
        ispainting = true;
        current_x = event.clientX - canvas.offsetLeft;
        current_y = event.clientY - canvas.offsetTop;

    });

    document.addEventListener('mousemove', function (event) {

        if (ispainting) {

            prev_x = current_x;
            current_x = event.clientX - canvas.offsetLeft;

            prev_y = current_y;
            current_y = event.clientY - canvas.offsetTop;

            draw();
        };

    });

    document.addEventListener('mouseup', function (event) {

        // console.log('Mouse released');
        ispainting = false;

    });

    canvas.addEventListener('mouseleave', function (event) {

        ispainting = false;

    });

    canvas.addEventListener('touchstart', function (event) {

        current_x = event.touches[0].clientX - canvas.offsetLeft;
        current_y = event.touches[0].clientY - canvas.offsetTop;

        ispainting = true;


    });

    canvas.addEventListener('touchmove', function (event) {

        if (ispainting) {

            prev_x = current_x;
            current_x = event.touches[0].clientX - canvas.offsetLeft;

            prev_y = current_y;
            current_y = event.touches[0].clientY - canvas.offsetTop;

            draw();

        };


    });

    canvas.addEventListener('touchcancel', function (event) {

        ispainting = false
    });

    canvas.addEventListener('touchend', function (event) {

        ispainting = false


    });
};

function draw() {
    context.beginPath();
    context.moveTo(prev_x, prev_y);
    context.lineTo(current_x, current_y);
    context.closePath();
    context.stroke();
};

function clearCanvas() {

    current_x = 0;
    current_y = 0;
    prev_x = 0;
    prev_y = 0;

    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

};