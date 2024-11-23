import Phaser from "phaser";

class SharkPrefab extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        //posicion de inicio del pez
        const startX = -550 // Fuera de la pantalla en un lado
        const startY = 274; // Posición aleatoria en Y
        super(scene, startX, startY, 'shark1');

        // Añadimos el pez a la escena
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 2.94;
        
        // dirección inicial (1 = derecha, -1 = izquierda)
        this.direction =1;
        // Definimos los límites de movimiento
        this.leftLimit = -550;
        this.rightLimit = scene.game.config.width+250;  // Ancho de la pantalla
        this.setScale(0.7);
        this.setOrigin(0,0);
        this.setSize(this.width*7/10,this.height*3)
        this.body.setOffset(this.width*1/6, this.height / 6); 
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

export default SharkPrefab;
