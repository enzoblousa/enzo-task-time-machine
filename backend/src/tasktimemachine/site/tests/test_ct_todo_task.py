
from tasktimemachine.site.content.todo_task import ITodoTask  # noqa: E501
from tasktimemachine.site.testing import INTEGRATION_TESTING  # noqa
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from plone.dexterity.interfaces import IDexterityFTI
from zope.component import createObject
from zope.component import queryUtility

import unittest




class TodoTaskIntegrationTest(unittest.TestCase):

    layer = INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.parent = self.portal

    def test_ct_todo_task_schema(self):
        fti = queryUtility(IDexterityFTI, name='Todo Task')
        schema = fti.lookupSchema()
        self.assertEqual(ITodoTask, schema)

    def test_ct_todo_task_fti(self):
        fti = queryUtility(IDexterityFTI, name='Todo Task')
        self.assertTrue(fti)

    def test_ct_todo_task_factory(self):
        fti = queryUtility(IDexterityFTI, name='Todo Task')
        factory = fti.factory
        obj = createObject(factory)

        self.assertTrue(
            ITodoTask.providedBy(obj),
            f'ITodoTask not provided by {obj}!',
        )

    def test_ct_todo_task_adding(self):
        setRoles(self.portal, TEST_USER_ID, ['Contributor'])
        obj = api.content.create(
            container=self.portal,
            type='Todo Task',
            id='todo_task',
        )

        self.assertTrue(
            ITodoTask.providedBy(obj),
            f'ITodoTask not provided by {obj.id}!',
        )

        parent = obj.__parent__
        self.assertIn('todo_task', parent.objectIds())

        # check that deleting the object works too
        api.content.delete(obj=obj)
        self.assertNotIn('todo_task', parent.objectIds())

    def test_ct_todo_task_globally_addable(self):
        setRoles(self.portal, TEST_USER_ID, ['Contributor'])
        fti = queryUtility(IDexterityFTI, name='Todo Task')
        self.assertTrue(
            fti.global_allow,
            f'{fti.id} is not globally addable!'
        )

    def test_ct_todo_task_filter_content_type_false(self):
        setRoles(self.portal, TEST_USER_ID, ['Contributor'])
        fti = queryUtility(IDexterityFTI, name='Todo Task')
        portal_types = self.portal.portal_types
        parent_id = portal_types.constructContent(
            fti.id,
            self.portal,
            'todo_task_id',
            title='Todo Task container',
        )
        self.parent = self.portal[parent_id]
        obj = api.content.create(
            container=self.parent,
            type='Document',
            title='My Content',
        )
        self.assertTrue(
            obj,
            f'Cannot add {obj.id} to {fti.id} container!'
        )
