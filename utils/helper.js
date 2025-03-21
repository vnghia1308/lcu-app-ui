export default {
    getLeagueAPIUrl(port, path) {
        return `https://127.0.0.1:${port}${path}`
    },

    getLeagueAPIPassword(password) {
        return Buffer.from(`riot:${password}`).toString('base64')
    },

    GetLCUInfo() {
        const { exec } = window.require('child_process')

        const processName = 'LeagueClientUx.exe'
        const command = `powershell -Command "(Get-WmiObject Win32_Process -Filter \\"Name = '${processName}'\\").CommandLine"`

        return new Promise((resolve) => {
            exec(command, { encoding: 'utf-8' }, (error, output) => {
                if (error) {
                    return resolve(false)
                }

                const LeagueArguments = output.trim()
                const regex = /--app-port=(\d+)|--remoting-auth-token=([-_a-zA-Z0-9]+)/g

                let matches;
                let result = {}
                while ((matches = regex.exec(LeagueArguments)) !== null) {
                    if (matches[1]) {
                        result["port"] = parseInt(matches[1])
                    }
                    if (matches[2]) {
                        result["password"] = matches[2]
                    }
                }

                if ("port" in result && "password" in result) {
                    window.LcuInfo = result
                    return resolve(true)
                }

                return resolve(false)
            })
        })
    }
}