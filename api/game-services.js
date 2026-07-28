import crypto from "crypto";

export default async function handler(req, res) {
  try {

    const apiId = process.env.SOSMED_API_ID;
    const apiKey = process.env.SOSMED_API_KEY;

    const sign = crypto
      .createHash("md5")
      .update(apiId + apiKey)
      .digest("hex");

    const response = await fetch(
      "https://panel.sosmedmedia.com/api/profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          key: apiKey,
          sign: sign
        })
      }
    );

    return res.json({
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: await response.text()
    });

  } catch (e) {

    return res.json({
      error: e.message
    });

  }
}
