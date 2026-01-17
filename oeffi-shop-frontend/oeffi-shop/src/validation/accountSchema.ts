import * as yup from 'yup'

export const accountSchema = yup.object({
  /* -----------------------------
   * Persönliche Daten
   * ----------------------------- */

  salutation: yup
    .string()
    .oneOf(['MR', 'MS', 'MRS', 'MX'], 'Ungültige Anrede')
    .required('Bitte eine Anrede auswählen'),

  otherSalutation: yup
    .string()
    .when('salutation', {
      is: 'MX',
      then: schema =>
        schema
          .required('Bitte geben Sie eine Anrede ein')
          .max(30, 'Maximal 30 Zeichen erlaubt'),
      otherwise: schema => schema.strip()
    }),

  firstName: yup
    .string()
    .required('Vorname ist erforderlich')
    .max(60, 'Vorname darf maximal 60 Zeichen lang sein'),

  lastName: yup
    .string()
    .required('Nachname ist erforderlich')
    .max(60, 'Nachname darf maximal 60 Zeichen lang sein'),

  countryCode: yup
    .string()
    .required('Ländercode ist erforderlich')
    .matches(
      /^[A-Z]{2}$/,
      'Ländercode muss ein ISO-2 Code sein (z.B. AT, DE, IT)'
    ),

  address: yup
    .string()
    .required('Adresse ist erforderlich')
    .max(120, 'Adresse darf maximal 120 Zeichen lang sein'),

  city: yup
    .string()
    .required('Stadt ist erforderlich')
    .max(60, 'Stadt darf maximal 60 Zeichen lang sein'),

  zip: yup
    .string()
    .required('PLZ ist erforderlich')
    .max(16, 'PLZ darf maximal 16 Zeichen lang sein'),

  profilePicturePath: yup
    .string()
    .nullable()
    .max(255, 'Profilbildpfad darf maximal 255 Zeichen lang sein'),
})
