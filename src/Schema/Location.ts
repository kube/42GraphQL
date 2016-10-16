
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
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

import connection from '../connection'
import Cache from '../Cache'

import { UserType, fetchUser } from './User'
import { Id, getUserLocations, ApiLocation } from '42api'

const usersLocationsCache = new Cache<Id, PlainLocation[]>('userLocation', 60 * 4)

type PlainLocation = {
  id: Id,
  beginAt: string,
  endAt: string,
  primary: boolean,
  floor: number,
  row: number,
  post: number,
  host: string,
  campus: Id,
  user: Id
}

const formatLocation = (location: ApiLocation): PlainLocation => (
  {
    id: location.id,
    beginAt: location.begin_at,
    endAt: location.end_at,
    primary: location.primary,
    floor: location.floor,
    row: location.row,
    post: location.post,
    host: location.host,
    campus: location.campus_id,
    user: location.user.id
  }
)

export const fetchUserLocations = (userId: Id) =>
  usersLocationsCache.get(userId)
    .then(userLocations => userLocations ?
      userLocations : getUserLocations(connection, userId)
        .then(locations =>
          locations.map(formatLocation)
        )
        .then(userLocations =>
          usersLocationsCache.set(userId, userLocations)
        )
    )

export const LocationType = new GraphQLObjectType<PlainLocation>({
  name: 'Location',
  description: '...',

  fields: () => (
    {
      id: { type: GraphQLInt },
      beginAt: { type: GraphQLString },
      endAt: { type: GraphQLString },
      primary: { type: GraphQLBoolean },
      floor: { type: GraphQLInt },
      row: { type: GraphQLInt },
      post: { type: GraphQLInt },
      host: { type: GraphQLString },

      campus: {
        type: GraphQLInt
      },
      user: {
        type: UserType,
        resolve: location =>
          fetchUser(location.user)
      }
    }
  )
})
