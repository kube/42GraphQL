
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

import { ApiProject } from '../Api/Types/Project'

export const ProjectType = new GraphQLObjectType<ApiProject>({
  name: 'Project',
  description: '...',

  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    description: { type: GraphQLString },
    parent: {
      type: ProjectType,
      resolve: project =>
        project.parent ? getProject(project.parent.id) : null
    },
    children: {
      type: new GraphQLList(ProjectType),
      resolve: project => Promise.all(
        project.children.map(child =>
          getProject(child.id)
        )
      )
    },
    objectives: { type: new GraphQLList(GraphQLString) },
    tier: { type: GraphQLInt }
  })
})
