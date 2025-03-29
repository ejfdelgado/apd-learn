import { Component } from '@angular/core';
import { Router } from '@angular/router';

export interface TopicCardData {
  id: string;
  title: string;
  description: string;
  backgroundStyle: { [key: string]: string };
  bodyStyle: { [key: string]: string };
}

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
export class TheoryComponent {
  public topics: TopicCardData[] = [
    {
      id: "1",
      title: "Comunicaciones Aeronáuticas",
      description: "Comunicaciones Aeronauticas",
      backgroundStyle: {
        "background-color": "#aee8ff",
      },
      bodyStyle: {
        "background-image": 'url("https://storage.googleapis.com/labs-pro-public/svg/car.svg")',
      }
    },
    {
      id: "2",
      title: "Comunicaciones Aeronáuticas",
      description: "Comunicaciones Aeronauticas",
      backgroundStyle: {
        "background-color": "rgb(212 255 193)",
      },
      bodyStyle: {
        "background-image": 'url("https://storage.googleapis.com/labs-pro-public/svg/mountain.svg")',
      }
    },
    {
      id: "3",
      title: "Comunicaciones Aeronáuticas",
      description: "Comunicaciones Aeronauticas",
      backgroundStyle: {
        "background-color": "#ffe3c7",
      },
      bodyStyle: {
        "background-image": 'url("https://storage.googleapis.com/labs-pro-public/svg/volcano.svg")',
      }
    }
  ];

  constructor(
    public router: Router,
  ) {

  }

  navigate(topic: TopicCardData) {
    this.router.navigate(['apd-learn', "questions"], { queryParams: { "topic": topic.id } });
  }
}
