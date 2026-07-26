export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan"
    });
  }

  try {

    const { service, country } = req.body;

    const response = await fetch(
      "https://nokos.co.id/api/?action=getNumber",
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.NOKOS_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `service=${service}&country=${country}&server=s2`
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
