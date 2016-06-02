from datetime import datetime

from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import MaxLengthValidator, MinValueValidator
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext_lazy

from openslides.core.config import ConfigVariable


def validate_start_time(value):
    try:
        datetime.strptime(value, '%d.%m.%Y %H:%M')
    except ValueError:
        raise DjangoValidationError(_('Invalid input.'))


def get_config_variables():
    """
    Generator which yields all config variables of this app.

    It has to be evaluated during app loading (see apps.py).
    """
    yield ConfigVariable(
        name='agenda_number_prefix',
        default_value='',
        label=ugettext_lazy('Numbering prefix for agenda items'),
        help_text=ugettext_lazy('This prefix will be set if you run the automatic agenda numbering.'),
        weight=210,
        group=ugettext_lazy('Agenda'),
        subgroup=ugettext_lazy('General'),
        validators=(MaxLengthValidator(20),))

    yield ConfigVariable(
        name='agenda_numeral_system',
        default_value='arabic',
        input_type='choice',
        label=ugettext_lazy('Numeral system for agenda items'),
        choices=(
            {'value': 'arabic', 'display_name': ugettext_lazy('Arabic')},
            {'value': 'roman', 'display_name': ugettext_lazy('Roman')}),
        weight=215,
        group=ugettext_lazy('Agenda'),
        subgroup=ugettext_lazy('General'))

    # TODO: Use an input type with generic datetime support.
    yield ConfigVariable(
        name='agenda_start_event_date_time',
        default_value='',
        label=ugettext_lazy('Begin of event'),
        help_text=ugettext_lazy('Input format: DD.MM.YYYY HH:MM'),
        weight=220,
        group=ugettext_lazy('Agenda'),
        subgroup=ugettext_lazy('General'),
        validators=(validate_start_time,))

    # List of speakers

    yield ConfigVariable(
        name='agenda_show_last_speakers',
        default_value=1,
        input_type='integer',
        label=ugettext_lazy('Number of last speakers to be shown on the projector'),
        weight=230,
        group=ugettext_lazy('Agenda'),
        subgroup=ugettext_lazy('List of speakers'),
        validators=(MinValueValidator(0),))

    yield ConfigVariable(
        name='agenda_countdown_warning_time',
        default_value=0,
        input_type='integer',
        label=ugettext_lazy('Show orange countdown in the last x seconds of speaking time'),
        help_text=ugettext_lazy('Enter duration in seconds. Choose 0 to disable warning color.'),
        weight=235,
        group=ugettext_lazy('Agenda'),
        subgroup=ugettext_lazy('List of speakers'),
        validators=(MinValueValidator(0),))

    yield ConfigVariable(
        name='agenda_couple_countdown_and_speakers',
        default_value=False,
        input_type='boolean',
        label=ugettext_lazy('Couple countdown with the list of speakers'),
        help_text=ugettext_lazy('[Begin speech] starts the countdown, [End speech] stops the countdown.'),
        weight=240,
        group=ugettext_lazy('Agenda'),
        subgroup=ugettext_lazy('List of speakers'))
