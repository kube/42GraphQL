
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

//TODO: Remove this reference path when find a way to import style properly
/// <reference path="../../node_modules/typed-graphql/graphql.d.ts" />

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql'


import { fetchUsers, UserType } from './User'
import { fetchProjects, ProjectType } from './Project'
import formatArgs from '../formatArgs'

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    users: {
      type: new GraphQLList(UserType),
      args: {
        page: { type: GraphQLInt },
        sortBy: { type: new GraphQLList(GraphQLString) },
        login: { type: GraphQLString }
      },
      resolve: (root, args) =>
        fetchUsers(formatArgs(args))
    },

    projects: {
      type: new GraphQLList(ProjectType),
      args: {
        page: { type: GraphQLInt },
        sortBy: { type: new GraphQLList(GraphQLString) }
      },
      resolve: (root, args) =>
        fetchProjects(formatArgs(args))
    }
  })
})

require('graphql-errors').maskErrors(QueryType)

export default new GraphQLSchema({
  query: QueryType
})
