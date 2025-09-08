

export const URLBuilder = (baseURL, filterMap) => {

    let queryString = ""
    if(filterMap !== null) {
        Object.keys(filterMap).forEach(key => {
            if(filterMap[key] !== "") queryString += `${key}="${filterMap[key]}&"`;
        });
    }

    if (queryString !== ""){
        return `${baseURL}?${queryString}`;
    }

    return baseURL;

}