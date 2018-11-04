export const newsletterTypeDef = `
input User {
    name: String!    
    email: String!
}
type UserCreated {
    id: Int
    name: String!
    email: String!
    created_at: String!
    updated_at: String!
    url: String!
}
type Newsletter {
    title: String!    
    description: String!
    url_to_image: String!
    topics: [Topic!]
}
type Topic {
    name: String!    
    img_id: Int!
}
`;

export const newsletterQueries = `
    allNewsletters: [Newsletter]!
    allTopics: [Topic]!
`;

export const newsletterMutations = `
    saveUser(user: User!): UserCreated!
`;
