
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql'


import config from './config'
import api from './abstraction'
import { ApiUser } from './apiResponseFormat'

const { getUser } = api(config)


const UserType = new GraphQLObjectType({
  name: 'User',
  description: '...',

  fields: () => ({
    id: { type: GraphQLString },
    login: { type: GraphQLString },
    firstName: {
      type: GraphQLString,
      resolve: (user: ApiUser) => user.first_name
    },
    lastName: {
      type: GraphQLString,
      resolve: (user: ApiUser) => user.last_name
    },
    url: { type: GraphQLString },
    phone: { type: GraphQLString },
    displayName: { type: GraphQLString },
    imageUrl: {
      type: GraphQLString,
      resolve: (user: ApiUser) => user.image_url
    },
    isStaff: {
      type: GraphQLBoolean,
      resolve: (user: ApiUser) => user['staff?']
    },
    correctionPoints: {
      type: GraphQLInt,
      resolve: (user: ApiUser) => user.correction_point
    },
    poolMonth: {
      type: GraphQLString,
      resolve: (user: ApiUser) => user.correction_point
    },
    poolYear: {
      type: GraphQLString,
      resolve: (user: ApiUser) => user.pool_year
    }
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString}
      },
      resolve: (root, { id }) => getUser(id)
    }
  })
})


export default new GraphQLSchema({
  query: QueryType
})
