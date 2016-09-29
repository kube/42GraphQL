
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
  ApiUsers
} from './Types/User'

import {
  ApiProject,
  ApiProjects
} from './Types/Project'

import { IConfig } from './api'

const usersCache = new Map<number, ApiUser>()
const projectsCache = new Map<number, ApiProject>()

export default function (config: IConfig) {
  const { get, post } = api(config)

  const getUsers = (page: number): Promise<ApiUsers> =>
    get(`users?page[number]=${page}`)

  const getUser = (userId: number): Promise<ApiUser> => {
    if (usersCache.has(userId))
      return Promise
        .resolve(usersCache.get(userId))
    else
      return get(`users/${userId}`)
        .then((user: ApiUser) =>
          usersCache
            .set(userId, user)
            .get(userId)
        )
  }

  const getProjects = (page: number): Promise<ApiProjects> =>
    get(`projects?page[number]=${page}`)

  const getProject = (projectId: number): Promise<ApiProject> => {
    if (projectsCache.has(projectId))
      return Promise
        .resolve(projectsCache.get(projectId))
    else
      return get(`projects/${projectId}`)
        .then((project: ApiProject) =>
          projectsCache
            .set(projectId, project)
            .get(projectId)
        )
  }

  /**
   * Expose Module
   */
  return {
    get,
    post,
    getUsers,
    getUser,
    getProject,
    getProjects
  }
}
