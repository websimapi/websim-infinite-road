class Game {
  constructor() {
    this.player = document.getElementById('player');
    this.road = document.getElementById('road');
    this.position = 0;
    this.speed = 0;
    this.maxSpeed = 5;
    this.acceleration = 0.1;
    this.deceleration = 0.05;
    this.planetRotation = 0;
    
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    };

    this.createStars();
    this.setupEventListeners();
    this.gameLoop();
  }

  createStars() {
    const stars = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    stars.classList.add('stars');
    stars.setAttribute('viewBox', '0 0 1000 1000');
    
    for (let i = 0; i < 200; i++) {
      const star = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      star.setAttribute('cx', Math.random() * 1000);
      star.setAttribute('cy', Math.random() * 1000);
      star.setAttribute('r', Math.random() * 2);
      star.setAttribute('fill', '#fff');
      stars.appendChild(star);
    }
    
    document.body.appendChild(stars);
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.key)) {
        this.keys[e.key] = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.key)) {
        this.keys[e.key] = false;
      }
    });
  }

  update() {
    // Handle forward/backward movement
    if (this.keys.ArrowUp) {
      this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    } else if (this.keys.ArrowDown) {
      this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed/2);
    } else {
      if (Math.abs(this.speed) < this.deceleration) {
        this.speed = 0;
      } else {
        this.speed -= Math.sign(this.speed) * this.deceleration;
      }
    }

    // Handle left/right movement
    if (this.keys.ArrowLeft) {
      const currentLeft = parseFloat(this.player.style.left || 50);
      if (currentLeft > 20) {
        this.player.style.left = `${currentLeft - 1}%`;
      }
    }
    if (this.keys.ArrowRight) {
      const currentLeft = parseFloat(this.player.style.left || 50);
      if (currentLeft < 80) {
        this.player.style.left = `${currentLeft + 1}%`;
      }
    }

    // Update position and apply movement
    this.position += this.speed;
    this.planetRotation += this.speed * 0.01;
    
    this.road.style.transform = `translateZ(${-this.position}px)`;
    document.getElementById('planet').style.transform = 
      `translateX(-50%) rotateX(${this.planetRotation}deg)`;
  }

  gameLoop() {
    this.update();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize the game
new Game();