import React, {useState} from 'react';

import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        Julio Romero
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function App() {
  const [tokenLogin, setTokenLogin] = useState(null);
  return (
      <Router>
        <main>
          <Switch>
            <Route path="/" exact>
              <Login setToken={setTokenLogin}/>
            </Route>
            <Route path="/dashboard" exact>
              <Dashboard token={tokenLogin} />
            </Route>
            <Redirect to="/" />
          </Switch>
        </main>
        <footer>
          <Box mt={5}>
            <Copyright />
          </Box>
        </footer>
      </Router>
  );
}

export default App;
