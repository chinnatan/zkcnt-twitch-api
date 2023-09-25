exports.isNullOrEmpty = (msg) => {
    try {
        if (msg === null || msg === "" || msg === undefined)
            return true
    } catch (e) {
        console.error(e)
    }
    return false
}