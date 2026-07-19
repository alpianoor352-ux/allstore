export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }

  try {

    const { order_id, gross_amount } = req.body;

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
