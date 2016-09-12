
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

  function getUsers(): Promise<IApiUsers>{
    return get('users')
  }

  function getUser(userId: number): Promise<IApiUser> {
    return get(`users/${userId}`)
  }

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
