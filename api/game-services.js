const response = await fetch(
  "https://panel.sosmedmedia.com/api/profile",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      key: apiKey,
      sign: sign
    })
  }
);

const text = await response.text();

return res.status(200).send(text);
