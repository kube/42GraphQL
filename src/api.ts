import * as Promise from 'promise'
import * as fetch from 'isomorphic-fetch'
import * as FormData from 'form-data'

export interface IConfig {
  protocol: string
  hostName: string
  tokenURL: string
  rootEndPoint: string
  clientId: string
  clientSecret: string
}

export default function (config: any) {
  let token: string

  const apiURL = `${config.protocol}://${config.hostName}`
  const apiToken = `${apiURL}${config.tokenURL}`
  const apiRoot = `${apiURL}${config.rootEndPoint}`

  /**
   * Helper to create proper FormData for POST requests body
   */
  function formData(body: { [key: string]: string }) {
    const form = new FormData()
    for (let key in body) {
      form.append(key, body[key])
    }
    return form
  }

  /**
   * Get API Access Token
   */
  function getToken() {
    return new Promise<String>((resolve, reject) => {

      // If no token has been fetched, ask it to the server
      if (token === undefined) {
        fetch(apiToken, {
          method: 'POST',
          body: formData({
            'grant_type': 'client_credentials',
            'client_id': config.clientId,
            'client_secret': config.clientSecret
          })
        })
          .then(res => res.json())
          .then(body => {
            const token = body['access_token']

            if (token !== undefined)
              resolve(token)
            else
              reject(new Error('No Access Token returned by server'))
          })
          .catch(err => reject(err))
      }
      // If we already stored a token, return it
      else {
        resolve(token)
      }
    })
  }

  /**
   * Perform a GET on API resource
   */
  function get(endPoint: string) {

    return new Promise((resolve, reject) => {

      getToken()
        .then(token => {
          fetch(`${apiRoot}/${endPoint}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(res => res.json())
            .then(body => resolve(body))
            .catch(err => reject(err))
        })

    })
  }

  /**
   * Perform a POST on API resource
   */
  function post(endPoint: string) {
    return new Promise((resolve, reject) => {

      getToken()
        .then(token => {
          fetch(`${apiRoot}/${endPoint}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(res => res.json())
            .then(body => resolve(body))
            .catch(err => reject(err))
        })

    })
  }

  /**
   * Expose module
   */
  return {
    getToken,
    get,
    post
  }
}
