
import { LitElement, html, css, nothing } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import DumbState from './js/dumb-state.js';

const state = new DumbState({
  intents: [],
  thneed: null,
  intentStatus: 'hidden',
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
function pickPic () { state.update({ intentStatus: 'selecting' }); }
function selectCatGallery () { state.update({ intentStatus: 'picking' }); }
function chooseCat (src) { state.update({ intentStatus: 'hidden', thneed: src }); }

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



export class BeltalowdaThneedPicker extends LitElement {
  static properties = {
    thneed: {
      attribute: false,
    },
    intentStatus: {
      attribute: false,
    },
  };
  constructor () {
    super();
    this.thneed = null;
    this.intentStatus = 'hidden';
    state.sub((data) => {
      this.thneed = data.thneed;
      this.intentStatus = data.intentStatus;
    });
  }
  handlePick () {
    pickPic();
  }
  render () {
    if (this.thneed) return html`<img src=${this.thneed} width="200">`;
    return html`<sl-button size="large" loading=${this.intentStatus !== 'hidden' ? true : nothing} @click=${this.handlePick}>Pick Picture</sl-button>`;
  }
}
customElements.define('blt-thneed-custom', BeltalowdaThneedPicker);


export class BeltalowdaIntentPick extends LitElement {
  static styles = css`
  ul {
    padding: 0;
  }
  li {
    list-style-type: none;
  }
  li img {
    cursor: pointer;
  }
  `;
  static properties = {
    intents: {
      attribute: false,
    },
    intentStatus: {
      attribute: false,
    },
  };
  constructor () {
    super();
    this.intents = null;
    this.intentStatus = 'hidden';
    state.sub((data) => {
      this.intents = data.intents;
      this.intentStatus = data.intentStatus;
    });
  }
  handlePickIntent () {
    selectCatGallery();
  }
  handleCatClick (ev) {
    const img = ev.originalTarget;
    if (img.localName !== 'img') return;
    chooseCat(img.src);
  }
  render () {
    if (this.intentStatus === 'hidden') return nothing;
    if (this.intentStatus === 'selecting') {
      let selectContent;
      if (!this.intents?.length) selectContent = html`<p>You have nothing to pick an image from. (Offer way to find something.)</p>`;
      else selectContent = html`<sl-button @click=${this.handlePickIntent}>
        <img src="img/picture.svg" alt="Picture Icon" width="32" height="32" slot="prefix">
        Cat Gallery
      </sl-button>`;
      return html`<sl-card>
        <div slot="header"><strong>Pick image source</strong></div>
        ${selectContent}
      </sl-card>`;
    }
    return html`<sl-card>
      <div slot="header"><strong><img src="img/picture.svg" alt="Picture Icon" width="32" height="32"> cats</strong></div>
      <ul @click=${this.handleCatClick}>
        <li><img src="img/mochi.jpg" alt="Mochi sleeping on plush toy" width="226"></li>
        <li><img src="img/library.jpg" alt="Mochi sleeping on books" width="226"></li>
        <li><img src="img/wtf-cat.jpg" alt="WTF cat" width="226"></li>
        <li><img src="img/cat.svg" alt="Cute cat" width="226"></li>
      </ul>
    </sl-card>`;
  }
}
customElements.define('blt-intent-pick', BeltalowdaIntentPick);
