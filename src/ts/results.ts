import { download_table_as_csv } from "./downloadAsCsv";
import { handleLogin } from "./util";

interface IResponse {
    result: IResultData[]
}

interface IResultData {
    account_id:             string,
    account_products:       string,
    contacts:               IContact[],
    account_type:           string[],
    account_name:           string,
    account_email:          string,
    shipping_address_city:  string,
    shipping_address_state: string
}

interface IContact {
    id:             string,
    lastName:       string,
    emailAddress:   string,
    phoneNumber:    string,
    firstName:      string
}

export async function loadResults() {
    await handleLogin()

    document.getElementById('download-as-csv').addEventListener("click", (_e) => {
        download_table_as_csv('result-table')
    });

    let queriedResults = window.sessionStorage.getItem("queryResults");
    if(queriedResults == null) {
        window.location.href = "index.html";
        return;
    }

    let results = <IResponse> JSON.parse(queriedResults);
    const RESULT_TABLE = <HTMLTableElement> document.getElementById('result-table');

    for(let i = 0; i < results.result.length; i++) {
        let account = results.result[i];

        //Add headers to the table
        if(i == 0) {
            let headerRow = RESULT_TABLE.insertRow();
            insertTr('Relatie Naam', headerRow);
            insertTr('Relatie Type', headerRow);
            insertTr('Stad', headerRow);
            insertTr('Provincie', headerRow);
            insertTr('Voornaam', headerRow);
            insertTr('Achternaam', headerRow);
            insertTr('E-Mail', headerRow);
            insertTr('Telefoonnummer', headerRow);
        }

        account.contacts.forEach(async (contact) => {
            if((contact.emailAddress == null || contact.emailAddress == "") && (account.account_email == null || account.account_email == "")) {
                return;
            }

            let email;
            if(contact.emailAddress == null || contact.emailAddress == "") {
                email = account.account_email;
            } else {
                email = contact.emailAddress;
            }

            let row = RESULT_TABLE.insertRow();
            insertCell(account.account_name, row);
            insertCell((account.account_type?? new Array()).join(", "), row);
            insertCell(account.shipping_address_city?? "", row);
            insertCell(account.shipping_address_state?? "", row);
            insertCell(contact.firstName, row);
            insertCell(contact.lastName, row);
            insertCell(email, row);
            insertCell(contact.phoneNumber?? "", row);
        });
    }

    document.getElementById('result-count').innerHTML = (RESULT_TABLE.rows.length -1) + " Resultaten";
    document.getElementById('next-query-btn').addEventListener("click", _e => window.location.href = "index.html");
}

function insertTr(name: string, row: HTMLTableRowElement) {
    let x = document.createElement('th');
    x.innerHTML = name;
    row.appendChild(x);
}

function insertCell(name: string, row: HTMLTableRowElement) {
    let x = document.createElement('td');
    x.innerHTML = name;
    row.appendChild(x);
}