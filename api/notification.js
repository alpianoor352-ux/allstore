export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }

  try {

    const {
      transaction_status,
      fraud_status,
      custom_field1,
      custom_field2,
      custom_field3
    } = req.body;

    if (
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept")
    ) {

      const response = await fetch(
        "https://allstore-tan.vercel.app/api/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            service: custom_field1,
            target: custom_field2,
            quantity: Number(custom_field3)
          })
        }
      );

      const result = await response.json();

      return res.status(200).json(result);

    }

    return res.status(200).json({
      message: "Pembayaran belum selesai."
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

            }
