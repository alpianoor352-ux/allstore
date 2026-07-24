export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {

    const response = await fetch(
      "https://nokos.co.id/api/?action=getCountries",
      {
        headers: {
          "X-API-Key": process.env.NOKOS_API_KEY
        }
      }
    );

    const result = await response.json();

    return res.status(200).json(result);

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

}
