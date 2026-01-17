import * as yup from 'yup'

export const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Aktuelles Passwort ist erforderlich'),

  newPassword: yup
    .string()
    .required('Neues Passwort ist erforderlich')
    .matches(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      'Mindestens 8 Zeichen, eine Zahl, ein Groß- und Kleinbuchstabe'
    ),

  repeatNewPassword: yup
    .string()
    .required('Bitte Passwort bestätigen')
    .oneOf([yup.ref('newPassword')], 'Passwörter müssen übereinstimmen')
})
