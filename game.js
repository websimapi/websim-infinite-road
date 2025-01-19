class Game {
  constructor() {
    this.player = document.getElementById('player');
    this.road = document.getElementById('road');
    this.position = 0;
    this.speed = 0;
    this.maxSpeed = 5;
    this.acceleration = 0.1;
    this.deceleration = 0.05;
    
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    };

    this.setupEventListeners();
    this.gameLoop();
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
      this.player.style.left = `${parseFloat(this.player.style.left || 50) - 1}%`;
    }
    if (this.keys.ArrowRight) {
      this.player.style.left = `${parseFloat(this.player.style.left || 50) + 1}%`;
    }

    // Update position and apply movement
    this.position += this.speed;
    this.road.style.transform = `translateZ(${-this.position}px)`;
  }

  gameLoop() {
    this.update();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize the game
new Game();