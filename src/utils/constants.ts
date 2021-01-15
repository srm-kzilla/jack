export const ERRORS = {
  DM_BLOCKED:
    "Oopsie! It seems your dm is blocked. Please change the settings and request again!",
  CERTIFICATE_NOT_FOUND:
    "Oops! A wide search across our records, but we couldn't trace your data. Our insights say you weren't able to register for the event. Hope to see you soon next time!",
  EMAIL_MISSING: "Invalid Command! Type `#kzjack help` for a list of commands",
  INVALID_EMAIL: "Oops! The email is malformed or invalid. Please try again!",
  URL_MISSING: "Invalid Command! Type `#kzjack help` for a list of commands",
};
export const COMMANDS = {
  prefix: "#kzjack",
  shrinkURL: "shrink",
  help: "help",
  certificate: "certificate",
  dmcertificate: "get-certificate",
  membercount: "membercount",
};

export const CONSTANTS = {
  thumbsUpEmoji: "👍",
  certificateUserDirectMessage:
    "Hello, Please drop your registered email here in the format " +
    "`#kzjack get-certificate <your_email>`", //FIXME remove hardcoded prefix

  KZILLA_XYZ_SHRINK_URL_ENDPOINT: "https://kzilla.xyz/api/v1/webhook/link",
};
