export const buildProfileFormValues = (profile) => ({
  nombres: profile?.nombres ?? "",
  apellidos: profile?.apellidos ?? "",
  fechaNacimiento: profile?.fechaNacimiento ? profile.fechaNacimiento.split("T")[0] : "",
  provincia: profile?.provincia ?? "",
  username: profile?.username ?? "",
  email: profile?.email ?? ""
})
