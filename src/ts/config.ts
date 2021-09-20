export interface IConfig {
    host:                   string
    authserverHost:         string
    relationTypeValues:     string[]
    locationType:           string[]
    products:               string[]
    provinces:              string[]
    contactRoles:           string[]
}

export async function loadConfig(): Promise<IConfig> {
    let fetched = await fetch('/config.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    switch(fetched.status) {
        case 200:
            let config = <IConfig> await fetched.json()
            return config
        default:
            alert('Failed to load configuration')
            throw new Error(await fetched.json())
    }
} 