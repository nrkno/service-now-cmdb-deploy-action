# Post Deployment to ServiceNow CMDB

This action posts the deployment to Service Now CMDB.

## Inputs

## `app-name`

**Required** The application name.

## `cmdbid`

**Required** The ServiceNow CMDB ID for the system, can be found in [tjenestekatalogen](http://tjenestekatalogen)

## `api-key`

**Required** The secret API key.

## `api-url`

**Required** The api-url for the ServiceNow endpoint.

## Example usage

```yaml
uses: nrkno/service-now-cmdb-deploy-action@1.0
with:
  app-name: 'nrk-awesome-app'
  cmdbid: '12345'
  api-key: ${{ secrets.SERVICENOW_TOKEN }}
  api-url: 'https://nrk.service-now.com/api/now/table/u_deploy_change'
```
