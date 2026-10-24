
export default async function handler(req, res) {
  res.setHeader(
    "Cache-Control",
    "s-maxage=300, stale-while-revalidate=600"
  );

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Metode tidak diizinkan",
    });
  }

  try {
    const vpsUrl = process.env.DIGIFLAZZ_VPS_URL;
    const secret = process.env.VPS_SHARED_SECRET;

    if (!vpsUrl || !secret) {
      return res.status(500).json({
        success: false,
        message: "Konfigurasi API belum lengkap",
      });
    }

    const response = await fetch(
      `${vpsUrl}/digiflazz/price-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({}),
      }
    );

    const result = await response.json();

    if (!response.ok || !Array.isArray(result.data)) {
      return res.status(502).json({
        success: false,
        message:
          result.data?.message ||
          "Gagal mengambil daftar produk Digiflazz",
      });
    }

    const products = result.data
      .filter(
        (item) =>
          item.category === "Games" &&
          item.buyer_product_status === true &&
          item.seller_product_status === true
      )
      .map((item) => ({
        name: item.product_name,
        brand: item.brand,
        sku: item.buyer_sku_code,
        price: Math.ceil(Number(item.price) * 1.1 / 100) * 100,
        description: item.desc,
      }));

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil produk",
    });
  }
        }
        
ppp
