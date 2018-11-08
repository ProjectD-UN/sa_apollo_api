import { generalRequest, getRequest } from '../utilities';
import { url, port_newsletter } from './server';

const URL = `http://${url}:${port_newsletter}/`;

const resolvers = {
	Query: {
		allNewsletters: (_) =>
			getRequest(`${URL}newsletters`, ''),
		allTopics: (_) =>
			getRequest(`${URL}topics`, '')
	},
	Mutation: {
		saveUser: (_, {user}) =>
			generalRequest(`${URL}users`, 'POST', user),
		saveUserTopic: (_, {userTopic}) =>
			generalRequest(`${URL}users`, 'POST', userTopic)
	}

};

export default resolvers;
