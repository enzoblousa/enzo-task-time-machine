
from tasktimemachine.site.content.task import ITask  # noqa: E501
from tasktimemachine.site.testing import INTEGRATION_TESTING  # noqa
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from plone.dexterity.interfaces import IDexterityFTI
from zope.component import createObject
from zope.component import queryUtility

import unittest




class TaskIntegrationTest(unittest.TestCase):

    layer = INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.parent = self.portal

    def test_ct_task_schema(self):
        fti = queryUtility(IDexterityFTI, name='Task')
        schema = fti.lookupSchema()
        self.assertEqual(ITask, schema)

    def test_ct_task_fti(self):
        fti = queryUtility(IDexterityFTI, name='Task')
        self.assertTrue(fti)

    def test_ct_task_factory(self):
        fti = queryUtility(IDexterityFTI, name='Task')
        factory = fti.factory
        obj = createObject(factory)

        self.assertTrue(
            ITask.providedBy(obj),
            f'ITask not provided by {obj}!',
        )

    def test_ct_task_adding(self):
        setRoles(self.portal, TEST_USER_ID, ['Contributor'])
        obj = api.content.create(
            container=self.portal,
            type='Task',
            id='task',
        )

        self.assertTrue(
            ITask.providedBy(obj),
            f'ITask not provided by {obj.id}!',
        )

        parent = obj.__parent__
        self.assertIn('task', parent.objectIds())

        # check that deleting the object works too
        api.content.delete(obj=obj)
        self.assertNotIn('task', parent.objectIds())

    def test_ct_task_globally_addable(self):
        setRoles(self.portal, TEST_USER_ID, ['Contributor'])
        fti = queryUtility(IDexterityFTI, name='Task')
        self.assertTrue(
            fti.global_allow,
            f'{fti.id} is not globally addable!'
        )

    def test_ct_task_filter_content_type_false(self):
        setRoles(self.portal, TEST_USER_ID, ['Contributor'])
        fti = queryUtility(IDexterityFTI, name='Task')
        portal_types = self.portal.portal_types
        parent_id = portal_types.constructContent(
            fti.id,
            self.portal,
            'task_id',
            title='Task container',
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
