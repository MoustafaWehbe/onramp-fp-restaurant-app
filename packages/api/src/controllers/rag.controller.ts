import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { answerQuestion } from "../services/rag/rag.service";
import { askQuestionSchema } from "../schemas/rag.schema";

type AskQuestionBody = z.infer<typeof askQuestionSchema>;

export const ragController = {
  askQuestion: async (
    req: Request<{}, {}, AskQuestionBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { question } = req.body;

      const result = await answerQuestion(question);

      return res.status(200).json({
        data: {
          answer: result.answer,
        },
        message: "Question answered successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};