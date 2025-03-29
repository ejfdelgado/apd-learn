import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChoiceCardData, QuestionCardData, TheoryService, TopicCardData } from 'src/app/services/theory.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: [
    '../../../../containers.css',
    '../../../../fonts.css',
    '../../../../forms.css',
    '../../../../popup.css',
    '../../../../effects.css',
    './questions.component.css'
  ]
})
export class QuestionsComponent implements OnInit {
  topicId: string | null;
  topic: TopicCardData | null = null;
  questions: QuestionCardData[] = [];
  currentQuestion: QuestionCardData | null = null;
  currentChoice: ChoiceCardData | null = null;

  constructor(
    public router: Router,
    public theorySrv: TheoryService,
  ) {

  }

  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.topicId = urlParams.get("topic");
    if (this.topicId) {
      this.questions = await this.theorySrv.getQuestions(this.topicId);
      this.theorySrv.suffleQuestions(this.questions);
      this.topic = await this.theorySrv.getTopic(this.topicId);
      this.nextQuestion();
    }
  }

  goToTopicSelection() {
    this.router.navigate(["apd-learn", "theory"]);
  }

  nextQuestion() {
    if (this.questions.length == 0) {
      return;
    }
    if (this.currentQuestion == null) {
      this.currentQuestion = this.questions[0];
    } else {
      const index = this.questions.indexOf(this.currentQuestion);
      if (index < this.questions.length - 1) {
        this.currentQuestion = this.questions[index + 1];
      }
    }
  }

  selectChoice(choice: ChoiceCardData) {
    this.currentChoice = choice;
  }
}
