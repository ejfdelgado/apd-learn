import { Component } from '@angular/core';

export interface TopicCardData {
  title: string;
  description: string;
  backgroundStyle: { [key: string]: string };
  centerImageURL: string;
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
      backgroundStyle: {},
      centerImageURL: ""
    },
    {
      title: "Comunicaciones Aeronáuticas",
      description: "Comunicaciones Aeronauticas",
      backgroundStyle: {},
      centerImageURL: ""
    },
    {
      title: "Comunicaciones Aeronáuticas",
      description: "Comunicaciones Aeronauticas",
      backgroundStyle: {},
      centerImageURL: ""
    }
  ];

  constructor() {

  }
}
