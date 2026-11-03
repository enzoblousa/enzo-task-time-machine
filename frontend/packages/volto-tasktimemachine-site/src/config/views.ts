import type { ConfigType } from '@plone/registry';
import TaskView from '../components/TaskView/TaskView';

export default function install(config: ConfigType) {
  // View padrão do content type "Task" (portal_type definido no backend)
  config.views.contentTypesViews = {
    ...config.views.contentTypesViews,
    Task: TaskView,
  };

  return config;
}
