
import { LitElement, html, css, nothing } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import DumbState from './js/dumb-state.js';

const state = new DumbState({
  state: 'logged-out',
  identity: null,
});

// actions
function requestLogin () { state.update({ state: 'requesting-login' }); }
function chooseIdentity (identity) { state.update({ state: 'logged-in', identity }); }
function logout () { state.update({ state: 'logged-out', identity: null }); }

export class CatSocietyLoginButton extends LitElement {
  static styles = css`
    sl-button::part(base) {
      color: #fff;
    }
    sl-button::part(base):hover {
      background: hotpink;
    }
    img {
      border-radius: 50%;
      border: 2px solid hotpink;
    }
  `;
  static properties = {
    state: {
      attribute: false,
    },
    identity: {
      attribute: false,
    },
  };
  constructor () {
    super();
    this.state = state.get().state;
    this.identity = null;
    state.sub((data) => {
      this.state = data.state;
      this.identity = data.identity;
    });
  }
  handleRequestIdentity () {
    requestLogin();
  }
  render () {
    if (this.state === 'logged-in') {
      return html`
        <img src=${`img/${this.identity.img}`} width="32" alt=${`${this.identity.name} picture`}>
      `
      ;
    }
    const loading = (this.state === 'requesting-login');
    return html`
      <sl-button size="small" outline loading=${loading ? 'loading' : nothing} @click=${this.handleRequestIdentity}>
        <sl-icon slot="prefix" name="person-circle"></sl-icon>
        Login
      </sl-button>`
    ;
}
}

customElements.define('cat-login', CatSocietyLoginButton);

export class BeltalowdaIdentity extends LitElement {
  static styles = css`
    :host {
      --arrow-color: #000;
    }
    sl-popup > div {
      background: #fff;
      border: solid var(--border-width) var(--border-color);
      border-radius: var(--border-radius);
    }
    sl-popup > .requesting {
      width: 280px;
    }
    sl-popup > .logged-in {
      width: 48px;
      height: 48px;
      filter: sepia(1);
      transition: opacity width 0.5s;
    }
    sl-popup > .logged-in img { display: revert; }
    sl-popup > .logged-in sl-icon-button { display: none; }
    sl-popup > .logged-in:hover img { display: none; }
    sl-popup > .logged-in:hover sl-icon-button { display: revert; }
    sl-option > img {
      border-radius: 50%;
    }
    .actions {
      text-align: right;
      padding: 0.5rem 1rem;
    }
    sl-icon-button::part(base):hover {
      color: inherit;
    }
  `;
  static properties = {
    anchor: {},
    state: {
      attribute: false,
    },
    identity: {
      attribute: false,
    },
    selectedIdentity: {
      attribute: false,
    },
  };
  constructor () {
    super();
    this.state = state.get().state;
    this.identity = null;
    state.sub((data) => {
      this.state = data.state;
      this.identity = data.identity;
    });
    this.identities = [
      { id: 'unicorn', img: 'unicorn.jpg', name: 'Unicorn' },
      { id: 'robin', img: 'robin.jpg', name: 'Robin' },
      { id: 'wtf', img: 'wtf-cat.jpg', name: 'Mew Mew Mew' },
    ];
    this.selectedIdentity = null;
  }
  handlePickIdentity (ev) {
    const id = ev.originalTarget.value;
    this.selectedIdentity = this.identities.find(p => p.id === id);
  }
  handleAccept () {
    chooseIdentity(this.selectedIdentity);
  }
  handleAbort () {
    this.selectedIdentity = null;
    logout();
  }
  handleLogout () {
    this.selectedIdentity = null;
    logout();
  }
  render () {
    const active = (this.state !== 'logged-out');
    if (!this.anchor) return;
    // not sure why but we have to resolve it ourselves or it won't work
    const anchor = this.getRootNode().getElementById(this.anchor);
    let content;
    if (this.state === 'requesting-login') {
      content = html`
        <div class="requesting">
          <sl-select placeholder="Pick login identity…" @sl-change=${this.handlePickIdentity}>
            <sl-icon name="person-circle" slot="prefix"></sl-icon>
            ${
              this.identities.map(({ id, img, name }) => html`<sl-option value=${id}><img src=${`img/${img}`} width="32" alt=${`${name} picture`} slot="prefix">${name}</sl-option>`)
            }
          </sl-select>
          <div class="actions">
            <sl-button size="small" @click=${this.handleAbort}>Cancel</sl-button>
            <sl-button size="small" @click=${this.handleAccept} disabled=${this.selectedIdentity ? nothing : true} variant="primary">Login</sl-button>
          </div>
        </div>
      `;
    }
    else if (this.state === 'logged-in') {
      content = html`
        <div class="logged-in">
          <img src=${`img/${this.identity.img}`} width="48" alt=${`${this.identity.name} picture`}>
          <sl-icon-button name="box-arrow-right" label="Logout" id="logout-icon" style="font-size: 2rem; text-align: center;" @click=${this.handleLogout}></sl-icon-button>
        </div>
      `;
    }
    return html`
      <sl-popup
        active=${active || nothing}
        placement="right-start"
        .anchor=${anchor}
        skidding="53"
        arrow
        arrow-placement="start"
        arrow-padding="5"
        distance="5"
      >
        ${content}
      </sl-popup>`
    ;
}
}

customElements.define('blt-identity', BeltalowdaIdentity);
