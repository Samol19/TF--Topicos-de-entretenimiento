import Phaser from "phaser"

import FishPrefab from "../prefabs/Fish";
import JellyfishPrefab from "../prefabs/Jellyfish";
import BootPrefab from "../prefabs/Boot";
import SharkPrefab from "../prefabs/Shark";

class GameScene extends Phaser.Scene{
    constructor(){
        super("GameScene");
    }
    init(){
        this.catchedAudio = this.sound.add('catched_audio')
        this.colectedAudio = this.sound.add('colected_audio')
        this.damageAudio = this.sound.add('damage_audio')
        this.sharkAudio = this.sound.add('shark_audio')

        this.life=3;
        this.isHooked = false;
        this.isDamaged = false;

        this.fishScore=0;
        this.timeTotal=165; //1:30 de tiempo de juego
        this.timerElapsed = 0; //contador de tiempo real

        this.isGameOver=false;
    }
    create(){
        const width = this.scale.width;
        const height = this.scale.height;
        this.isGameOver=false;
        this.life=3;
        // configuracion responsive
        if (width < 768) {  // Condición para dispositivos móviles
            this.scaleFactor = 3; 
        } else {
            this.scaleFactor = 1; // Mantener la escala por defecto para pantallas grandes
        }



        //fondo
        this.background = this.add.image(0,0,'background');
        this.background.setOrigin(0,0);
        this.background.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height); // Ajusta el tamaño de la imagen al tamaño de la pantalla

