import { Header } from './header/Header'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import { HomeComponent } from './Home';
import { GameComponent } from './Game';
import { JoinComponent } from './Join';
import { ErrorComponent } from './Error';

import { socketWrapper, SocketContext } from './context/socket'


export const App = () => {

  return (
    <Router>
      <div className="container-fluid">
        <Header />

        <SocketContext.Provider value={socketWrapper}>
          <Switch>
            <Route exact path="/" component={HomeComponent} />
            <Route path="/game/:id" component={GameComponent} />
            <Route path="/join/:id" component={JoinComponent} />
            <Route path="/error/:errorMessage" component={ErrorComponent}/>
            <Route path="*" component={ErrorComponent} />
          </Switch>
        </SocketContext.Provider>
      </div>
    </Router>
  );
}



