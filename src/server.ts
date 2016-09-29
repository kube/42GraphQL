
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

const app = express()

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(4000, () =>
  console.log('GraphQL 42 Api listening at localhost:4000')
)
