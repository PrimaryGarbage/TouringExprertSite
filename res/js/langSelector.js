const selector = document.getElementById("lang-select");
selector.addEventListener("change", changeLang);

function changeLang(event)
{
    const lang = event.target.value;
    const href = window.location.href;
    const pageName = href.split('/').at(-1);
    let newURL = `../${lang}/${pageName}`;
    window.location.href = newURL;
}