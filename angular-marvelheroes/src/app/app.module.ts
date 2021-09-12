import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MaterialModule } from './material-module';
import { CharacterComponent } from './components/character.component';
import { HeroListComponent } from './components/hero-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MarvelService } from './services/marvel.service';

@NgModule({
  declarations: [
    AppComponent,
    CharacterComponent,
    HeroListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    {provide:'publicKey', useValue:'5c0f6192dc91341993ef0bcb56d56079'},
    {provide:'privateKey', useValue:'eb9081a1decb25804a9e6c65c71340f69a3a54fa'},
    MarvelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
