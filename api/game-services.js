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
      sign: sign,
      type: "services"
    });

    const response = await fetch(
      "https://panel.sosmedmedia.com/api/game-feature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      }
    );

    const result = await response.text();
return res.status(200).send(result);

    return res.status(200).json(result);

  } catch (err) {

    return res.status(500).json({
      result: false,
      message: err.message
    });

  }
      }
