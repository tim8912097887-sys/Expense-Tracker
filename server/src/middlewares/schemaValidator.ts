import { ZodObject } from "zod";
import { RequestHandler } from "express";
import { BadRequestError } from "@/customs/error/httpErrors.js";

export const schemaValidator = (schema: ZodObject): RequestHandler => ((req,_res,next) => {
      const result = schema.safeParse(req.body);
      if(!result.success) throw new BadRequestError(result.error.issues[0].message);
      // Attach validated data
      req.validData = result.data;
      return next();
})