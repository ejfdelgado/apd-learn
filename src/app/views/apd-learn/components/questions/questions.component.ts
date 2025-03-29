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
    '../../../../buttons.css',
    './questions.component.css'
  ]
})
export class QuestionsComponent implements OnInit {
  topicId: string | null;
  topic: TopicCardData | null = null;
  questions: QuestionCardData[] = [];
  currentQuestion: QuestionCardData | null = null;
  currentChoice: ChoiceCardData | null = null;
  topicStyle: { [key: string]: string } = {};
  finished: boolean = false;

  state: "pristine" | "selected" | "correct" | "incorrect" = "pristine";

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
      if (this.topic) {
        this.topicStyle['background-color'] = this.topic.backgroundStyle['background-color'];
      }
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
      } else {
        this.finished = true;
      }
    }
  }

  selectChoice(choice: ChoiceCardData) {
    if (['correct', 'incorrect'].indexOf(this.state) >= 0) {
      return;
    }
    this.currentChoice = choice;
    this.state = "selected";
  }

  getProgress() {
    if (this.currentQuestion == null || this.questions.length == 0) {
      return "0%";
    }
    if (this.finished) {
      return "100%";
    }
    const index = this.questions.indexOf(this.currentQuestion);
    const value = (100 * (index) / this.questions.length).toFixed(0);
    return value + "%";
  }

  async verifyChoice() {
    if (!this.currentChoice) {
      return;
    }
    if (this.currentChoice.correctness > 0) {
      this.state = 'correct';
    } else {
      this.state = 'incorrect';
    }
  }

  getCorrectAnswer() {
    if (!this.currentQuestion) {
      return "";
    }
    const correct = this.currentQuestion.choices.filter((choice) => {
      return choice.correctness > 0
    });
    if (correct.length == 0) {
      return "";
    }
    return correct[0].txt;
  }

  async continue() {
    this.nextQuestion();
    this.state = 'pristine';
  }
}
