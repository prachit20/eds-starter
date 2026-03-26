export default function decorate(block) {
  const tabList = document.createElement('div');
  tabList.className = 'tabs-list';
  tabList.setAttribute('role', 'tablist');

  const tabPanels = document.createElement('div');
  tabPanels.className = 'tabs-panels';

  Array.from(block.children).forEach((row, i) => {
    const tabBtn = document.createElement('button');
    tabBtn.className = 'tab-button';
    tabBtn.setAttribute('role', 'tab');

    const tabPanel = document.createElement('div');
    tabPanel.className = 'tab-panel';
    tabPanel.setAttribute('role', 'tabpanel');

    // 1. Maintain Universal Editor attributes
    Array.from(row.attributes).forEach((attr) => {
      if (attr.name.startsWith('data-aue-'))
        tabPanel.setAttribute(attr.name, attr.value);
    });
    tabPanel.setAttribute('data-aue-model', 'tab');
    tabPanel.setAttribute('data-aue-type', 'component');

    const cols = Array.from(row.children);

    // 2. Map Column 0 to the Tab Title property
    if (cols[0]) {
      tabBtn.innerText = cols[0].innerText || `Tab ${i + 1}`;
      cols[0].setAttribute('data-aue-prop', 'title');
      cols[0].setAttribute('data-aue-type', 'text');
      cols[0].style.display = 'none'; // Hide in UI, keep for editor payload
      tabPanel.append(cols[0]);
    }

    // 3. Map Column 1 as the Dropzone Container for nested blocks
    if (cols[1]) {
      cols[1].className = 'tab-content-container';
      cols[1].setAttribute('data-aue-type', 'container');
      cols[1].setAttribute('data-aue-filter', 'tab-content'); // Allows Accordion
      tabPanel.append(cols[1]);
    }

    // Tab Switching Logic
    tabBtn.addEventListener('click', () => {
      block
        .querySelectorAll('.tab-button')
        .forEach((b) => b.classList.remove('active'));
      block
        .querySelectorAll('.tab-panel')
        .forEach((p) => p.classList.remove('active'));
      tabBtn.classList.add('active');
      tabPanel.classList.add('active');
    });

    // Default to first tab open
    if (i === 0) {
      tabBtn.classList.add('active');
      tabPanel.classList.add('active');
    }

    tabList.append(tabBtn);
    tabPanels.append(tabPanel);
    row.remove();
  });

  block.append(tabList);
  block.append(tabPanels);
}
