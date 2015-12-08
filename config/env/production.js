/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
  port: 1338,
  cmds: {
    showInstanceInfo: {
      mainCmd: 'nova --os-username freshdesk --os-password test --os-tenant-name freshdesk --os-auth-url https://keystone.test.rc.nectar.org.au:5000/v2.0/ show <instanceId>'
    },
    getInstanceList: {
      mainCmd: '~/python/osenv/bin/openstack server list --os-username freshdesk --os-password test --os-tenant-name freshdesk --os-auth-url https://keystone.test.rc.nectar.org.au:5000/v2.0/ --all-projects -f json --long --ip <ipAddress>'
    }
  },
  idField: 'ID',
  ipField: 'Networks',
  projectIdField: 'Project ID',
  authorization: 'Basic ',
  instanceDelim:"\n",
  stripTable: true,
  debugHttp: false,
  freshdesk: {
    protocol: 'https://',
    hostname: 'support.nectar.org.au',
    username: '',
    pw: 'X',
    noteApiMethod:'POST',
    noteApiPath: '/helpdesk/tickets/<ticketId>/conversations/note.json',
    isNotePrivate:true,
    updateNote: true,
  },
  apiVersion:'0.0.1',
  error: {
    noAuth: {
      code: 403,
      msg: 'You are not permitted to perform this action.'
    },
    noParam: {
      code: 400, 
      msg: 'Missing parameters.'
    },
  }
};