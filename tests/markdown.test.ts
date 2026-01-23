import { generateMarkdown } from '../src/markdown';

describe('generateMarkdown', () => {
  it('should correctly format PMAT violations into a markdown table', () => {
    const pmatResult = {
      violations: [
        {
          file: './src/server/watcher.rs',
          severity: 'error',
          value: 12,
        },
        {
          file: './src/utils/helper.ts',
          severity: 'warning',
          value: 18,
        },
      ],
    };

    const expectedMarkdown = `## Automated Check Failed!
Cyclomatic complexity found:
# Code Complexity Violations
| Path | Severity | Value |
| ---- | -------- | ----- |
| [./src/server/watcher.rs](./src/server/watcher.rs) | error | 12 |
| [./src/utils/helper.ts](./src/utils/helper.ts) | warning | 18 |
`;

    expect(generateMarkdown(pmatResult)).toBe(expectedMarkdown);
  });

  it('should return an empty string if no violations are present', () => {
    const pmatResult = {
      violations: [],
    };

    expect(generateMarkdown(pmatResult)).toBe('');
  });
});
