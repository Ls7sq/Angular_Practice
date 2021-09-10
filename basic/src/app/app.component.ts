import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "shiqi luo";
  numberOfPpl = 10;
  fruits = ['Apple', 'Pear', 'Orange'];
  isDisabled = true;

  pressButton(){
    console.log("Press!");
      this.isDisabled = false;
  }

  pressButton2Disable(){
    this.isDisabled = true;
  }

  sizeChanged($event:any){
    console.log("sized changed listening ..")
  }
}
