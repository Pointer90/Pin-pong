class Player{
	constructor(x, y, width, height){
		/* Инициализация полей:
			положение по х,
			положение по у,
			положение х по умолчанию,
			положение у по умолчанию,
			счет игрока,
			ширина доски игрока,
			высота доски игрока,
			скорость игрока.
		*/

		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.score = 0;
		this.width = width;
		this.height = height;
		this.speed = 2.5;
	}

	// Возвращение игрока в позицию по умолчанию.
	restart(){
		this.x = this.baseX;
		this.y = this.baseY;
	}

	// Отрисовка игрока.
	draw(){
		let width = this.width / 2,
			height = this.height / 2;

		ctx.beginPath();
		ctx.moveTo(this.x - width, this.y - height);
		ctx.lineTo(this.x + width, this.y - height);
		ctx.lineTo(this.x + width, this.y + height);
		ctx.lineTo(this.x - width, this.y + height);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	isCollision(){
		let topBorder = -300 + this.height / 2 + 15,
			bottomBorder = 300 - this.height / 2 - 15;

		if (this.y > bottomBorder){
			this.y -= this.speed;
			return true;
		}

		if (this.y < topBorder){
			this.y += this.speed;
			return true;
		}
		return false;
	}

	rulesMove(){
		keys.forEach(KeysControlPlayer);
	}
}

class Ball{
	constructor(x, y, radius, angle){
		/* Инициализация полей:
			положение по х,
			положение по у,
			положение х по умолчанию,
			положение у по умолчанию,
			радиус,
			точка удара при колизии,
			скорость мяча,
			угол полета мяча.
		*/

		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.radius = radius;
		this.b = 0;
		this.step = 5;
		this.k = angle;
	}

	// Возвращение мяча в центр поля.
	restart(){

		this.x = this.baseX;
		this.y = this.baseY;
		this.k = getRandomCount();
		this.b = 0;
	}

	// Отрисовка мяча.
	draw(){
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();		
	}

	// Проверка столкновения мяча с данным игроком.
	isCollision(player){
		/* Инициализация контрольных точек мяча:
			левая,
			правая,
			верх,
			низ,
			верх-лево,
			низ-лево,
			низ-право,
			верх-право.

			Инициализация ширины и высоты игрока.
		*/

		let collisionBoxModel = [ {x: this.x - this.radius, y: this.y},
								{x: this.x + this.radius, y: this.y},
								{x: this.x, y: this.y - this.radius},
								{x: this.x, y: this.y + this.radius}, 
								{x: this.x - this.radius / 2, y: this.y - this.radius / 2}, 
								{x: this.x - this.radius / 2, y: this.y + this.radius / 2}, 
								{x: this.x + this.radius / 2, y: this.y + this.radius / 2}, 
								{x: this.x + this.radius / 2, y: this.y - this.radius / 2}],
			width = player.width / 2,
			height = player.height / 2;

		// Проверка столкновения с игроком

		for (let i = 0; i < collisionBoxModel.length; i++){
			if (collisionBoxModel[i].x > player.x - width && 
				collisionBoxModel[i].x < player.x + width && 
				collisionBoxModel[i].y < player.y + height && 
				collisionBoxModel[i].y > player.y - height ) return true;
		}

		return false;
	}

	// Правила поведения мяча при вылете за поле, столкновении с игроком.
	rulesMove(){
		/*let topBorder = -290 + this.y - this.radius,
			bottomBorder = 290 - this.y + this.radius;*/

		if (this.x > -390 && this.x < 390){

			// Если столкнулся с игроком.

			if (this.isCollision(Player1) || this.isCollision(Player2)){
				//this.k *= -1;
				this.k = (-1) * getRandomCount();
				this.step *= -1;
				this.b = this.y - this.k * this.x;
			}

			// Если столкнулся с низом или верхом игрового поля.

			if (this.y < -290 || this.y > 290){
				//this.k *= -1;
				this.k = (-1) * getRandomCount();
				this.b = this.y - this.k * this.x;
			}

			// Конечная формула вычисления положения мяча и шаг смещения.

			this.x += this.step;
			this.y = this.k * this.x + this.b;
		} else {
			gameOver();
		}
	}
}

/* ------ Блок объявления глобальных переменных ------ */
/* Инициализирую:
	холст,
	контекст,
	зацикливаю сцену отрисовки,
	создаю мяч и игроков,
	множество с нажатыми клавишами.
*/

var canvas = document.querySelector("#Ping-pong"),
	ctx    = canvas.getContext("2d"),
	gameLoop   = setInterval(drawScene, 10),
	ball = new Ball(0, 0, 13, getRandomCount()),
	Player2 = new Player(350, 0, 15, 100),
	Player1 = new Player(-350, 0, 15, 100),
	keys = new Set();

/* Устанавливаю:
	смещение центра координат по центру,
	цвет контуров,
	цвет заполнения,
	размер шрифта и шрифт у цифр,
	расположение текста по горизотали.
*/

ctx.translate(400, 300);
ctx.strokeStyle = "black";
ctx.fillStyle = "black";
ctx.font = "60px Arial";
ctx.textAlign = "center";

// Добавление клавиши в список нажатых при нажатии/зажатии.

addEventListener("keydown", function(event){
	keys.add(event.code);
});

// Удаление клавиши из списка нажатых при отпускании клавиши.

addEventListener("keyup", function(event){
	keys.delete(event.code);
});

/*  ------  ------  ------  ------  ------  ------ */

// Функция для отрисовки всех элементов сцены.
function drawScene(){

	// Отчистка сцены.

	ctx.clearRect(-400, -300, 800, 600);

	// Рисую счет.
	ctx.moveTo(10, 10);
	ctx.fillText(Player1.score + "				" + Player2.score, 0, -230);

	// Рисую границы поля.
	ctx.lineWidth = 5;
	ctx.strokeRect(-390, -290, 780, 580);
	ctx.beginPath();
	ctx.moveTo(0, -290);
	ctx.lineTo(0, 290);
	ctx.stroke();
	ctx.lineWidth = 1;

	// методы вычисление положения мяча и игроков.
	ball.rulesMove();
	Player1.rulesMove();
	Player2.rulesMove();

	// Рисую мяч и игроков.
	ball.draw();
	Player1.draw();
	Player2.draw();
}

// Выбор знака для рандомного числа и выдача.
function getRandomCount(){

	if (Math.random() > 0.5) {
		return Math.random();
	}else{
		return (-1) * Math.random();
	}
}

// Клавиши управления игроками.
function KeysControlPlayer(key){

	// Управление для Игрока #1.

	if (!Player1.isCollision()){
		switch (key){
			case "KeyW":
				Player1.y -= Player1.speed;
				break;
			case "KeyS":
				Player1.y += Player1.speed;
				break;				
		}
	}

	// Управление для Игрока #2.

	if (!Player2.isCollision()){
		switch (key){
			case "ArrowUp":
				Player2.y -= Player2.speed;
				break;
			case "ArrowDown":
				Player2.y += Player2.speed;
				break;			
		}
	}
}

// Функция сброса к начальным положениям.
function gameOver(){

	// Начисление очков игроку.

	if (ball.x < 390) Player2.score++;
	if (ball.x > -390) Player1.score++;

	// Возвращение мяча и игроков в начальное положение.

	ball.restart();
	Player1.restart();
	Player2.restart();
	return;
}
