import { ReactNode } from "react"
import { useParams } from "react-router"
import { Link } from "react-router-dom"
import { LanguageParam, useReposQuery } from "../api"
import { ForksIcon } from "../assets/svg/ForksIcon"
import { StarsIcon } from "../assets/svg/StarsIcon"
import { IssuesIcon } from "../assets/svg/IssuesIcon"
import { UsernameIcon } from "../assets/svg/UsernameIcon"
import clsx from "clsx"

interface RouteParams {
   language: LanguageParam | undefined
}

interface RepoCardProps {
   className: string
   rank: number
   ownerAvatarUrl: string
   username: string
   stars: number
   forks: number
   openIssues: number
}

export function PopularRepos() {
   const { language = "All" } = useParams<RouteParams>()
   const { status, data, error } = useReposQuery(language)

   console.log("language", language)

   let content: ReactNode
   if (status === "loading") {
      content = "loading"
   } else if (status === "error") {
      content = "error :("
   } else {
      content = data!.items.map((v, i) => (
         <RepoCard
            key={v.id}
            className="RepoCard"
            rank={i + 1}
            ownerAvatarUrl={v.owner.avatar_url}
            username={v.owner.login}
            stars={v.stargazers_count}
            forks={v.forks}
            openIssues={v.open_issues}
         />
      ))
   }

   return (
      <div>
         <RepoSelectorNav />
         <div className="flex flex-wrap">{content}</div>
      </div>
   )
}

function RepoSelectorNav() {
   return (
      <nav className="flex justify-center">
         <Link to="/popular">All</Link>
         <Link to="/popular/JavaScript" className="ml-2">
            JavaScript
         </Link>
         <Link to="/popular/Ruby" className="ml-2">
            Ruby
         </Link>
         <Link to="/popular/Java" className="ml-2">
            Java
         </Link>
         <Link to="/popular/CSS" className="ml-2">
            CSS
         </Link>
         <Link to="/popular/Python" className="ml-2">
            Python
         </Link>
      </nav>
   )
}

function RepoCard(props: RepoCardProps) {
   return (
      <div
         className={clsx(
            "flex flex-col items-center justify-center w-1/4 p-6 mr-6 mb-6 bg-gray-200 border border-red-500",
            props.className
         )}
         style={{ width: "250px" }}
      >
         <span>#{props.rank}</span>
         <img
            width={120}
            height={120}
            src={props.ownerAvatarUrl}
            alt="Github user profile"
         />
         <span>{props.username}</span>
         <div className="self-start">
            <div className="flex items-center">
               <UsernameIcon />
               <span className="ml-1">{props.username}</span>
            </div>
            <div className="flex items-center">
               <StarsIcon />
               <span className="ml-1">{props.stars}</span>
            </div>
            <div className="flex items-center">
               <ForksIcon />
               <span className="ml-1">{props.forks}</span>
            </div>
            <div className="flex items-center">
               <IssuesIcon />
               <span className="ml-1">{props.openIssues}</span>
            </div>
         </div>
      </div>
   )
}
