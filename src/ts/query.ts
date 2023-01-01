import { loadConfig } from "./config";
import { IInputForm } from "./inputForm"; 
import { getCookie, handleLogin } from "./util";

export async function queryApi() {
    await handleLogin()

    let config = await loadConfig();
    const INPUT_FORM = <IInputForm> document.getElementById('input-form');

    let products = Array.from(INPUT_FORM.products.querySelectorAll('option:checked'), (e: HTMLOptionElement) => e.value)?? new Array();
    let relationType = Array.from(INPUT_FORM.accountType.querySelectorAll('option:checked'), (e: HTMLOptionElement) => e.value)?? new Array();
    let locationType = Array.from(INPUT_FORM.locationType.querySelectorAll('option:checked'), (e: HTMLOptionElement) => e.value)?? new Array();
    let province = Array.from(INPUT_FORM.province.querySelectorAll('option:checked'), (e: HTMLOptionElement) => e.value)?? new Array();
    let city = Array.from(INPUT_FORM.city.querySelectorAll('option:checked'), (e: HTMLOptionElement) => e.value)?? new Array();
    let contactRole = Array.from(INPUT_FORM.contactRole.querySelectorAll('option:checked'), (e: HTMLOptionElement) => e.value)?? new Array();

    let loadingIcon = document.createElement('object');
    loadingIcon.data = 'img/loading_icon.svg';
    loadingIcon.type = 'image/svg+xml';
    loadingIcon.classList.value = "loading-icon";
    document.body.appendChild(loadingIcon);

    let toDarken = document.querySelectorAll("main");
    toDarken.forEach(e => e.classList.add('darkened'));

    fetch(`${config.host}/query`, {
        method: 'POST',
        headers: {
            'Authorization': getCookie('sessionid'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            products: (products.length != 0) ? products.join(",") : null,
            relation_type: (relationType.length != 0) ? relationType.join(",") : null,
            location_type: (locationType.length != 0) ? locationType.join(",") : null,
            province: (province.length != 0) ? province.join(",") : null,
            city: (city.length != 0) ? city.join(",") : null,
            contact_role: (contactRole.length != 0) ? contactRole.join(",") : null,
        })
    })
    .then(async r => {
        switch(r.status) {
            case 200:
                r.text().then(t => {
                    window.sessionStorage.setItem('queryResults', t)
                    window.location.href = "results.html"
                })
                break
            default:
                alert('An error occurred')
                throw new Error(await r.json())
        }
    })
}