
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
import Cache from '../Cache'

import { Id, getUserProject, getUserProjects, ApiUserProject } from '42api'
import { fetchProject, ProjectType } from './Project'

/**
 * UserProjects cache as PlainUserProject with a TTL of 30 minutes
 */
const userProjectsCache = new Cache<Id, PlainUserProject>('userProject', 60 * 30)

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
 * Fetch a UserProject by its Id
 */
export const fetchUserProject = (userProjectId: Id) =>
  userProjectsCache.get(userProjectId)
    .then(userProject => userProject ?
      userProject : getUserProject(connection, userProjectId)
        .then(formatUserProject)
        .then(userProject =>
          userProjectsCache.set(userProject.id, userProject)
        )
    )

/**
 * Fetch all UserProjects of a User
 */
export const fetchUserProjects = (userId: Id) =>
  getUserProjects(connection, userId)
    .then(userProjects =>
      userProjects
        .map(formatUserProject)
        .map(userProject =>
          userProjectsCache.set(userProject.id, userProject)
        )
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
