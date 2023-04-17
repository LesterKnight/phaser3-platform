import Bomb from './Bomb.js'
import Player from './Player.js'
import Star from './Star.js'

export default class Game extends Phaser.Scene
{
    constructor ()
    {
        super({key: 'GameScene'})
    }
      
    create ()
    {
        //const canvasWidth = this.sys.canvas.width
        //const canvasHeight = this.sys.canvas.height
        const bg = this.add.image(0, 0, 'forest')
        .setOrigin(0,0)
        
        const platforms = this.physics.add.staticGroup()
        platforms.create(0,184,'chao')
        .setOrigin(0,0)
        .refreshBody()//entire ground

        platforms.create(400 - 30 - 30, 240 - 56 - 34 ,'platform')
        .setOrigin(0,0)
        .refreshBody()

        platforms.create(400 - 30, 240 - 56 - 34 - 34 ,'platform')
        .setOrigin(0,0)
        .refreshBody()

        this.player = new Player(this)
        this.stars = new Star(this)
        this.bombs = new Bomb(this)

        this.physics.add.collider(this.player.sprite, platforms)
        this.keys = this.input.keyboard.createCursorKeys()
        //this.score = 0
        //this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })
        this.physics.add.collider(this.stars.group, platforms)
        //this.physics.add.collider(this.stars, this.player.sprite)//WORKS//método abaixo binda o escopo this da função
        this.physics.add.overlap(this.player.sprite, this.stars.group, this.stars.collectStar.bind(this.stars), null, this)

        //this.physics.add.collider(this.bombs.group, platforms)
        this.physics.add.overlap(this.player.sprite, this.bombs.group, this.bombs.hitBomb, null, this, );
        //this.physics.world.setBoundsCollision(true, true, true, true); // permitir colisões fora da tela
        //this.physics.overlapCirc(this.player.sprite.x, this.player.sprite.y, this.player.sprite.width * 0.55, this.bombs.hitBomb, null, this);


        
    }

    update(){
        const playerSpr = this.player.sprite
        if(!this.gameOver){
            this.bombs.group.children.iterate(function (child) {
                if (child.body.position.x < child.body.prev.x) 
                    child.setFlip(true,false)//.setAlpha(Phaser.Math.FloatBetween(0,1))
                else
                    child.setFlip(false,false)
            })
    
    
            if(this.keys.left.isDown){
                playerSpr.setVelocityX(-160)
                playerSpr.anims.play('left',true)
                playerSpr.setFlip(true,false)
            }
            else if(this.keys.right.isDown){
                playerSpr.setVelocityX(160)
                playerSpr.anims.play('right',true)
                playerSpr.setFlip(false,false)
            }
            else{
                playerSpr.setVelocityX(0)
                if(playerSpr.body.touching.down){
                    playerSpr.anims.play('st')
                }
                    
            }
    
            if(this.keys.up.isDown && playerSpr.body.touching.down){
                playerSpr.setVelocityY(-100)
                playerSpr.anims.play('jump',true)
            }
        }else if(this.keys.up.isDown){
            this.scene.restart()
            this.gameOver = false
        }
        
    }
}