
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

import { Id, getUser, getUsers, ApiUser, QueryStringArgs } from '42api'
import { fetchUserProject, UserProjectType } from './UserProject'

/**
 * Cache using a Map until implementation of Redis
 */
const usersCache = new Map<number, PlainUser>()

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
 * Store PlainUser in cache
 */
const cacheUser = (user: PlainUser): PlainUser =>
  usersCache
    .set(user.id, user)
    .get(user.id)

/**
 * Fetch User formatted as PlainUser from cache or API
 */
export const fetchUser =
  (userId: number, args?: QueryStringArgs) =>
    usersCache.has(userId) ?
      Promise.resolve(
        usersCache.get(userId)
      )
      : getUser(connection, userId, args)
        .then(formatUser)
        .then(cacheUser)

/**
 * Fetch Users page from API, formatted as PlainUser array
 */
export const fetchUsers =
  (args?: QueryStringArgs): Promise<PlainUser[]> =>
    getUsers(connection, args)
      .then(users =>
        Promise.all(
          users.map(user =>
            fetchUser(user.id)
          )
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

    projects: {
      type: new GraphQLList(UserProjectType),
      resolve: user => {
        console.log(user.userProjects)
        return user.userProjects
          .map(fetchUserProject)
      }
    }
  })
})
