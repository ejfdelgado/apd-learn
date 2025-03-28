import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApdLearnComponent } from './apd-learn.component';
import { TheoryComponent } from './components/theory/theory.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';

const routes: Routes = [
  {
    path: '',
    component: ApdLearnComponent,
    children: [
      { path: 'checklist', component: ChecklistComponent, },
      { path: 'theory', component: TheoryComponent, },
      { path: 'leaderboard', component: LeaderboardComponent, },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApdLearnRoutingModule { }
