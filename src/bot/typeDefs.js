export const botTypeDef = `
type ButtonGoBack {
    title: String!    
    value: String!
}
type ButtonPhone {
    type: String!
    title: String!    
    value: String!
}
type LabCards {
    title: String!
    subtitle: String!
    buttons: [ButtonPhone!]
}
type BadAnswer {
    title: String!
    buttons: [ButtonGoBack!]
}

interface Reply {
    type: String!
}

type ReplyText implements Reply {
    type: String!
    content: String!
}
type ReplyCards implements Reply {
    type: String!
    content: [LabCards!]
}
type ReplyBad implements Reply {
    type: String!
    content: BadAnswer!
}
type ReplyAnswer {
    messages: [Reply]
}

input Question {
    type: String!
    email: String!
    question: String!
    id: String!
}
input City {
    city: String!
    id: String!
}
`;

export const botQueries = `
    allCourses: [ButtonGoBack]!
    courseByCode(code: Int!): ButtonGoBack!
`;

export const botMutations = `
    saveQuestion(question: Question): ReplyAnswer!
    getLabs(city: City): ReplyAnswer!
`;
