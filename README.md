# GitHub Action: Code Complexity Check with PMAT

This GitHub Action integrates the [PMAT tool](https://github.com/paiml/paiml-mcp-agent-toolkit) to automatically analyze the cyclomatic and cognitive complexity of your source code. It reports complexity violations directly in your Pull Requests, making it easy to maintain code quality and identify complex sections.

## Features

*   **Automated PMAT Installation:** The PMAT tool is automatically downloaded and installed in your CI environment.
*   **Cyclomatic Complexity Check:** Calculates and reports cyclomatic complexity for each file.
*   **Cognitive Complexity Check:** (Implied by example output) Also reports cognitive complexity.
*   **Configurable Thresholds:** Set `max-cyclomatic` and `fail-on-violation` to customize behavior.
*   **Pull Request Comments:** Reports complexity violations as Markdown comments directly in Pull Requests using the GitHub token.

## Usage

To use this action in your workflow, add a step like the following to your `.github/workflows` directory (e.g., `complexity-check.yml`):

```yaml
name: Complexity Check
on: [push, pull_request]
jobs:
  complexity:
    runs-on: ubuntu-latest
    steps:
      - name: Check out source repository
        uses: actions/checkout@v3
      - name: Check project complexity
        uses: paiml/pmat-action@vl 
        with:
          max-cyclomatic: 20
          fail-on-violation: true
          comment-on-pr: true
```

### Configuration Options

*   `max-cyclomatic`: The maximum allowed cyclomatic complexity. Defaults to `20` in the example.
*   `fail-on-violation`: If set to `true`, the action will fail if any complexity violations are found.
*   `comment-on-pr`: If set to `true`, the action will post comments on pull requests with violation details.

## How it Works

The action handles the installation and execution of the PMAT tool.

### PMAT Tool Installation

The action uses the recommended installation method for Linux environments:

```bash
curl -sSfl https://raw.githubusercontent.com/paiml/paiml-mcp-agent-toolkit/master/scripts/install.sh | sh
```

### PMAT Analysis Command

The complexity analysis is performed using the `pmat` tool with the following command:

```bash
pmat analyze complexity --fail-on-violation {FAIL_ON_VIOLATION} --max-cyclomatic {MAX_CYCLOMATIC} --format JSON
```

### Example Pull Request Output

When violations are detected, the action will post a comment similar to this in your Pull Request:

```markdown
## Automated Check Failed!
Cyclomatic complexity found:
# Code Complexity Violations
| Path | Severity | Value |
| ---- | -------- | ----- |
| [./src/server/watcher.rs](./src/server/watcher.rs) | error | 12 |
| [./src/server/watcher.rs](./src/server/watcher.rs) | warning | 18 |
```