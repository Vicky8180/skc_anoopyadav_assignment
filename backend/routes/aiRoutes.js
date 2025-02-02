import express from "express";

import { continueThread } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  const userId = "1290234";

  if (!userId || !message) {
    return res.status(400).send("User ID and prompt are required.");
  }

  try {
    console.log(1);
    console.log(message);
    const assistantResponse = await continueThread(userId, message);

    res.json({ response: assistantResponse });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

export default router;
