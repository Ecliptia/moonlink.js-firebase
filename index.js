const databaseExtended = require("./databseExtended.js");
const { Structure, Database, Plugin } = require("moonlink.js");

/**
 * Firebase integration plugin for Moonlink.js
 * @class FirebasePlugin
 * @extends Plugin
 */
class FirebasePlugin extends Plugin {
  /**
   * Creates a new Firebase plugin instance
   * @param {Object} options - Plugin configuration options
   * @param {string} options.databaseUrl - Firebase database URL
   */
  constructor(options) {
    super();
    this.name = "moonlink.js-firebase";
    this.version = "1.0.0";
    this.description = "Firebase integration";
    this.author = "Lucas Morais Rodrigues (1Lucas1apk)";
    this.options = options;
    this.manager = null;
  }

  /**
   * Loads the plugin and initializes Firebase integration
   * @param {Object} manager - The Moonlink manager instance
   */
  load(manager) {
    if (!this.options.databaseUrl) {
      throw new Error(
        "Database URL is required. Please provide it in the plugin options and store it in an environment variable for better security."
      );
    }
    databaseExtended.setDatabaseUrl(this.options.databaseUrl);
    Structure.extend("Database", databaseExtended);
  }

  /**
   * Unloads the plugin and restores default Database implementation
   * @param {Object} manager - The Moonlink manager instance
   */
  unload(manager) {
    Structure.extend("Database", Database);
  }
}

module.exports = FirebasePlugin;
