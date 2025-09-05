const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routers,
  username: state=>state.user.username,
  member: state=>state.user.member,
  foreignid:state=>state.user.foreignid,
  routesAdded: state => state.permission.routesAdded,
}
export default getters
