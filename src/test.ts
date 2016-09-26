
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

const { getUser, getUsers } = api(config)

// A simple test

getUsers()
  .then(users =>
    Promise
      .all(users.map(user => getUser(user.id)))
      .then(users => {
        let formattedData = users.map(user => ({
          login: user.login,
          fullName: user.first_name,
          firstName: user.first_name,
          lastName: user.last_name
        }))

        console.log(formattedData)
      })
      .catch(err =>
        console.error(err)))
