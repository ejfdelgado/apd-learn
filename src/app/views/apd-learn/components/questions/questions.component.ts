import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChoiceCardData, QuestionCardData, TheoryService, TopicCardData } from 'src/app/services/theory.service';
import { ModuloSonido } from '@ejfdelgado/ejflab-common/src/ModuloSonido';

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
  lives: number = 10;
  correctCounter: number = 0;
  missedQuestions: QuestionCardData[] = [];
  state: "pristine" | "selected" | "correct" | "incorrect" = "pristine";

  constructor(
    private elementRef: ElementRef,
    public router: Router,
    public theorySrv: TheoryService,
  ) {

  }

  async ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.topicId = urlParams.get("topic");
    const response = await ModuloSonido.preload([
      '/assets/sounds/error.mp3',
      '/assets/sounds/mario-coin.mp3',
      '/assets/sounds/newscore.mp3',
      '/assets/sounds/success.mp3',
    ]);
    if (this.topicId) {
      this.topic = await this.theorySrv.getTopic(this.topicId);
      if (this.topic) {
        this.topicStyle['background-color'] = this.topic.backgroundStyle['background-color'];
        this.reiniciar();
      }
    }
  }

  async reiniciar() {
    if (!this.topicId) {
      return;
    }
    this.questions = await this.theorySrv.getQuestions(this.topicId, 5);
    this.theorySrv.suffleQuestions(this.questions);
    this.finished = false;
    this.state = 'pristine';
    this.lives = 10;
    this.correctCounter = 0;
    this.missedQuestions = [];
    this.currentChoice = null;
    this.currentQuestion = null;
    this.nextQuestion();
  }

  goToTopicSelection() {
    this.router.navigate(["apd-learn", "theory"]);
  }

  nextQuestion() {
    this.currentChoice = null;
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
    if (this.finished) {
      if (this.missedQuestions.length == 0) {
        ModuloSonido.play('/assets/sounds/newscore.mp3');
      } else {
        ModuloSonido.play('/assets/sounds/success.mp3');
      }
    }
    setTimeout(() => {
      this.scrollTop();
    });
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
      ModuloSonido.play('/assets/sounds/mario-coin.mp3');
      this.state = 'correct';
      this.correctCounter += 1;
    } else {
      ModuloSonido.play('/assets/sounds/error.mp3');
      this.state = 'incorrect';
      this.lives -= 1;
      if (this.lives == 0) {
        this.finished = true;
      }
      if (this.currentQuestion) {
        this.missedQuestions.push(this.currentQuestion);
      }
    }
    setTimeout(() => {
      if (this.finished) {
        this.scrollTop();
      } else {
        this.scrollDown();
      }
    });
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

  scrollTop() {
    const nativeElement = this.elementRef.nativeElement;
    nativeElement.scrollTop = 0;
  }

  scrollDown() {
    const nativeElement = this.elementRef.nativeElement;
    nativeElement.scrollTop = nativeElement.scrollHeight;
  }

  repasarPreguntas() {
    let firstQuestion = null;
    for (let i = 0; i < this.missedQuestions.length; i++) {
      const missed = this.missedQuestions[i];
      const newQuestion = {
        txt: missed.txt,
        choices: missed.choices,
      };
      if (firstQuestion == null) {
        firstQuestion = newQuestion;
      }
      this.questions.push(newQuestion);
    }
    this.currentQuestion = firstQuestion;
    this.missedQuestions = [];
    this.finished = false;
  }
}
