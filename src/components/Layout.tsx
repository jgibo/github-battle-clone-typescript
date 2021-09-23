import { ReactNode } from "react"
import { Link } from "react-router-dom"

export const Layout = (props: { children: ReactNode }) => {
   return (
      // main
      <div className="mx-auto border border-red-500" style={{maxWidth: "1200px"}}>
         <nav>
            <Link to="/popular">Popular</Link>
            <Link to="/battle" className="ml-2">
               Battle
            </Link>
         </nav>
         <div>{props.children}</div>
      </div>
   )
}

// function NavLink() {}
