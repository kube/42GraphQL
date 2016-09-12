
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import config from './config'
import api from './abstraction'
import * as async from 'async'

const { getUser, getUsers } = api(config)

// A simple test

getUsers()
  .then(users => async.map(users, function (user, next) {

    getUser(user.id)
      .then(user => {
        // Format user item
        next(null, {
          login: user.login,
          fullName: user.first_name,
          firstName: user.first_name,
          lastName: user.last_name
        })
      })
      .catch(err => {
        next(err, null)
      })

  }, function (err, users) {
    if (err) {
      throw err
    }
    console.log(users)
  }))
