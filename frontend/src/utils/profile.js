export const buildProfileFormValues = (profile) => ({
  nombres: profile?.nombres ?? "",
  apellidos: profile?.apellidos ?? "",
  provincia: profile?.provincia ?? "",
  username: profile?.username ?? "",
  email: profile?.email ?? ""
})
