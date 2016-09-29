
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

import schema from './schema'

express()
.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))
.listen(4000, () =>
  console.log('GraphQL 42 Api listening at localhost:4000')
)
