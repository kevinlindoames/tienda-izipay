import { spawn } from 'node:child_process';

import {
  E2eSafetyError,
  sanitizeE2eText,
} from '../../src/config/e2e-database-target';

interface RunPnpmCommandOptions {
  args: string[];
  cwd: string;
  environment: NodeJS.ProcessEnv;
  label: string;
  sensitiveValues?: readonly string[];
  streamOutput?: boolean;
}

function pnpmCommand(args: string[]): { args: string[]; command: string } {
  if (process.platform === 'win32') {
    return {
      args: ['/d', '/s', '/c', 'pnpm.cmd', ...args],
      command: process.env.ComSpec ?? 'cmd.exe',
    };
  }

  return {
    args,
    command: 'pnpm',
  };
}

export async function runPnpmCommand(
  options: RunPnpmCommandOptions,
): Promise<void> {
  const command = pnpmCommand(options.args);

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command.command, command.args, {
      cwd: options.cwd,
      env: options.environment,
      shell: false,
      stdio: options.streamOutput ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    child.once('error', () => {
      reject(new E2eSafetyError(`${options.label} could not be started.`));
    });

    child.once('close', (exitCode) => {
      if (!options.streamOutput) {
        const sensitiveValues = options.sensitiveValues ?? [];
        const safeStdout = sanitizeE2eText(stdout, sensitiveValues);
        const safeStderr = sanitizeE2eText(stderr, sensitiveValues);

        if (safeStdout.length > 0) {
          process.stdout.write(safeStdout);
        }

        if (safeStderr.length > 0) {
          process.stderr.write(safeStderr);
        }
      }

      if (exitCode === 0) {
        resolve();
        return;
      }

      reject(new E2eSafetyError(`${options.label} failed.`));
    });
  });
}
