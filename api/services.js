export default async function handler(req, res) {
  try {
    const response = await fetch("https://ordersosmed.id/api-1/service", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        api_id: process.env.API_ID,
        api_key: process.env.API_KEY,
        secret_key: process.env.SECRET_KEY
      })
    });

    const text = await response.text();
    console.log(text);

    res.status(200).send(text);

  } catch (err) {
    res.status(500).json({
      response: false,
      msg: err.message
    });
  }
}
