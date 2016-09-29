
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import api from './api'

import {
  ApiUser,
  ApiUsers,
  ApiProject,
  ApiProjects
} from './ApiTypes'

import { IConfig } from './api'


export default function (config: IConfig) {
  const { get, post } = api(config)

  const getUsers = (page: number): Promise<ApiUsers> =>
    get(`users?page[number]=${page}`)

  const getUser = (userId: number): Promise<ApiUser> =>
    get(`users/${userId}`)

  const getProjects = (page: number): Promise<ApiProjects> =>
    get(`projects?page[number]=${page}`)

  const getProject = (projectId: number): Promise<ApiProject> =>
    get(`projects/${[projectId]}`)

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
