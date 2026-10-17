import { tools, categories } from './tools-data.js';

const $ = (selector) => document.querySelector(selector);
const list = $('#tools-grid');
const search = $('#tool-search');
const tabs = $('#category-tabs');
const results = $('#results-status');
const empty = $('#empty-state');

if (list && tabs && results && empty && search) {
  let selectedCategory = 'Todas';
  const folded = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const tabButtons = categories.map(category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tab';
    button.textContent = category;
    button.setAttribute('aria-pressed', category === 'Todas' ? 'true' : 'false');
    button.addEventListener('click', () => {
      selectedCategory = category;
      tabButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      render();
    });
    tabs.append(button);
    return button;
  });

  function render() {
    const query = folded(search.value.trim());
    const filtered = tools.filter(tool =>
      (selectedCategory === 'Todas' || tool.category === selectedCategory) &&
      folded(`${tool.title} ${tool.category} ${tool.summary}`).includes(query)
    );
    list.replaceChildren(...filtered.map((tool, i) => {
      const item = document.createElement('article');
      item.className = 'tool-row';
      const number = document.createElement('span');
      number.className = 'tool-index';
      number.textContent = String(i + 1).padStart(2, '0');
      const symbol = document.createElement('span');
      symbol.className = 'tool-symbol';
      symbol.setAttribute('aria-hidden','true');
      symbol.textContent = tool.icon;
      const copy = document.createElement('div');
      copy.className = 'tool-copy';
      const title = document.createElement('h3');
      title.textContent = tool.title;
      const description = document.createElement('p');
      description.textContent = tool.summary;
      copy.append(title, description);
      const detail = document.createElement('span');
      detail.className = 'tool-stage';
      detail.textContent = 'Planejada';
      detail.title = 'A ferramenta ainda não está disponível';
      item.append(number, symbol, copy, detail);
      return item;
    }));
    empty.hidden = filtered.length !== 0;
    results.textContent = `${filtered.length} ferramenta${filtered.length === 1 ? '' : 's'} ${filtered.length === 1 ? 'encontrada' : 'encontradas'} · catálogo em planejamento`;
  }
  search.addEventListener('input', render);
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      search.focus();
    }
    if (e.key === 'Escape' && document.activeElement === search) {
      search.value = '';
      render();
      search.blur();
    }
  });
  const clear = $('#clear-search');
  clear?.addEventListener('click', () => { search.value = ''; selectedCategory = 'Todas'; tabButtons[0].click(); search.focus(); });
  render();
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear().toString();
