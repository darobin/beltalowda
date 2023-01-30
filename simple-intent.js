
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

export class BeltalowdaSimpleIntentState extends LitElement {
  static styles = css`
    p {
      margin: 0;
      padding: 1rem;
      border: 1px solid var(--sl-color-primary-700);
      background: var(--sl-color-primary-100);
      font-size: 0.8rem;
      max-width: 300px;
    }
  `;
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
  render () {
    if (this.isInstalled) return html`<p>
      Now that the intent is installed, it will respond when the user seeks to <strong>pick an image/*</strong>.
      You can remove the intent by clicking again.
    </p>`;
    return html`<p>
      Install the intent by clicking on the top-right icon.
    </p>`;
  }
}

customElements.define('blt-simple-intent-state', BeltalowdaSimpleIntentState);
