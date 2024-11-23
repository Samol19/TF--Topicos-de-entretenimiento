import Phaser from "phaser";

class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    init(){
        this.backsoundplay = this.sound.get('background_music');

        // Si la música existe y no se está reproduciendo, iníciala
        if (!this.backsoundplay) {
            this.backsoundplay = this.sound.add('background_music', { loop: true });
            this.backsoundplay.play();
        } else if (!this.backsoundplay.isPlaying) {
            // Si la música está cargada pero no está sonando, la reproduce
            this.backsoundplay.play();
        }
    }
    create() {
        this.add.image(0, 0, 'portada')
        .setOrigin(0, 0)
        .setDisplaySize(this.game.config.width, this.game.config.height);


   
        let titleText = this.add.text(this.cameras.main.centerX, 70, "Trabajo Final(gaaa)", {
            fontSize: '52px',
            fill: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 6    
        }).setOrigin(0.5);

        let studentText = this.add.text(this.cameras.main.centerX, 130, "Topicos de Software de Entretenimiento", {
            fontSize: '34px',
            fill: '#ffffff',
            stroke: '#000000',     
            strokeThickness: 6     
        }).setOrigin(0.5);

        let studentName = this.add.text(this.cameras.main.centerX, 185, "Alumno: Fernando Samuel Paredes Espinoza", {
            fontSize: '28px',
            fill: '#ffffff',
            stroke: '#000000',     
            strokeThickness: 6    
        }).setOrigin(0.5);

        let clickText = this.add.text(this.cameras.main.centerX, 320, "Haz clic para comenzar", {
            fontSize: '28px',
            fill: '#ffffff',
            stroke: '#000000',     
            strokeThickness: 6     
        }).setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

export default StartScene;
