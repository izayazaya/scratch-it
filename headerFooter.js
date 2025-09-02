class CustomHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="parentContainer">
              <div class="header">
                <img
                  id="logo"
                  src="./assets/circuits-logo.png"
                  alt="college organization's logo"
                />
                <div class="innerHeader">
                  <h1>CIRCUITS</h1>
                  <hr />
                  <h2>PICK.IT!</h2>
                </div>
              </div>
            </div>
        `
    }
}

class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
          <p id="footer">© 2025 CircuITs</p>
        `
    }
}

customElements.define('custom-header', CustomHeader)
customElements.define('custom-footer', CustomFooter)
