export interface IConfig {
    host:                   string,
    relationTypeValues:     string[],
    locationType:           string[],
    products:               string[],
    provinces:              string[],
    contactRoles:           string[]
}

export async function loadConfig(): Promise<IConfig> {
    let getConfigReq = $.ajax({
        method: 'POST',
        url: '/config.json'
    });

    getConfigReq.fail((e) => {
        alert('Failed to load configuration.');
        console.error(e);
    });

    let config = <IConfig> await getConfigReq;
    return config;
} 