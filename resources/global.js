globalThis.snow = new SnowBackground();
globalThis.formatter = new Intl.NumberFormat();

if (localStorage.darkTheme === undefined){
	const result = confirm("Использовать темную тему?");
	localStorage.darkTheme = result;
 }
 
 if (localStorage.darkTheme === "true"){
	document.body.classList.add("dark-theme");
 }