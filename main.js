import {Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import {FlyingEnemy , ClimbingEnemy, GroundEnemy} from './enemies.js';
import { UI } from './UI.js';

window.addEventListener('load' ,function(){
     const canvas = this.document.getElementById('canvas1');
     const ctx = canvas.getContext('2d');
     canvas.width = 900;
     canvas.height = 500;

     class Game {
        constructor(width ,height){
            this.width = width;
            this.height = height;
            this.groundMargin = 80;
            this.speed =0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particals =[];
            this.collisions = [];
            this.floatingMessage = [];
            this.maxPartical =50;
            this.enemyTimer =0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore =40;
            this.fontColor = 'black';
            this.time =0;
            this.maxTime = 2000000;
            this.gameOver = false;
            this.lives =5;
            this.player.currentSate = this.player.states[0];
            this.player.currentSate.enter();

        }
        update(deltaTime){
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update()
            this.player.update(this.input.keys ,deltaTime);
              // handlenemies 
              if(this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer =0;
            }
            else{
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach( enemy => {
                enemy.update(deltaTime);
              // if(enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy) ,1) ;
            });
            // handle message
            this.floatingMessage.forEach( message => {
                message.update(deltaTime);
               
            });


            // handle particles 
            this.particals.forEach((partical , index) =>{
                partical.update();
                // if(partical.markedForDeletion) this.particals.splice(index ,1);
            });
            if(this.particals.length > this.maxPartical){
              //  this.particals = this.particals.slice( 0, this.maxPartical);
                this.particals.length =  this.maxPartical;
            }
            // handle collision
            this.collisions.forEach((collision , index) =>{
                collision.update(deltaTime);
                if(collision.markedForDeletion) this.collisions.splice(index ,1);
            });
            this.enemies = this.enemies.filter(enemy =>
            !enemy.markedForDeletion);

            this.particals = this.particals.filter(partical =>
            !partical.markedForDeletion);   

            this.collisions = this.collisions.filter(collision=>
             !collision.markedForDeletion); 

            this.floatingMessage = this.floatingMessage.filter(message =>
            !message.markedForDeletion);
           
           // console.log(this.enemies ,this.particals ,this.collisions ,this.floatingMessage);


        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach( enemy => {
                enemy.draw(context);
            });
            this.particals.forEach( partical => {
                partical.draw(context);
            });
            this.collisions.forEach( collisions => {
             collisions.draw(context);
            });
            this.floatingMessage.forEach( message => {
                message.draw(context);
               
            });
            this.UI.draw(context);
        
        }
        addEnemy(){
            if(this.speed > 0 && Math.random() <0.5 ) this.enemies.push(new GroundEnemy(this));
            else if( this.speed >0) this.enemies.push(new ClimbingEnemy(this));
            this.enemies.push(new FlyingEnemy(this));
            //console.log(this.enemies ,this.particals ,this.collisions ,this.floatingMessage);
        }
     }
     const game = new Game(canvas.width ,canvas.height);
    
     let lastTime =0;

     function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        //console.log(deltaTime);
        lastTime = timeStamp;
       ctx.clearRect(0 ,0 , canvas.width ,canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
       // console.log(deltaTime);
     }
     animate(0);

});