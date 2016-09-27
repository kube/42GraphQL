
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import api from './api'
import { IApiUser, IApiUsers } from './apiResponseFormat'
import { IConfig } from './api'

export default function (config: IConfig) {
  const { get, post } = api(config)

  const getUsers = (): Promise<IApiUsers> =>
    get('users')

  const getUser = (userId: number): Promise<IApiUser> =>
    get(`users/${userId}`)

  /**
   * Expose Module
   */
  return {
    get,
    post,
    getUsers,
    getUser
  }
}
