import { Route, Switch, Redirect } from "react-router-dom"
import { PopularRepos } from "./pages/PopularRepos"
import { Battle } from "./pages/Battle"
import { Layout } from "./components/Layout"

function App() {
   return (
      <Layout>
         <Switch>
            <Route path="/" exact>
               <Redirect to="/popular" />
            </Route>
            <Route path="/popular/:language?" component={PopularRepos} />
            <Route path="/battle" component={Battle} />
         </Switch>
      </Layout>
   )
}

export default App
