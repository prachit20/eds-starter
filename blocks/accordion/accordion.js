export default function decorate(block) {
  Array.from(block.children).forEach((row) => {
    row.className = 'accordion-item';

    // 1. Maintain Universal Editor attributes
    row.setAttribute('data-aue-model', 'accordion-item');
    row.setAttribute('data-aue-type', 'component');

    const cols = Array.from(row.children);

    // Header Element
    const header = document.createElement('button');
    header.className = 'accordion-header';

    // 2. Map Column 0 to Accordion Title property
    if (cols[0]) {
      header.innerText = cols[0].innerText || 'Accordion Title';
      cols[0].setAttribute('data-aue-prop', 'title');
      cols[0].setAttribute('data-aue-type', 'text');
      cols[0].style.display = 'none'; // Hide in UI, keep for editor payload
      row.append(cols[0]);
    }

    // Content Wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'accordion-content-wrapper';

    // 3. Map Column 1 as the Dropzone Container for nested blocks
    if (cols[1]) {
      cols[1].className = 'accordion-content';
      cols[1].setAttribute('data-aue-type', 'container');
      cols[1].setAttribute('data-aue-filter', 'accordion-content'); // Allows Fragment
      contentWrapper.append(cols[1]);
    }

    // Accordion Toggle Logic
    header.addEventListener('click', () => {
      const isExpanded = row.classList.contains('expanded');
      block
        .querySelectorAll('.accordion-item')
        .forEach((item) => item.classList.remove('expanded'));
      if (!isExpanded) {
        row.classList.add('expanded');
      }
    });

    row.prepend(header);
    row.append(contentWrapper);
  });
}
