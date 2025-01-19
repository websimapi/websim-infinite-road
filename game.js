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
    this.verticalSpeed = 0;
    this.gravity = 0.5;
    this.isGrounded = true;
    this.jumpForce = 12;
    this.mouseSensitivity = 0.002;
    this.yaw = 0;
    this.pitch = 0;
    
    this.keys = {
      w: false,
      s: false,
      a: false,
      d: false,
      ' ': false
    };

    this.createStars();
    this.setupEventListeners();
    this.createRoadSegments();
    this.lockPointer();
    this.gameLoop();
  }

  lockPointer() {
    document.addEventListener('click', () => {
      document.body.requestPointerLock();
    });
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
    this.road.innerHTML = '';
    this.roadSegments = [];

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
    const curve = Math.sin(z * 0.01) * 50;
    const planetCurve = Math.pow(z * 0.01, 2) * 0.5;
    
    segment.style.transform = `
      translateZ(${-z}px)
      translateY(${planetCurve}px)
      translateX(${curve}px)
      rotateX(${85 + (z * 0.02)}deg)
    `;
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (this.keys.hasOwnProperty(e.key.toLowerCase())) {
        this.keys[e.key.toLowerCase()] = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (this.keys.hasOwnProperty(e.key.toLowerCase())) {
        this.keys[e.key.toLowerCase()] = false;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === document.body) {
        this.yaw -= e.movementX * this.mouseSensitivity;
        this.pitch = Math.max(-Math.PI/3, Math.min(Math.PI/3, 
          this.pitch - e.movementY * this.mouseSensitivity));
      }
    });
  }

  update() {
    // Handle jumping and gravity
    if (this.keys[' '] && this.isGrounded) {
      this.verticalSpeed = this.jumpForce;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.verticalSpeed -= this.gravity;
      this.cameraHeight += this.verticalSpeed;

      if (this.cameraHeight <= 50) {
        this.cameraHeight = 50;
        this.verticalSpeed = 0;
        this.isGrounded = true;
      }
    }

    // Handle movement
    let forward = 0;
    let strafe = 0;

    if (this.keys.w) forward += 1;
    if (this.keys.s) forward -= 1;
    if (this.keys.a) strafe -= 1;
    if (this.keys.d) strafe += 1;

    const moveAngle = Math.atan2(strafe, forward) + this.yaw;
    const moveIntensity = Math.min(1, Math.sqrt(forward * forward + strafe * strafe));

    if (moveIntensity > 0) {
      this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    } else {
      this.speed = Math.max(0, this.speed - this.deceleration);
    }

    const velocityX = Math.sin(moveAngle) * this.speed * moveIntensity;
    const velocityZ = Math.cos(moveAngle) * this.speed * moveIntensity;

    this.position += velocityZ;
    this.planetRotation += velocityZ * 0.02;

    // Update camera
    this.camera.style.transform = `
      translateX(${-50 + velocityX * 10}%)
      translateY(${-this.cameraHeight}px)
      translateZ(50px)
      rotateX(${(this.pitch * 180) / Math.PI}deg)
      rotateY(${(this.yaw * 180) / Math.PI}deg)
    `;

    // Update road
    this.road.style.transform = `
      translateZ(${-this.position}px)
      rotateY(${(-this.yaw * 180) / Math.PI}deg)
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