import * as yup from "yup";

export const registrationSchema = yup.object({
  salutation: yup
    .string()
    .oneOf(["MR", "MS", "MRS", "MX"], "Ungültige Anrede")
    .required("Bitte eine Anrede auswählen"),
  otherSalutation: yup
    .string()
    .when("salutation", {
      is: "MX",
      then: (schema) =>
        schema
          .required("Bitte geben Sie eine Anrede ein")
          .max(30, "Maximal 30 Zeichen"),
      otherwise: (schema) => schema.strip(),
    }),
  email: yup
    .string()
    .email("Bitte eine gültige E-Mail-Adresse eingeben")
    .required("E-Mail ist erforderlich"),
  username: yup
    .string()
    .required("Benutzername darf nicht leer sein"),
  password: yup
    .string()
    .required("Passwort ist erforderlich")
    .min(12, "Mindestens 12 Zeichen erforderlich")
    .matches(/[a-z]/, "Mindestens ein Kleinbuchstabe erforderlich")
    .matches(/[A-Z]/, "Mindestens ein Großbuchstabe erforderlich")
    .matches(/\d/, "Mindestens eine Zahl erforderlich")
    .matches(/[^A-Za-z0-9]/, "Mindestens ein Sonderzeichen erforderlich"),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwörter müssen übereinstimmen")
    .required("Bitte Passwort bestätigen"),
  country: yup
    .string()
    .required("Bitte ein Land auswählen"),
});
