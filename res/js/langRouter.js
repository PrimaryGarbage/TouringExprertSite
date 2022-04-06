
if (/^ru\b/.test(navigator.language)) 
{
    window.location.href = "./html/ru/index.html";
}
else
{
    //window.location.href = "./html/en/index.html";

    // until english part of site isn't implemented
    window.location.href = "./html/ru/index.html";
}
