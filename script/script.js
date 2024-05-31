const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const size = 30;
const audio = new Audio('../assets/eating.mp3');

let direction, loopId;
let score = 0;

const snake = [
	{ x: 0, y: 0 },
];

const randomNumber = (min, max) => {
	return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
	const number = randomNumber(0, canvas.width - size);
	return Math.round(number / 30) * 30;
};

const randomColor = () => {
	const red = randomNumber(0, 255);
	const green = randomNumber(0, 255);
	const blue = randomNumber(0, 255);

	return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
	x: randomPosition(),
	y: randomPosition(),
	color: randomColor(),
};

const drawSnake = () => {
	ctx.fillStyle = '#ddd';

	snake.forEach((position, index) => {
		if (index === snake.length - 1) {
			ctx.fillStyle = '#fff';
		}
		ctx.fillRect(position.x, position.y, size, size);
	});
};

const drawFood = () => {
	const { x, y, color } = food;

	ctx.shadowColor = color;
	ctx.shadowBlur = 6;
	ctx.fillStyle = color;
	ctx.fillRect(x, y, size, size);
	ctx.shadowBlur = 0;
};

const drawGrid = () => {
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#181818';

	for (let i = 30; i < canvas.width; i += 30) {
		ctx.beginPath();
		ctx.lineTo(i, 0);
		ctx.lineTo(i, 600);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineTo(0, i);
		ctx.lineTo(600, i);
		ctx.stroke();
	}
};

const moveSnake = () => {
	if (!direction) return;

	const head = snake[snake.length - 1];

	if (direction == 'up') {
		snake.push({ x: head.x, y: head.y - size });
	}

	if (direction == 'down') {
		snake.push({ x: head.x, y: head.y + size });
	}

	if (direction == 'right') {
		snake.push({ x: head.x + size, y: head.y });
	}

	if (direction == 'left') {
		snake.push({ x: head.x - size, y: head.y });
	}

	// const collision = snake.some((segment) => segment.x === head.x && segment.y === head.y);

	snake.push();
	snake.shift();

	// if (!collision) {
	// } else {
	// 	clearInterval(gameInterval);
	// 	alert('Game Over!');
	// }
};

const checkEat = () => {
	const head = snake[snake.length - 1];

	if (head.x == food.x && head.y == food.y) {
		audio.play();

		score += 10;
		snake.push(head);

		document.querySelector('#score').innerText = `Score: ${score}`;

		let x = randomPosition();
		let y = randomPosition();

		while (snake.find((position) => position.x == x && position.y == y)) {
			x = randomPosition();
			y = randomPosition();
		}

		food.x = x;
		food.y = y;
		food.color = randomColor();
	}
};

const updateGame = () => {
	clearTimeout(loopId);

	ctx.clearRect(0, 0, 600, 600);
	drawGrid();
	drawFood();
	moveSnake();
	drawSnake();
	checkEat();

	loopId = setTimeout(() => {
		updateGame();
	}, 300);
};

updateGame();

document.addEventListener('keydown', ({ key }) => {
	const movements = {
		w: () => (direction !== 'down' ? (direction = 'up') : direction),
		s: () => (direction !== 'up' ? (direction = 'down') : direction),
		d: () => (direction !== 'left' ? (direction = 'right') : direction),
		a: () => (direction !== 'right' ? (direction = 'left') : direction),
	};

	const movementFunction = movements[key];
	if (movementFunction) {
		movementFunction();
	}
});
