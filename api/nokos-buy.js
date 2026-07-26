async function beliNokos(){

try{

const res = await fetch(
"https://allstore-tan.vercel.app/api/nokos-buy",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
service:"wa",
country:"6"
})
}
);

alert("Status : " + res.status);

const result = await res.json();

alert(JSON.stringify(result));

}catch(err){

alert(err);

}

}
