var canvas = document.querySelector('#canvasPractice');
canvas.width = window.innerWidth -1;
canvas.height = window.innerHeight -4;
growRate = .1;
maxRadius = 15;
mouseDown = false;

var a_colorFull = [
	'rgba(0,223,255,.8)',
	'rgba(0,159,255,.8)',
	'rgba(0,120,255,.8)',
	'rgba(0,56,255,.8)',
	'rgba(0,13,107,.8)',
];

var a_color = [
	'0,223,255',
	'0,159,255',
	'0,120,255',
	'0,56,255',
	'0,13,107',
];

var c = canvas.getContext('2d');

function Circle(x, y, dx, dy, radius){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.originalRadius = radius;
	this.maxX = canvas.width - radius;
	this.maxY = canvas.height - radius;
	this.minY = radius;
	this.minX = radius;
	this.curOpacity = .8;
//	this.r = Math.round(Math.random()* 255);
//	this.g = Math.round(Math.random()* 255);
//	this.b = Math.round(Math.random()* 255);
//	this.color =  'rgba('+this.r+','+this.g+','+this.b+',.8)';
	var index = Math.round(Math.random()*(a_color.length - 1));
	this.color = a_color[index];
	this.colorFull = 'rgba('+this.color+','+this.curOpacity+')';
//	console.log(this.color);
//	console.log(index);
	
	this.draw = function(){
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
		c.strokeStyle = this.colorFull;
		c.fillStyle = this.colorFull;
		c.fill();
		c.stroke();
	}

	this.update = function(){
		if(this.x >= this.maxX || this.x <= this.minY){
			this.dx *= -1;
		}

		if(this.y >= this.maxY || this.y <= this.minY){
			this.dy *= -1;
		}
		this.x += this.dx;
		this.y += this.dy;
		this.dy*= .99;
		this.dx*= .99;
		
		var speed = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
		if(speed == 0){
			speed = .0000001;
		}
		var nextOpacity = 1/speed;
		if(nextOpacity < .1){
			nextOpacity = .1;
		}
		
		if(nextOpacity > .9){
			nextOpacity = .9;
		}
		this.curOpacity = nextOpacity;
		this.colorFull = 'rgba('+this.color+','+this.curOpacity+')';
		this.draw();
	}
	
	this.workTowardsOriginalRadius = function(){
		if(this.radius > this.originalRadius){
			this.updateRadius(this.radius - growRate);
		}
	}
	
	this.updateRadius = function(newRadius){
		if(newRadius > maxRadius){
			return;
		}
		
		if(newRadius < this.originalRadius){
			return;
		}
		this.radius = newRadius;
		this.updateMinMax();
	}
	
	this.updateMinMax = function(){
		this.maxX = canvas.width - radius;
		this.maxY = canvas.height - radius;
		this.minY = radius;
		this.minX = radius;
	}
}

