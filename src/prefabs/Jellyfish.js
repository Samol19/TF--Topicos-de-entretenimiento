import Phaser from "phaser";

class JellyfishPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, texture) {
        //posicion de inicio del pez
        const startX = Phaser.Math.Between(0, 1) === 0 ? -50 : scene.game.config.width + 50; // Fuera de la pantalla en un lado
        const startY = Phaser.Math.Between(210, scene.game.config.height - 20); // Posición aleatoria en Y
        super(scene, startX, startY, texture);

        // Añadimos el pez a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 1.9;
        
        // dirección inicial (1 = derecha, -1 = izquierda)
        this.direction = startX < 0 ? 1 : -1;
        if (startX>0){
            this.setFlipX(true);
        }
        // Definimos los límites de movimiento
        this.leftLimit = -50;
        this.rightLimit = scene.game.config.width+50;  // Ancho de la pantalla
        this.setSize(90,110)
        this.setScale(0.8);
    }

    // Método de actualización que se llama en cada frame
    update() {
        this.x += this.speed * this.direction;

        // si el pez sale por los limites se elimina
        if (this.x < this.leftLimit || this.x > this.rightLimit) {
            this.destroy(); 
        }
    }
}

export default JellyfishPrefab;
