import * as core from '@actions/core';
import * as github from '@actions/github'; // Keep this import for typing

import { run } from '../src/main';

jest.mock('@actions/core');
jest.mock('@actions/github', () => ({ // Mock the entire @actions/github module
  getOctokit: jest.fn(() => ({
    rest: {
      issues: {
        createComment: jest.fn(),
      },
    },
  })),
  context: { // Directly provide the context object
    issue: { owner: 'test', repo: 'test', number: 123 },
  },
}));

describe('main', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not fail the action when fail-on-violation is false', async () => {
    (core.getBooleanInput as jest.Mock).mockImplementation((name: string) => {
      if (name === 'fail-on-violation') return false;
      return false;
    });
    (core.getInput as jest.Mock).mockReturnValue('');

    const pmatOutput = JSON.stringify({ violations: [{ file: 'test.ts', value: 15 }] });

    await run(pmatOutput);

    expect(core.setFailed).not.toHaveBeenCalled();
  });

  it('should fail the action when fail-on-violation is true', async () => {
    (core.getBooleanInput as jest.Mock).mockImplementation((name: string) => {
      if (name === 'fail-on-violation') return true;
      return false;
    });
    (core.getInput as jest.Mock).mockReturnValue('');

    const pmatOutput = JSON.stringify({ violations: [{ file: 'test.ts', value: 15 }] });

    await run(pmatOutput);

    expect(core.setFailed).toHaveBeenCalledWith('Complexity violations found');
  });

  it('should not fail the action or report anything when fail-on-violation is true but no violations are found', async () => {
    (core.getBooleanInput as jest.Mock).mockImplementation((name: string) => {
      if (name === 'fail-on-violation') return true;
      if (name === 'comment-on-pr') return true;
      return false;
    });
    (core.getInput as jest.Mock).mockReturnValue('');

    const pmatOutput = JSON.stringify({ violations: [] }); // No violations



    const { getOctokit } = require('@actions/github');
    const octokit = getOctokit();

    await run(pmatOutput);

    expect(core.setFailed).not.toHaveBeenCalled();
    expect(octokit.rest.issues.createComment).not.toHaveBeenCalled();
  });
});
