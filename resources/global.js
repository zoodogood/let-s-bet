globalThis.snow = new SnowBackground();
globalThis.formatter = new Intl.NumberFormat();

globalThis.parseInt = function(value){
	return +String(value).replaceAll(/\D/g, "");
}

if (localStorage.darkTheme === undefined){
	const result = confirm("Использовать темную тему?");
	localStorage.darkTheme = result;
 }
 
 if (localStorage.darkTheme === "true"){
	document.body.classList.add("dark-theme");
 }