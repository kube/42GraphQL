
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
import schema from './Schema'

const PORT = process.env['PORT'] || 4000

express()
.use('/', graphqlHTTP({
  schema,
  graphiql: true
}))
.listen(PORT, () =>
  console.log(`42 GraphQL listening at port ${PORT}`)
)
