import fs from "fs";

let content = fs.readFileSync("./rawComunicacionesAeronauticas.txt", { encoding: "utf8" });

let state = "question";
const lines = content.split(/[\n\r]/g);

const questions = [];
let currentQuestion = null;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.length > 0) {
        if (state == "question") {
            currentQuestion = {
                txt: line,
                choices: [],
            };
            questions.push(currentQuestion);
            state = "choices";
        } else if (state == "choices") {
            if (line.includes("Respuesta opción")) {
                state = "answer";
            } else {
                currentQuestion.choices.push({
                    txt: line,
                    correctness: 0,
                });
            }
        } else if (state == "answer") {
            const answer = parseInt(line);
            if (isNaN(answer)) {
                console.log(JSON.stringify(questions, null, 4));
                throw new Error(`At line ${i} a number was expected but found ${line}`);
            }
            currentQuestion.choices[answer-1].correctness = 100;
            state = "question";
        }
    }
}

fs.writeFileSync("topic_1.json", JSON.stringify(questions, null, 4), { encoding: "utf8" });
