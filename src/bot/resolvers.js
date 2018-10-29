import { generalRequest, getRequest } from '../utilities';
import { url, port_bot, entryPoint_bot } from './server';

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

export default resolvers;
