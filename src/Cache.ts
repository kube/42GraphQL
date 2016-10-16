
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { createClient, RedisClient } from 'redis'

const client = createClient()

/**
 * Creates a cache provider for a specified plain-object type
 * Optional expireTime sets type validity-time
 */
export default class Cache<K, V> {

  constructor(private name: string, private expireTime?: number) {
  }

  set(key: K, value: V): V {
    const keyWithPrefix = `${this.name}_${key}`

    // Store value stringified as JSON in Redis
    client.set(keyWithPrefix, JSON.stringify(value))

    if (this.expireTime)
      client.expire(keyWithPrefix, this.expireTime)

    return value
  }

  get(key: K): Promise<V> {
    const keyWithPrefix = `${this.name}_${key}`

    return new Promise((resolve, reject) =>
      client.get(keyWithPrefix, (error: Error, value: string) =>
        error ?
          reject(error) : resolve(JSON.parse(value))
      )
    )
  }
}
