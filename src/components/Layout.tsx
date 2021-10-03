import { ReactNode } from "react"
import { NavLink } from "react-router-dom"

export const Layout = (props: { children: ReactNode }) => {
   return (
      // main
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
         <nav>
            <NavLink to="/popular" className="a-nav-link" activeClassName="a-nav-link--active">
               Popular
            </NavLink>
            <NavLink to="/battle" className="a-nav-link ml-2" activeClassName="a-nav-link--active">
               Battle
            </NavLink>
         </nav>
         <div>{props.children}</div>
      </div>
   )
}

// function NavLink() {}
