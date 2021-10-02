import { useLocation } from "react-router"
import querystring from "query-string"
import { UserData, UserReposData, useUserQuery, useUserReposQuery } from "../api"
import { useRef } from "react"
import ms from "ms"

interface BattleResultCardProps {
   score: number
   winner: boolean
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
   const playerOneScore = useRef<number>()
   const playerTwoScore = useRef<number>()

   function calculateScore() {
      const calcFollowersScore = (data: UserData) => data.followers * 3
      const calcStarsScore = (data: UserReposData) => data.reduce((acc, x) => acc + x.stargazers_count, 0)

      playerOneScore.current = calcFollowersScore(playerOneQuery.data!) + calcStarsScore(playerOneRepos.data!)
      playerTwoScore.current = calcFollowersScore(playerTwoQuery.data!) + calcStarsScore(playerTwoRepos.data!)
   }

   const isLoading = playerOneQuery.isLoading && playerTwoQuery.isLoading && playerOneRepos.data && playerTwoRepos.data

   if (!isLoading) {
      calculateScore()
   }

   return (
      <div>
         {isLoading ? (
            "Loading"
         ) : (
            <>
               <BattleResultCard
                  score={playerOneScore.current!}
                  winner={playerOneScore.current! >= playerTwoScore.current!}
               />
               <BattleResultCard
                  score={playerTwoScore.current!}
                  winner={playerTwoScore.current! >= playerOneScore.current!}
               />
               <button>Reset</button>
            </>
         )}
      </div>
   )
}

function BattleResultCard(props: BattleResultCardProps) {
   console.log("BattleResultCard", props)
   return <div>BattleResultCard</div>
}
