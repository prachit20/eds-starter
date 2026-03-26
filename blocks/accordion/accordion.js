export default function decorate(block) {
  [...block.children].forEach((row) => {
    // 1. Tell Universal Editor this row is an Accordion Item
    row.setAttribute('data-aue-model', 'accordion-item');
    row.setAttribute('data-aue-type', 'component');

    const label = row.children[0];
    const body = row.children[1];

    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';

    // 2. Map the title property and move contents safely
    if (label) {
      summary.append(...label.childNodes);
      label.setAttribute('data-aue-prop', 'title');
      label.setAttribute('data-aue-type', 'text');
      label.style.display = 'none'; // Hide in UI, keep for Editor
      details.append(label);
    }

    // 3. Mark the body as a dropzone for the Fragment
    if (body) {
      body.className = 'accordion-item-body';
      body.setAttribute('data-aue-type', 'container');
      body.setAttribute('data-aue-filter', 'accordion-content');
      details.append(body);
    }

    // 4. Safely clear the row and append the details INSIDE it
    row.innerHTML = '';
    row.append(details);
  });
}
