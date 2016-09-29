
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


import schema from './schema'

const { getUsers } = api(config)

// const schema = buildASTSchema(parse(`
//   type User {
//     id: Int,
//     login: String,
//     url: String
//   }

//   type Query {
//     users(page: Int): [User]
//   }
// `))




const app = express()

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(4000, () =>
  console.log('Listening at localhost:4000')
)
