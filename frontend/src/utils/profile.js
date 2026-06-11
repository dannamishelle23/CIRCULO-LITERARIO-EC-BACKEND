export const buildProfileFormValues = (profile = {}) => ({
  nombres: profile.nombres || "",
  apellidos: profile.apellidos || "",
  fechaNacimiento: profile.fechaNacimiento ? new Date(profile.fechaNacimiento) : null,
  provincia: profile.provincia || "",
  biografia: profile.biografia || "",
  username: profile.username || "",
  email: profile.email || "",

  redes: {
    facebook: profile.redes?.facebook || "",
    instagram: profile.redes?.instagram || "",
    x: profile.redes?.x || "",
    tiktok: profile.redes?.tiktok || "",
    youtube: profile.redes?.youtube || "",
    web: profile.redes?.web || ""
  }
})