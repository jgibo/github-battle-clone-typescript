import { useLocation } from "react-router"
import querystring from "query-string"
import { UserData, UserReposData, useUserQuery, useUserReposQuery } from "../api"
import { ReactNode, useRef } from "react"
import ms from "ms"
import { Card } from "../components/shared/Card"
import clsx from "clsx"
import { UsernameIcon } from "../assets/svg/UsernameIcon"
import { LocationIcon } from "../assets/svg/LocationIcon"
import { FollowersIcon } from "../assets/svg/FollowersIcon"
import { FollowingIcon } from "../assets/svg/FollowingIcon"
import { ReposIcon } from "../assets/svg/ReposIcon"
import { numberFormatter } from ".."
import { Link } from "react-router-dom"

const PlayerBattleResult = {
   Winner: "Winner",
   Loser: "Loser",
   Draw: "Draw",
} as const

interface BattleResultCardProps {
   score: number
   result: keyof typeof PlayerBattleResult
   username: string
   avatarUrl: string
   url: string
   realName: string
   location?: string
   followers: number
   following: number
   reposCount: number
}

const cacheTime = ms("60s")
const staleTime = cacheTime

export function BattleResult() {
   const location = useLocation()
   const q = querystring.parse(location.search) as { [key: string]: string }
   const playerOneQuery = useUserQuery(q.p1, { staleTime, cacheTime })
   const playerTwoQuery = useUserQuery(q.p2, { staleTime, cacheTime })
   const playerOneRepos = useUserReposQuery(q.p1, { staleTime, cacheTime })
   const playerTwoRepos = useUserReposQuery(q.p2, { staleTime, cacheTime })

   function calculateScores() {
      if (!playerOneQuery.data || !playerOneRepos.data || !playerTwoQuery.data || !playerTwoRepos.data) {
         throw Error("Expected players data to be available")
      }

      const calcFollowersScore = (data: UserData) => data.followers * 3
      const calcStarsScore = (data: UserReposData) => data.reduce((acc, x) => acc + x.stargazers_count, 0)

      const playerOneScore = calcFollowersScore(playerOneQuery.data) + calcStarsScore(playerOneRepos.data)
      const playerTwoScore = calcFollowersScore(playerTwoQuery.data) + calcStarsScore(playerTwoRepos.data)

      return { playerOneScore, playerTwoScore }
   }

   const isDataReady = playerOneQuery.data && playerTwoQuery.data && playerOneRepos.data && playerTwoRepos.data
   if (isDataReady) {
      const { playerOneScore, playerTwoScore } = calculateScores()
      let playerOneResult, playerTwoResult
      if (playerOneScore > playerTwoScore) {
         playerOneResult = PlayerBattleResult.Winner
         playerTwoResult = PlayerBattleResult.Loser
      } else if (playerTwoScore > playerOneScore) {
         playerOneResult = PlayerBattleResult.Loser
         playerTwoResult = PlayerBattleResult.Winner
      } else {
         playerOneResult = PlayerBattleResult.Draw
         playerTwoResult = PlayerBattleResult.Draw
      }

      return (
         <div>
            <div className="flex justify-around mt-8">
               <BattleResultCard
                  score={playerOneScore}
                  result={playerOneResult}
                  username={q.p1}
                  avatarUrl={playerOneQuery.data.avatar_url}
                  url={playerOneQuery.data.html_url}
                  realName={playerOneQuery.data.name}
                  location={playerOneQuery.data.location}
                  followers={playerOneQuery.data.followers}
                  following={playerOneQuery.data.following}
                  reposCount={playerOneQuery.data.public_repos}
               />
               <BattleResultCard
                  score={playerTwoScore}
                  result={playerTwoResult}
                  username={q.p2}
                  avatarUrl={playerTwoQuery.data.avatar_url}
                  url={playerTwoQuery.data.html_url}
                  realName={playerTwoQuery.data.name}
                  location={playerTwoQuery.data.location}
                  followers={playerTwoQuery.data.followers}
                  following={playerTwoQuery.data.following}
                  reposCount={playerTwoQuery.data.public_repos}
               />
            </div>
            <div className="flex justify-center mt-16">
               <Link to="/battle" className="w-60 p-2 bg-black text-white text-center">
                  Reset
               </Link>
            </div>
         </div>
      )
   } else {
      return <div className="flex justify-around mt-8">Loading</div>
   }
}

function BattleResultCard(props: BattleResultCardProps) {
   console.log("BattleResultCard", props)
   return (
      <Card>
         <div className={clsx("flex flex-col items-center justify-center")}>
            <span className="text-2xl mb-3">{props.result}</span>
            <img className="mb-3" width={120} height={120} src={props.avatarUrl} alt="Github user profile" />
            <span className="text-center">Score: {props.score}</span>
            <a href={props.url} rel="noreferrer" className="a-medium-bright text-2xl mb-3 text-center">
               {props.username}
            </a>
            <div className="self-start text-xl">
               <div className="flex items-center mb-1.5 font-medium">
                  <UsernameIcon />
                  <span className="ml-2">{props.realName}</span>
               </div>
               {props.location && (
                  <div className="flex items-center mb-1.5">
                     <LocationIcon />
                     <span className="ml-2">{props.location}</span>
                  </div>
               )}
               <div className="flex items-center mb-1.5">
                  <FollowersIcon />
                  <span className="ml-2">{props.followers} followers</span>
               </div>
               <div className="flex items-center">
                  <FollowingIcon />
                  <span className="ml-2">{props.following} following</span>
               </div>
               <div className="flex items-center">
                  <ReposIcon />
                  <span className="ml-2">{props.reposCount} repositories</span>
               </div>
            </div>
         </div>
      </Card>
   )
}
