
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
  GraphQLInt,
  GraphQLList
} from 'graphql'

import connection from '../connection'
import Cache from '../Cache'

import { Id, getUser, getUsers, ApiUser, QueryStringArgs } from '42api'
import { fetchUserProject, UserProjectType } from './UserProject'
import { fetchUserLocations, LocationType } from './Location'

/**
 * Users cache as PlainUser with a TTL of 3 hours
 */
const usersCache = new Cache<Id, PlainUser>('user', 3600 * 3)

/**
 * Plain User type to be stored in cache
 */
export type PlainUser = {
  id: Id,
  email: string,
  login: string,
  firstName: string,
  lastName: string,
  url: string,
  phone: string,
  displayName: string,
  imageUrl: string,
  isStaff: boolean,
  correctionPoints: number,
  poolMonth: string,
  poolYear: string,
  location: string,
  wallet: number,
  groups: Id[],
  userCursus: Id[]
  userProjects: Id[],
  achievements: Id[],
  titles: Id[],
  partnerships: Id[],
  patroned: Id[],
  patroning: Id[],
  userExpertises: Id[],
  campuses: Id[]
}

/**
 * Convert Raw ApiUser to PlainUser
 */
const formatUser = (user: ApiUser): PlainUser => (
  {
    id: user.id,
    email: user.email,
    login: user.login,
    firstName: user.first_name,
    lastName: user.last_name,
    url: user.url,
    phone: user.phone,
    displayName: user.displayname,
    imageUrl: user.image_url,
    isStaff: user['staff?'],
    correctionPoints: user.correction_point,
    poolMonth: user.pool_month,
    poolYear: user.pool_year,
    location: user.location,
    wallet: user.wallet,
    groups: user.groups.map(group => group.id),
    userCursus: user.cursus_users.map(cursus => cursus.id),
    userProjects: user.projects_users.map(project => project.id),
    achievements: user.achievements.map(achievement => achievement.id),
    titles: user.titles.map(title => title.id),
    partnerships: user.partnerships.map(partnership => partnership.id),
    patroned: user.patroned.map(patroned => patroned.id),
    patroning: user.patroning.map(patroning => patroning.id),
    userExpertises: user.expertises_users.map(expertise => expertise.id),
    campuses: user.campus.map(campus => campus.id)
  }
)

/**
 * Fetch User formatted as PlainUser from cache or API
 */
export const fetchUser =
  (userId: number, args?: QueryStringArgs) =>
    usersCache.get(userId)
      .then(user => user ?
        user : getUser(connection, userId, args)
          .then(formatUser)
          .then(user =>
            usersCache.set(user.id, user)
          )
      )

/**
 * Fetch Users page from API, formatted as PlainUser array
 */
export const fetchUsers =
  (args?: QueryStringArgs) =>
    getUsers(connection, args)
      .then(users =>
        users.map(user =>
          fetchUser(user.id)
        )
      )

/**
 * GraphQL User type
 */
export const UserType = new GraphQLObjectType<PlainUser>({
  name: 'User',
  description: '...',

  fields: () => ({
    id: { type: GraphQLInt },
    login: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    url: { type: GraphQLString },
    phone: { type: GraphQLString },
    displayName: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
    isStaff: { type: GraphQLBoolean },
    correctionPoints: { type: GraphQLInt },
    poolMonth: { type: GraphQLString },
    poolYear: { type: GraphQLString },
    location: { type: GraphQLString },
    wallet: { type: GraphQLInt },

    userProjects: {
      type: new GraphQLList(UserProjectType),
      resolve: user =>
        user.userProjects
          .map(fetchUserProject)
    },

    locations: {
      type: new GraphQLList(LocationType),
      resolve: user =>
        fetchUserLocations(user.id)
    }
  })
})

require('graphql-errors').maskErrors(UserType)
