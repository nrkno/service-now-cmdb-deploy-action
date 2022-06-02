import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import * as exec from '@actions/exec';
import fetch from 'node-fetch';
import { inspect } from 'util';

const debug = getInput('debug') !== 'false';

async function getMessage(commit) {
  let message = '';
  await exec.exec('git', ['log', '--format=%B', '-n', '1', commit], {
    listeners: { stdout: (data) => (message += data.toString()) },
  });
  return message.trim();
}

async function getAuthorName(commit) {
  let authorName = '';
  await exec.exec('git', ['log', '--format=%an', '-n', '1', commit], {
    listeners: { stdout: (data) => (authorName += data.toString()) },
  });
  return authorName.trim();
}

async function main() {
  try {
    debug && console.log('context', inspect(context, { depth: null }));

    const body = {
      u_type: 'Deployment',
      u_cmdb_ci: getInput('cmdbid'),
      u_short_description: `Deployment of ${getInput('app-name')}`,
      u_description: await getMessage(context.sha),
      u_requested_by: await getAuthorName(context.sha),
    };
    debug && console.log('Sending', body);

    const request = await fetch(getInput('api-url'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getInput('api-key')}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await request.text();

    if (debug) {
      console.log('Response: ', request.status);
      responseText && console.log(responseText);
    }

    if (request.status >= 400) {
      setFailed(
        `Failed to post to ServiceNow: ${[request.status, responseText].join(
          '\n'
        )}`
      );
    }
  } catch (error) {
    console.log(error);
    setFailed(error.message);
  }
}
main();
