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

    public topics: TopicCardData[] | null = null;

    constructor(private httpSrv: HttpService) { }

    shuffle(array: Array<any>) {
        let currentIndex = array.length, randomIndex;
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    async getDatabase(): Promise<TopicCardData[]> {
        if (this.topics == null) {
            this.topics = await this.httpSrv.get("assets/db/topics.json");
        }
        return this.topics as any;
    }

    async getTopic(id: string): Promise<TopicCardData | null> {
        const database = await this.getDatabase();
        const filtered = database.filter((topic) => {
            return topic.id == id;
        });
        if (filtered.length > 0) {
            return filtered[0];
        }
        return null;
    }

    suffleQuestions(temp: QuestionCardData[]) {
        for (let i = 0; i < temp.length; i++) {
            const question = temp[i];
            this.shuffle(question.choices);
        }
        this.shuffle(temp);
    }

    async getQuestions(fileName: string, maxQuestions?: number): Promise<any> {
        let temp: any = await this.httpSrv.get(`assets/db/${fileName}`);
        if (typeof maxQuestions == "number") {
            temp = temp.splice(0, maxQuestions);
        }
        return temp;
    }
}