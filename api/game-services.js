import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const apiId = process.env.SOSMED_API_ID;
    const apiKey = process.env.SOSMED_API_KEY;

    return res.json({
      apiId: !!apiId,
      apiKey: !!apiKey,
      sign: crypto.createHash("md5").update(apiId + apiKey).digest("hex")
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
}
