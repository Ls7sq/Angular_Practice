import { NgModule } from "@angular/core";

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import{ MatIconModule }from '@angular/material/icon';
import { FlexLayoutModule } from "@angular/flex-layout";

const MATERIAL = [
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    MatToolbarModule,
];

@NgModule({
    imports: [MATERIAL],
    exports: [MATERIAL]
})

export class MaterialModule{}