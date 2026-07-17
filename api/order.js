export default async function handler(req, res) {

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  try {

    const { service, target, quantity, additional } = req.body;

    const body = new URLSearchParams({
      api_id: process.env.API_ID,
      api_key: process.env.API_KEY,
      secret_key: process.env.SECRET_KEY,
      service,
      target,
      quantity,
      additional: additional || ""
    });

    const response = await fetch("https://ordersosmed.id/api-1/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    const text = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(200).send(text);

  } catch (err) {

    res.status(500).json({
      response: false,
      msg: err.message,
    });

  }

}
