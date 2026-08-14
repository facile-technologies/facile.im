import { DEBUG_MODE, NODE_ENV } from "../../config/index.js";
import joi from "joi";

import CustomErrorHandler from "./customErrorHandler.js";

// advanced error handler middleware
const errorHandler = (error, req, res, next) => {

  // Never leak internal error/SQL details in production, even if a stray
  // DEBUG_MODE=true ends up in a prod .env. Only expose when NOT prod AND debug on.
  const exposeInternals = NODE_ENV !== "prod" && DEBUG_MODE == "true";

  let statusCode ;
  let data = {};

  if(error.status){
    statusCode = error.status;
     data = {
    success: false,
    message: error.message || "internal server error",
    ...(exposeInternals && { originalError: error.message }),
  };
  }else{
    statusCode = 500;
  data = {
    success: false,
    message: "internal server error",
    ...(exposeInternals && { originalError: error.message }),
  };
  }
  if (error instanceof joi.ValidationError) {
    statusCode = 422;
    data = {
      success: false,
      message: error.details.map(d => d.message),
    };
  }


  if (error instanceof CustomErrorHandler) {
    statusCode = error.status;
    data = {
      success: false,
      message: error.message,
    };
  }

  return res.status(statusCode).json(data);
};

export default errorHandler;
