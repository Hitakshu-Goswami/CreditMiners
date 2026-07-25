const UAParser = require("ua-parser-js");

const getDeviceInfo = (userAgent) => {
  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  const browserName = browser.name || "Unknown Browser";
  const browserVersion = browser.version || "";

  const osName = os.name || "Unknown OS";
  const osVersion = os.version || "";

  const deviceType =
    device.type || "Desktop";

  return {
    browser: `${browserName} ${browserVersion}`.trim(),
    os: `${osName} ${osVersion}`.trim(),
    device: device.vendor
      ? `${device.vendor} ${device.model || ""}`.trim()
      : deviceType,

    displayName:
      `${browserName} • ${osName}`.trim(),
  };
};

module.exports = {
  getDeviceInfo,
};