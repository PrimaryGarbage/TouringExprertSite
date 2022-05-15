const selector = document.getElementById("lang-select");
selector.addEventListener("change", changeLang);
let lastLang = selector.value;

function changeLang(event)
{
    const lang = event.target.value ;
    const href = window.location.href;
    let newPath = href.replace(`/${lastLang}/`, `/${lang}/`);
	console.log(newPath);
    lastLang = lang;
    window.location.href = newPath;
}