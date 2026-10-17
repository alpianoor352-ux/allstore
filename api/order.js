
export default async function handler(req, res) {
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
      buyer_sku_code,
      customer_no,
      ref_id
    } = req.body || {};

    // ORDER SMM — tetap menggunakan provider lama
    if (type === "smm") {
      const body = new URLSearchParams({
        api_id: process.env.API_ID || "",
        api_key: process.env.API_KEY || "",
        secret_key: process.env.SECRET_KEY || "",
        service: String(service || ""),
        target: String(target || ""),
        quantity: String(quantity || ""),
        additional: String(additional || "")
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

      return res.status(200).send(await response.text());
    }

    // ORDER DIGIFLAZZ — diteruskan ke VPS
    if (type === "digiflazz") {
      if (
        typeof buyer_sku_code !== "string" ||
        !buyer_sku_code.trim() ||
        typeof customer_no !== "string" ||
        !customer_no.trim()
      ) {
        return res.status(400).json({
          response: false,
          msg: "Kode produk dan nomor tujuan wajib diisi"
        });
      }

      const vpsUrl = process.env.DIGIFLAZZ_VPS_URL;
      const sharedSecret = process.env.VPS_SHARED_SECRET;

      if (!vpsUrl || !sharedSecret) {
        return res.status(500).json({
          response: false,
          msg: "Konfigurasi API VPS belum lengkap"
        });
      }

      const idTransaksi =
        typeof ref_id === "string" && ref_id.trim()
          ? ref_id.trim()
          : "ALLSTORE-" + Date.now();

      const response = await fetch(
        vpsUrl.replace(/\/+$/, "") + "/digiflazz/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sharedSecret
          },
          body: JSON.stringify({
            buyer_sku_code: buyer_sku_code.trim(),
            customer_no: customer_no.trim(),
            ref_id: idTransaksi
          })
        }
      );

      const data = await response.json();

      return res.status(response.ok ? 200 : 502).json(data);
    }

    return res.status(400).json({
      response: false,
      msg: "Type order tidak dikenali"
    });
  } catch (err) {
    console.error("Order gagal:", err.message);

    return res.status(500).json({
      response: false,
      msg: "Terjadi kesalahan saat memproses pesanan"
    });
  }
}
