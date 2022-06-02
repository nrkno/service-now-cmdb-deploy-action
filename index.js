import { getInput, setFailed } from '@actions/core';
import { context } from '@actions/github';
import fetch from 'node-fetch';

async function main() {
  try {
    const body = {
      u_type: 'Deployment',
      u_cmdb_ci: getInput('cmdbid'),
      u_short_description: `Deployment of ${getInput('app-name')}`,
      u_description: context.payload.head_commit.message,
      u_requested_by: context.payload.head_commit.author.name,
    };
    console.log('Sending', body);

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
    console.log('Response: ', request.status);
    responseText && console.log(responseText);

    if (request.status !== 200) {
      setFailed(
        `Failed to post to ServiceNow: ${request.status}\n ${responseText}`
      );
    }
  } catch (error) {
    setFailed(error.message);
  }
}
main();
