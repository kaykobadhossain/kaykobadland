/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors located at https://github.com/opencrvs/opencrvs-core/blob/master/AUTHORS.
 */

import {
  ActionType,
  defineConfig,
  defineDeclarationForm,
  FieldType,
  PageTypes,
  field,
  event,
  now,
  defineActionForm,
  ConditionalType,
  status,
  user
} from '@opencrvs/toolkit/events'

import { MAX_NAME_LENGTH } from './birth/validators'
import { Event } from './utils/types'

const PASSPORT_DECLARATION_REVIEW = {
  title: {
    id: 'event.passport.action.declare.form.review.title',
    defaultMessage: 'PASSPORT Application Review',
    description: 'Title of the review page'
  },
  fields: [
    {
      id: 'review.comment',
      type: FieldType.TEXTAREA,
      label: {
        defaultMessage: 'Comments',
        id: 'event.passport.action.declare.form.review.comment.label',
        description: 'Label for the comment field in the review section'
      }
    },
    {
      type: FieldType.SIGNATURE,
      id: 'review.signature',
      label: {
        defaultMessage: 'Signature of Applicant',
        id: 'event.passport.action.declare.form.review.signature.label',
        description: 'Label for the signature field in the review section'
      },
      signaturePromptLabel: {
        id: 'signature.upload.modal.title',
        defaultMessage: 'Draw signature / স্বাক্ষর প্রদান করুন',
        description: 'Title for the modal to draw signature'
      }
    },
    {
      type: FieldType.ALPHA_PRINT_BUTTON,
      id: 'review.print',
      label: {
        defaultMessage: 'Print PASSPORT Card',
        description: 'Print',
        id: 'event.passport.action.declare.form.review.print.label'
      },
      configuration: {
        template: 'v2.passport-certificate',
        buttonLabel: {
          defaultMessage:
            'Print Smart PASSPORT Card / স্মার্ট কার্ড প্রিন্ট করুন',
          description: "Print button's label",
          id: 'event.passport.action.declare.form.review.print.button.label'
        }
      }
    }
  ]
}

const PASSPORT_DECLARATION_FORM = defineDeclarationForm({
  label: {
    id: 'event.passport.action.declare.form.label',
    defaultMessage: 'PASSPORT Application',
    description: 'This is what this form is referred as in the system'
  },
  pages: [
    {
      id: 'citizen-info',
      type: PageTypes.enum.FORM,
      title: {
        id: 'event.passport.action.declare.form.section.citizen.title',
        defaultMessage: 'Nagorik Information',
        description: 'This is the title of the section'
      },
      fields: [
        {
          id: 'citizen.name',
          type: FieldType.NAME,
          label: {
            defaultMessage: 'Full Name / পূর্ণ নাম',
            description: 'This is the title for the name field',
            id: 'event.passport.field.name.label'
          },
          required: true,
          configuration: {
            name: {
              firstname: { required: true },
              middlename: { required: false },
              surname: { required: true }
            },
            maxLength: MAX_NAME_LENGTH
          }
        },
        {
          id: 'citizen.dob',
          type: FieldType.DATE,
          required: true,
          defaultValue: now(),
          label: {
            defaultMessage: 'Date of Birth / জন্ম তারিখ',
            description: 'Label for Date of Birth',
            id: 'event.passport.field.dob.label'
          }
        },
        {
          id: 'citizen.fatherName',
          type: FieldType.NAME,
          label: {
            defaultMessage: "Father's Name / পিতার নাম",
            description: "Label for Father's Name",
            id: 'event.passport.field.fatherName.label'
          },
          required: true,
          configuration: {
            name: {
              firstname: { required: true },
              middlename: { required: false },
              surname: { required: true }
            }
          }
        },
        {
          id: 'citizen.motherName',
          type: FieldType.NAME,
          label: {
            defaultMessage: "Mother's Name / মাতার নাম",
            description: "Label for Mother's Name",
            id: 'event.passport.field.motherName.label'
          },
          required: true,
          configuration: {
            name: {
              firstname: { required: true },
              middlename: { required: false },
              surname: { required: true }
            }
          }
        },
        {
          id: 'citizen.bloodGroup',
          type: FieldType.SELECT,
          label: {
            defaultMessage: 'Blood Group / রক্তের গ্রুপ',
            description: 'Label for Blood Group',
            id: 'event.passport.field.bloodGroup.label'
          },
          options: [
            {
              value: '+',
              label: {
                defaultMessage: '+',
                id: 'blood.p',
                description: 'Positive'
              }
            },
            {
              value: '-',
              label: {
                defaultMessage: '-',
                id: 'blood.m',
                description: 'Negative'
              }
            }
          ]
        }
      ]
    }
  ]
})

