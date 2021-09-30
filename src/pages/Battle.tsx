import { ReactNode, useState } from "react"
import { UsersIcon } from "../assets/svg/UsersIcon"
import { JetFighterIcon } from "../assets/svg/JetFighterIcon"
import { TrophyIcon } from "../assets/svg/TrophyIcon"
import { RedCrossIcon } from "../assets/svg/RedCrossIcon"
import clsx from "clsx"
import { useUserQuery } from "../api"
import { useQueryClient } from "react-query"
import { Link } from "react-router-dom"
import querystring from "query-string"

interface BattleInstructionsCardProps {
   title: string
   icon: ReactNode
}

interface BattleParticipantFormProps {
   label: string
   usernameValue: string
   setUsernameValue: React.Dispatch<React.SetStateAction<string>>
   onSubmit: () => void
   className?: string
}

interface BattlePlayerCardProps {
   avatarUrl?: string
   username?: string
   isFetching?: boolean
   className?: string
   onClear: () => void
}

export function Battle() {
   const [playerOneValue, setPlayerOneValue] = useState("")
   const [playerTwoValue, setPlayerTwoValue] = useState("")
   const queryClient = useQueryClient()
   const playerOneQuery = useUserQuery(playerOneValue, { enabled: false })
   const playerTwoQuery = useUserQuery(playerTwoValue, { enabled: false })

   const battleReady = !!playerOneQuery.data && !!playerTwoQuery.data

   return (
      <div>
         <h2 className="text-2xl mb-4 text-center">Instructions</h2>
         <div className="flex flex-wrap justify-around mb-16">
            <BattleInstructionsCard title="Enter two Github users" icon={<UsersIcon />} />
            <BattleInstructionsCard title="Battle" icon={<JetFighterIcon />} />
            <BattleInstructionsCard title="See the winner" icon={<TrophyIcon />} />
         </div>
         <div>
            <h2 className="text-2xl text-center mb-4">Players</h2>
            <div className="flex">
               {playerOneQuery.isIdle ? (
                  <BattleParticipantForm
                     className="mr-4"
                     label={"Player One"}
                     usernameValue={playerOneValue}
                     setUsernameValue={setPlayerOneValue}
                     onSubmit={() => playerOneQuery.refetch()}
                  />
               ) : (
                  <BattlePlayerCard
                     className="mr-8"
                     isFetching={playerOneQuery.isFetching}
                     avatarUrl={playerOneQuery.data?.avatar_url}
                     username={playerOneValue}
                     onClear={() => {
                        queryClient.resetQueries(["user", playerOneValue])
                        setPlayerOneValue("")
                     }}
                  />
               )}
               {playerTwoQuery.isIdle ? (
                  <BattleParticipantForm
                     label={"Player Two"}
                     usernameValue={playerTwoValue}
                     setUsernameValue={setPlayerTwoValue}
                     onSubmit={() => playerTwoQuery.refetch()}
                  />
               ) : (
                  <BattlePlayerCard
                     isFetching={playerTwoQuery.isFetching}
                     avatarUrl={playerTwoQuery.data?.avatar_url}
                     username={playerTwoValue}
                     onClear={() => {
                        queryClient.resetQueries(["user", playerTwoValue])
                        setPlayerTwoValue("")
                     }}
                  />
               )}
            </div>
            {battleReady && (
               <div className="flex justify-center mt-12">
                  <Link
                     to={{
                        pathname: "/battle/results",
                        search: querystring.stringify({ p1: playerOneValue, p2: playerTwoValue }),
                     }}
                     className="text-center w-60 p-2 bg-black text-white"
                  >
                     Battle
                  </Link>
               </div>
            )}
         </div>
      </div>
   )
}

function BattleInstructionsCard(props: BattleInstructionsCardProps) {
   return (
      <div className="text-center" style={{ minWidth: "320px" }}>
         <h3 className="text-xl">{props.title}</h3>
         <div className="mx-auto inline-block p-12 bg-gray-200">{props.icon}</div>
      </div>
   )
}

function BattleParticipantForm(props: BattleParticipantFormProps) {
   const submitEnabled = !!props.usernameValue

   return (
      <form className={clsx("flex flex-col flex-1 min-w-min", props.className)} onSubmit={(e) => e.preventDefault()}>
         <label>{props.label}</label>
         <div className="flex">
            <input
               className="p-2 mr-2 bg-gray-100 flex-2"
               placeholder="github username"
               value={props.usernameValue}
               onChange={(e) => props.setUsernameValue(e.target.value)}
            />
            <button
               className={clsx("flex-1 p-2", {
                  "bg-black text-white": submitEnabled,
                  "bg-gray-200 text-gray-400": !submitEnabled,
               })}
               disabled={!submitEnabled}
               onClick={props.onSubmit}
            >
               Submit
            </button>
         </div>
      </form>
   )
}

function BattlePlayerCard(props: BattlePlayerCardProps) {
   const height = 55

   return (
      <div className={clsx("box-content flex flex-1 items-center p-2 bg-gray-200", props.className)} style={{ height }}>
         <img className="rounded-full mr-2" src={props.avatarUrl} style={{ width: height, height }} />
         <span>{props.username}</span>
         <button className="ml-auto" onClick={props.onClear}>
            <RedCrossIcon />
         </button>
      </div>
   )
}
