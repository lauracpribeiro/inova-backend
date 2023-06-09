module.exports = {
  "type": process.env.G_TYPE,
  "project_id": process.env.G_PROJECT_ID,
  "private_key_id": process.env.G_KEY_ID,
  "private_key": process.env.G_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.G_CLIENT_EMAIL,
  "client_id": process.env.G_CLIENT_ID,
  "auth_uri": process.env.G_AUTH_URI,
  "token_uri": process.env.G_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.G_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.G_CLIENT_X509_CERT_URL
}