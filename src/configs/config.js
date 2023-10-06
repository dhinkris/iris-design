const serverConst = {
    ST: {
        nodeRequest: {
            server: {
                host: 'localhost', //10.54.250.10
                port: '3005',
                entry: 'api',
                requestContentType: 'application/json'
            }
        }
    },
    UAT: {
        nodeRequest: {
            server: {
                host: 'localhost',
                port: '3005',
                entry: 'api',
                requestContentType: 'application/json'
            }
        }
    },
    production: {
        nodeRequest: {
            server: {
                host: 'localhost',
                port: '3005',
                entry: 'api',
                requestContentType: 'application/json'
            }
        }
    }
}


export default serverConst;
