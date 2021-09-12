import { Component, OnInit } from '@angular/core';
import { MarvelService, Character } from '../services/marvel.service';
import { ActivatedRoute, Router
 } from '@angular/router';
@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit {
  character?:Character;
  
  constructor(private activateRoute: ActivatedRoute, 
              private router: Router, 
              private marvelSvc: MarvelService) { 
              }

  ngOnInit(): void {
    this.marvelSvc.getCharacter(this.activateRoute.snapshot.params.id)
      .then(result=>{
        this.character = result;
      })
  }

  back(){
    this.router.navigate(['/']);
  }

}
