import { ReactNode } from "react"
import { useParams } from "react-router"
import { NavLink } from "react-router-dom"
import { LanguageParam, useReposQuery } from "../api"
import { ForksIcon } from "../assets/svg/ForksIcon"
import { StarsIcon } from "../assets/svg/StarsIcon"
import { IssuesIcon } from "../assets/svg/IssuesIcon"
import { UsernameIcon } from "../assets/svg/UsernameIcon"
import clsx from "clsx"
import { numberFormatter } from ".."

interface RouteParams {
   language: LanguageParam | undefined
}

interface RepoCardProps {
   className: string
   repoName: string
   repoUrl: string
   ownerAvatarUrl: string
   ownerUrl: string
   username: string
   rank: number
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
            className="RepoCard my-2.5"
            rank={i + 1}
            ownerAvatarUrl={v.owner.avatar_url}
            ownerUrl={v.owner.html_url}
            repoName={v.name}
            repoUrl={v.html_url}
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
         <div className="flex flex-wrap justify-around">
            {content}
         </div>
      </div>
   )
}

function RepoSelectorNav() {
   return (
      <nav className="flex justify-center">
         <NavLink to="/popular" className="a-nav-link" activeClassName="a-nav-link--active" exact>All</NavLink>
         <NavLink to="/popular/JavaScript" className="a-nav-link ml-2" activeClassName="a-nav-link--active">
            JavaScript
         </NavLink>
         <NavLink to="/popular/Ruby" className="a-nav-link ml-2" activeClassName="a-nav-link--active">
            Ruby
         </NavLink>
         <NavLink to="/popular/Java" className="a-nav-link ml-2" activeClassName="a-nav-link--active">
            Java
         </NavLink>
         <NavLink to="/popular/CSS" className="a-nav-link ml-2" activeClassName="a-nav-link--active">
            CSS
         </NavLink>
         <NavLink to="/popular/Python" className="a-nav-link ml-2" activeClassName="a-nav-link--active">
            Python
         </NavLink>
      </nav>
   )
}

function RepoCard(props: RepoCardProps) {
   return (
      <div
         className={clsx(
            "flex flex-col items-center justify-center p-8 bg-gray-200 rounded-md",
            props.className
         )}
         style={{ width: "290px" }}
      >
         <span className="text-2xl mb-3">#{props.rank}</span>
         <img
            className="mb-3"
            width={120}
            height={120}
            src={props.ownerAvatarUrl}
            alt="Github user profile"
         />
         <a href={props.repoUrl} rel="noreferrer" className="a-medium-bright text-2xl mb-3 text-center">{props.repoName}</a>
         <div className="self-start text-xl">
            <div className="flex items-center mb-1.5 font-medium">
               <UsernameIcon />
               <a target="_blank" rel="noreferrer" href={props.ownerUrl} className="a-medium ml-2">{props.username}</a>
            </div>
            <div className="flex items-center mb-1.5">
               <StarsIcon />
               <span className="ml-2">{numberFormatter.format(props.stars)} stars</span>
            </div>
            <div className="flex items-center mb-1.5">
               <ForksIcon />
               <span className="ml-2">{numberFormatter.format(props.forks)} forks</span>
            </div>
            <div className="flex items-center">
               <IssuesIcon />
               <span className="ml-2">{numberFormatter.format(props.openIssues)} open issues</span>
            </div>
         </div>
      </div>
   )
}
