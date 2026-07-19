export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }

  try {

    const { order_id, gross_amount } = req.body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    const auth = Buffer.from(serverKey + ":").toString("base64");

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
