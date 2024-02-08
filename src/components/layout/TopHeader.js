import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MaterialIcon, {colorPalette} from 'material-icons-react';
import { removeUserSession, getUserName, getRole } from '../utils/common';
import { Role } from '../utils/role';
const TopHeader = (props) => {

  const [userName, setUserName] = useState(getUserName());
  const logout = ()=>{
    removeUserSession();
    window.location = '/login';
  }

  return (
    <div>
      <nav className="main-header navbar-fixed-top navbar navbar-expand-md navbar-light navbar-white">
        <div class="container-fluid" style={{paddingLeft: 20, paddingRight:20}}>
          <NavLink exact to="/dashboard" class="navbar-brand">
          <img src="/dist/img/logo.png" height="40" alt="AdminLTE Logo"></img>
          <span class="brand-text font-weight-bold">iPOULTRY</span>
          </NavLink>
          <button
            class="navbar-toggler order-1"
            type="button"
            data-toggle="collapse"
            data-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse order-3" id="navbarCollapse">
            <ul class="navbar-nav navBar">
              <li class="nav-item">
                <NavLink exact to="/dashboard" className="nav-link">
                  Dashboard
                </NavLink>
              </li>
              <li class="nav-item dropdown">
                <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link dropdown-toggle">Farm Management</a>
                <ul aria-labelledby="dropdownSubMenu1" class="dropdown-menu border-0 shadow">
                  {
                    getRole() == Role.Farmer || getRole() == Role.Admin?
                  <>
                    <NavLink exact to="/addBarn" className="nav-link">
                      Add Barn
                    </NavLink>
                    <NavLink exact to="/addBatch" className="nav-link">
                      Add Batch
                    </NavLink>
                  </>
                  : <></>
                  }
                 <NavLink exact to="/batchOperations" className="nav-link">
                    Batch Operations
                  </NavLink>
                  {
                    getRole() == Role.Farmer || getRole() == Role.Admin?
                  <>
                     <NavLink exact to="/batchHistory" className="nav-link">
                        Batch History
                      </NavLink>
                      <NavLink exact to="/listofbarns" className="nav-link">
                        List of Barns
                      </NavLink>
                      <NavLink exact to="/addtemplates" className="nav-link">
                        Add Templates
                      </NavLink>
                      <NavLink exact to="/templates" className="nav-link">
                        List of Templates
                      </NavLink>
                      {/* <NavLink exact to="/batchSummary" className="nav-link">
                        Batch Summary
                      </NavLink> */}
                  </>
                  : <></>
                  }
                  
                 
                  <NavLink exact to="/managefans" className="nav-link">
                    Manage Fans
                  </NavLink>
                </ul>
              </li>
              {
                    getRole() == Role.Farmer || getRole() == Role.Admin?
                    <>
              <li class="nav-item dropdown">
                <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link dropdown-toggle">User Management</a>
                <ul aria-labelledby="dropdownSubMenu1" class="dropdown-menu border-0 shadow">
                  <NavLink exact to="/adduser" className="nav-link">
                     Create new user
                  </NavLink>
                  <NavLink exact to="/users" className="nav-link">
                     List of users
                  </NavLink>
                  {getRole() == Role.Admin?
                  <>
                  <NavLink exact to="/appVideos" className="nav-link">
                     Videos
                  </NavLink>
                  </> 
                  : <></> 
                }
                </ul>
              </li>
              <li class="nav-item dropdown">
              <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link dropdown-toggle">Analytics</a>
                <ul aria-labelledby="dropdownSubMenu1" class="dropdown-menu border-0 shadow">
          
                  <NavLink exact to="/mortality" className="nav-link">
                    Chick Mortality
                  </NavLink>
                  <NavLink exact to="/growthcurve" className="nav-link">
                    Growth Curve
                  </NavLink>
                  <NavLink exact to="/idealweightcomparison" className="nav-link">
                    Ideal Weights
                  </NavLink>
                  <NavLink exact to="/batchcomparison" className="nav-link">
                    Batch Comparison
                  </NavLink>
                </ul>
              </li>
              <li class="nav-item dropdown">
                <a id="dropdownSubMenu1" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link">Device Management</a>
                <ul aria-labelledby="dropdownSubMenu1" class="dropdown-menu border-0 shadow">
          
                  <NavLink exact to="/managedevices" className="nav-link">
                    List of Devices
                  </NavLink>
                  <NavLink exact to="/sesorcalibration" className="nav-link">
                    Sensor Calibration
                  </NavLink>
                  {/* <NavLink exact to="/" className="nav-link">
                    Feed
                  </NavLink> */}
                </ul>
              </li>
              </>
              :<></>}
            </ul>
          </div>

          <ul class="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
            
            {/* <li class="nav-item dropdown">
              <a class="nav-link alertIcon" data-toggle="dropdown" href="#">
                
                <MaterialIcon icon='notifications_none' size={24} />
                <span class="badge badge-warning navbar-badge">15</span>
              </a>
              <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <span class="dropdown-header">15 Notifications</span>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <i class="fas fa-envelope mr-2"></i> 4 new messages
                  <span class="float-right text-muted text-sm">3 mins</span>
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer">
                  See All Notifications
                </a>
              </div>
            </li> */}
            <li className="loggedas">Logged as: </li>
            <li class="nav-item dropdown">
              <a class="nav-link loggedasButton" data-toggle="dropdown" href="#">
                {userName} <i class="fa fa-caret-down" aria-hidden="true"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-md dropdown-menu-right">
                {/* <a href="#" class="dropdown-item">
                  <i class="fas fa-envelope mr-2"></i> View Profile
                  
                </a> */}
                <span href="#" class="dropdown-item" onClick={logout}>
                  Logout
                </span>
                <span href="#" class="dropdown-item" >
                  <NavLink exact to="/myprofile" className='profileLink'>
                    My Profile
                  </NavLink>
                </span>
              </div> 
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};
export default TopHeader;
