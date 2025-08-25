// netlify/functions/googleDriveProxy.js
//import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    // event.queryStringParameters = '1i7dHtHgjuWayII6Gt7lCvciZdXxQoLb1';
    const { fileId } = event.queryStringParameters;

    if (!fileId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "fileId is required" }),
      };
    }

    // 🔑 Replace with your real API key
    const apiKey = "03dc727d61af3574e265d6345ab82f4a48367f5e"; 
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}&key=${apiKey}`;

    const response = await fetch(driveUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Google Drive error: ${response.status}` }),
      };
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*", // ✅ Enable CORS
      },
      body: Buffer.from(buffer).toString("base64"),
      isBase64Encoded: true, // required for binary files
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
