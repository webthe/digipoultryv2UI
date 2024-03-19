import React from "react";
import logo from "./logo.svg";
import "./App.css";

import TopHeader from "./components/layout/TopHeader";
import TopFooter from "./components/layout/TopFooter";
import Dashboard from "./components/pages/Dashboard";
import Login from './components/pages/Login';
import BatchOperations from "./components/pages/BatchOperations";
import BatchHistory from "./components/pages/BatchHistory";
import MyFarms from "./components/pages/MyFarms";
import Mortality from "./components/pages/Mortality";
import GrowthCurve from "./components/pages/GrowthCurve";
import DeviceManagement from "./components/pages/DeviceManagement";
import SensorCalibration from "./components/pages/SensorCalibrations";
import {  useLocation, BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Templates from "./components/pages/Templates";
import BatchMaster from "./components/pages/AddBatch";
import FarmMaster from "./components/pages/AddBarn";
import Users from "./components/pages/Users";
import AddUser from "./components/pages/AddUser";
import BatchSummary from "./components/pages/BatchSummary";
import ForgotPassword from "./components/pages/ForgotPassword";
import ManageFans from "./components/pages/ManageFans";
import IdealsComparison from "./components/pages/IdealsComparison";
import MortalityComparison from "./components/pages/MortalityComparison";
import SetPassword from "./components/pages/SetPassword";
import MyProfile from "./components/pages/MyProfile";
import AddTemplates from "./components/pages/AddTemplates";
import AppVideos from "./components/pages/AppVideos";
import Videos from "./components/pages/Videos";
import DailyOperationsReport from "./components/pages/DailyOperationsReport";
import ControlSystems from "./components/pages/ConstrolSystem";
import Integrators from "./components/pages/Integrators";
function App() {
  
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Login}></Route>
          <Route exact path="/login" component={Login}></Route>
          <Route exact path="/validate/:user" component={SetPassword}></Route>
          <Route exact path="/forgotpassword" component={ForgotPassword}></Route>
          <div class="wrapper">
            <TopHeader />
            <div className="content myappcontent">
              <div className="container-fluid">
                <Route exact path="/dashboard" component={Dashboard}></Route>
                <Route exact path="/batchOperations" component={BatchOperations}></Route>
                <Route exact path="/batchHistory" component={BatchHistory}></Route>
                <Route exact path="/listofbarns" component={MyFarms}></Route>
                <Route exact path="/mortality" component={Mortality}></Route>
                <Route exact path="/growthcurve" component={GrowthCurve}></Route>
                <Route exact path="/managedevices" component={DeviceManagement}></Route>
                <Route exact path="/sesorcalibration" component={SensorCalibration}></Route>
                <Route exact path="/templates" component={Templates}></Route>
                <Route exact path="/addBatch" component={BatchMaster}></Route>
                <Route exact path="/addBarn" component={FarmMaster}></Route>
                <Route exact path="/users" component={Users}></Route>
                <Route exact path="/adduser" component={AddUser}></Route>
                <Route exact path="/managefans" component={ManageFans}></Route>
                <Route exact path="/batchSummary/:data" component={BatchSummary}></Route>
                <Route exact path="/idealweightcomparison/" component={IdealsComparison}></Route>
                <Route exact path="/batchcomparison/" component={MortalityComparison}></Route>
                <Route exact path="/myprofile/" component={MyProfile}></Route>
                <Route exact path="/addtemplates/" component={AddTemplates}></Route>
                <Route exact path="/appVideos/" component={AppVideos}></Route>
                <Route exact path="/dopReport/" component={DailyOperationsReport}></Route>
                <Route exact path="/controlSystem/" component={ControlSystems}></Route>
                <Route exact path="/integrators/" component={Integrators}></Route>
              </div>
            </div>
            <TopFooter />
          </div>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
