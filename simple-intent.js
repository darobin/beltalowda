
import { LitElement, html, css, nothing } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import DumbState from './js/dumb-state.js';

const state = new DumbState({
  intents: [],
});

// actions
function installCatPickerIntent () { state.update({ intents: [
  {
    can: 'pick',
    what: 'image/*',
    name: 'Cat Gallery',
  }
] }); }
function removeCatPickerIntent () { state.update({ intents: [] }); }

export class BeltalowdaInstallIntentIcon extends LitElement {
  static properties = {
    isInstalled: {
      attribute: false,
    },
  };
  constructor () {
    super();
    this.isInstalled = !!state.get().intents?.length;
    state.sub((data) => {
      this.isInstalled = !!data.intents?.length;
    });
  }
  handleToggleInstall () {
    if (this.isInstalled) removeCatPickerIntent();
    else installCatPickerIntent();
  }
  render () {
    if (this.isInstalled) return html`<sl-icon-button name="journal-x" label="Remove Intent" @click=${this.handleToggleInstall}></sl-icon-button>`;
    return html`<sl-icon-button name="journal-plus" label="Add Intent" @click=${this.handleToggleInstall}></sl-icon-button>`;
  }
}

customElements.define('blt-install-intent', BeltalowdaInstallIntentIcon);
