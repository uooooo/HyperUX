# Errors

> List of general and specific errors you may encounter when using the REST API.

## Generic Errors

These error codes are consistent for all endpoints.

### Forbidden

You're not authorized to use the endpoint. This usually happens due to missing an user token.

<Note>Similar to the HTTP 403 Forbidden error.</Note>

```json error-response-forbidden
{
  "error": {
    "code": "forbidden",
    "message": "Not authorized"
  }
}
```

### Rate Limited

You exceeded the maximum allotted requests.

The limit of request is per endpoint basis so you could continue using another endpoints even if some of them give you this error.

```json error-response-rate-limited
{
  "error": {
    "code": "rate_limited",
    "message": "The rate limit of 6 exceeded for 'api-www-user-update-username'. Try again in 7 days",
    "limit": {
      "remaining": 0,
      "reset": 1571432075,
      "resetMs": 1571432075563,
      "total": 6
    }
  }
}
```

### Bad Request

There was an error with the request, the `error.message` would contain information about the issue.

```json error-response-bad-request
{
  "error": {
    "code": "bad_request",
    "message": "An english description of the error that just occurred"
  }
}
```

### Internal Server Error

This errors is similar to the HTTP 500 Internal Server Error error code.

```json error-response-internal-server-error
{
  "error": {
    "code": "internal_server_error",
    "message": "An unexpected internal error occurred"
  }
}
```

### Resource Not Found

The requested resource could not be found

```json error-response-not-Found
{
  "error": {
    "code": "not_found",
    "message": "Could not find the RESOURCE: ID"
  }
}
```

### Method Unknown

The endpoint you're requesting does not handle the method you defined. The error message will contain the methods the endpoint responds to.

```json error-response-method-unknown
{
  "error": {
    "code": "method_unknown",
    "message": "This endpoint only responds to METHOD"
  }
}
```

## Deployment Errors

These error codes can happen when using any [deployment related endpoint](/endpoints/deployments).

### Missing Files

Some of the files you defined when creating the deployment are missing.

```json error-response-missing-files
{
  "error": {
    "code": "missing_files",
    "message": "Missing files",
    "missing": []
  }
}
```

### No Files in the Deployment

You tried to create an empty deployment.

```json error-response-no-files
{
  "error": {
    "code": "no_files",
    "message": "No files in the deployment"
  }
}
```

### Too Many Environment Variables

The limit of environment variables per deployment is 100 and you defined more. The error message indicates the amount you define.

```json error-response-too-many-env-keys
{
  "error": {
    "code": "env_too_many_keys",
    "message": "Too many env vars have been supplied (100 max allowed, but got #)"
  }
}
```

<Note>
  `#`is your number of variables.
</Note>

### Environment Variable Key with Invalid Characters

Some environment variable name contains an invalid character. The only valid characters are letters, digits and `_`.

The error message will contain the `KEY` with the problem.

```json error-response-env-key-invalid-characters
{
  "error": {
    "code": "env_key_invalid_characters",
    "message": "The env key "KEY" contains invalid characters. Only letters, digits and \`_\` are allowed",
    "key": KEY
  }
}
```

### Environment Variable Key with a Long Name

An environment variable name is too long, the maximum permitted name is 256 characters.

The error message contains the environment `KEY`.

```json error-response-env-key-invalid-length
{
  "error": {
    "code": "env_key_invalid_length",
    "message": "The env key "KEY" exceeds the 256 length limit",
    "key": KEY
  }
}
```

### Environment Variable Value with a Long Name

An environment variable value contains a value too long, the maximum permitted value is 65536 characters.

The error message contains the environment `KEY`.

```json error-response-env-value-invalid-length
{
  "error": {
    "code": "env_value_invalid_length",
    "message": "The env value for "KEY" exceeds the 65536 length limit",
    "key": KEY,
    "value": VALUE
  }
}
```

### Environment Variable Value Is an Object without UID

The value of an environment variable is object but it doesn't have a `uid`.

The error message contains the environment `KEY` which has the error.

```json error-response-env-value-invalid-type
{
  "error": {
    "code": "env_value_invalid_type_missing_uid",
    "message": "The env key "KEY" passed an object as a value with no \`uid\` key"
  }
}
```

### Environment Variable Value Is an Object with Unknown Props

The value of an environment variable is an object with unknown attributes, it only can have a `uid` key inside the object.

```json error-response-env-value-invalid-type
{
  "error": {
    "code": "env_value_invalid_type_unknown_props",
    "message": "The env key "KEY" passed an object with unknown properties. Only \`uid\` is allowed when passing an object"
  }
}
```

### Environment Variable Value with an Invalid Type

An environment variable value passed is of an unsupported type.

The error message contains the environment `KEY`.

```json error-response-env-value-invalid-type
{
  "error": {
    "code": "env_value_invalid_type",
    "message": "The env key "KEY" passed an unsupported type for its value",
    "key": KEY
  }
}
```

### Not Allowed to Access a Secret

You're trying to use a secret but you don't have access to it.

```json error-response-secret-forbidden
{
  "error": {
    "code": "env_secret_forbidden",
    "message": "Not allowed to access secret \\"NAME\\"",
    "uid": UID
  }
}
```

### Missing Secret

You're trying to use a secret as an environment value and it doesn't exists.

```json error-response-secret-missing
{
  "error": {
    "code": "env_secret_missing",
    "message": "Could not find a secret by uid "UID"",
    "uid": UID
  }
}
```

## Domain Errors

These error code could happen when using any [domains related endpoints](/endpoints/domains).

### Domain Forbidden

You don't have access to the domain, this usually mean this domains is owned by another account or team.

The domain is specified in the message and the `DOMAIN` key.

