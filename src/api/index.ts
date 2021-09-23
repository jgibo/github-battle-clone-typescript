import axios from "axios"
import { useQuery } from "react-query"

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

export type LanguageParam =
   | "All"
   | "javascript"
   | "ruby"
   | "java"
   | "css"
   | "python"

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

export function useReposQuery(language: LanguageParam) {
   return useQuery<ReposData, Error>(`repos-${language}`, async () => {
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
