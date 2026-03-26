import { toClassName } from '../../scripts/aem.js';

export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const rows = [...block.children];

  rows.forEach((row, i) => {
    // 1. Tell Universal Editor this row is a Tab component
    row.setAttribute('data-aue-model', 'tab');
    row.setAttribute('data-aue-type', 'component');

    const tabTitleCol = row.children[0];

    // 2. CRITICAL FIX: Force-create the content dropzone if it's missing
    let tabContentCol = row.children[1];
    if (!tabContentCol) {
      tabContentCol = document.createElement('div');
      row.append(tabContentCol);
    }

    const id = toClassName(tabTitleCol?.textContent || `tab-${i}`);

    // Setup Tab Panel wrapper
    row.className = 'tabs-panel';
    row.id = `tabpanel-${id}`;
    row.setAttribute('aria-hidden', !!i);
    row.setAttribute('aria-labelledby', `tab-${id}`);
    row.setAttribute('role', 'tabpanel');

    // 3. Map the title property for the Editor
    if (tabTitleCol) {
      tabTitleCol.setAttribute('data-aue-prop', 'title');
      tabTitleCol.setAttribute('data-aue-type', 'text');
      tabTitleCol.style.display = 'none';
    }

    // 4. Always apply dropzone attributes to the content column
    tabContentCol.className = 'tabs-panel-content';
    tabContentCol.setAttribute('data-aue-type', 'container');
    tabContentCol.setAttribute('data-aue-filter', 'tab-content'); // Allows Accordion

    // Build the visual Tab Button
    const button = document.createElement('button');
    button.className = 'tabs-tab';
    button.id = `tab-${id}`;
    button.innerHTML = tabTitleCol?.innerHTML || 'New Tab';
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      row.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });

    tablist.append(button);
  });

  block.prepend(tablist);
}
