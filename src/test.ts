
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

getUsers()
  .then(users =>
    Promise
      .all(users.map(user =>
        getUser(user.id)
      ))
      .then(users =>
        users.map(user => ({
          login: user.login,
          fullName: user.first_name,
          firstName: user.first_name,
          lastName: user.last_name
        }))
      )
      .then(data =>
        console.log(data)
      )
      .catch(err =>
        console.error(err)
      )
  )
