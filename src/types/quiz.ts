export type Quiz = {
    _id: string;
    title: string,
    description: string,
    questions: [],
    user: string,
}

export type Question = {
    question: string,
    questionType: string,
    answers: string[],
    correctAnswer: string
}

export type User = {
    name: string,
    username: string,
    password: string,
    role: string,
}

export type Analytics = {
    quiz:  string,
    user: string
    score:  number,
    correctResponses: number,
    incorrectResponses: number, 
    status: string,
    timeTaken?: number,
}