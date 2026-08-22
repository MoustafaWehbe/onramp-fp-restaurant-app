import { Request, Response, NextFunction } from "express";

import { answerQuestion } from "../services/rag/rag.service";

type AskQuestionBody = {
  question: string;
};

export const ragController = {
  askQuestion: async (
    req: Request<{}, {}, AskQuestionBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { question } = req.body;

      const result = await answerQuestion(
        question
      );

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