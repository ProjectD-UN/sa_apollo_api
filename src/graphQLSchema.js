import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	botMutations,
	botQueries,
	botTypeDef
} from './bot/typeDefs';
import botResolvers from './bot/resolvers';

import {
	newsletterMutations,
	newsletterQueries,
	newsletterTypeDef
} from './newsletter/typeDefs';
import newsletterResolvers from './newsletter/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		botTypeDef,newsletterTypeDef

	],
	[
		botQueries,newsletterQueries
	],
	[
		botMutations,newsletterMutations
	]
);

// Generate the schema object from your types definition.
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		botResolvers,
		newsletterResolvers
	)
});
