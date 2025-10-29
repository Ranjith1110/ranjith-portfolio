import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const baseSpeed = 300; // starting speed
let currentSpeed = baseSpeed;

const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan");
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = baseSpeed + 50;
    this.target;
    this.points = 0;
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinMusic;
    this.bgMusic;
    this.emitter;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
    this.load.image("money", "/assets/money.png");
    this.load.audio("coin", "/assets/coin.mp3");
    this.load.audio("bgMusic", "/assets/bgMusic.mp3");
  }

  create() {
    this.scene.pause("scene-game");

    this.coinMusic = this.sound.add("coin");
    this.bgMusic = this.sound.add("bgMusic", { loop: true, volume: 0.4 });
    this.bgMusic.play();

    // Background
    this.add.image(0, 0, "bg").setOrigin(0, 0);

    // Player basket
    this.player = this.physics.add
      .image(sizes.width / 2 - 40, sizes.height - 100, "basket")
      .setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player
      .setSize(this.player.width - this.player.width / 4, this.player.height / 6)
      .setOffset(
        this.player.width / 10,
        this.player.height - this.player.height / 10
      );

    // Apple
    this.target = this.physics.add.image(this.getRandomX(), 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, currentSpeed);

    // Collision
    this.physics.add.overlap(this.target, this.player, this.targetHit, null, this);

    // Controls
    this.cursor = this.input.keyboard.createCursorKeys();

    // UI Text
    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    });
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });

    // Timer
    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);

    // Particle emitter
    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: baseSpeed - 200,
      scale: 0.04,
      duration: 100,
      emitting: false,
    });
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  }

  update() {
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime)}`);

    // If apple hits ground, reset & speed up
    if (this.target.y >= sizes.height) {
      this.resetApple();
    }

    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * (sizes.width - 40));
  }

  targetHit() {
    this.coinMusic.play();
    this.emitter.start();

    this.points++;
    this.textScore.setText(`Score: ${this.points}`);

    // Increase speed when apple is caught
    currentSpeed += 15; // Adjust this number for more or less acceleration
    this.physics.world.gravity.y = currentSpeed;

    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.target.setMaxVelocity(0, currentSpeed);
  }

  resetApple() {
    // Missed apple also speeds up
    currentSpeed += 10;
    this.physics.world.gravity.y = currentSpeed;

    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.target.setMaxVelocity(0, currentSpeed);
  }

  gameOver() {
    this.sys.game.destroy(true);

    gameEndScoreSpan.textContent = this.points;
    gameWinLoseSpan.textContent =
      this.points >= 10 ? "Win! 😊" : "Lose! 😭";

    gameEndDiv.style.display = "flex";
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: baseSpeed },
      debug: false,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
});
