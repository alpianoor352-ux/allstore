export default async function handler(req, res) {
  try {
    const body = new URLSearchParams({
      api_id: process.env.API_ID,
      api_key: process.env.API_KEY,
      secret_key: process.env.SECRET_KEY,
    });

    const response = await fetch("https://ordersosmed.id/api-1/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const text = await response.text();

res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

res.status(200).send(text);
  } catch (err) {
    res.status(500).json({
      response: false,
      msg: err.message,
    });
  }
      }
