import { installPmat } from '../src/installer';
import * as exec from '@actions/exec';

jest.mock('@actions/exec');

describe('installPmat', () => {
  it('should call the curl command to install pmat', async () => {
    const execSpy = jest.spyOn(exec, 'exec');
    await installPmat();
    expect(execSpy).toHaveBeenCalledWith(
      'curl -sSfl https://raw.githubusercontent.com/paiml/paiml-mcp-agent-toolkit/master/scripts/install.sh | sh'
    );
  });
});