//globals
var scaling = 30;

var snake;
var goal;
var score = 0;
var scoreElement = document.getElementById('score');

function setup() {
    createCanvas(600, 600);
    noStroke();

    // initialize objects
    reset();
}

function draw() {

    let scaleFactor = width / scaling;
    // set origin to center
    translate(width / 2, height / 2);
    // scale canvas
    scale(scaleFactor, -scaleFactor);
    frameRate(8);

    // clear screen
    clear();
    // set background to gray
    background(0,0,16);

    // update objects
    snake.update();
    goal.update();
}

// resets the snake and goal
function reset() {
    // make background red
    goal = new Goal();
    snake = new Snake(new Position(0, 0), 1, goal);
    score = 0;
    updateScore();
}

function updateScore() {
    scoreElement.innerText = score;
}

function keyPressed() {
    // change snake direction on key press
    switch (keyCode) {
        case LEFT_ARROW:
            snake.direction = Direction.LEFT;
            break;
        case RIGHT_ARROW:
            snake.direction = Direction.RIGHT;
            break;
        case UP_ARROW:
            snake.direction = Direction.UP;
            break;
        case DOWN_ARROW:
            snake.direction = Direction.DOWN;
            break;
        default:
            break;
    }
}

class Snake {

    constructor(start, length, goal) {
        // set initial direction
        this.direction = Direction.RIGHT;
        // initialize segments array
        this.bodySegmentPositions = [];
        // add first segment
        this.bodySegmentPositions.push(start);
        // add more segments to snake
        this.setupSnakeSegments(length);
        // assign goal
        this.goal = goal;
    }

    setupSnakeSegments(length) {
        // add starting segments depending on length
        for (let i = 1; i < length; i++) {
            this.grow();
        }
    }

    grow() {
        // get last segment
        const tail = this.bodySegmentPositions[this.bodySegmentPositions.length - 1];
        // new segments should be added in the opposite direction of the movement
        let growDirection = this.direction.clone().invert();
        // segment in opposite move direction of last segment
        const newSegmentPosition = tail.clone().addDirection(growDirection);
        // add segment
        this.bodySegmentPositions.push(newSegmentPosition);
    }

    move() {
        if(this.bodySegmentPositions.length > 1) {
            // remove last segment
            this.bodySegmentPositions.pop();
        }
        // get first segment
        const head = this.bodySegmentPositions[0];
        // add segment to head in direction of the movement
        const newSegmentPosition = head.clone().addDirection(this.direction)
        this.bodySegmentPositions.unshift(newSegmentPosition);
    }

    checkGoal(goal) {
        // check if head has same position as goal
        const head = this.bodySegmentPositions[0];
        if (head.equals(goal.position)) {
            goal.spawn();
            this.grow();
            score++;
            updateScore();
        }
    }

    checkCollision() {
        const head = this.bodySegmentPositions[0];
        // check if outside of canvas
        if (!head.isInBounds(scaling / 2 * -1, scaling / 2)) {
            return true;
        }
        // check if at least tow body segments have the same position (collision with snake)
        for (let i = 1; i < this.bodySegmentPositions.length; i++) {
            if (head.equals(this.bodySegmentPositions[i])) {
                return true;
            }
        }
        // no collision
        return false;
    }

    update() {
        // set color
        fill(255);
        // draw snake segments
        for (const bodySegment of this.bodySegmentPositions) {
            square(bodySegment.x, bodySegment.y, 1);
        }
        // move snake
        this.move();
        // check if head touches goal
        this.checkGoal(this.goal);
        // check collision with snake or border
        if (this.checkCollision()) {
            // turn background red on collision
            background(255, 0, 0);
            // reset game
            reset();
        }
    }

}

class Goal {

    constructor() {
        // set initial position
        this.position = new Position(-2, -2);
    }

    // change position of goal to random position
    spawn() {
        this.position.x = Math.floor(random(scaling / 2 * -1, scaling / 2));
        this.position.y = Math.floor(random(scaling / 2 * -1, scaling / 2));
    }

    // draw Goal
    update() {
        // set color
        fill(298, 65, 100);
        // draw square
        square(this.position.x, this.position.y, 1);
    }

}

class Direction {

    static get RIGHT() {
        return new Direction(1, 0);
    }
    static get LEFT() {
        return new Direction(-1, 0);
    }
    static get UP() {
        return new Direction(0, 1);
    }
    static get DOWN() {
        return new Direction(0, -1);
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    invert() {
        this.x *= -1;
        this.y *= -1;
        return this;
    }

    clone() {
        return new Direction(this.x, this.y);
    }

}

class Position {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    addDirection(direction) {
        this.x += direction.x;
        this.y += direction.y;
        return this;
    }

    clone() {
        return new Position(this.x, this.y);
    }

    equals(position) {
        return this.x === position.x && this.y === position.y;
    }

    isInBounds(min, max) {
        return !(this.x > max || this.x < min || this.y > max || this.x < min);
    }

}