function Circles(circleCount,radius){
	this.circleCount = circleCount;
	this.radius = radius;
	this.a_circle = [];
	this.maxX = canvas.width - radius;
	this.maxY = canvas.height - radius;
	this.minY = radius;
	this.minX = radius;
	this.minDistance = this.radius*2;

//	var curX = radius + 20;
//	var curY = radius + 20;
	for(var i = 0; i < circleCount; i++){
		var x = Math.round(Math.random() * (this.maxX - this.minX) + this.minX) + .5;
		var y = Math.round(Math.random() * (this.maxY - this.minY) + this.minY) + .5;
//		curX += radius*2 + 10;
//		if(curX >= innerHeight - 30){
//			curX = radius + 20;
//			curY += radius + 20;
//		}
//		var x = curX;
//		var y = curY;
		var dx = Math.round(Math.random() * 3) + 3.5;
		var dy = Math.round(Math.random() * 3) + 3.5;
		this.a_circle.push(new Circle(x,y,dx,dy,this.radius)) + .5;
	}
	
	this.updateLoop = function(){
		c.clearRect(0,0,canvas.width,canvas.height);
		for(var i in this.a_circle){
			this.a_circle[i].update();
		}
//		this.ballCollision();
		this.ballChangeSize();
//		this.followMouse();
	};
	
	this.ballCollision = function(){
		for(var i = 0; i < this.circleCount; i++){
			for(var j = i; j < this.circleCount; j++){
				if(i === j){
					continue;
				}
				this.manageCollide(i,j);
			}
		}
	};
	
	this.manageCollide = function(i,j){
		var b1x = this.a_circle[i].x;
		var b1y = this.a_circle[i].y;
		var b2x = this.a_circle[j].x;
		var b2y = this.a_circle[j].y;
		var distance = Math.sqrt((b1x-b2x)*(b1x-b2x) + (b1y-b2y)*(b1y-b2y));
		if(Math.abs(distance -  (this.a_circle[i].radius + this.a_circle[j].radius)) - 10 < 0){
//			if(this.movingAwayAlready(i,j)){
//				return;
//			}
			var tempDx = this.a_circle[i].dx;
			var tempDy = this.a_circle[i].dy;
			this.a_circle[i].dx = this.a_circle[j].dx;
			this.a_circle[i].dy = this.a_circle[j].dy;
			this.a_circle[j].dx = tempDx;
			this.a_circle[j].dy = tempDy;
		}
	};
	
	this.movingAwayAlready = function(i,j){
		var b1dx = this.a_circle[i].dx;
		var b1dy = this.a_circle[i].dy;
		var b2dx = this.a_circle[j].dx;
		var b2dy = this.a_circle[j].dy;
		if(b1dx*b2dx < 0 || b1dy*b2dy < 0){
			return true;
		}else{
			return false;
		}
	}
	
	this.ballChangeSize = function(){
		if(mouse.x <= 0 || mouse.x >= canvas.width || mouse.y <= 0 || mouse.y >= canvas.height){
			return;
		}
		
		for(i in this.a_circle){
			var x = this.a_circle[i].x;
			var y = this.a_circle[i].y;
			var distance = Math.sqrt((x-mouse.x)*(x-mouse.x) + (y-mouse.y)*(y-mouse.y));
			if(300 >= distance){
				var x = this.a_circle[i].x;
				var y = this.a_circle[i].y;
				if(!mouseDown){
					this.a_circle[i].dx -= (mouse.x - x) * .001;
					this.a_circle[i].dy -= (mouse.y - y) * .001;
					var newRadius = this.a_circle[i].radius - growRate;
				}else{
					this.a_circle[i].dx += (mouse.x - x) * .001;
					this.a_circle[i].dy += (mouse.y - y) * .001;
					var newRadius = this.a_circle[i].radius + growRate;
				}
				this.a_circle[i].updateRadius(newRadius);
			}else{
				this.a_circle[i].workTowardsOriginalRadius();
			}
		}
	}
	
	this.followMouse = function(){
		console.log(mouse);
		for(i in this.a_circle){
			var x = this.a_circle[i].x;
			var y = this.a_circle[i].y;
			if(mouseDown){
				this.a_circle[i].dx -= (mouse.x - x) * .005;
				this.a_circle[i].dy -= (mouse.y - y) * .005;
			}else{
				this.a_circle[i].dx += (mouse.x - x) * .001;
				this.a_circle[i].dy += (mouse.y - y) * .001;
			}
		}
	}
}

var mouse = {
	x: null,
	y: null
}

window.addEventListener('mousemove',function(event){
	mouse.x = event.x;
	mouse.y = event.y;
});


window.addEventListener('mousedown',function(event){
	mouseDown = true;
});

window.addEventListener('mouseup',function(event){
	mouseDown = false;
}); 

var MyCircleGroup = new Circles(1000,10);

animateLoop();
function animateLoop(highResTimestamp) {
  requestAnimationFrame(animateLoop);
  MyCircleGroup.updateLoop();
}
