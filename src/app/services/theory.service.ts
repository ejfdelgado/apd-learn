import { Injectable } from "@angular/core";
import { HttpService } from "ejflab-front-lib";

export interface TopicCardData {
    id: string;
    title: string;
    description: string;
    backgroundStyle: { [key: string]: string };
    bodyStyle: { [key: string]: string };
}

export interface ChoiceCardData {
    txt: string;
    correctness: number;
}

export interface QuestionCardData {
    txt: string;
    choices: ChoiceCardData[];
}

@Injectable({
    providedIn: 'root'
})
export class TheoryService {

    constructor(private httpSrv: HttpService) { }

    async getDatabase(): Promise<any> {
        return this.httpSrv.get("assets/db/topics.json");
    }

    async getQuestions(fileName: string): Promise<any> {
        return this.httpSrv.get(`assets/db/${fileName}`);
    }
}