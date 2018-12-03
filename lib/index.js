'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}

	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}?`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	const queryUrl = addParams(`${url}/${path}`, parameters);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

const botTypeDef = `
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

const botQueries = `
    allCourses: [ButtonGoBack]!
    courseByCode(code: Int!): ButtonGoBack!
`;

const botMutations = `
    saveQuestion(question: Question): ReplyAnswer!
    getLabs(city: City): ReplyAnswer!
`;

const url = process.env.URL || '35.231.237.201';
const port_bot = process.env.BOT_PORT || '3000';
const entryPoint_bot = process.env.BOT_ENTRY || 'api/';

const URL = `http://${url}:${port_bot}/${entryPoint_bot}`;

const resolvers = {
	Reply: {
		__resolveType(obj, args, context, info){
			if(obj.type === 'quickReplies') {
				return 'ReplyBad'
			}
			if (obj.type === 'carousel'){
				return 'ReplyCards'
			}
			if (obj.type === 'text'){
				return 'ReplyText'
			}
			return null;
		}
	},

	Query: {
		allCourses: (_) =>
			getRequest(URL, ''),
		courseByCode: (_, { code }) =>
			generalRequest(`${URL}/${code}`, 'GET'),
	},
	Mutation: {
		saveQuestion: (_, {question}) =>
			generalRequest(`${URL}questions`, 'POST', question),
		getLabs: (_, {city}) =>
			generalRequest(`${URL}labs/search`, 'POST', city)



		// createCourse: (_, { course }) =>
		// 	generalRequest(`${URL}`, 'POST', course),
		// updateCourse: (_, { code, course }) =>
		// 	generalRequest(`${URL}/${code}`, 'PUT', course),
		// deleteCourse: (_, { code }) =>
		// 	generalRequest(`${URL}/${code}`, 'DELETE')
	}
};

const newsletterTypeDef = `
input User {
    name: String!    
    email: String!
}
input UserTopic{
    user_id: Int!
    topic_id: Int!
}
type UserCreated {
    id: Int
    name: String!
    email: String!
    created_at: String!
    updated_at: String!
    url: String!
}
type UserTopicCreated{
    user_id: Int
    topic_id: Int
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

const newsletterQueries = `
    allNewsletters: [Newsletter]!
    allTopics: [Topic]!
`;

const newsletterMutations = `
    saveUser(user: User!): UserCreated!
    saveUserTopic(userTopic: UserTopic!): UserTopicCreated!
`;

const url$1 = process.env.URL || '35.231.237.201';
const port_newsletter = process.env.NEWSLETTER_PORT || '3002';

const URL$1 = `http://${url$1}:${port_newsletter}/`;

const resolvers$1 = {
	Query: {
		allNewsletters: (_) =>
			getRequest(`${URL$1}newsletters`, ''),
		allTopics: (_) =>
			getRequest(`${URL$1}topics`, '')
	},
	Mutation: {
		saveUser: (_, {user}) =>
			generalRequest(`${URL$1}users`, 'POST', user),
		saveUserTopic: (_, {userTopic}) =>
			generalRequest(`${URL$1}user_topics`, 'POST', userTopic)
	}

};

const centersTypeDef = `
input Center {
    name: String!    
    email: String
    city: String!
    address: String!
    lat: Float!
    lng: Float!
}
type CenterCreated {
    code: Int!
    name: String!    
    email: String
    city: String!
    address: String!
    lat: Float!
    lng: Float!
}

`;

const centersQueries = `
    allCenters: [CenterCreated]!
    centerById(code:Int!): CenterCreated
`;

const centersMutations = `
    saveCenter(center: Center!): CenterCreated!
`;

const entryPoint = process.env.CENTERS_ENTRY || 'courses-ms/resources/courses';
const url$2 = process.env.URL || '35.231.237.201';
const port_centers = process.env.CENTERS_PORT || '3001';

const URL$2 = `http://${url$2}:${port_centers}/${entryPoint}`;

const resolvers$2 = {
	Query: {
		allCenters: (_) =>
			getRequest(`${URL$2}`, ''),
		centerById: (_, { code }) =>
			generalRequest(`${URL$2}/${code}`, 'GET'),
		
	},
	Mutation: {
		saveCenter: (_, {center}) =>
			generalRequest(`${URL$2}`, 'POST', center)
	}

};

const usersTypeDef = `
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

const usersQueries = `
    me: Me!    
`;

const usersMutations = `
    registerUser(user: User): Token
    loginUser(login: Login): LoginResult
`;

const url$3 = process.env.URL || '35.231.237.201';
const user_port = process.env.USER_PORT || '3003';
const entryPoint_user = process.env.USER_ENTRY || 'api/auth';

const URL$3 = `http://${url$3}:${user_port}/${entryPoint_user}`;

const resolvers$3 = {
	Query: {
		me: (_) =>
			getRequest(`${URL$3}/me`, '')		
	},
	Mutation: {
		registerUser: (_, {user}) =>
			generalRequest(`${URL$3}/register`, 'POST', user),
		loginUser: (_, {login}) =>
			generalRequest(`${URL$3}/login`, 'POST', login)



		// createCourse: (_, { course }) =>
		// 	generalRequest(`${URL}`, 'POST', course),
		// updateCourse: (_, { code, course }) =>
		// 	generalRequest(`${URL}/${code}`, 'PUT', course),
		// deleteCourse: (_, { code }) =>
		// 	generalRequest(`${URL}/${code}`, 'DELETE')
	}
};

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		botTypeDef,newsletterTypeDef,centersTypeDef, usersTypeDef

	],
	[
		botQueries,newsletterQueries,centersQueries, usersQueries
	],
	[
		botMutations,newsletterMutations,centersMutations, usersMutations
	]
);

// Generate the schema object from your types definition.
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers,
		resolvers$1,
		resolvers$2,
		resolvers$3
	)
});

const app = new Koa();
const router = new KoaRouter();
const PORT = process.env.PORT || 5000;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));

router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
