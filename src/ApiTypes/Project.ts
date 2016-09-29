
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

export type ApiProjects = ApiProject[]

export type ApiProjectShort = {
  id: number,
  created_at: string,
  name: string,
  slug: string
}

export type ApiCursusShort = {
  id: number,
  created_at: string,
  name: string,
  slug: string
}

export type ApiSkillShort = {
  id: number,
  name: string,
  created_at: string
}

export type ApiTagShort = {
  id: number,
  name: string
}

export type ApiScaleShort = {
  id: number,
  correction_number: number,
  is_primary: boolean
}

export type ApiProjectUploadShort = {
  id: number,
  name: string,
}

export type ApiProjectSessionShort = {
  id: number,
  solo: boolean,
  begin_at: string,
  end_at: string,
  estimate_time: number,
  duration_days: number,
  terminating_after: string,
  project_id: number,
  campus_id: number,
  cursus_id: number,
  created_at: string,
  updated_at: string,
  max_people: number,
  is_subscriptable: boolean,
  scales: ApiScaleShort[],
  uploads: ApiProjectUploadShort[],
  team_behaviour: string,
}

export type ApiProject = {
  id: number,
  name: string,
  slug: string,
  description: string,
  parent: ApiProjectShort[],
  children: ApiProjectShort[],
  objectives: string[],
  tier: number,
  attachments: any[],
  created_at: string,
  updated_at: string,
  exam: boolean,
  cursus: ApiCursusShort[],
  skills: ApiSkillShort[],
  tags: ApiTagShort[],
  project_sessions: ApiProjectSessionShort
}
