import { IConfig } from './api'

const config: IConfig = {
  protocol: 'https',
  hostName: 'api.intra.42.fr',
  tokenURL: '/oauth/token',
  rootEndPoint: '/v2',
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

export default config
