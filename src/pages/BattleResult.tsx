import { useLocation } from "react-router"
import querystring from "query-string"

export function BattleResult() {
   const location = useLocation()

   const q = querystring.parse(location.search)

   return (
      <>
         Battle with {q.p1} {q.p2}
      </>
   )
}
