import * as core from '@actions/core';
import * as github from '@actions/github';
import * as exec from '@actions/exec';
import { installPmat } from './installer';
import { generateMarkdown } from './markdown';

export async function run(pmatOutput?: string) {
  try {
    const maxCyclomatic = core.getInput('max-cyclomatic');
    const failOnViolation = core.getBooleanInput('fail-on-violation');
    const commentOnPr = core.getBooleanInput('comment-on-pr');

    if (!pmatOutput) {
      await installPmat();

      const options = {
        listeners: {
          stdout: (data: Buffer) => {
            pmatOutput += data.toString();
          },
        },
        ignoreReturnCode: true,
      };

      await exec.exec(
        `pmat analyze complexity --fail-on-violation ${failOnViolation} --max-cyclomatic ${maxCyclomatic} --format JSON`,
        [],
        options
      );
    }

    if (!pmatOutput) {
      return;
    }

    const pmatResult = JSON.parse(pmatOutput);

    if (pmatResult.violations.length > 0) {
      const comment = generateMarkdown(pmatResult);

      if (commentOnPr) {
        const token = core.getInput('github-token');
        if (token) {
          const octokit = github.getOctokit(token);
          const { owner, repo, number } = github.context.issue;
          if (number) {
            await octokit.rest.issues.createComment({
              owner,
              repo,
              issue_number: number,
              body: comment,
            });
          }
        }
      }

      if (failOnViolation) {
        core.setFailed('Complexity violations found');
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();