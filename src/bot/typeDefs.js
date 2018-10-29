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

union DifferentReplies = ReplyText | ReplyCards | ReplyBad

type Question {
    type: String!
    email: String!
    question: String!
}
type City {
    city: String!
}
`;

// export const botQueries = `
//     allCourses: [Course]!
//     courseByCode(code: Int!): Course!
// `;

export const botMutations = `
    saveQuestion(question: Question): Reply!
    getLabs(city: City): Reply!
`;
