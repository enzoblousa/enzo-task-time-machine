# from plone.app.textfield import RichText
# from plone.autoform import directives
from plone.dexterity.content import Container
# from plone.namedfile import field as namedfile
from plone.supermodel import model
# from plone.supermodel.directives import fieldset
# from z3c.form.browser.radio import RadioFieldWidget
# from zope import schema
from zope.interface import implementer
from plone.app.dexterity.textindexer import searchable

# from tasktimemachine.site import _


class ITodoTask(model.Schema):
    """ Marker interface and Dexterity Python Schema for TodoTask
    """
    # If you want, you can load a xml model created TTW here
    # and customize it in Python:

    # model.load('todo_task.xml')

    # add the following line to make your field searchable in
    # the default SearchableText index
    #
    # searchable('fieldname')

    # directives.widget(level=RadioFieldWidget)
    # level = schema.Choice(
    #     title=_('Sponsoring Level'),
    #     vocabulary=LevelVocabulary,
    #     required=True
    # )

    # text = RichText(
    #     title=_('Text'),
    #     required=False
    # )

    # url = schema.URI(
    #     title=_('Link'),
    #     required=False
    # )

    # fieldset('Images', fields=['logo', 'advertisement'])
    # logo = namedfile.NamedBlobImage(
    #     title=_('Logo'),
    #     required=False,
    # )

    # advertisement = namedfile.NamedBlobImage(
    #     title=_('Advertisement (Gold-sponsors and above)'),
    #     required=False,
    # )

    # directives.read_permission(notes='cmf.ManagePortal')
    # directives.write_permission(notes='cmf.ManagePortal')
    # notes = RichText(
    #     title=_('Secret Notes (only for site-admins)'),
    #     required=False
    # )


@implementer(ITodoTask)
class TodoTask(Container):
    """ Content-type class for ITodoTask
    """
