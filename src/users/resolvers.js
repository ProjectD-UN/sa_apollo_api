import { generalRequest, getRequest } from '../utilities';
import { url, user_port, entryPoint_user } from './server';

const URL = `http://${url}:${user_port}/${entryPoint_user}`;

const resolvers = {
	Query: {
		me: (_) =>
			getRequest(`${URL}/me`, '')		
	},
	Mutation: {
		registerUser: (_, {user}) =>
			generalRequest(`${URL}/register`, 'POST', user),
		loginUser: (_, {login}) =>
			generalRequest(`${URL}/login`, 'POST', login)



		// createCourse: (_, { course }) =>
		// 	generalRequest(`${URL}`, 'POST', course),
		// updateCourse: (_, { code, course }) =>
		// 	generalRequest(`${URL}/${code}`, 'PUT', course),
		// deleteCourse: (_, { code }) =>
		// 	generalRequest(`${URL}/${code}`, 'DELETE')
	}
};

export default resolvers;