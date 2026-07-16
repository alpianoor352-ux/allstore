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

    const data = await response.json();

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({
      response: false,
      msg: err.message
    });
  }
}
