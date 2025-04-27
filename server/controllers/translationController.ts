import { Request, Response } from "express";
import axios from "axios";
import { logger } from "../utils/logger.js";

// Proxy requests to DeepL API
export const proxyTranslation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const apiKey = process.env.VITE_DEEPL_API_KEY;

    if (!apiKey) {
      res.status(500).json({
        success: false,
        message: "DeepL API key is missing in server configuration",
      });
      return;
    }

    logger.info({
      message: "Translation request",
      targetLang: req.body.target_lang,
      textLength: req.body.text?.[0]?.length || 0,
    });

    const response = await axios.post(
      "https://api-free.deepl.com/v2/translate",
      req.body,
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error({
        message: "DeepL API error",
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
      });
    } else {
      logger.error({
        message: "Translation proxy error",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to proxy translation request",
      error: error instanceof Error ? error.message : "Unknown error",
      details: axios.isAxiosError(error) ? error.response?.data : undefined,
    });
  }
};
