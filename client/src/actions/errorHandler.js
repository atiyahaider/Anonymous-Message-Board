// Handle HTTP errors since fetch won't.
const handleHTTPErrors = response => {
  let contentType = response.headers.get('content-type');

  if (!response.ok) {
    if (contentType.includes('application/json')) 
      return handleJSONResponse(response);
    else if (contentType.includes('text/html')) 
      return handleTextResponse(response);
    else 
      // Other response types as necessary.
      throw Error("Sorry, content-type " + contentType + " not supported");
  }
  return response;  //if no error
}

function handleJSONResponse (response) {
  return response.json()
          .then(json => { throw Error(json.error) })
}

function handleTextResponse (response) {
  return response.text()
          .then(text => { throw Error(text) })
}

export default handleHTTPErrors;