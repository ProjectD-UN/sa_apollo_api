export const usersTypeDef = `
input User {
    name: String!
    email: String!
    password: String!    
}
input Login {
    email: String!
    password: String!
}
type Token {
    auth: Boolean!
    token: String!
    expiresIn: Int!
}
type FailedToken {
    auth: Boolean
    token: String    
}
type Me {
    _id: String
    name: String!
    email: String!
    __v: Int!
}

union LoginResult = Token | FailedToken
`;

export const usersQueries = `
    me: Me!    
`;

export const usersMutations = `
    registerUser(user: User): Token
    loginUser(login: Login): LoginResult
`;
