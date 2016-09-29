
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

import api from '../Api'
import config from '../config'
const { getUser, getUsers, getProject, getProjects } = api(config)

import { UserType } from './User'
import { ProjectType } from './Project'

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (root, args) =>
        getUser(args['id'])
    },

    users: {
      type: new GraphQLList(UserType),
      args: {
        page: { type: GraphQLInt }
      },
      resolve: (root, args) =>
        getUsers(args['page'])
          .then(users =>
            Promise.all(users.map(user =>
              getUser(user.id))
            )
          )
    },

    projects: {
      type: new GraphQLList(ProjectType),
      args: {
        page: { type: GraphQLInt }
      },
      resolve: (root, args) =>
        getProjects(args['number'])
    }
  })
})

export default new GraphQLSchema({
  query: QueryType
})
