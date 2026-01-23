export function generateMarkdown(pmatResult: any) {
  if (pmatResult.violations.length === 0) {
    return '';
  }

  let comment = '## Automated Check Failed!\n';
  comment += 'Cyclomatic complexity found:\n';
  comment += '# Code Complexity Violations\n';
  comment += '| Path | Severity | Value |\n';
  comment += '| ---- | -------- | ----- |\n';

  for (const violation of pmatResult.violations) {
    comment += `| [${violation.file}](${violation.file}) | ${violation.severity} | ${violation.value} |\n`;
  }

  return comment;
}
