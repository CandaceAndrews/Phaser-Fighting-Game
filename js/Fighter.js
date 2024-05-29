// Fighter.js
class Fighter {
    constructor(scene, x, y, flip, data, spriteKey, animationSteps) {
        this.scene = scene;
        this.size = data[0];
        this.imageScale = data[1];
        this.offset = data[2];
        this.flip = flip;
        this.animationSteps = animationSteps;

        // Create the sprite and set its properties
        this.sprite = this.scene.physics.add.sprite(x, y, spriteKey);
        this.sprite.setScale(this.imageScale);
        this.sprite.setFlipX(flip);

        // Set the size of the body for physics
        this.sprite.body.setSize(this.size[0], this.size[1]);
        this.sprite.body.setOffset(this.offset[0], this.offset[1]);

        this.createAnimations(spriteKey);

        this.action = 0; // 0: idle, 1: attack1, 2: run, 3: jump, 4: attack2
        this.frameIndex = 0;
        this.updateTime = this.scene.time.now;
        this.velY = 0;
        this.running = false;
        this.jump = false;
        this.attacking = false;
        this.attackType = 0;
        this.health = 100;
    }

    createAnimations(spriteKey) {
        const actions = ['idle', 'attack1', 'run', 'jump', 'attack2'];

        actions.forEach((action, i) => {
            this.scene.anims.create({
                key: `${spriteKey}_${action}`,
                frames: this.scene.anims.generateFrameNumbers(spriteKey, { start: i * this.animationSteps[i], end: (i + 1) * this.animationSteps[i] - 1 }),
                frameRate: 10,
                repeat: -1
            });
        });
    }

    move(keys, target) {
        const SPEED = 10;
        const GRAVITY = 2;
        let dx = 0;
        let dy = 0;
        this.running = false;
        this.attackType = 0;

        // can only perform other actions if not currently attacking
        if (!this.attacking) {
            // movement
            if (keys.A.isDown) {
                dx = -SPEED;
                this.running = true;
            }
            if (keys.D.isDown) {
                dx = SPEED;
                this.running = true;
            }
            // jump
            if (keys.W.isDown && !this.jump) {
                this.velY = -30;
                this.jump = true;
            }
            // attack
            if (keys.R.isDown || keys.T.isDown) {
                this.attack(target);
                // determine which attack type was used
                if (keys.R.isDown) {
                    this.attackType = 1;
                }
                if (keys.T.isDown) {
                    this.attackType = 2;
                }
            }
        }

        // apply gravity
        this.velY += GRAVITY;
        dy += this.velY;

        // ensure player stays on screen
        if (this.sprite.x + dx < 0) {
            dx = -this.sprite.x;
        }
        if (this.sprite.x + dx > this.scene.sys.canvas.width) {
            dx = this.scene.sys.canvas.width - this.sprite.x;
        }
        if (this.sprite.y + dy > this.scene.sys.canvas.height - 110) {
            this.velY = 0;
            this.jump = false;
            dy = this.scene.sys.canvas.height - 110 - this.sprite.y;
        }

        // ensure players face each other
        if (target.sprite.x > this.sprite.x) {
            this.flip = false;
        } else {
            this.flip = true;
        }

        this.sprite.setFlipX(this.flip);
        this.sprite.setVelocity(dx, dy);
    }

    update() {
        // check what action the player is performing
        if (this.attacking) {
            if (this.attackType === 1) {
                this.updateAction(1); // 1: attack_1
            } else if (this.attackType === 2) {
                this.updateAction(4); // 4: attack_2
            }
        } else if (this.jump) {
            this.updateAction(3); // 3: jump
        } else if (this.running) {
            this.updateAction(2); // 2: run
        } else {
            this.updateAction(0); // 0: idle
        }

        const animationCooldown = 230;

        if (this.scene.time.now - this.updateTime > animationCooldown) {
            this.frameIndex += 1;
            this.updateTime = this.scene.time.now;
        }

        if (this.frameIndex >= this.animationSteps[this.action]) {
            this.frameIndex = 0;
            if (this.action === 1 || this.action === 4) {
                this.attacking = false;
            }
        }
    }

    attack(target) {
        this.attacking = true;
        const attackingRect = new Phaser.Geom.Rectangle(
            this.sprite.x - (3 * this.sprite.width * this.flip), this.sprite.y, 3 * this.sprite.width, this.sprite.height
        );
        if (Phaser.Geom.Rectangle.Overlaps(attackingRect, target.sprite.getBounds())) {
            target.health -= 10;
        }

        // Debug draw
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, 0x00ff00, 1);
        graphics.strokeRectShape(attackingRect);
        graphics.setDepth(1);

        this.scene.time.delayedCall(50, () => {
            graphics.clear();
        });
    }

    updateAction(newAction) {
        if (newAction !== this.action) {
            this.action = newAction;
            this.frameIndex = 0;
            this.updateTime = this.scene.time.now;
            this.sprite.anims.play(`${this.sprite.texture.key}_${['idle', 'attack1', 'run', 'jump', 'attack2'][newAction]}`);
        }
    }

    draw() {
        // Drawing is handled by Phaser
    }
}
