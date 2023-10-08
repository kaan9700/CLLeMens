async function makeRequest(method, endpoint, data = {}) {
    function getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const csrftoken = getCookie('csrftoken');
    const headers = {'X-CSRFToken': csrftoken};

    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        data = JSON.stringify(data);
    }

    const fetchOptions = {
        method: method,
        headers: headers,
        credentials: 'include',  // Ensure cookies are sent with the request
    };

    if (method !== 'GET') {
        fetchOptions.body = data;
    }

    const response = await fetch(endpoint, fetchOptions);

    if (response.status === 204) {
        return null; // Kein Inhalt
    }

    const jsonData = await response.json();
    if (!response.ok) {
        throw new Error(jsonData.message);
    }

    return jsonData;
}

export { makeRequest };
