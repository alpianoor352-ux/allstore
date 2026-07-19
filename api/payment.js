export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }

  try {

    const {
  order_id,
  gross_amount,
  service,
  target,
  quantity
} = req.body;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    const auth = Buffer.from(serverKey + ":").toString("base64");

    const response = await fetch(
  "https://app.sandbox.midtrans.com/snap/v1/transactions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + auth
    },
    body: JSON.stringify({
  transaction_details: {
    order_id,
    gross_amount
  },
  item_details: [
    {
      id: service,
      name: "ALL STORE Order",
      price: gross_amount,
      quantity: 1
    }
  ],
  customer_details: {
    first_name: "Customer"
  }
})
  }
);

const result = await response.json();

return res.status(200).json(result);

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
