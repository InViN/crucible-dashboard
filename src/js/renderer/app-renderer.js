/**
 * Main JS for the "Renderer".
 * Look at IPC JS for operations stemming from events sent up from the server.
 */

// Browser Window Object
const {
  BrowserWindow
} = require("electron").remote;

// Is App Maximized
let isAppMaximized = false;

/**
 * Minimize the App.
 */
function minimizeApp() {
  console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Minimizing App.");
  BrowserWindow.getFocusedWindow().minimize();
}

/**
 * Maximize the App.
 */
function maximizeApp() {
  if (isAppMaximized) {
    console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Restoring App.");
    BrowserWindow.getFocusedWindow().restore();
    isAppMaximized = false;
  } else {
    console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Maximizing App.");
    BrowserWindow.getFocusedWindow().maximize();
    isAppMaximized = true;
  }
}

/**
 * Close the App.
 */
function closeApp() {
  console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Quitting App.");
  BrowserWindow.getFocusedWindow().close();
}

/**
 * Reload the current page (force-refresh)
 */
function reloadPage() {
  console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "HTML Reload.");
  window.location.reload(true);
}

/**
 * Backout
 */
function blackout() {
  // Attempt to collapse the Sidebar only if it's currently open
  if (document.getElementById("sidebar").classList.contains("active")) {
    document.getElementById("sidebarCollapse").click();
    document.getElementById("sidebar").classList.add("sidebar-clicked");
  }

  const appWrapper = document.getElementById("appWrapper");
  if (!appWrapper.classList.contains("blackout")) {
    appWrapper.classList.add("blackout");
  }
}

/**
 * Remove Backout
 */
function removeBlackout() {
  // Expand the Sidebar only if it was programmatically collapsed
  // if(!document.getElementById("sidebar").classList.contains("active") && document.getElementById("sidebar").classList.contains("sidebar-clicked")) {
  //   document.getElementById("sidebarCollapse").click();
  //   document.getElementById("sidebar").classList.remove("sidebar-clicked");
  // }

  const appWrapper = document.getElementById("appWrapper");
  if (appWrapper.classList.length > 0) {
    appWrapper.classList.remove("blackout");
  }
}

/**
 * Logout & clear DB
 */
function logout() {
  console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Logout Attempted.");
  IPC.send("logout", 1);

  // Clear out the User object neccesiating re-authentication.
  _GLOBAL_USER = null;

  // Remove existing elements
  clearServerInput();

  // Clear data
  clearPendingReviewTable();
  clearOpenReviewTable();
  clearChartData();
  clearTableData();

  // Hide the Button & Review Containers
  hideContentContainer();
  hidePendingReviewDiv();
  hideOpenReviewDiv();
  hideReviewStatisticsDiv();

  // Launch the Server Modal
  launchServerModal();
  addServerInstanceInput(null);
}

/**
 * Sets the current user.
 *
 * @param {*} currentUser
 */
function setCurrentUser(currentUser) {
  if (typeof currentUser !== "undefined" && currentUser !== null) {
    console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Setting User:", currentUser.userID);

    _GLOBAL_USER = currentUser;
    setUserInfo(_GLOBAL_USER.userID, _GLOBAL_USER.displayName, _GLOBAL_USER.avatarURL);
  } else {
    console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "User not defined!");
  }
}

/**
 * Set the user information to the modal as a header.
 *
 * @param {String} userID
 * @param {String} displayName
 * @param {String} avatarURL
 */
function setUserInfo(userID, displayName, avatarURL) {
  console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "setUserInfo", userID);
  document.getElementById("userIDLabel").innerHTML = userID;
  document.getElementById("profilePicture").src = avatarURL;
}

/**
 * Sets the current Reviewer list.
 *
 * @param {*} currentReviewerList
 */
function setCurrentReviewerList(currentReviewerList) {
  console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Setting", currentReviewerList.length, "Reviewers.");
  _GLOBAL_REVIEWER_LIST = [];
  currentReviewerList.forEach(function (element) {
    _GLOBAL_REVIEWER_LIST.push(element.reviewer);
  });
}

/**
 * Toggles Particle JS
 */
function toggleParticles(toggle) {
  if (toggle) {
    console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Particles JS Enabled.");
    particlesJS.load("particles-js", "../src/js/vendor/particles.json", function () {});
  } else {
    console.log(new Date().toJSON(), _GLOBAL_APP_CONSTANTS.LOG_INFO, "Particles JS Disabled.");
    pJSDom[0].pJS.fn.vendors.destroypJS();
    pJSDom = [];
  }
}