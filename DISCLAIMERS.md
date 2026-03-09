# Disclaimers & Terms of Use

> **Community-maintained open-source project — not affiliated with or supported by Rocketlane, Inc.**

---

## 1. No Affiliation with Rocketlane

This project is an independent, community-built tool and is **not affiliated with, endorsed by, sponsored by, or in any way officially connected to Rocketlane, Inc.** or any of its subsidiaries or affiliates. The Rocketlane name, logo, and API are the property of Rocketlane, Inc.

Use of the Rocketlane API through this tool is subject to Rocketlane's own Terms of Service and API usage policies. Users are solely responsible for ensuring their use complies with Rocketlane's terms.

---

## 2. No Warranty — Provided "As Is"

> ⚠️ **This software is provided without any warranty of any kind, express or implied.**

The author(s) make no representations or warranties, including but not limited to:

- Fitness for a particular purpose
- Merchantability
- Accuracy or completeness of results
- Uninterrupted or error-free operation
- Compatibility with current or future versions of the Rocketlane API

The Rocketlane API may change at any time without notice. This MCP server may break or produce unexpected results if the underlying API is updated.

---

## 3. Risk of Data Loss or Corruption

> 🚨 **Critical Warning:** This tool can create, modify, and **permanently delete** data in your Rocketlane account via the API.

By using this MCP server, you acknowledge and accept that:

- Unintended or erroneous tool calls may result in **permanent data loss that cannot be recovered**
- Bulk operations (e.g. deleting multiple tasks or projects) have no built-in confirmation or undo mechanism
- AI-generated tool calls may be incorrect, misinterpreted, or produce unintended side effects
- The author(s) **accept no liability** for any data loss, corruption, or unintended modifications to your Rocketlane data

**It is strongly recommended to test this tool in a non-production Rocketlane environment before using it against live project data.**

---

## 4. API Key Security

> 🔑 **Your Rocketlane API key provides full account access. Treat it like a password.**

This tool requires a Rocketlane API key configured as an environment variable. Users are responsible for:

- Keeping their API key secure and **never committing it to source control**
- Revoking and regenerating the API key if it is compromised
- Understanding that any Claude Desktop session with this MCP server configured has access to your Rocketlane account
- Limiting API key scope if Rocketlane provides such controls

---

## 5. Limitation of Liability

To the maximum extent permitted by applicable law, the author(s) of this project shall not be liable for any direct, indirect, incidental, special, exemplary, or consequential damages arising from:

- The use of or inability to use this software
- Unauthorized access to or alteration of your data
- Any errors or omissions in the software
- Any interaction with the Rocketlane API facilitated by this tool

This includes, but is not limited to, loss of data, loss of profits, loss of business, or any other commercial or financial losses.

---

## 6. No Support Guarantee

This is a community project maintained on a best-effort, volunteer basis. There is no commitment to:

- Ongoing maintenance or updates
- Timely bug fixes
- Compatibility with future Rocketlane API versions
- Responding to issues or pull requests

Users are encouraged to fork the repository and adapt it to their own needs.

---

## 7. License

This project is distributed under the **MIT License**. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions of that license. See the [LICENSE](./LICENSE) file for full terms.

---

## 8. Recommended Precautions

Before using this tool against a production Rocketlane environment:

- **Export or back up critical Rocketlane project data** before use
- **Test in a sandbox or staging workspace first**
- **Review the registered tools** and the API calls they make before enabling the MCP server
- **Use read-only or scoped API keys** where possible
- **Monitor your Rocketlane API activity log** for unexpected calls

---

*By using this software, you confirm that you have read, understood, and agree to these disclaimers.*
