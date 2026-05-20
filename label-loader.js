(async function () {
  const labelPattern = /\{:label\('([^']+)'\)\}/g;

  async function loadText(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Load failed: ${url}`);
    }

    return response.text();
  }

  async function fileExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async function loadCss(labelName) {
    const cssUrl = `./labels/${labelName}/style.css`;

    if (!(await fileExists(cssUrl))) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.dataset.label = labelName;

    document.head.appendChild(link);
  }

  async function loadJs(labelName) {
    const jsUrl = `./labels/${labelName}/script.js`;

    if (!(await fileExists(jsUrl))) return;

    const script = document.createElement('script');
    script.src = jsUrl;
    script.dataset.label = labelName;

    document.body.appendChild(script);
  }

  async function loadHtml(labelName) {
    const htmlUrl = `./labels/${labelName}/index.html`;

    try {
      return await loadText(htmlUrl);
    } catch (error) {
      console.error(error);

      return `
        <div style="padding: 12px; color: red; border: 1px solid red;">
          label not found: ${labelName}
        </div>
      `;
    }
  }

  async function renderLabels() {
    const originalHtml = document.body.innerHTML;
    const matches = [...originalHtml.matchAll(labelPattern)];

    if (matches.length === 0) return;

    let nextHtml = originalHtml;

    for (const match of matches) {
      const fullText = match[0];
      const labelName = match[1];

      await loadCss(labelName);

      const labelHtml = await loadHtml(labelName);
      nextHtml = nextHtml.replace(fullText, labelHtml);
    }

    document.body.innerHTML = nextHtml;

    for (const match of matches) {
      const labelName = match[1];
      await loadJs(labelName);
    }
  }

  await renderLabels();
})();