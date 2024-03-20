// Importing required modules
const cp = require("child_process");
const fs = require("fs");
const path = require("path");

// Extracting Yarn version from the DEPS file
const YARN_VERSION_MATCH = /'yarn_version': '(.+?)'/.exec(
  fs.readFileSync(path.resolve(__dirname, "../DEPS"), "utf8")
);
if (!YARN_VERSION_MATCH) {
  console.error("Failed to extract Yarn version from DEPS file");
  process.exit(1);
}
const YARN_VERSION = YARN_VERSION_MATCH[1];

// Determining the correct NPX command based on the platform
const NPX_CMD = process.platform === "win32" ? "npx.cmd" : "npx";

// If this file is executed directly, spawn a child process to run Yarn with the extracted version
if (require.main === module) {
  const child = cp.spawn(
    NPX_CMD,
    [`yarn@${YARN_VERSION}`, ...process.argv.slice(2)],
    {
      stdio: "inherit",
      env: {
        ...process.env,
        npm_config_yes: "true",
      },
    }
  );

  child.on("exit", (code) => process.exit(code));
}

// Export the extracted Yarn version for external use
exports.YARN_VERSION = YARN_VERSION;
