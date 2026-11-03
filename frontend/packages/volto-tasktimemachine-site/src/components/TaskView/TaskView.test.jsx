import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import TaskView from './TaskView';
import { formatDeliveryDate } from './TaskDetails';

vi.mock('@plone/volto/components/theme/View/RenderBlocks', () => ({
  default: ({ content }) => (
    <div data-testid="blocks">{content.blocks_layout.items.join(',')}</div>
  ),
}));

const renderView = (content) =>
  render(
    <IntlProvider locale="pt-BR" defaultLocale="pt-BR" messages={{}}>
      <TaskView content={content} />
    </IntlProvider>,
  );

const baseContent = {
  '@type': 'Task',
  title: 'Migração para Plone 6',
  delivery_date: '2024-05-10',
  company: 'ACME',
  role: 'Desenvolvedor backend',
  technologies: ['Python', 'Plone'],
  project_url: 'https://github.com/acme/pr/1',
};

describe('formatDeliveryDate', () => {
  it('keeps the saved day regardless of timezone', () => {
    expect(formatDeliveryDate('2024-05-10', 'pt-BR')).toBe(
      '10 de maio de 2024',
    );
  });

  it('returns null for empty values', () => {
    expect(formatDeliveryDate(null, 'pt-BR')).toBeNull();
  });
});

describe('TaskView', () => {
  it('renders the task metadata', () => {
    renderView(baseContent);
    expect(screen.getByText('ACME')).toBeInTheDocument();
    expect(screen.getByText('Desenvolvedor backend')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Plone')).toBeInTheDocument();
    expect(screen.getByText('10 de maio de 2024')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://github.com/acme/pr/1',
    );
  });

  it('places the details right after the title block', () => {
    const { container } = renderView({
      ...baseContent,
      blocks: { a: { '@type': 'title' }, b: { '@type': 'slate' } },
      blocks_layout: { items: ['a', 'b'] },
    });
    const children = [...container.querySelector('#page-document').children];
    expect(children.map((el) => el.tagName)).toEqual(['DIV', 'ASIDE', 'DIV']);
    expect(children[0]).toHaveTextContent('a');
    expect(children[2]).toHaveTextContent('b');
  });

  it('omits optional fields that are empty', () => {
    renderView({
      ...baseContent,
      role: null,
      technologies: [],
      project_url: null,
    });
    expect(screen.queryByText('Função')).not.toBeInTheDocument();
    expect(screen.queryByText('Tecnologias')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
