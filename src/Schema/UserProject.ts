
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
  GraphQLBoolean,
  GraphQLInt
} from 'graphql'

import connection from '../connection'

import { Id, getUserProject, getUserProjects, ApiUserProject } from '42api'
import { fetchProject, ProjectType } from './Project'

const userProjectsCache = new Map<Id, PlainUserProject>()

/**
 * Plain UserProject type to be stored in cache
 */
type PlainUserProject = {
  id: Id,
  occurrence: number,
  finalMark: number,
  status: string,
  validated: boolean,
  currentTeam: Id,
  project: Id
}

/**
 * Convert raw ApiUserProject to PlainUserProject
 */
export const formatUserProject =
  (userProject: ApiUserProject): PlainUserProject => (
    {
      id: userProject.id,
      occurrence: userProject.occurrence,
      finalMark: userProject.final_mark,
      status: userProject.status,
      validated: userProject['validated?'],
      currentTeam: userProject.current_team_id,
      project: userProject.project.id
    }
  )

/**
 * Cache UserProject
 */
export const cacheUserProject =
  (userProject: PlainUserProject): PlainUserProject =>
    userProjectsCache
      .set(userProject.id, userProject)
      .get(userProject.id)

/**
 * Fetch a UserProject by its Id
 */
export const fetchUserProject = (userProjectId: Id) =>
  userProjectsCache.has(userProjectId) ?
    userProjectsCache.get(userProjectId)
    : getUserProject(connection, userProjectId)
      .then(p => { console.log(p); return p })
      .then(formatUserProject)
      .then(cacheUserProject)

/**
 * Fetch all UserProjects of a User
 */
export const fetchUserProjects = (userId: Id) =>
  getUserProjects(connection, userId)
    .then(userProjects =>
      userProjects
        .map(formatUserProject)
        .map(cacheUserProject)
    )

/**
 * GraphQL UserProject type
 */
export const UserProjectType = new GraphQLObjectType<PlainUserProject>({
  name: 'UserProject',
  description: 'Projects to which a User subscribed',

  fields: () => ({
    id: { type: GraphQLInt },
    occurence: { type: GraphQLInt },
    finalMark: { type: GraphQLInt },
    status: { type: GraphQLString },
    validated: { type: GraphQLBoolean },
    currentTeamId: { type: GraphQLInt },
    project: {
      type: ProjectType,
      resolve: userProject =>
        fetchProject(userProject.project)
    }
  })
})

require('graphql-errors').maskErrors(UserProjectType)
