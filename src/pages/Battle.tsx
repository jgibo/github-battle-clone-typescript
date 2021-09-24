import { MouseEventHandler, ReactNode, useState } from "react"
import { UsersIcon } from "../assets/svg/UsersIcon"
import { JetFighterIcon } from "../assets/svg/JetFighterIcon"
import { TrophyIcon } from "../assets/svg/TrophyIcon"
import clsx from "clsx"

interface BattleInstructionsCardProps {
   title: string
   icon: ReactNode
}

interface BattleInputFormProps {
   label: string
   onSubmit: MouseEventHandler<HTMLButtonElement>
   className?: string
}

export function Battle() {
   return (
      <div>
         <h2 className="text-2xl mb-2 text-center">Instructions</h2>
         <div className="flex flex-wrap justify-around">
            <BattleInstructionsCard
               title="Enter two Github users"
               icon={<UsersIcon />}
            />
            <BattleInstructionsCard title="Battle" icon={<JetFighterIcon />} />
            <BattleInstructionsCard
               title="See the winner"
               icon={<TrophyIcon />}
            />
         </div>
         <div className="mt-16">
            <h2 className="text-2xl text-center">Players</h2>
            <div className="flex">
               <BattleInputForm
                  className="w-1/2 m-4"
                  label="Player One"
                  onSubmit={() => {}}
               />
               <BattleInputForm
                  className="w-1/2 m-4"
                  label="Player Two"
                  onSubmit={() => {}}
               />
            </div>
         </div>
      </div>
   )
}

export function BattleInstructionsCard(props: BattleInstructionsCardProps) {
   return (
      <div className="text-center" style={{ minWidth: "320px" }}>
         <h3 className="text-xl">{props.title}</h3>
         <div className="mx-auto inline-block p-12 bg-gray-200">
            {props.icon}
         </div>
      </div>
   )
}

export function BattleInputForm(props: BattleInputFormProps) {
   const [value, setValue] = useState("")

   const submitEnabled = !!value

   return (
      <form
         className={clsx("flex flex-col flex-1 min-w-min", props.className)}
         onSubmit={(e) => e.preventDefault()}
      >
         <label>{props.label}</label>
         <div className="flex">
            <input
               className="p-2 mr-2 bg-gray-100 flex-2"
               placeholder="github username"
               value={value}
               onChange={(e) => setValue(e.target.value)}
            />
            <button
               className={clsx("flex-1 p-2", {
                  "bg-black text-white": submitEnabled,
                  "bg-gray-200 text-gray-400": !submitEnabled,
               })}
               onClick={props.onSubmit}
            >
               Submit
            </button>
         </div>
      </form>
   )
}
