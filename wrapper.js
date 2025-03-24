const defaultFetchOptions = {
    keepalive: true,
    headers: { "Content-Type": "application/json" }
  };
  
  /**
   * Writes data to the Firebase Realtime Database
   * @param {string} databaseUrl - The Firebase database URL
   * @param {string} path - The path within the database
   * @param {any} data - The data to write (null to delete)
   * @returns {Promise<object>} The response from Firebase
   */
  async function writeData(databaseUrl, path, data) {
    const method = data !== null ? "PATCH" : "DELETE";
    const url = `${databaseUrl}${databaseUrl.endsWith('.json') ? '' : '.json'}`;
    
    // Tratamento para strings - converte para objeto com propriedade default
    const processedData = typeof data === 'string' ? { default: data } : data;
    
    // Preparar dados para envio
    const jsonData = processedData === null ? null : JSON.stringify(processedData);

    const response = await fetch(url, {
      ...defaultFetchOptions,
      method,
      body: jsonData
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 404) {
        throw new Error("404: Resource not found");
      }
      if (response.status === 403) {
        throw new Error(
          "Permission denied. To allow access temporarily, follow these steps:\n" +
          "1) Log in to your Firebase Console.\n" +
          "2) Navigate to Realtime Database → Rules.\n" +
          "3) Set both .read and .write rules to true, for example:\n" +
          '{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}\n' +
          "For security, store your database URL in an environment variable."
        );
      }
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  
    return await response.json();
  }
  
  /**
   * Retrieves data from the Firebase Realtime Database
   * @param {string} databaseUrl - The Firebase database URL
   * @param {string} path - The path within the database
   * @returns {Promise<any>} The data retrieved from Firebase
   */
  async function getData(databaseUrl, path) {
    const url = `${databaseUrl}${databaseUrl.endsWith('.json') ? '' : '.json'}`;
  
    const response = await fetch(url, defaultFetchOptions);
  
    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 404) {
        throw new Error("404: Resource not found");
      }
      if (response.status === 403) {
        throw new Error(
          "Permission denied. To allow access temporarily, follow these steps:\n" +
          "1) Log in to your Firebase Console.\n" +
          "2) Navigate to Realtime Database → Rules.\n" +
          "3) Set both .read and .write rules to true, for example:\n" +
          '{\n  "rules": {\n    ".read": true,\n    ".write": true\n  }\n}\n' +
          "For security, store your database URL in an environment variable."
        );
      }
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  
    const data = await response.json();
    
    if (data && typeof data === 'object' && 'default' in data && Object.keys(data).length === 1) {
      return data.default;
    }
    
    return data;
  }
  
  module.exports = {
    writeData,
    getData
  };
  