import { Component } from '@angular/core';

export interface TopicCardData {
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

  constructor() {

  }
}
