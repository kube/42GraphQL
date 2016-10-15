
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import { QueryStringArgs } from '42api'

export type QueryArgs = {
  [key: string]: any
}

/**
 * Convert GraphQL Query Args to 42 api QueryStringArgs
 */
const formatArgs = (args: QueryArgs): QueryStringArgs => {
  if (!args) return null

  const qsargs = {
    page: {} as any,
    filter: {} as any,
    sort: [] as string[],
  }

  Object.keys(args)
    .forEach(key =>
      key === 'page' ?
        qsargs.page.number = args['page']
        : key === 'sortBy' ?
          qsargs.sort = [args['sortBy']]
          : qsargs.filter[key] = args[key]
    )
  return qsargs
}

export default formatArgs
