import { generalRequest, getRequest } from '../utilities';
import { url, port_center , entryPoint } from './server';

const URL = `http://${url}:${port_centers}/${entryPoint}`;

const resolvers = {
	Query: {
		allCenters: (_) =>
			getRequest(`${URL}`, ''),
		centerById: (_, { code }) =>
			generalRequest(`${URL}/${code}`, 'GET'),
		
	},
	Mutation: {
		saveCenter: (_, {center}) =>
			generalRequest(`${URL}`, 'POST', center)
	}

};

export default resolvers;
