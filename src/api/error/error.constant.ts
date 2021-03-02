export const ERRORS = {
  BAD_REQUEST: {
    httpStatus: 400,
    message: "Bad Request.",
  },
  INTERNAL_SERVER_ERROR: {
    httpStatus: 500,
    message: "Internal Server Error.",
  },
  UNAUTHORIZED: {
    httpStatus: 401,
    message: "Unauthorized.",
  },
  FORBIDDEN: {
    httpStatus: 403,
    message: "Forbidden.",
  },
  NOT_FOUND: {
    httpStatus: 404,
    message: "Resource not found!",
  },
  WEBHOOK_ERROR: {
    httpStatus: 403,
    message: "Webhook Token Error",
  },
  WEBHOOK_DNE: {
    httpStatus: 403,
    message: "Webhook Token is Invalid!",
  },
  DISCORD_404: {
    httpStatus: 404,
    message: "Discord User Not Found!",
  },
  DISCORD_CHANNEL_404: {
    httpStatus: 404,
    message: "Discord Channel Not Found!",
  },
  USER_DM_BLOCKED: {
    httpStatus: 400,
    message: "User DM Blocked!",
  },
  SERVICE_UNAVAILABLE: {
    httpStatus: 503,
    message: "Service Unavailable!",
  },
};
