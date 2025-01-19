class Game {
  constructor() {
    this.camera = document.getElementById('camera');
    this.road = document.getElementById('road');
    this.position = 0;
    this.speed = 0;
    this.maxSpeed = 8;
    this.acceleration = 0.2;
    this.deceleration = 0.1;
    this.planetRotation = 0;
    this.roadSegments = [];
    this.segmentLength = 200;
    this.visibleSegments = 20;
    this.cameraHeight = 50;
    this.cameraAngle = 0;
    
    this.keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false
    };

    this.createStars();
    this.setupEventListeners();
    this.createRoadSegments();
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

  createRoadSegments() {
    // Clear existing segments
    this.road.innerHTML = '';
    this.roadSegments = [];

    // Create new segments
    for (let i = 0; i < this.visibleSegments; i++) {
      const segment = document.createElement('div');
      segment.className = 'road-segment';
      this.road.appendChild(segment);
      this.roadSegments.push(segment);
      this.updateSegmentPosition(segment, i);
    }
  }

  updateSegmentPosition(segment, index) {
    const z = index * this.segmentLength;
    const curve = Math.sin(z * 0.01) * 50; // Add slight curve to the road
    const planetCurve = Math.pow(z * 0.01, 2) * 0.5; // Add planetary curvature
    
    segment.style.transform = `
      translateZ(${-z}px)
      translateY(${planetCurve}px)
      translateX(${curve}px)
      rotateX(${85 + (z * 0.02)}deg)
    `;
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

    // Update position and camera
    this.position += this.speed;
    this.planetRotation += this.speed * 0.02;

    // Update camera angle based on speed
    const targetAngle = this.speed * 2;
    this.cameraAngle += (targetAngle - this.cameraAngle) * 0.1;

    // Apply camera transformation
    this.camera.style.transform = `
      translateX(-50%)
      translateZ(50px)
      rotateX(${-this.cameraAngle}deg)
    `;

    // Update road position and rotation
    this.road.style.transform = `
      translateZ(${-this.position}px)
      rotateX(${this.cameraAngle}deg)
    `;

    // Update planet rotation
    document.getElementById('planet').style.transform = 
      `translateX(-50%) rotateX(${this.planetRotation}deg)`;

    // Update road segments
    const segmentOffset = Math.floor(this.position / this.segmentLength) % this.visibleSegments;
    this.roadSegments.forEach((segment, i) => {
      const adjustedIndex = (i + segmentOffset) % this.visibleSegments;
      this.updateSegmentPosition(segment, adjustedIndex);
    });
  }

  gameLoop() {
    this.update();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize the game
new Game();