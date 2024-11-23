import Phaser from "phaser"

class PreloadScene extends Phaser.Scene{
    constructor(){
        super("PreloadScene");
    }
    preload(){  
        //Fishing game assets
        this.load.image('portada', 'assets/images/portada.png'); 
        this.load.image('background', 'assets/images/bg_image.png'); 
        this.load.image('ice', 'assets/images/ice.png'); 
        this.load.image('hook', 'assets/images/hook.png'); 
        this.load.image('hook_fish', 'assets/images/hook_fish.png'); 
        this.load.image('fish_score','assets/images/fish_score.png')

        //Penguin
        this.load.image('penguin1', 'assets/images/player.png'); 
        this.load.image('penguin2', 'assets/images/player2.png');
        this.load.spritesheet('damage_pinguin', 'assets/images/damagepinguin.png', 

            { frameWidth: 215, frameHeight: 153 });

        //fish
        this.load.spritesheet('fishtexture', 'assets/images/fish_anim.png',{
            frameWidth: 192,   
            frameHeight: 76     
        }); 
        this.load.spritesheet('jellytexture', 'assets/images/jellyfish.png',{
            frameWidth: 117,   
            frameHeight: 145     
        }); 
        this.load.image('Boot','assets/images/boot.png');

        //shark
        this.load.image('entrance_shark','assets/images/entrance_shark.png');
        this.load.image('shark1','assets/images/shark1.png');
        this.load.image('shark2','assets/images/shark2.png');
        this.load.image('life', 'assets/images/life.png');


        //Audio para pez
        this.load.audio('catched_audio',['assets/audio/catched.ogg']) 
        this.load.audio('colected_audio',['assets/audio/colected.ogg']); 
        this.load.audio('damage_audio',['assets/audio/damage.ogg']) ;
        this.load.audio('shark_audio',['assets/audio/shark_sound.ogg']) ;
        this.load.audio('background_music',['assets/audio/cp_bg.ogg']);
    }               
    create(){
        this.scene.start('StartScene');
    }
}
export default PreloadScene