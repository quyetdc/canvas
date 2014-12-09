$(document).ready(function () {
//    define variables
    var canvas = document.getElementById("canvas");
    var ctx =  canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var cw = 15; // cell width
    var food; // food, small square
    var score; // current score
    var speed = 80; //milliseconds
    var cellColor = "green";
    var d; // direction

//    Snake Array
    var snake_array;

//    Initializer
//    This function call other sub-functions
    function init() {
        create_snake();
        create_food();
        score = 0;
        d = "right";

        if (typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, speed);
    }

    init(); // Run initializer

    // Create snake
    function create_snake(){
        var length = 5; // default length
        snake_array = [];
        for(var i = length-1; i >= 0; i--){
            snake_array.push({x: i, y: 0});
        }
    }

    // Create Food
    function create_food(){
        food = {
            x:Math.round(Math.random()*(w-cw)/cw),
            y:Math.round(Math.random()*(h-cw)/cw)
        }
    }

    // Paint Snake
    function paint() {
        // Paint the canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "white";
        ctx.strokeRect(0, 0, w, h);

        // current position
        var nx = snake_array[0].x;
        var ny = snake_array[0].y;

        if(d=='right') nx++;
        else if(d=='left') nx--;
        else if(d=='up') ny--;
        else if(d=='down') ny++;

        //Collide code
        if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array)){
//            init();
            // insert final score
            $("#final_score").html(score);
            $("#overlay").fadeIn(200);
            return;
        }

        if(nx == food.x && ny == food.y){
            var tail = {x: nx, y: ny};
            score++;
            // Create new Food
            create_food();
        } else {
            var tail = snake_array.pop();
            tail.x = nx;
            tail.y = ny
        }

        snake_array.unshift(tail);

        // paint snake
        for(var i = 0; i < snake_array.length; i++){
            var c = snake_array[i];
            paint_cell(c.x, c.y);
        }

        // pain food
        paint_cell(food.x, food.y);

        // check Score
        checkScore(score);

        // Display Current Score
        $("#score").html( 'Your Score: ' + score);
    }

    function paint_cell(x, y){
        ctx.fillStyle=cellColor;
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle="white";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    function check_collision(x, y, array){
        for(var i = 0; i < array; i ++){
            if(array[i].x === x && array[i].y === y){
                return true;
            }
        }

        return false;
    }

    function checkScore(score){
        if(localStorage.getItem('highScore') === null){
            localStorage.setItem('highScore', score);
        } else {
            if(score > localStorage.getItem('highScore')){
                localStorage.setItem('highScore', score);
            }
        }

        $('#high_score').html('High Score: ' + localStorage.highScore);
    }

    // Keyboard Controller
    $(document).keydown(function (e) {
        var key = e.which;
        if(key == '37' && d != 'right') d =  'left'; // left key
        else if(key == '38' && d != 'down') d = 'up';
        else if(key == '39' && d != 'left') d = 'right';
        else if(key == '40' && d != 'up') d = 'down';
    });
});

function resetScore() {
    localStorage.setItem('highScore', 0);
    $('#high_score').html('High Score: ' + 0);
}