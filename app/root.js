const inherits = require('util').inherits
const Component = require('react').Component
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const passworder = require('browser-passworder')

module.exports = connect(mapStateToProps)(AppRoot)

function mapStateToProps (state) {
  return {
    view: state.currentView,
    nonce: state.nonce,
  }
}

inherits(AppRoot, Component)
function AppRoot () {
  Component.call(this)
  this.state = {
    vaultData: '',
    password: '',
    error: null,
    crypted: null,
  }
}

AppRoot.prototype.render = function () {
  const props = this.props
  const state = this.state || {}
  const { error, crypted } = state

  return (
    h('.content', [
      h('div', {
        style: {
        },
      }, [
        h('h1', `MetaMask Vault Decryptor`),

        h('a', {
          href: 'https://metamask.zendesk.com/hc/en-us/articles/360015289852-How-to-Copy-Your-Vault-Data',
          target: '_blank'
        }, 'How to Copy Your Vault Data'),
        h('br'),

        h('a', {
          href: 'https://github.com/MetaMask/vault-decryptor',
        }, 'Fork on Github'),
        h('br'),

        h('textarea.vault-data', {
          style: {
            width: '600px',
            height: '300px'
          },
          placeholder: 'Paste your vault data here.',
          onChange: (event) => {
            const vaultData = event.target.value
            this.setState({ vaultData })
          },
        }),
        h('br'),

        h('input.password', {
          type: 'password',
          placeholder: 'Password',
          onChange: (event) => {
            const password = event.target.value
            this.setState({ password })
          },
        }),
        h('br'),

        h('button.decrypt', {
          onClick: this.decrypt.bind(this),
        }, 'Decrypt'),

        h('button.encrypt', {
          onClick: this.encrypt.bind(this),
        }, 'Encrypt'),

        error ? h('.error', {
          style: { color: 'red' },
        }, error) : null,

        crypted ? h('div', crypted) : null,

      ])
    ])
  )
}

AppRoot.prototype.decrypt = function(event) {
  const { password, vaultData } = this.state

  let vault
  try {
    vault = vaultData
  } catch (e) {
    console.error(e)
    return this.setState({ error: 'Problem decoding vault: ' + JSON.stringify(e) })

  }

  passworder.decrypt(password, vault)
  .then((decryptedObj) => {
    const crypted = JSON.stringify(decryptedObj)
    console.log('Decrypted!', crypted)
    this.setState({ crypted })
  })
  .catch((reason) => {
    console.error(reason)
    this.setState({ error: 'Problem decoding vault.' })
  })
}

AppRoot.prototype.encrypt = function(event) {
  const { password, vaultData } = this.state

  let vault
  try {
    vault = vaultData
  } catch (e) {
    console.error(e)
    return this.setState({ error: 'Problem encoding vault: ' + JSON.stringify(e) })
  }

  passworder.encrypt(password, vault)
  .then((encryptedObj) => {
    const crypted = JSON.stringify(encryptedObj)
    console.log('Encrypted!', crypted)
    this.setState({ crypted })
  })
  .catch((reason) => {
    console.error(reason)
    this.setState({ error: 'Problem encoding vault.' })
  })
}

