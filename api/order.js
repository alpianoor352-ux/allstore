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
      response: false,
      msg: "Method tidak diizinkan"
    });
  }

  try {

    const {
      type,
      service,
      target,
      quantity,
      additional,

      // Digiflazz
      buyer_sku_code,
      customer_no,
      ref_id
    } = req.body || {};

    // =====================================
    // 1. ORDER SMM
    // =====================================

    if (type === "smm") {

      const body = new URLSearchParams({
        api_id: process.env.API_ID,
        api_key: process.env.API_KEY,
        secret_key: process.env.SECRET_KEY,
        service: service || "",
        target: target || "",
        quantity: quantity || "",
        additional: additional || ""
      });

      const response = await fetch(
        "https://ordersosmed.id/api-1/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: body.toString()
        }
      );

      const text = await response.text();

      return res.status(200).send(text);
    }


    // =====================================
    // 2. ORDER DIGIFLAZZ
    // =====================================

    if (type === "digiflazz") {

      if (!buyer_sku_code || !customer_no) {
        return res.status(400).json({
          response: false,
          msg: "Kode produk dan nomor tujuan wajib diisi"
        });
      }

      const idTransaksi =
        ref_id ||
        "ALLSTORE-" +
        Date.now();

      const username =
        process.env.DIGIFLAZZ_USERNAME;

      const apiKey =
        process.env.DIGIFLAZZ_API_KEY;

      // Signature Digiflazz:
      // md5(username + apiKey + ref_id)

      const sign = crypto
        .createHash("md5")
        .update(username + apiKey + idTransaksi)
        .digest("hex");

      const body = {
        username: username,
        buyer_sku_code: buyer_sku_code,
        customer_no: customer_no,
        ref_id: idTransaksi,
        sign: sign
      };

      const response = await fetch(
        "https://api.digiflazz.com/v1/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();

      return res.status(200).json(data);
    }


    // =====================================
    // TYPE TIDAK DIKENAL
    // =====================================

    return res.status(400).json({
      response: false,
      msg: "Type order tidak dikenali"
    });

  } catch (err) {

    return res.status(500).json({
      response: false,
      msg: err.message
    });

  }
}
