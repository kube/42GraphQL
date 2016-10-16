
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { createClient, RedisClient } from 'redis'

/**
 * Creates a cache provider for a specified plain-object type
 * Optional expireTime sets type validity-time
 */
export default class Cache<K, V> {
  private client: RedisClient

  constructor(private name: string, private expireTime?: number) {
    this.client = createClient()
  }

  set(key: K, value: V): V {
    const keyWithPrefix = `${this.name}_${key}`

    // Store value stringified as JSON in Redis
    this.client.set(keyWithPrefix, JSON.stringify(value))

    if (this.expireTime)
      this.client.expire(keyWithPrefix, this.expireTime)

    return value
  }

  get(key: K): Promise<V> {
    const keyWithPrefix = `${this.name}_${key}`

    return new Promise((resolve, reject) =>
      this.client.get(keyWithPrefix, (error: Error, value: string) =>
        error ?
          reject(error) : resolve(JSON.parse(value))
      )
    )
  }
}
