import axios from "axios"
import { useQuery, UseQueryOptions } from "react-query"

const gh = axios.create({
   baseURL: "https://api.github.com",
   headers: {
      Accept: "application/vnd.github.v3+json",
   },
   auth: {
      username: process.env.REACT_APP_GH_USERNAME!,
      password: process.env.REACT_APP_GH_PERSONAL_TOKEN!,
   },
})

export type LanguageParam = "All" | "javascript" | "ruby" | "java" | "css" | "python"

interface ReposData {
   total_count: number
   incomplete_results: boolean
   items: Array<ReposDataItem>
}

interface ReposDataItem {
   id: number
   name: string
   stargazers_count: number
   forks: number
   open_issues: number
   html_url: string
   owner: {
      login: string
      avatar_url: string
      html_url: string
   }
}

export interface UserData {
   avatar_url: string
   html_url: string
   followers: number
   following: number
   repos_url: string
   public_repos: number
   name: string
   location?: string
}

export interface UserRepoDataItem {
   stargazers_count: number
}

export type UserReposData = Array<UserRepoDataItem>

export function useReposQuery(language: LanguageParam) {
   return useQuery<ReposData, Error>(["repos", language], async () => {
      const res = await gh.get(`/search/repositories`, {
         params: {
            q: `stars:>=30 language:${language}`,
            sort: "stars",
            order: "desc",
            per_page: 30,
         },
      })
      return res.data as ReposData
   })
}

export function useUserQuery(username: string, options?: UseQueryOptions<UserData, Error>) {
   return useQuery<UserData, Error>(
      ["user", username],
      async () => {
         const res = await gh.get(`/users/${username}`)
         return res.data as UserData
      },
      options
   )
}

export async function getUserRepos(username: string) {
   const res = await gh.get(`/users/${username}/repos`)
   return res.data as UserReposData
}

export function useUserReposQuery(username: string, options?: UseQueryOptions<UserReposData, Error>) {
   return useQuery<UserReposData, Error>(
      ["user-repos", username],
      async () => {
         return getUserRepos(username)
      },
      options
   )
}
