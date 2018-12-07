import React from 'react';
import { Router, Route, Switch  } from "react-router-dom";
import Index from '../index/Index'
import Vip from '../Vip/Vip'

import createHashHistory from 'history/createHashHistory'
const history = createHashHistory()
const Main = () => (

    <Router history={history}>
        <Switch>
             <Route path="/" exact component={Index} />
             <Route path="/vip" component={Vip} />
        </Switch>
    </Router>
    
)

export default Main;
