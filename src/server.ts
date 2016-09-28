
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import { buildASTSchema, parse } from 'graphql'

import config from './config'
import api from './abstraction'

const { getUsers } = api(config)

const schema = buildASTSchema(parse(`
  type User {
    id: Int,
    login: String,
    url: String
  }

  type Query {
    users: [User]
  }
`))

const root = {
  users: () => getUsers()
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}))

app.listen(4000, () =>
  console.log('Listening at localhost:4000')
)
