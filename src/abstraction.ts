
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import api from './api'
import { ApiUser, ApiUsers } from './apiResponseFormat'
import { IConfig } from './api'

export default function (config: IConfig) {
  const { get, post } = api(config)

  const getUsers = (): Promise<ApiUsers> =>
    get('users')

  const getUser = (userId: number): Promise<ApiUser> =>
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
