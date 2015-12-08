# freshdesk-osid

Freshdesk Openstack Instance Data Provider

## Overview

Retrieves compute instance data from Openstack using an IP address and pushes the data as a private ticket comment. 

## Architecture

The application is written in SailsJS (NodeJS), and requires the Python Openstack client, and valid Openstack credentials.

## Configuration

Freshdesk needs to be configured to have the following integrations:

A 'Dispatchr' with:

- Conditions not ''.
- Action set to 'Trigger a webhook'.
  - Callback URL: https://*fqdn*/osid/api/0.0.1/instance/addInfo
  - Request type: 'POST'
  - Requires Authentication (API Key): the value that translates to the base64 field value 'authorization' found at 'puppet-freshdesk/osid-config/*environment*.js'. See puppet-freshdesk for more information.
  - Encoding: JSON
  - Content: 
  ```
  {
    "srcText": "{{ticket.description}}",
    "ticketId": {{ticket.id}}
  }
  ```

A 'Observer' with:

- Trigger when 'Note is added', type: 'Public', events performed by 'anyone'.
- 'Tickets with these properties' set to a blank condition (no condition).
- Action set to 'Trigger a webhook'
  - Callback URL: https://*fqdn*/osid/api/0.0.1/instance/addInfo
  - Request type: 'POST'
  - Requires Authentication (API Key): the value that translates to the base64 field value 'authorization' found at 'puppet-freshdesk/osid-config/*environment*.js'. See puppet-freshdesk for more information.
  - Encoding: JSON
  - Content: 
  ```
  {
    "srcText": "{{ticket.latest_public_comment}}",
    "ticketId": {{ticket.id}}
  }
  ```
  
See Freshdesk documentation for more information on how to add the above 'Helpdesk Productivity' components.


## Packaging

To simplify deployment of the application on the production and test environments which have limited internet connectivity, versioned bundles of this application is stored at *puppet-freshdesk/bin*.

To package a bundle, simply create a tar ball of this app (after running `npm install`) with the naming convention 'freshdesk-osid-*version*.tar.gz' and put at *puppet-freshdesk/bin/*. Dont' forget the appropriate tags on the concerned repositories.

## Service information 

Service name: freshdesk-osid
Configuration: /opt/freshdesk-osid/config/env/*environment*.js
Log file: /var/log/freshdesk/osid.log
Logrotate config: /etc/logrotate.d/freshdesk

