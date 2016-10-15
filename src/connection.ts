
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { Connection } from '42api'

const config = {
  clientId: process.env['CLIENT_ID'],
  clientSecret: process.env['CLIENT_SERVER']
}

// If no credentials were passed in ENV
if (!(config.clientId && config.clientSecret)) {
  // Load from credentials.json
  // Will crash if none exist
  const credentials = require('../credentials.json')

  config.clientId = credentials.uid
  config.clientSecret = credentials.secret
}

export default new Connection(config.clientId, config.clientSecret)
