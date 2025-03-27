import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApdLearnRoutingModule } from './apd-learn-routing.module';
import { ApdLearnComponent } from './apd-learn.component';


@NgModule({
  declarations: [
    ApdLearnComponent
  ],
  imports: [
    CommonModule,
    ApdLearnRoutingModule
  ]
})
export class ApdLearnModule { }
