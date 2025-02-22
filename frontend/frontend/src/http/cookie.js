import Cookie from "js-cookie";

const userId = "userId";
const userRole = "userRole";
const userAuthorId = "authorId";
const isAdmin = "false";
const userNickName = "userNickName";
const userEmail = "userEmail";
const userAvatarURL = "https://s2.loli.net/2024/05/14/goXsDLbJqTMwUka.png";

export function removeCookie(){
  Cookie.remove(userId);
  Cookie.remove(isAdmin);
  Cookie.remove(userNickName);
  Cookie.remove(userEmail);
  Cookie.remove(userAvatarURL);
  Cookie.remove(userRole);
  Cookie.remove(userAuthorId);
}
export function setUserId(id) {
  Cookie.set(userId, id, { expires: 7 });
}

export function getUserId() {
  return Cookie.get(userId);
}

export function setUserEmail(email) {
  Cookie.set(userEmail, email, { expires: 7 });
}

export function setUserAuthorId(authorId) {
  return Cookie.set(userAuthorId, authorId, { expires: 7 });
}
export function getUserAuthorId(){
  return Cookie.get(userAuthorId);
}
export function setUserRole(role) {
  return Cookie.set(userRole, role, { expires: 7 });
}
export function getUserRole(){
  return Cookie.get(userRole);
}

export function getUserEmail() {
  return Cookie.get(userEmail);
}

export function setUserAvatarURL(url) {
  Cookie.set(userAvatarURL, url, { expires: 7 });
}

export function getUserAvatarURL() {
  return Cookie.get(userAvatarURL);
}

export function setUserNickName(name) {
  Cookie.set(userNickName, name, { expires: 7 });
}

export function getUserNickName() {
  return Cookie.get(userNickName);
}

export function setIsAdmin(is) {
  Cookie.set(isAdmin, is, { expires: 7 });
}

export function getIsAdmin() {
  return Cookie.get(isAdmin);
}


export function removeUserId(){
  Cookie.remove(userId);
}

export function removeUserEmail(){
  Cookie.remove(userEmail);
}
