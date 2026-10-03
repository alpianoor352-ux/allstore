
import crypto from "crypto";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan"
    });
  }

  try {
    const {
      buyer_sku_code,
      customer_no,
      testing = true
    } = req.body || {};

    if (!buyer_sku_code || !customer_no) {
      return res.status(400).json({
        success: false,
        message: "buyer_sku_code dan customer_no wajib diisi"
      });
    }

    const username = process.env.DIGIFLAZZ_USERNAME;
    const apiKey = process.env.DIGIFLAZZ_API_KEY;

    if (!username || !apiKey) {
      return res.status(500).json({
        success: false,
        message: "Konfigurasi Digiflazz belum lengkap"
      });
    }

    const ref_id = "TEST-" + Date.now();

    const sign = crypto
      .createHash("md5")
      .update(username + apiKey + ref_id)
      .digest("hex");

    const response = await fetch(
      "https://api.digiflazz.com/v1/transaction",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          buyer_sku_code,
          customer_no,
          ref_id,
          sign,
          testing
        })
      }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}
