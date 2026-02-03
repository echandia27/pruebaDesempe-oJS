//Here all exports will be centralized

import { initLogin } from "./pagesLogin.js";
import { initRegister } from "./pagesRegister.js";
import { initUserTasks } from "./userTasks.js";
import { initUserProfile } from "./userProfile.js";
import { initAdminDashboard } from "./adminDashboard.js";
import { initAdminTasks } from "./adminTasks.js";

const page = document.body.dataset.page;

const routes = {
  login: initLogin,
  register: initRegister,
  userTasks: initUserTasks,
  userProfile: initUserProfile,
  adminDashboard: initAdminDashboard,
  adminTasks: initAdminTasks,
};

routes[page]?.();
