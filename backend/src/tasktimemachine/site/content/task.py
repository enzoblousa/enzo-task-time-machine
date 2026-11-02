from plone.dexterity.content import Container
from plone.supermodel import model
from tasktimemachine.site import _
from zope import schema
from zope.interface import implementer


class ITask(model.Schema):
    """Uma task profissional já entregue.

    Os campos abaixo são os metadados exibidos junto ao título e na listagem.
    O conteúdo no formato STAR (Situação, Tarefa, Ação, Resultado) e os
    blocos de código ficam no corpo da página, nos blocos do Volto
    (behavior volto.blocks).
    """

    delivery_date = schema.Date(
        title=_("Data de entrega"),
        required=True,
    )

    company = schema.TextLine(
        title=_("Empresa"),
        description=_("Empresa ou cliente para quem a task foi entregue."),
        required=True,
    )

    role = schema.TextLine(
        title=_("Função"),
        description=_("Seu papel na task. Ex.: Desenvolvedor backend."),
        required=False,
    )

    technologies = schema.List(
        title=_("Tecnologias"),
        description=_("Tecnologias usadas. Ex.: Python, Plone, React."),
        value_type=schema.TextLine(),
        required=False,
        default=[],
    )

    project_url = schema.URI(
        title=_("Link"),
        description=_("Link da entrega, do PR ou do projeto."),
        required=False,
    )


@implementer(ITask)
class Task(Container):
    """Content-type class for ITask"""
