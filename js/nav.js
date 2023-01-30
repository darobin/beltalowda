
import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class BeltalowdaSidebar extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 1rem;
      left: 1rem;
    }
    sl-drawer::part(body) {
      margin-top: -5rem;
    }
    h1 {
      font-family: var(--h-font);
      font-size: 2rem;
      color: var(--green-500);
      margin: 1rem 0 0 0;
      padding: 0 1rem;
      line-height: 1;
    }
    ul {
      padding-left: calc(1rem + 1ch);
    }
    li {
      padding-left: 1ch;
    }
    li::marker {
      content: '»';
      color: var(--light-grey);
    }
    li a {
      text-decoration: none;
      color: var(--sky-500);
    }
  `;
  constructor () {
    super();
  }
  handleShow () {
    this.shadowRoot.querySelector('#nav').show();
  }
  render () {
    return html`
      <sl-icon-button name="list" label="Navigation" style="font-size: 2rem;" @click=${this.handleShow}></sl-icon-button>
      <sl-drawer placement="start" id="nav">
        <h1>beltalowda</h1>
        <nav>
          <ul>
            <li><a href="simple-intent.html">Simple Intent</a></li>
            <li><a href="index.html">Pluggable Identity</a></li>
          </ul>
        </nav>
      </sl-drawer>`
    ;
}
}

customElements.define('blt-sidebar', BeltalowdaSidebar);
