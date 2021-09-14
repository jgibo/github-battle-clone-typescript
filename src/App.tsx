import { Route, Switch } from "react-router-dom"
import { PopularRepos } from "./pages/PopularRepos"
import { Layout } from "./components/Layout"

function App() {
   return (
      <Layout>
         <Switch>
            <Route
               path={["/popular/:language?", "/"]}
               component={PopularRepos}
            />
         </Switch>
      </Layout>
   )
}

export default App