```json error-response-forbidden
{
  "error": {
    "code": "forbidden",
    "message": "You don't have access to \\"DOMAIN\\"",
    "domain": DOMAIN
  }
}
```

### Domain Not Found

The domain name could not be found in our system. Try to [add it first](#endpoints/domains/register-or-transfer-in-a-new-domain).

```json error-response-not-found
{
  "error": {
    "code": "not_found",
    "message": "Domain name not found"
  }
}
```

### Missing Domain Name

The domain name wasn't specified in the URL. This means you tried to use an endpoint which require you to define the domain name in the URL but didn't defined it.

```json error-response-missing-name
{
  "error": {
    "code": "missing_name",
    "message": "The URL was expected to include the domain name. Example: /domains/google.com"
  }
}
```

### Conflicting Certificates

You must [remove the certificates](#endpoints/certificates/delete-a-certificate) described in the error before removing the domains.

The certificates are specified in the `CERT_CNS` key.

```json error-response-conflict-certs
{
  "error": {
    "code": "conflict_certs",
    "message": "The following certificates must be removed before removing the domain: CERT_CNS",
    "certCNs": CERT_CNS
  }
}
```

### Conflicting Aliases

You must [remove the aliases](#endpoints/aliases/delete-an-alias) described in the error before removing the domains.

The aliases are specified in the `ALIASES` key.

```json error-response-conflict-alias
{
  "error": {
    "code": "conflict_aliases",
    "message": "The following aliases must be removed before removing the domain: ALIASES",
    "aliases": ALIASES
  }
}
```

### Not Modified

When trying to modify a domain nothing was required to change.

```json error-response-not-modified
{
  "error": {
    "code": "not_modified",
    "message": "Nothing to do"
  }
}
```

### Missing Name for Domain

When trying to add a domain the name wasn't present in the request body.

```json error-response-missing-name
{
  "error": {
    "code": "missing_name",
    "message": "The `name` field in the body was expected but is not present in the body payload. Example value: `example.com`"
  }
}
```

### Invalid Name for Domain

The domain name defined in the request body is invalid.

The name is specified in the error as the `NAME` key.

```json error-response-invalid-name
{
  "error": {
    "code": "invalid_name",
    "message": "The \`name\` field contains an invalid domain name ("NAME")",
    "name": NAME
  }
}
```

### Custom Domain Needs a Plan Upgrade

In order to add a custom domain to your account or team you need to upgrade to a paid plan.

```json error-response-domain-needs-upgrade
{
  "error": {
    "code": "custom_domain_needs_upgrade",
    "message": "Domain name creation requires a premium account."
  }
}
```

### Domain Already Exists

The domain name you're trying to add already exists.

The domain name and its current ID are received in the `NAME` and `DOMAIN_ID` keys.

```json error-response-not-modified
{
  "error": {
    "code": "not_modified",
    "message": "The domain "NAME" already exists",
    "name": NAME,
    "uid": DOMAIN_ID
  }
}
```

### Can't Create the Domain

The domain name can't be created. Most probably it couldn't be verified.

```json error-response-forbidden
{
  "error": {
    "code": "forbidden",
    "message": "You don't have permission to create a domain"
  }
}
```

### Failed to Add Domain after Purchase

We were able to purchase a domain for you but we had an error when trying to add it to your account. Please contact us on **[Contact Support](/help)**.

```json error-response-failed-add-domain
{
  "error": {
    "code": "failed_to_add_domain",
    "message": "The domain was bought but couldn't be added.
  }
}
```

### Unable to Determine the Domain Price

We're unable to determine the domain price of a domain.

```json error-response-service-unavailable
{
  "error": {
    "code": "service_unavailable",
    "message": "Failed to determine the domain price"
  }
}
```

### Domain price mismatch

The `expectedPrice` supplied in the request body does not match the actual domain price, which is specified in the `actualPrice` key.

```json error-response-price-mismatch
{
  "error": {
    "code": "price_mismatch",
    "message": "The expected price does not match the actual price",
    "price": ACTUAL_PRICE
  }
}
```

### Domain Is Not Available

The domain name is not available to be purchased.

```json error-response-not-available
{
  "error": {
    "code": "not_available",
    "message": "Domain is not available"
  }
}
```

### Invalid Domain Name

The domain name or TLD is invalid or not supported.

```json error-response-invalid-domain
{
  "error": {
    "code": "invalid_domain",
    "message": "Invalid domain or TLD"
  }
}
```

### Missing DNS Record Name

The DNS record key `name` is required and was not provided. It could be [any valid DNS record](https://en.wikipedia.org/wiki/List_of_DNS_record_types).

```json error-response-missing-type
{
  "error": {
    "code": "missing_type",
    "message": "Missing `type` parameter"
  }
}
```

## DNS Errors

These error code could happen when using any [DNS related endpoint](/endpoints/dns).

### Missing DNS Record Name

The DNS record key `name` is required and was not provided. It should be either a subdomain or `@` for the domain itself.

```json error-response-missing-Name
{
  "error": {
    "code": "missing_name",
    "message": "Missing `name` parameter"
  }
}
```

### Missing DNS Record Type

The DNS record key `name` is required and was not provided. It could be [any valid DNS record](https://en.wikipedia.org/wiki/List_of_DNS_record_types).

```json error-response-missing-type
{
  "error": {
    "code": "missing_type",
    "message": "Missing `type` parameter"
  }
}
```

## OAuth2 errors

These errors could occur when using any [OAuth2 related endpoint](/docs/integrations#using-the-vercel-api/getting-an-access-token).

### Client Not Found

The OAuth2 client ID could not be found or doesn't exist.

```json error-response-not-found
{
  "error": {
    "code": "not_found",
    "message": "OAuth client doesn't not found: CLIENT_ID"
  }
}
```
