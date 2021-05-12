/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import ListOfUsers from "views/ListOfUsers.js";
import Trace from "views/Trace.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/listofusers",
    name: "Users",
    icon: "nc-icon nc-notes",
    component: ListOfUsers,
    layout: "/admin",
  },
  {
    path: "/trace",
    name: "Trace",
    icon: "nc-icon nc-notes",
    component: Trace,
    layout: "/admin",
  },
];

export default dashboardRoutes;
