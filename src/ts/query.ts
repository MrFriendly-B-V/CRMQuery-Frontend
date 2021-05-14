import { visitFunctionBody } from "../../node_modules/typescript/lib/typescript";
import { loadConfig } from "./config";
import { IInputForm } from "./inputForm"; 

export async function queryApi() {
    let config = await loadConfig();

    const INPUT_FORM = <IInputForm> document.getElementById('input-form');

    let products = Array.from(INPUT_FORM.products.querySelectorAll('option:checked'), (e: HTMLOptionElement) => e.value)?? new Array();
    let queryApiReq = $.ajax({
        method: 'POST',
        url: config.host + "/query",
        data: {
            products: (products.length != 0) ? products.join(",") : null,
        }
    });

    let loadingIcon = document.createElement('object');
    loadingIcon.data = '/img/loading_icon.svg';
    loadingIcon.type = 'image/svg+xml';
    loadingIcon.classList.value = "loading-icon";
    document.body.appendChild(loadingIcon);

    let mainElem = document.querySelector("main");
    mainElem.classList.add('darkened');

    let response = await queryApiReq;
    window.sessionStorage.setItem('queryResults', JSON.stringify(response));

    window.location.href = "/results.html";
}