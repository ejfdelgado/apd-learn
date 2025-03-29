import { Injectable } from "@angular/core";
import { HttpService } from "ejflab-front-lib";

export interface TopicCardData {
    id: string;
    title: string;
    description: string;
    backgroundStyle: { [key: string]: string };
    bodyStyle: { [key: string]: string };
}

@Injectable({
    providedIn: 'root'
})
export class TheoryService {
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

    constructor(private httpSrv: HttpService) { }

    async getDatabase() {
        return this.topics;
    }
}