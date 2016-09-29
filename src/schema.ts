
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
  GraphQLInt,
  GraphQLList
} from 'graphql'

import {
  ApiProject
} from './ApiTypes/Project'

import {
  ApiUser
} from './ApiTypes/User'

import config from './config'
import api from './abstraction'

const { getUser, getUsers } = api(config)

const ProjectType = new GraphQLObjectType<ApiProject>({
  name: 'Project',
  description: '...',

  fields: () => ({
    id: { type: GraphQLInt },
    occurrence: { type: GraphQLInt },

  })
})

const UserType = new GraphQLObjectType<ApiUser>({
  name: 'User',
  description: '...',

  fields: () => ({
    id: { type: GraphQLInt },
    login: { type: GraphQLString },

    firstName: {
      type: GraphQLString,
      resolve: user => user.first_name
    },
    lastName: {
      type: GraphQLString,
      resolve: user => user.last_name
    },

    url: { type: GraphQLString },
    phone: { type: GraphQLString },
    displayName: { type: GraphQLString },
    imageUrl: {
      type: GraphQLString,
      resolve: user => user.image_url
    },
    isStaff: {
      type: GraphQLBoolean,
      resolve: user => user['staff?']
    },
    correctionPoints: {
      type: GraphQLInt,
      resolve: user => user.correction_point
    },
    poolMonth: {
      type: GraphQLString,
      resolve: user => user.correction_point
    },
    poolYear: {
      type: GraphQLString,
      resolve: user => user.pool_year
    },
    location: { type: GraphQLString },
    wallet: { type: GraphQLInt },
    //TODO: Add groups with correct Typing
    //TODO: Add cursus_users

    projects: {
      type: new GraphQLObjectType({
        name: 'User Projects',
        description: 'Projects to which user subscribed',

        fields: () => ({
          id: { type: GraphQLInt },
          occurence: { type: GraphQLInt },
          finalMark: { type: GraphQLInt },
          status: { type: GraphQLString },
          validated: {
            type: GraphQLBoolean,
            resolve: (projects: any) => projects['validated?'],
          },
          currentTeamId: { type: GraphQLInt },
          project: ProjectType
        })
      }),
      resolve: user => user.projects_users
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
        id: { type: GraphQLInt }
      },
      resolve: (root, args) => getUser(args['id'])
    },

    users: {
      type: new GraphQLList(UserType),
      args: {
        page: { type: GraphQLInt }
      },
      resolve: (root, args) => getUsers(args['page'])
        .then(users =>
          Promise.all(users.map(user =>
            getUser(user.id))
          )
        )
    }
  })
})


export default new GraphQLSchema({
  query: QueryType
})
