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

type ReplyText {
    type: String!
    content: String!
}
type ReplyCards {
    type: String!
    content: [LabCards!]
}
type ReplyBad {
    type: String!
    content: BadAnswer!
}
type Reply {
    replies: [DifferentReplies]
}
type ReplyQuestion {
    replies: [ReplyText]
}


union DifferentReplies = ReplyText | ReplyCards | ReplyBad

input Question {
    type: String!
    email: String!
    question: String!
}
input City {
    city: String!
}
`;

export const botQueries = `
    allCourses: [ButtonGoBack]!
    courseByCode(code: Int!): ButtonGoBack!
`;

export const botMutations = `
    saveQuestion(question: Question): ReplyQuestion!
    getLabs(city: City): Reply!
`;
