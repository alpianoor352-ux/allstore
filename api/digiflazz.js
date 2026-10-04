export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan"
    });
  }

  try {
    const { buyer_sku_code, customer_no } = req.body;

    if (!buyer_sku_code || !customer_no) {
      return res.status(400).json({
        success: false,
        message: "Kode produk dan nomor tujuan wajib diisi"
      });
    }

    const response = await fetch(
      "https://api.digiflazz.com/v1/transaction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: process.env.DIGIFLAZZ_USERNAME,
          buyer_sku_code,
          customer_no,
          ref_id: "TEST-" + Date.now(),
          sign: process.env.DIGIFLAZZ_API_KEY
        })
      }
    );

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
