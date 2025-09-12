// Header template
class CustomHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="parentContainer">
              <div class="header">
                <a class="logoLink" href="https://www.facebook.com/bucscircuits" target="_blank">
                  <img
                    id="logo"
                    src="/assets/circuits-logo.png"
                    alt="college organization's logo"
                  />
                </a>
                <div class="innerHeader">
                  <h1 class="circuits">CIRCUITS</h1>
                  <hr />
                  <h2 class="pickIt">PICK.IT!</h2>
                </div>
              </div>
            </div>
        `
    }
}

// Footer template
class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
          <div class="footerSection">
            <a class="githubLink" href="https://github.com/izayazaya/scratch-it/" target="_blank">
              <div class="githubContainer"><img id="github" src="/assets/github.png" alt="github logo"/></div>
            </a>
            <p id="footer">© 2025 <a class="footerCircuits" href="https://www.facebook.com/bucscircuits" target="_blank">CircuITs</a></p>
          </div>
        `
    }
}

// Link templates to custom tags located in the html files
customElements.define('custom-header', CustomHeader)
customElements.define('custom-footer', CustomFooter)
