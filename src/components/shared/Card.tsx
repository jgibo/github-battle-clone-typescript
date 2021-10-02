import clsx from "clsx"
import { ReactNode } from "react"

interface CardProps {
   className?: string
   children: ReactNode | Element
}

export function Card(props: CardProps) {
   return (
      <div className={clsx("bg-light", "p-8 rounded-md", props.className)} style={{ width: "290px" }}>
         {props.children}
      </div>
   )
}
