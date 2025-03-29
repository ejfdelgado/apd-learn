import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TheoryService, TopicCardData } from 'src/app/services/theory.service';

@Component({
  selector: 'app-theory',
  templateUrl: './theory.component.html',
  styleUrls: [
    '../../../../containers.css',
    '../../../../fonts.css',
    '../../../../forms.css',
    '../../../../popup.css',
    '../../../../effects.css',
    './theory.component.css'
  ]
})
export class TheoryComponent implements OnInit {

  public topics: TopicCardData[] = [];

  constructor(
    public router: Router,
    public theorySrv: TheoryService,
  ) {

  }

  async ngOnInit() {
    this.topics = await this.theorySrv.getDatabase();
  }

  navigate(topic: TopicCardData) {
    this.router.navigate(['apd-learn', "questions"], { queryParams: { "topic": topic.id } });
  }
}
