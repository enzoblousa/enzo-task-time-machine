import React from 'react';
import { Container as SemanticContainer } from 'semantic-ui-react';
import config from '@plone/volto/registry';
import RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
import { hasBlocksData } from '@plone/volto/helpers/Blocks/Blocks';
import TaskDetails from './TaskDetails';
import './TaskView.css';

/**
 * Separa o bloco de título (se for o primeiro) do restante dos blocos,
 * para que os detalhes da task apareçam logo abaixo do título.
 */
const splitTitleBlock = (content) => {
  const items = content.blocks_layout?.items || [];
  const firstId = items[0];
  const hasTitleFirst = content.blocks?.[firstId]?.['@type'] === 'title';
  const withItems = (subset) => ({
    ...content,
    blocks_layout: { ...content.blocks_layout, items: subset },
  });
  return hasTitleFirst
    ? [withItems(items.slice(0, 1)), withItems(items.slice(1))]
    : [null, content];
};

const TaskView = (props) => {
  const { content } = props;
  const Container =
    config.getComponent({ name: 'Container' }).component || SemanticContainer;

  if (!hasBlocksData(content)) {
    return (
      <Container id="page-document" className="view-wrapper task-view">
        <h1 className="documentFirstHeading">{content.title}</h1>
        {content.description && (
          <p className="documentDescription">{content.description}</p>
        )}
        <TaskDetails content={content} />
      </Container>
    );
  }

  const [titleContent, bodyContent] = splitTitleBlock(content);

  return (
    <Container id="page-document" className="view-wrapper task-view">
      {titleContent && <RenderBlocks {...props} content={titleContent} />}
      <TaskDetails content={content} />
      <RenderBlocks {...props} content={bodyContent} />
    </Container>
  );
};

export default TaskView;
