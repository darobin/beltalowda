
import { LitElement, html, css, nothing } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import DumbState from '../lib/dumb-state.js';

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
  `;
  static properties = {
    state: {
      attribute: false,
    },
  };
  constructor () {
    super();
    this.state = state.get().state;
    state.sub((data) => {
      this.state = data.state;
    });
  }
  handleRequestIdentity () {
    console.warn(`requesting`);
    requestLogin();
    console.warn(`data`, state.get());
  }
  render () {
    if (this.state === 'logged-in') {
      return html`
        <sl-button size="small" outline>
          <sl-icon slot="prefix" name="person-circle"></sl-icon>
          SOME PERSON
        </sl-button>`
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
