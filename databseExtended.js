const { writeData, getData } = require("./wrapper.js");
const { Structure } = require("moonlink.js");

/**
 * Extended database implementation for Firebase integration
 * @class databaseExtended
 * @extends Database
 */
class databaseExtended extends Structure.get("Database") {
  static databaseUrl = null;
  
  /**
   * Creates a new instance of databaseExtended
   * @param {Object} manager - The manager instance
   */
  constructor(manager) {
    super(manager);
    this.databaseUrl = databaseExtended.databaseUrl;
    this.manager = manager;
    this.id = manager.options.clientId;
    this.disabled = manager.options.disableDatabase && !manager.options.resume;
  }

  /**
   * Sets the database URL
   * @param {string} url - The Firebase database URL
   */
  static setDatabaseUrl(url) {
    databaseExtended.databaseUrl = url;
  }

  /**
   * Sets a value in the database
   * @param {string} key - The key to set
   * @param {any} value - The value to store
   */
  async set(key, value) {
    if (this.disabled) return;
    if (!key) throw new Error("Key cannot be empty");
    
    try {
      const formattedKey = key.replace(/\./g, '/');
      const safeId = this.sanitizePath(this.id);
      const path = `${safeId}/${formattedKey}`;
      const url = `${this.databaseUrl}/${path}.json`;
      
      await writeData(url, "", value);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets a value from the database
   * @param {string} key - The key to retrieve
   * @returns {Promise<any>} The stored value
   */
  async get(key) {
    if (this.disabled) return undefined;
    if (!key) throw new Error("Key cannot be empty");
    
    try {
      const formattedKey = key.replace(/\./g, '/');
      const safeId = this.sanitizePath(this.id);
      const path = `${safeId}/${formattedKey}`;
      const url = `${this.databaseUrl}/${path}.json`;
      
      return await getData(url, "");
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Pushes a value to an array in the database
   * @param {string} key - The key pointing to the array
   * @param {any} value - The value to push
   */
  async push(key, value) {
    if (this.disabled) return;
    const formattedKey = key.replace(/\./g, '/');
    const arr = (await this.get(formattedKey)) || [];
    if (!Array.isArray(arr)) throw new Error("Key does not point to an array");
    arr.push(value);
    await this.set(formattedKey, arr);
  }

  /**
   * Deletes a value from the database
   * @param {string} key - The key to delete
   * @returns {Promise<boolean>} Success status
   */
  async delete(key) {
    if (this.disabled) return false;
    if (!key) throw new Error("Key cannot be empty");
    
    try {
      const formattedKey = key.replace(/\./g, '/');
      const safeId = this.sanitizePath(this.id);
      const path = `${safeId}/${formattedKey}`;
      const url = `${this.databaseUrl}/${path}.json`;
      
      await writeData(url, "", null);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sanitizes path components for Firebase compatibility
   * @param {string} path - The path to sanitize
   * @returns {string} The sanitized path
   */
  sanitizePath(path) {
    if (!path) return '';
    return String(path)
      .replace(/[\.\$\#\[\]\/]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/[^\w\-]/g, '_');
  }
  
  /**
   * Required by the parent class but not used in this implementation
   */
  loadData() {
    return;
  }
}

module.exports = databaseExtended;
