interface NetlifyEvent {
  httpMethod: string;
}

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  const hasHost = Boolean(process.env.DB_HOST);
  const hasUser = Boolean(process.env.DB_USER);
  const hasPass = Boolean(process.env.DB_PASS);
  const hasName = Boolean(process.env.DB_NAME);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'ok',
      runtime: 'Netlify Functions',
      timestamp: new Date().toISOString(),
      dbConfigured: {
        hasHost,
        hasUser,
        hasPass,
        hasName,
        isFullyConfigured: hasHost && hasUser && hasName,
      },
    }),
  };
};
