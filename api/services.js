const text = await response.text();
console.log(text);

res.status(200).send(text);
