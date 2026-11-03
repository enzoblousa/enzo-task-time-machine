import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  details: { id: 'Detalhes da task', defaultMessage: 'Detalhes da task' },
  deliveryDate: { id: 'Data de entrega', defaultMessage: 'Data de entrega' },
  company: { id: 'Empresa', defaultMessage: 'Empresa' },
  role: { id: 'Função', defaultMessage: 'Função' },
  technologies: { id: 'Tecnologias', defaultMessage: 'Tecnologias' },
  link: { id: 'Link', defaultMessage: 'Link' },
  openLink: { id: 'Abrir entrega', defaultMessage: 'Abrir entrega' },
});

/**
 * Formata uma data ISO (YYYY-MM-DD) sem conversão de fuso horário.
 * `new Date('2024-05-10')` é meia-noite UTC; no Brasil isso viraria
 * 09/05. Formatando em UTC, o dia exibido é sempre o dia salvo.
 */
export const formatDeliveryDate = (isoDate, locale) => {
  if (!isoDate) return null;
  const date = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  if (isNaN(date)) return isoDate;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
};

const TaskDetails = ({ content }) => {
  const intl = useIntl();
  const {
    delivery_date,
    company,
    role,
    technologies = [],
    project_url,
  } = content;

  return (
    <aside
      className="task-details"
      aria-label={intl.formatMessage(messages.details)}
    >
      <dl>
        {delivery_date && (
          <div className="task-details-item">
            <dt>{intl.formatMessage(messages.deliveryDate)}</dt>
            <dd>
              <time dateTime={delivery_date}>
                {formatDeliveryDate(delivery_date, intl.locale)}
              </time>
            </dd>
          </div>
        )}
        {company && (
          <div className="task-details-item">
            <dt>{intl.formatMessage(messages.company)}</dt>
            <dd>{company}</dd>
          </div>
        )}
        {role && (
          <div className="task-details-item">
            <dt>{intl.formatMessage(messages.role)}</dt>
            <dd>{role}</dd>
          </div>
        )}
        {technologies?.length > 0 && (
          <div className="task-details-item task-details-technologies">
            <dt>{intl.formatMessage(messages.technologies)}</dt>
            <dd>
              <ul>
                {technologies.map((tech) => (
                  <li key={tech} className="task-tech">
                    {tech}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {project_url && (
          <div className="task-details-item">
            <dt>{intl.formatMessage(messages.link)}</dt>
            <dd>
              <a href={project_url} target="_blank" rel="noopener noreferrer">
                {intl.formatMessage(messages.openLink)}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </aside>
  );
};

export default TaskDetails;
