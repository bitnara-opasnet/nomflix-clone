import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import Header from "./Components/Headers";

export default function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/">
                    <Home />
                </Route>
                <Route path="/tv">
                    <Tv />
                </Route>
                <Route path="/search">
                    <Search />
                </Route>
            </Switch>
        </Router>
    );
}