        // Crear la animación de los peces
        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('fishtexture', { start: 0, end: 2 }), // Número de cuadros del spritesheet
            frameRate: 6, 
            repeat: -1 
        });
        //Jellyfish
        this.anims.create({
            key: 'jellyfish_swim',  // Nombre de la animación
            frames: this.anims.generateFrameNumbers('jellytexture', { start: 0, end: 3 }),  // frames 0 a 3 (los 4 frames)
            frameRate: 6,  
            repeat: -1 
        });
        //daño del pinguino :(
        this.anims.create({
            key: 'hurted',  // Nombre de la animación
            frames: this.anims.generateFrameNumbers('damage_pinguin', { start: 0, end: 1 }),  // frames 0 a 3 (los 4 frames)
            frameRate: 6,  
            repeat: -1  
        });
        

        //establecer arreglod de peces
        this.fishGroup = this.physics.add.group({ allowGravity: false});
        //establecer temporizador de creador de peces
        this.time.addEvent({
            delay: 3000,  // 3 seg 
            callback: this.createFish, 
            callbackScope: this,
            loop: true  //de manera indefinida
        });

        //establecer arreglod de medusas
        this.JellyFishGroup = this.physics.add.group({ allowGravity: false});
        this.time.addEvent({
            delay: 5100,  
            callback: this.createJellyFish, 
            callbackScope: this,
            loop: true  //de manera indefinida
        });

        this.Bootgroup = this.physics.add.group({ allowGravity: false});
        this.time.addEvent({
            delay: 7107,
            callback: this.createBoot, 
            callbackScope: this,
            loop: true  //de manera indefinida
        });     

        this.Sharkgroup = this.physics.add.group({allowGravity:false});
        this.time.addEvent({
            delay: 15000,
            callback: this.startShark, 
            callbackScope: this,
            loop: true  //de manera indefinida
        });     



        //cuerda de pescar
        this.rope = this.add.graphics();
        this.hook = this.physics.add.image(width * 0.58 + 5, 20, 'hook');
        this.hook.setOrigin(0.3,0)
        this.hook.setScale(this.scaleFactor*(width / 1150))
        this.hook.body.allowGravity = false; 

        //HIELO
        this.ice = this.add.tileSprite(0,this.game.config.height*22/100,this.game.config.width,30,'ice');
        this.ice.setOrigin(0,0);
        this.ice.setScale(1.12)
        //jugador (pinguino xd)
        this.player = this.add.sprite(width * 0.482,20,'penguin1');
        this.player.setOrigin(0,0);

        //COLLIDERS
        this.physics.add.overlap(this.hook, this.fishGroup, this.catchFish, null, this);
        this.physics.add.overlap(this.hook, this.JellyFishGroup, this.hurt, null, this);
        this.physics.add.overlap(this.hook, this.Bootgroup, this.hurt, null, this);
        this.physics.add.overlap(this.hook, this.Sharkgroup, this.hurt, null, this);
        this.input.on('pointerdown', (pointer) => {
            if (pointer.y < 100 && this.isHooked) {
                this.hook.setTexture('hook');
                this.hook.setOrigin(0,0);
                this.hook.setSize(this.hook.width, this.hook.height);
                this.colectedAudio.play();
                this.fishScore+=1;
                this.isHooked = false; 
                this.updateScore();
            }
        });

        //text score
        this.fish_score_image= this.add.image(10,10,'fish_score').setOrigin(0,0);
        this.scoreText = this.add.text(150, 10, 'x 0', { font: '36px "Sour Gummy"', fill: '#00000' });
        this.scoreText.setOrigin(0, 0); 

        //life score
        this.life_image= this.add.image(50,60,'life').setOrigin(0,0);
        this.lifeText = this.add.text(110, 70, 'x 3', { font: '36px "Sour Gummy"', fill: '#00000' });
        this.lifeText.setOrigin(0, 0); 

        //text time
        this.timerText = this.add.text(this.game.config.width-100, 10, '1:30', { font: '36px "Sour Gummy"', fill: '#00000' });
        this.timerText.setOrigin(0, 0); 

        
    }
    update(time,delta){
        if (!this.isHooked){
        this.hook.setOrigin(0.37,0)
        }
        if(this.isGameOver){
            return;
        }
        if(this.timeTotal<=0||this.life<=0){
            this.gameOver();
        }
        // actualizar la lista de peces
        this.fishGroup.getChildren().forEach(fish => {
            fish.update(time,delta);
        });
        this.JellyFishGroup.getChildren().forEach(Jellyfish => {
            Jellyfish.update(time,delta);
        });
        this.Bootgroup.getChildren().forEach(Boot => {
            Boot.update(time,delta);
        });
        this.Sharkgroup.getChildren().forEach(shark => {
            if (shark.x>this.game.config.width/8 && shark.x<this.game.config.width-this.game.config.width*5/9&&shark.key !== 'shark2'){
                shark.setTexture('shark2');
            }else if(shark.key !== 'shark1'){
                shark.setTexture('shark1');
            }
            shark.update(time,delta);
        });
        
        //actualizar la cuerda de pescar
        this.drawRope();
        //actualizar el sprite del jugador
        this.updatePenguin();
        //actualizar el contador de tiempo
        this.updateTimer();

    }
    updateScore() {
        this.scoreText.setText('x ' + this.fishScore); // Actualiza el texto con el puntaje actual
    }
    updateLife() {
        this.lifeText.setText('x ' + this.life); // Actualiza el texto con el puntaje actual
    }
    updateTimer() {
     this.timerElapsed += 1 / 160; //calcular tiempopor frames
    
    if (this.timerElapsed >= 1) {
        this.timerElapsed = 0;
        if (this.timeTotal > 0) {
            this.timeTotal -= 1; //restar segundos
        }
    }

    const minutes = Math.floor(this.timeTotal / 60);
    const seconds = Math.floor(this.timeTotal % 60);
    this.timerText.setText(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }

    catchFish(hook,fish){
        if (!this.isHooked){
        
        this.isHooked=true;
        this.hook.setTexture("hook_fish")
        this.hook.setOrigin(0.529,0)

        //ajustar hitbox
        this.hook.setSize(40, 105); 
        this.hook.setOffset(0, 0);  

        this.catchedAudio.play();
        fish.destroy();}
    }

    hurt(hook,Jellyfish){
        this.isHooked=false;
        this.life-=1;
        this.damageAudio.play();
        this.hook.setTexture('hook');
        this.hook.setOrigin(0,0);
        this.hook.setSize(this.hook.width, this.hook.height);
        this.isDamaged=true;
        this.updateLife();
        //mantener estado activo de daño
        this.time.delayedCall(2000, () => {
            this.isDamaged = false;  // Restablecer después de 2 segundos
        }, [], this);
    
    }
    drawRope() {
        this.rope.clear(); // Limpia la cuerda anterior
        this.rope.lineStyle(3, 0x1a1a1a); // Grosor y color de la cuerda
        // Fijar la posición de la cuerda en el jugador
        const startX = this.player.x;
        const startY = this.player.y; 
        const cursorY = this.input.activePointer.y; // Posición vertical del cursor
    
        // dibuja la línea vertical desde el jugador hasta el cursor
        this.rope.beginPath();
        this.rope.moveTo(startX, startY);

        // Disposición de solo dibujar la cuerda si es x debajo del jugador
        if (cursorY > startY && !this.isDamaged){
            this.rope.lineTo(startX, cursorY);
            this.hook.setPosition(this.player.x,cursorY)
        }else{
            this.hook.setPosition(this.player.x,20)
        }

        this.rope.strokePath();
    }

    updatePenguin() {
        const cursorY = this.input.activePointer.y;
        if (this.isDamaged){
            if (!this.player.anims.isPlaying) {
                this.player.anims.play('hurted'); 
            }
        }else {
        if (cursorY > 260){
            this.player.setTexture('penguin2')
        }else{
            this.player.setTexture('penguin1')
        }
    }
    }

    gameOver(){
        
        this.player.anims.stop();
        this.showGameOver();
        if (this.isGameOver) 
        this.time.removeAllEvents(); 
        //this.restart()
    }
    showGameOver(){
        this.isGameOver=true;
        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0x000000, 1);
        this.overlay.setAlpha(0)
        this.overlay.fillRect(
            0, 0,
            this.game.config.width, this.game.config.height);
            let maxScore=0;
            if(localStorage.hasOwnProperty('maxScore')){
                maxScore = localStorage.maxScore;
                if(maxScore < this.fishScore){
                    maxScore = this.fishScore;
                    localStorage.maxScore = maxScore;
                }
            }else{
                localStorage.maxScore = this.fishScore;
                maxScore = this.fishScore;
            }
        this.tweens.add(
            {
                targets: this.overlay,
                alpha: 0.55,
                duration: 500,
                onComplete: () => {
                    //this.background.setVisible(false);
                    //this.water.setVisible(false);
                    let style = { font: '30px Arial', fill: '#fff' };
                    this.add.text(
                        this.game.config.width / 2, this.game.config.height / 2 - 30,
                        'GAME OVER', style
                    ).setOrigin(0.5);
                    style = { font: '20px Arial', fill: '#fff' };
                    this.add.text(
                        this.game.config.width / 2, this.game.config.height / 2 + 50,
                        'High Score: ' + localStorage.maxScore, style
                    ).setOrigin(0.5);
                    this.add.text(
                        this.game.config.width / 2, this.game.config.height / 2 + 80,
                        'Current Score: '+ this.fishScore, style
                    ).setOrigin(0.5);
                    this.add.text(
                        this.game.config.width / 2, this.game.config.height / 2 + 10,
                        'Presiona para volver a jugar', style
                    ).setOrigin(0.5);
                    this.input.once('pointerdown', this.restart, this);
                }

            }

        );
    }

    createFish() {
        const fish = new FishPrefab(this, 'fishtexture');
        fish.anims.play('swim')
        this.fishGroup.add(fish);
    }
    createJellyFish() {
        const Jellyfish = new JellyfishPrefab(this, 'jellytexture');
        Jellyfish.anims.play('jellyfish_swim')
        this.JellyFishGroup.add(Jellyfish);
    }
    createBoot() {
         // Genera una duración aleatoria entre 800 y 1200 milisegundos
        const randomDuration = Phaser.Math.Between(980, 1390);
        // Genera un retraso aleatorio entre 0 y 1 segundo
        const randomDelay = Phaser.Math.Between(0, 1000);

        const Boot = new BootPrefab(this, 'Boot');
        this.Bootgroup.add(Boot);
        this.tweens.add({
            targets: Boot,
            y: Boot.y - 13,
            duration: randomDuration,
            delay:randomDelay, 
            yoyo: true, // Hace que el tween se revierta después de completarse
            repeat: -1, // Repetir indefinidamente
            ease: 'Sine.easeInOut' // suaviza el movimiento
        });
    }

    startShark() {
        // Crear el tiburón en la posición inicial
        this.entranceShark = this.add.image(-50, this.game.config.height - 39, 'entrance_shark');
        this.entranceShark.setScale(1.32);
        this.sharkAudio.play();
    
        // Calcular la distancia total y la duración en función de la velocidad
        const distance = this.sys.game.config.width + 250; // Distancia desde -50 hasta fuera del límite derecho
        const speed = 600; // Velocidad deseada en píxeles por segundo
        const duration = (distance / speed) * 1000; // Convertimos la velocidad en duración
    
        this.tweens.add({
            targets: this.entranceShark,
            x: this.sys.game.config.width + 200,
            duration: duration,  // Duración calculada dinámicamente
            ease: 'Linear',
            onComplete: () => {
                this.entranceShark.destroy();
                const Shark = new SharkPrefab(this);
                this.Sharkgroup.add(Shark);
            }
        });
    }
    

    restart(){
        this.scene.start('StartScene')
    }

}
export default GameScene