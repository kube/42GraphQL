
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

import { ApiUser, ApiUserProject } from '../Api/Types/User'
import { ProjectType } from './Project'

const UserProjectType = new GraphQLObjectType<ApiUserProject>({
  name: 'UserProject',
  description: 'Projects to which user subscribed',

  fields: () => ({
    id: { type: GraphQLInt },
    occurence: { type: GraphQLInt },
    finalMark: { type: GraphQLInt },
    status: { type: GraphQLString },
    validated: {
      type: GraphQLBoolean,
      resolve: userProject => userProject['validated?']
    },
    currentTeamId: { type: GraphQLInt },
    project: {
      type: ProjectType,
      resolve: userProject =>
        getProject(userProject.project.id)
    }
  })
})

export const UserType = new GraphQLObjectType<ApiUser>({
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
      type: new GraphQLList(UserProjectType),
      resolve: user => user.projects_users
    }
  })
})