const PASSPORT_CERTIFICATE_COLLECTOR_FORM = defineActionForm({
  label: {
    id: 'event.passport.action.certificate.form.label',
    defaultMessage: 'PASSPORT Card Collection',
    description: 'This is what this form is referred as in the system'
  },
  pages: [
    {
      id: 'collector',
      type: PageTypes.enum.FORM,
      requireCompletionToContinue: true,
      title: {
        id: 'event.passport.action.certificate.form.section.who.title',
        defaultMessage: 'Collect Smart PASSPORT Card',
        description: 'This is the title of the section'
      },
      fields: [
        {
          id: 'collector.requesterId',
          type: FieldType.SELECT,
          required: true,
          label: {
            defaultMessage: 'Requester',
            description: 'Label for requester',
            id: 'event.passport.collector.requester.label'
          },
          options: [
            {
              label: {
                id: 'event.passport.collector.self',
                defaultMessage: 'Self (Citizen) ',
                description: 'Self collection'
              },
              value: 'SELF'
            },
            {
              label: {
                id: 'event.passport.collector.other',
                defaultMessage: 'Guardian/Other',
                description: 'Other person collection'
              },
              value: 'OTHER'
            }
          ]
        }
      ]
    }
  ]
})

export const passportEvent = defineConfig({
  id: Event.PASSPORT,
  analytics: true,
  declaration: PASSPORT_DECLARATION_FORM,
  label: {
    defaultMessage: 'PASSPORT',
    description: 'This is what this event is referred as in the system',
    id: 'event.passport.label'
  },
  dateOfEvent: field('citizen.dob'),
  title: {
    defaultMessage: 'PASSPORT: {citizen.name.firstname} {citizen.name.surname}',
    description: 'This is the title of the summary',
    id: 'event.passport.title'
  },
  fallbackTitle: {
    id: 'event.passport.fallbackTitle',
    defaultMessage: 'New PASSPORT Application',
    description: 'Fallback title'
  },
  flags: [
    {
      id: 'validated',
      label: {
        id: 'event.passport.flag.validated',
        defaultMessage: 'Validated',
        description: 'Flag label for validated'
      },
      requiresAction: true
    }
  ],
  summary: {
    fields: [
      {
        fieldId: 'citizen.name',
        emptyValueMessage: {
          defaultMessage: 'Name missing',
          description: 'Shown when name is missing',
          id: 'event.passport.summary.name.empty'
        },
        label: {
          defaultMessage: 'Citizen Name',
          description: 'Label for citizen name',
          id: 'event.passport.summary.name.label'
        }
      },
      {
        fieldId: 'citizen.dob',
        label: {
          defaultMessage: 'Date of Birth',
          description: 'Label for DOB',
          id: 'event.passport.summary.dob.label'
        }
      }
    ]
  },
  actions: [
    {
      type: ActionType.READ,
      label: {
        id: 'event.passport.action.read.label',
        defaultMessage: 'Review Application',
        description: 'Read action label'
      },
      review: PASSPORT_DECLARATION_REVIEW
    },
    {
      type: ActionType.CUSTOM,
      customActionType: 'VALIDATE_DECLARATION',
      auditHistoryLabel: {
        id: 'event.passport.custom.action.validate-declaration.auditHistory.label',
        defaultMessage: 'Validated PASSPORT application',
        description: 'Audit history label for the validate declaration action'
      },
      icon: 'Stamp',
      label: {
        defaultMessage: 'Validate / যাচাই করুন',
        description: 'Action label for validating an PASSPORT application',
        id: 'event.passport.custom.action.validate-declaration.label'
      },
      supportingCopy: {
        defaultMessage:
          'Validating this application confirms it meets all requirements.',
        description: 'Supporting copy for the Validate action',
        id: 'event.passport.custom.action.validate-declaration.supportingCopy'
      },
      conditionals: [
        {
          type: ConditionalType.SHOW,
          conditional: status('DECLARED')
        }
      ],
      flags: [{ id: 'validated', operation: 'add' }],
      form: [
        {
          id: 'comments',
          type: 'TEXTAREA',
          label: {
            defaultMessage: 'Comments / মন্তব্য',
            description: 'Label for the comments field',
            id: 'event.passport.custom.action.validate-declaration.field.comments.label'
          }
        }
      ]
    },
    {
      type: ActionType.DECLARE,
      label: {
        id: 'event.passport.action.declare.label',
        defaultMessage: 'Submit PASSPORT Application',
        description: 'Declare action label'
      },
      review: PASSPORT_DECLARATION_REVIEW
    },
    {
      type: ActionType.REGISTER,
      label: {
        id: 'event.passport.action.register.label',
        defaultMessage: 'Issue PASSPORT',
        description: 'Register action label'
      }
    },
    {
      type: ActionType.PRINT_CERTIFICATE,
      label: {
        id: 'event.passport.action.print.label',
        defaultMessage: 'Print PASSPORT Card',
        description: 'Print action label'
      },
      printForm: PASSPORT_CERTIFICATE_COLLECTOR_FORM
    }
  ],
  advancedSearch: [
    {
      title: {
        defaultMessage: 'PASSPORT Search',
        description: 'PASSPORT search section title',
        id: 'event.passport.search.title'
      },
      fields: [
        event('legalStatuses.REGISTERED.registrationNumber').exact(),
        field('citizen.name').fuzzy(),
        field('citizen.dob').range()
      ]
    }
  ]
})
