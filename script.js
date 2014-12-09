$(document).ready(function () {
//    define variables
    var canvas = document.getElementById("canvas");
    var ctx =  canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var cw = 15; // cell width
    var food; // food, small square
    var score; // current score
    var speed = 70; //milliseconds
    var cellColor = "green";
    var d; // direction

    var option1;
    var option2;
    var option3;

    var resultsArr = [
        {
            hi: 'あ',
            ro: 'a'
        },
        {
            hi: 'お',
            ro: 'o'
        },
        {
            hi: 'え',
            ro: 'e'
        },
        {
            hi: 'う',
            ro: 'u'
        },
        {
            hi: 'い',
            ro: 'i'
        },
        {
            hi: 'か',
            ro: 'ka'
        },
        {
            hi: 'け',
            ro: 'ke'
        },
        {
            hi: 'く',
            ro: 'ku'
        },
        {
            hi: 'こ',
            ro: 'ko'
        },
        {
            hi: 'き',
            ro: 'ki'
        }
    ];

    var noisyArr = [
        'sa', 'a', 'u', 'o', 'i', 'e', 'ka', 'ki', 'ke', 'ko', 'ku', 'shi'
    ];

    var order;

//    Snake Array
    var snake_array = [];

//    Initializer
//    This function call other sub-functions
    function init() {
        create_snake();
        create_food();
        score = 0;
        order = 0;
        option1 = resultsArr[0].ro;
        option2 = noisyArr[noisyArr.indexOf(resultsArr[order].ro) - 1];
        option3 = noisyArr[noisyArr.indexOf(resultsArr[order].ro) + 1];

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
        food = [
            {
                x:150,
                y:225
            },
            {
                x:300,
                y:360
            },
            {
                x:450,
                y:60
            }
        ]
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
            return;
        }

        if(option1 == resultsArr[order].ro){
            if(ny == food[0].y/cw && nx == food[0].x/cw) {
                var tail = {x: nx, y: ny};
                getRightElement(nx, ny);
            } else if (ny == food[1].y/cw && nx == food[1].x/cw) {
                return;
            } else if (ny == food[2].y/cw && nx == food[2].x/cw) {
                return;
            } else {
                var tail = snake_array.pop();
                tail.x = nx;
                tail.y = ny
            }
        } else if (option2 == resultsArr[order].ro){
            if(ny == food[1].y/cw && nx == food[1].x/cw) {
                var tail = {x: nx, y: ny};
                getRightElement(nx, ny);
            } else if (ny == food[0].y/cw && nx == food[0].x/cw) {
                return;
            } else if (ny == food[2].y/cw && nx == food[2].x/cw) {
                return;
            } else {
                var tail = snake_array.pop();
                tail.x = nx;
                tail.y = ny
            }
        } else if (option3 == resultsArr[order].ro){
            if(ny == food[2].y/cw && nx == food[2].x/cw) {
                var tail = {x: nx, y: ny};
                getRightElement(nx, ny);
            } else if (ny == food[1].y/cw && nx == food[1].x/cw) {
                return;
            } else if (ny == food[2].y/cw && nx == food[2].x/cw) {
                return;
            } else {
                var tail = snake_array.pop();
                tail.x = nx;
                tail.y = ny
            }
        }

        snake_array.unshift(tail);

        // paint snake
        for(var i = 0; i < snake_array.length; i++){
            var c = snake_array[i];
            paint_cell(c.x, c.y);
        }

        paint_food(order);

        // check Score
        checkScore(score);

        // Display Current Score
        $("#score").html( 'Your Score: ' + score);
    }

    function getRightElement(nx, ny) {
        score++;
        if (order < resultsArr.length - 1){
            order++;
        } else {
            order--;
        }

        tmp_arr = [
            resultsArr[order].ro,
            noisyArr[noisyArr.indexOf(resultsArr[order].ro) - 1],
            noisyArr[noisyArr.indexOf(resultsArr[order].ro) + 1]
        ];
        console.log(tmp_arr);
        do {
            var option1_order = Math.floor(Math.random()*tmp_arr.length);
            option1 = tmp_arr[option1_order];
            tmp_arr.splice(option1_order, 1);
            option2 = tmp_arr[0];
            option3 = tmp_arr[1];
        } while (option1 != resultsArr[order].ro && option2 != resultsArr[order].ro && option3 != resultsArr[order].ro)
    }

    function paint_cell(x, y){
        ctx.fillStyle=cellColor;
        ctx.fillRect(x*cw, y*cw, cw, cw);
        ctx.strokeStyle="white";
        ctx.strokeRect(x*cw, y*cw, cw, cw);
    }

    function paint_food(order){
        ctx.font = "18pt Arial";
        ctx.fillStyle=cellColor;
        $("#food_word").html(resultsArr[order].hi);

        ctx.fillText(option1, food[0].x, food[0].y + cw, cw);
        ctx.fillText(option2, food[1].x, food[1].y + cw, cw);
        ctx.fillText(option3, food[2].x, food[2].y + cw, cw);
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

function resetScore(){
    localStorage.setItem('highScore', 0);
    $("#high_score").html('High Score: ' + 0);
}