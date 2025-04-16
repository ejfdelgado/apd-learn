import { Injectable } from "@angular/core";

export interface LeaderData {
    i: number;
    avatar?: string;
    name: string;
    score: number;
}

export interface TopicData {
    id: string;
    label: string;
    image: string;
}

export interface MyScoreData {
    topics: { [key: string]: number },
}

@Injectable({
    providedIn: 'root'
})
export class LeaderBoardService {
    async loadLeaderTopics(): Promise<TopicData[]> {
        return [
            {
                id: "comunicacion_aeronautica",
                label: "Comunicaciones Aeronáuticas",
                image: "https://storage.googleapis.com/labs-pro-public/apd_assets/comunicacion_aeronautica.svg"
            },
            {
                id: "aerodinamica_aplicada",
                label: "Aerodinámica Aplicada",
                image: "https://storage.googleapis.com/labs-pro-public/apd_assets/aerodinamica_aplicada.svg",
            },
            {
                id: "derecho_aereo",
                label: "Derecho Aéreo",
                image: "https://storage.googleapis.com/labs-pro-public/apd_assets/derecho_aereo.svg",
            },
        ];
    }

    async loadMyScore(): Promise<MyScoreData> {
        return {
            topics: {
                "comunicacion_aeronautica": 0.5,
                "derecho_aereo": 0.1,
                "aerodinamica_aplicada": 1,
            }
        }
    }

    async loadLeaderBoard(topicId: string, offset: number = 0, pageSize: number = 100): Promise<LeaderData[]> {
        return [
            {
                i: 1,
                name: "ferdex",
                score: 4000,
            },
            {
                i: 2,
                name: "enciso.hansen",
                score: 3875,
            },
            {
                i: 3,
                name: "veronicae",
                score: 3850,
            },
            {
                i: 4,
                name: "reyesdanielawa",
                score: 3800,
            },
            {
                i: 5,
                name: "v_rosemberg",
                score: 3540,
            },
            {
                i: 6,
                name: "Daniel Torres",
                score: 3440,
            },
            {
                i: 7,
                name: "maikolanavarro04",
                score: 3070,
            },
            {
                i: 8,
                name: "jussuarezga",
                score: 2730,
            },
        ];
    }
}