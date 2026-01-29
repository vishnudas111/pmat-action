# Code Complexity Check with PMAT

This GitHub Action integrates the [PMAT tool](https://github.com/paiml/paiml-mcp-agent-toolkit) to automatically analyze the cyclomatic and cognitive complexity of your source code. It helps you maintain code quality by reporting complexity violations directly in your Pull Requests.

## Features

-   **Automated Complexity Analysis:** Runs the PMAT tool to check for cyclomatic and cognitive complexity.
-   **Pull Request Integration:** Posts clear and concise complexity reports as comments on your Pull Requests.
-   **Configurable Thresholds:** Easily configure the maximum allowed complexity to fit your project's standards.
-   **Workflow Failure:** Optionally fail the workflow if complexity violations are found.

## Usage

To get started, add the following step to your workflow file (e.g., `.github/workflows/complexity-check.yml`):

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
        uses: vishnudas111/pmat-action@v1 # Replace with the correct version
        with:
          max-cyclomatic: 20
          fail-on-violation: true
          comment-on-pr: true
```

## Configuration

You can configure the action with the following inputs:

| Input               | Description                                                                    | Default |
| ------------------- | ------------------------------------------------------------------------------ | ------- |
| `max-cyclomatic`    | The maximum cyclomatic complexity allowed.                                     | `'20'`    |
| `fail-on-violation` | If `true`, the action will fail if any complexity violations are found.          | `'true'`  |
| `comment-on-pr`     | If `true`, the action will post a comment on the pull request with the results. | `'true'`  |
| `github-token`      | The GitHub token to use for commenting on the PR.                              | `'${{ github.token }}'` |

## Example Pull Request Comment

When violations are detected, the action will post a comment similar to this in your Pull Request:

![Example Pull Request Comment](lib/screenshot.png)


## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
