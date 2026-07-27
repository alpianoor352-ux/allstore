import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const apiId = process.env.SOSMED_API_ID;
    const apiKey = process.env.SOSMED_API_KEY;

    const sign = crypto
      .createHash("md5")
      .update(apiId + apiKey)
      .digest("hex");

    const body = new URLSearchParams({
      key: apiKey,
      sign: sign
    });

    const response = await fetch(
      "https://panel.sosmedmedia.com/api/profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      }
    );

    const result = await response.json();

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({
      result: false,
      message: err.message
    });
  }
      }
