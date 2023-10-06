import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from "../pages/Home";
// import FileExplorer from "../components/FileExplorer/FileExplorerController";
// import Algorithms from "../components/Algorithms/Algorithms";
// import Pipelines from "../components/Pipelines";
// import Navigation from "../components/SideBar/SideBar";
// import Error from "../components/Error";
// import Layout from "../components/Layout/Layout";

class CustomRouter extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    {/*<Layout />*/}
                    <Switch>
                        <Route path="/" component={Home} exact />
                        {/*<Route path="/fileexplorer" component={FileExplorer} />*/}
                        {/*<Route path="/algorithms" component={Algorithms} />*/}
                        {/*<Route path="/pipelines" component={Pipelines} />*/}
                        {/*<Route component={Error} />*/}
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
};

export default CustomRouter;
