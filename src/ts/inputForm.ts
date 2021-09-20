import { loadConfig } from "./config";
import { queryApi } from "./query";
import { handleLogin } from "./util";

export interface IInputForm extends HTMLFormElement {
    products:       HTMLSelectElement,
    accountType:    HTMLSelectElement,
    locationType:   HTMLSelectElement,
    province:       HTMLSelectElement,
    city:           HTMLSelectElement,
    contactRole:    HTMLSelectElement,
    returnValues:   HTMLSelectElement
}

export async function loadForm() {
    await handleLogin()

    let config = await loadConfig();
    const INPUT_FORM = <IInputForm> document.getElementById('input-form');

    let processors = new Array();

    processors.push(config.products.forEach(async (e) => {
        let elem = document.createElement('option');
        elem.innerHTML = e;
        elem.value = e;
        INPUT_FORM.products.appendChild(elem);
    }));

    processors.push(config.relationTypeValues.forEach(async (e)=> {
        let elem = document.createElement('option');
        elem.innerHTML = e;
        elem.value = e;
        INPUT_FORM.accountType.appendChild(elem);
    }));

    processors.push(config.locationType.forEach(async (e) => {
        let elem = document.createElement('option');
        elem.innerHTML = e;
        elem.value = e;
        INPUT_FORM.locationType.appendChild(elem);
    }));

    processors.push(config.provinces.forEach(async (e) => {
        let elem = document.createElement('option');
        elem.innerHTML = e;
        elem.value = e;
        INPUT_FORM.province.appendChild(elem);
    }));

    processors.push(config.contactRoles.forEach(async (e) => {
        let elem = document.createElement('option');
        elem.innerHTML = e;
        elem.value = e;
        INPUT_FORM.contactRole.appendChild(elem);
    }));

    document.getElementById('formSubmitBtn').addEventListener('click', (_e) => {
        queryApi();
    });

    for(let i = 0; i < processors.length; i++) {
        await processors[i];
    }

    (<any>$('.chosen-select')).chosen();
    (<any>$(".tagging")).select2({
        tags: true,
        tokenSeparators: [',']
    });
}