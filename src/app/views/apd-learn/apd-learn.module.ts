import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApdLearnRoutingModule } from './apd-learn-routing.module';
import { ApdLearnComponent } from './apd-learn.component';
import { MatIconModule } from '@angular/material/icon';
import { MycommonModule } from 'ejflab-front-lib';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { TheoryComponent } from './components/theory/theory.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { QuestionsComponent } from './components/questions/questions.component';

@NgModule({
  declarations: [
    ApdLearnComponent,
    ChecklistComponent,
    TheoryComponent,
    LeaderboardComponent,
    QuestionsComponent
  ],
  imports: [
    CommonModule,
    ApdLearnRoutingModule,
    MatIconModule,
    MycommonModule,
    FormsModule,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatTabsModule,
  ]
})
export class ApdLearnModule { }
