
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
} from 'graphql'

import connection from '../connection'
import { Id, getProject, getProjects, ApiProject, QueryStringArgs } from '42api'

/**
 * Cache using a Map until implementation of Redis
 */
const projectsCache = new Map<number, PlainProject>()

/**
 * Plain Project type to be stored in cache
 */
export type PlainProject = {
  id: Id,
  name: string,
  slug: string,
  description: string,
  parent: Id | null,
  children: Id[],
  objectives: string[],
  tier: number
}

/**
 * Store PlainProject in cache
 */
const cacheProject = (project: PlainProject): PlainProject =>
  projectsCache
    .set(project.id, project)
    .get(project.id)

/**
 * Convert Raw ApiProject to PlainProject
 */
const formatProject = (project: ApiProject): PlainProject => (
  {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    parent: project.parent ? project.parent.id : null,
    children: project.children ? project.children.map(child => child.id) : [],
    objectives: project.objectives,
    tier: project.tier
  }
)

/**
 * Fetch Project formatted as PlainProject from cache or API
 */
export const fetchProject =
  (projectId: number, args?: QueryStringArgs) =>
    projectsCache.has(projectId) ?
      Promise.resolve(
        projectsCache.get(projectId)
      )
      : getProject(connection, projectId, args)
        .then(formatProject)
        .then(cacheProject)

/**
 * Fetch Projects from API, formatted as PlainProject array
 */
export const fetchProjects =
  (args?: QueryStringArgs): Promise<PlainProject[]> =>
    getProjects(connection, args)
      .then(projects =>
        projects
          .map(formatProject)
          .map(cacheProject)
      )

/**
 * GraphQL Project type
 */
export const ProjectType = new GraphQLObjectType<PlainProject>({
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
        project.parent ? fetchProject(project.parent) : null
    },
    children: {
      type: new GraphQLList(ProjectType),
      resolve: project => Promise.all(
        project.children.map(childId =>
          fetchProject(childId)
        )
      )
    },
    objectives: { type: new GraphQLList(GraphQLString) },
    tier: { type: GraphQLInt }
  })
})

require('graphql-errors').maskErrors(ProjectType)
