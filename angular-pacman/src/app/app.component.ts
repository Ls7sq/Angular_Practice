import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

export enum KEY_CODE{
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  DOWN_ARROW = 40,
  UP_ARROW = 38,
}

class Ghost{
  className:string='';
  startIndex:number=0;
  speed:number = 0;
  currentIndex:number=0;
  previousIndex:number=0;
  isScared:boolean=false;
  timerId:any;

  constructor(className:string, startIndex:number,speed:number){
    this.className=className;
    this.startIndex=startIndex;
    this.speed=speed;
    this.currentIndex=startIndex;
    this.previousIndex=startIndex;
    this.timerId=null;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-pacman';
  width:number=28;
  scoreValue:number=0;

  // map layout legend
  // 0 - pac dot
  // 1 - wall
  // 2 - ghost lair
  // 3 - power pallet
  // 4 - empty
  layout = [
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
      1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
      1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
      1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
      1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
      1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
      1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
      4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
      1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
      1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
      1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
      1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
      1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
      1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
      1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
      1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
      1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
      1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
      1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
      1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
      1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ]
    squres:any = [];
    pacmanCurrenIndex= 489;
    ghosts = [
      new Ghost('blinky',348,400),
      new Ghost('pinky',348,400),
      new Ghost('inky',348,400),
      new Ghost('clyde',348,400),
    ]
    
    @ViewChild('grid') grid:ElementRef = {} as ElementRef;
    @ViewChild('score') score:ElementRef = {} as ElementRef;
    @ViewChild('result') result:ElementRef = {} as ElementRef;

    constructor(private renderer: Renderer2, private elem:ElementRef){

    }

    //generate pac-man board
    createBoard(){
      for (let i = 0; i < this.layout.length; i++) {
        const square = this.renderer.createElement('div');
        this.renderer.appendChild(this.grid?.nativeElement, square);
        this.squres.push(square);

        if(this.layout[i] === 0){
          this.renderer.addClass(this.squres[i],'pac-dot')
        }else if(this.layout[i] === 1){
          this.renderer.addClass(this.squres[i],'wall')
        }else if(this.layout[i] === 2){
          this.renderer.addClass(this.squres[i],'ghost-lair')
        }else if(this.layout[i] === 3){
          this.renderer.addClass(this.squres[i],'power-pellet')
        }
      }
    }

    ngOnInit(){

    }

    initGhosts(){
      this.ghosts.forEach(ghost=>{
        this.squres[ghost.currentIndex].classList.add('ghost');
        this.squres[ghost.currentIndex].classList.add(ghost.className);
        this.moveGhost(ghost)
      })
    }

    moveGhost(ghost:Ghost){
      var widthX = this.width;
      var squaresY = this.squres;
      var scoreValX = this.scoreValue;
      var pacmanCurrentX = this.pacmanCurrenIndex;
      var checkForGameOverX = this.checkForGameOver;

      ghost.timerId = setInterval(function(){
        const directions = [-1, 1, widthX, -widthX];
        let direction = directions[Math.floor(Math.random()*directions.length)];
        console.log(direction);
          if(!squaresY[ghost.currentIndex + direction].classList.contains('ghost') &&
           !squaresY[ghost.currentIndex + direction].classList.contains('wall'))
           {
             squaresY[ghost.currentIndex].classList.remove(ghost.className);
             squaresY[ghost.currentIndex].classList.remove('ghost','scared-ghost');
             ghost.currentIndex += direction;
             ghost.previousIndex = ghost.currentIndex;
             squaresY[ghost.currentIndex].classList.add(ghost.className,'ghost');
           }else{
            direction = directions[Math.floor(Math.random()*directions.length)];
           }
           if(ghost.isScared){
            squaresY[ghost.currentIndex].classList.add('scared-ghost');
           }
           if(ghost.isScared && squaresY[ghost.currentIndex].classList.contains('pac-man')){
            squaresY[ghost.currentIndex].classList.remove(ghost.className,'ghost','scared-ghost');
            squaresY[ghost.currentIndex].classList.remove(ghost.className,'scared-ghost');
            ghost.currentIndex = ghost.startIndex;
            squaresY[ghost.currentIndex].classList.add(ghost.className,'ghost');
           }
           checkForGameOverX(squaresY,pacmanCurrentX);
      }, ghost.speed)
    }

    checkForGameOver(squaresX:any, pacmanCurrentIndexX:any){
      if(squaresX[pacmanCurrentIndexX].classList.contains('ghost')&&
        !squaresX[pacmanCurrentIndexX].calssList.contains('sacred-ghost')){
          this.ghosts.forEach(ghost=>clearInterval(ghost.timerId));
          this.KeyUpEvent = function():void{};
          this.result.nativeElement.innerHTML="You Lose hahahaha!";
        }
    }

    checkForWin(){
      if(this.scoreValue === 274){
        this.ghosts.forEach(ghost=> clearInterval(ghost.timerId));
        this.KeyUpEvent = function():void{};
        this.result.nativeElement.innerHTML="You have Won !";
    }
  }

    ngAfterViewInit(){
      this.createBoard();
      this.renderer.addClass(this.squres[this.pacmanCurrenIndex],'pac-man');
      this.initGhosts();
    }

    pacDotEaten(){
      if(this.squres[this.pacmanCurrenIndex].classList.contains('pac-dot')){
        this.scoreValue++;
        this.score.nativeElement.innerHTML = this.scoreValue;
        this.squres[this.pacmanCurrenIndex].classList.remove('pac-dot')
      }
    }

    
    powerPelletEaten(){
      if(this.squres[this.pacmanCurrenIndex].classList.contains('power-pellet')){
        this.scoreValue+=10;
        this.score.nativeElement.innerHTML = this.scoreValue;
        this.ghosts.forEach(ghost=>{
          ghost.isScared=true;
          this.squres[ghost.currentIndex].classList.add(ghost.className,'ghost','scared-ghost');
        });
        setTimeout(()=>{
          this.ghosts.forEach(ghost=>{
            ghost.isScared=false;
            this.squres[ghost.currentIndex].classList.remove(ghost.className,'ghost','scared-ghost');
            ghost.currentIndex = ghost.startIndex;
            this.squres[ghost.currentIndex].classList.add(ghost.className,'ghost')
          });
        },8000)
        this.squres[this.pacmanCurrenIndex].classList.remove('power-pellet')
      }
    }

    @HostListener('document:keyup',['$event'])
    KeyUpEvent(event:KeyboardEvent){
      this.renderer.removeClass(this.squres[this.pacmanCurrenIndex],'pac-man');
      if(event.keyCode == KEY_CODE.RIGHT_ARROW){
        if(this.pacmanCurrenIndex - this.width >=0 &&
          !this.squres[this.pacmanCurrenIndex + 1].classList.contains('wall') &&
          !this.squres[this.pacmanCurrenIndex + 1].classList.contains('ghost-lair')
          ){
            this.pacmanCurrenIndex += 1;
            if(this.squres[this.pacmanCurrenIndex + 1] === this.squres[392]){
              this.pacmanCurrenIndex = 364;
            }
          }
      }
      if(event.keyCode == KEY_CODE.LEFT_ARROW){
        if(this.pacmanCurrenIndex % this.width !=0 &&
          !this.squres[this.pacmanCurrenIndex - 1].classList.contains('wall') &&
          !this.squres[this.pacmanCurrenIndex - 1].classList.contains('ghost-lair')
          ){
            this.pacmanCurrenIndex -= 1;
            if(this.squres[this.pacmanCurrenIndex - 1] === this.squres[363]){
              this.pacmanCurrenIndex = 391;
            }
          }
      }
      if(event.keyCode == KEY_CODE.DOWN_ARROW){    
        if(this.pacmanCurrenIndex + this.width < this.width * this.width &&
          !this.squres[this.pacmanCurrenIndex + this.width].classList.contains('wall') &&
          !this.squres[this.pacmanCurrenIndex + this.width].classList.contains('ghost-lair')
          ){
            this.pacmanCurrenIndex += this.width;
          }
      }
      if(event.keyCode == KEY_CODE.UP_ARROW){
        if(this.pacmanCurrenIndex - this.width >= 0  &&
          !this.squres[this.pacmanCurrenIndex - this.width].classList.contains('wall') &&
          !this.squres[this.pacmanCurrenIndex - this.width].classList.contains('ghost-lair')
          ){
            this.pacmanCurrenIndex -= this.width;
          }
      }

      this.renderer.addClass(this.squres[this.pacmanCurrenIndex],'pac-man');
      this.pacDotEaten();
      this.powerPelletEaten();
      this.checkForGameOver(this.squres,this.pacmanCurrenIndex);
      this.checkForWin();
    }
}
