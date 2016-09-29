
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

export type ApiUsers = {
  id: number,
  login: string,
  url: string
}[]

export type ApiUserProject = {
  id: number,
  occurrence: number,
  final_mark: number,
  status: string,
  'validated?': boolean,
  current_team_id: number,
  project: {
    id: number,
    name: string,
    slug: string
  }
}

export type ApiUser = {
  id: number,
  email: string,
  login: string,
  first_name: string,
  last_name: string,
  url: string,
  phone: string,
  displayname: string,
  image_url: string,
  'staff?': boolean,
  correction_point: number,
  pool_month: string,
  pool_year: string,
  location: string,
  wallet: number,
  groups: any[],
  cursus_users: {
    id: number,
    begin_at: string,
    end_at: string,
    grade: string,
    level: number,
    skills: any[],
    cursus_id: number,
    user: {
      id: number,
      login: string,
      url: string
    },
    cursus: {
      id: number,
      created_at: string,
      name: string,
      slug: string
    }
  }[],
  projects_users: ApiUserProject[],
  achievements: {
    id: number,
    name: string,
    description: string,
    tier: string,
    kind: string,
    visible: boolean,
    image: string,
    nbr_of_success: number,
    users_url: string
  }[],
  titles: any[],
  partnerships: {
    id: number,
    name: string,
    slug: string,
    tier: number,
    url: string,
    partnerships_users_url: string
  }[],
  patroned: {
    id: number,
    user_id: number,
    godfather_id: number,
    ongoing: boolean,
    created_at: string,
    updated_at: string
  }[],
  patroning: any[],
  expertises_users: {
    id: number,
    expertise_id: number,
    interested: boolean,
    value: number,
    contact_me: boolean,
    created_at: string,
    user_id: number
  }[],
  campus: {
    id: number,
    name: string,
    time_zone: string,
    language: {
      id: number,
      name: string,
      identifier: string,
      created_at: string,
      updated_at: string
    },
    users_count: number,
    vogsphere_id: number
  }[]
}
