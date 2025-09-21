# Using the Vercel SDK

> Interact programmatically with your Vercel account using the SDK.

The `@vercel/sdk` is a type-safe Typescript SDK that allows you to access the resources and methods of the Vercel REST API.

<Note>To view the methods for all endpoints, and explore code examples, see the [reference endpoints documentation](/endpoints).</Note>

## Installing Vercel SDK

To download and install Vercel SDK, run the following command:

<CodeGroup>
  ```bash pnpm
  pnpm i @vercel/sdk
  ```

  ```bash npm
  npm i @vercel/sdk
  ```

  ```bash yarn
  yarn add @vercel/sdk
  ```
</CodeGroup>

### Authentication

Vercel Access Tokens are required to authenticate and use the Vercel SDK.

Once you have [created a token](/welcome#creating-an-access-token), you can use it to initialize the SDK as follows:

```ts run.ts
import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: '<YOUR_BEARER_TOKEN_HERE>',
});
```

### Troubleshooting

Make sure that you create a token with the correct Vercel [scope](https://vercel.com/docs/dashboard-features#scope-selector).
If you face permission (403) errors when you are already sending a token, it can be one of the following problems:

* The token you are using has expired. Check the expiry date of the token in the Vercel dashboard.
* The token does not have access to the correct scope, either not the right team or it does not have account level access.
* The resource or operation you are trying to use is not available for that team. For example, AccessGroups is an Enterprise only feature and you are using a token for a team on the pro plan.

### Examples

Learn how to use Vercel SDK through the following categories of examples:

* [Deployments Automation](/examples/deployments-automation)
* [Project Management](/examples/project-management)
* [Domain Management](/examples/domain-management)
* [Team Management](/examples/team-management)
* [Environment Variables](/examples/environment-variables)
* [Logs and Monitoring](/examples/logs-monitoring)
* [Integrations](/examples/integrations)
