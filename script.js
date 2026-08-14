<img 
src="https://i.ndtvimg.com/i/2017-05/kl-university_650x400_4149388361
3.jpg" /> 
<script> 
const myImage = document.querySelector("img"); 
const reqHeaders = new Headers(); 
// a cached response is okay unless it's more than a week old 
reqHeaders.set("Cache-Control", "max-age=604800"); 
const options = { 
headers: reqHeaders, 
}; 
// pass init as an "options" object with our headers 
const req = new 
Request("https://i.ndtvimg.com/i/2017-05/kl-university_650x400_414938
83613.jpg", options); 
fetch(req) 
.then((response) => { 
if (!response.ok) { 
throw new Error(`HTTP error, status = 
${response.status}`); 
} 
return response.blob(); 
}) 
.then((blob) => { 
const objectURL = URL.createObjectURL(blob); 
myImage.src = objectURL; 
}) 
.catch((error) => { 
const p = document.createElement("p"); 
p.appendChild(document.createTextNode(`Error: 
${error.message}`)); 
document.body.insertBefore(p, myImage); 
}); 
</script>