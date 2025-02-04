const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const { httpMethod, queryStringParameters, headers } = event;

  // Extract the target URL (with query parameters) from the query string
  const targetUrl = queryStringParameters.url;
  
  // Set headers to match what Pesapal expects
  const headersToForward = {
    ...headers,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  const options = {
    method: httpMethod,
    headers: headersToForward,
  };

  try {
    const response = await fetch(targetUrl, options);

    const contentType = response.headers.get('content-type');
    let responseBody = {};

    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();  // Handle JSON responses
    } else {
      responseBody = await response.text();  // Handle non-JSON responses (like plain text)
    }

    // Return the response back to the frontend
    return {
      statusCode: response.status,
      body: JSON.stringify(responseBody),
      headers: {
        'Access-Control-Allow-Origin': '*',  // CORS headers
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    };
  } catch (error) {
    console.error('Error making API request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred while processing the request' }),
    };
  }
};
