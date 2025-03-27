import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApdLearnComponent } from './apd-learn.component';

const routes: Routes = [{ path: '', component: ApdLearnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApdLearnRoutingModule { }
