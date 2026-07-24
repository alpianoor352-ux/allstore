export default async function handler(req, res) {

  try {

    const {
      service = "",
      country = 6,
      server = "s2"
    } = req.query;

    const response = await fetch(
      `https://nokos.co.id/api/?action=getPrices&service=${service}&country=${country}&server=${server}`,
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
