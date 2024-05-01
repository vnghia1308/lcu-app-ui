export default {
    getLeagueAPIUrl(port, path) {
        return `https://127.0.0.1:${port}${path}`
    },
    
    getLeagueAPIPassword(password) {
        return Buffer.from(`riot:${password}`).toString('base64')
    }
}