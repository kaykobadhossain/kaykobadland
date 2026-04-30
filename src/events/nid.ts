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
  user,
  now,
  defineActionForm,
  ActionStatus,
  ConditionalType,
  not,
  status
} from '@opencrvs/toolkit/events'

import { MAX_NAME_LENGTH } from './birth/validators'
import { Event } from './utils/types'

const NID_DECLARATION_REVIEW = {
  title: {
    id: 'event.nid.action.declare.form.review.title',
    defaultMessage: 'NID Application Review',
    description: 'Title of the review page'
  },
  fields: [
    {
      id: 'review.comment',
      type: FieldType.TEXTAREA,
      label: {
        defaultMessage: 'Comments',
        id: 'event.nid.action.declare.form.review.comment.label',
        description: 'Label for the comment field in the review section'
      }
    },
    {
      type: FieldType.SIGNATURE,
      id: 'review.signature',
      label: {
        defaultMessage: 'Signature of Applicant',
        id: 'event.nid.action.declare.form.review.signature.label',
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
        defaultMessage: 'Print NID Card',
        description: 'Print',
        id: 'event.nid.action.declare.form.review.print.label'
      },
      configuration: {
        template: 'v2.nid-certificate',
        buttonLabel: {
          defaultMessage: 'Print Smart NID Card / স্মার্ট কার্ড প্রিন্ট করুন',
          description: "Print button's label",
          id: 'event.nid.action.declare.form.review.print.button.label'
        }
      }
    }
  ]
}

const NID_DECLARATION_FORM = defineDeclarationForm({
  label: {
    id: 'event.nid.action.declare.form.label',
    defaultMessage: 'NID Application',
    description: 'This is what this form is referred as in the system'
  },
  pages: [
    {
      id: 'citizen-info',
      type: PageTypes.enum.FORM,
      title: {
        id: 'event.nid.action.declare.form.section.citizen.title',
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
            id: 'event.nid.field.name.label'
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
            id: 'event.nid.field.dob.label'
          }
        },
        {
          id: 'citizen.fatherName',
          type: FieldType.NAME,
          label: {
            defaultMessage: "Father's Name / পিতার নাম",
            description: "Label for Father's Name",
            id: 'event.nid.field.fatherName.label'
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
            id: 'event.nid.field.motherName.label'
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
            id: 'event.nid.field.bloodGroup.label'
          },
          options: [
            {
              value: 'A+',
              label: {
                defaultMessage: 'A+',
                id: 'blood.ap',
                description: 'A Positive'
              }
            },
            {
              value: 'A-',
              label: {
                defaultMessage: 'A-',
                id: 'blood.am',
                description: 'A Negative'
              }
            },
            {
              value: 'B+',
              label: {
                defaultMessage: 'B+',
                id: 'blood.bp',
                description: 'B Positive'
              }
            },
            {
              value: 'B-',
              label: {
                defaultMessage: 'B-',
                id: 'blood.bm',
                description: 'B Negative'
              }
            },
            {
              value: 'AB+',
              label: {
                defaultMessage: 'AB+',
                id: 'blood.abp',
                description: 'AB Positive'
              }
            },
            {
              value: 'AB-',
              label: {
                defaultMessage: 'AB-',
                id: 'blood.abm',
                description: 'AB Negative'
              }
            },
            {
              value: 'O+',
              label: {
                defaultMessage: 'O+',
                id: 'blood.op',
                description: 'O Positive'
              }
            },
            {
              value: 'O-',
              label: {
                defaultMessage: 'O-',
                id: 'blood.om',
                description: 'O Negative'
              }
            }
          ]
        }
      ]
    }
  ]
})

const NID_CERTIFICATE_COLLECTOR_FORM = defineActionForm({
  label: {
    id: 'event.nid.action.certificate.form.label',
    defaultMessage: 'NID Card Collection',
    description: 'This is what this form is referred as in the system'
  },
  pages: [
    {
      id: 'collector',
      type: PageTypes.enum.FORM,
      requireCompletionToContinue: true,
      title: {
        id: 'event.nid.action.certificate.form.section.who.title',
        defaultMessage: 'Collect Smart NID Card',
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
            id: 'event.nid.collector.requester.label'
          },
          options: [
            {
              label: {
                id: 'event.nid.collector.self',
                defaultMessage: 'Self (Citizen) ',
                description: 'Self collection'
              },
              value: 'SELF'
            },
            {
              label: {
                id: 'event.nid.collector.other',
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

export const nidEvent = defineConfig({
  id: Event.NID,
  declaration: NID_DECLARATION_FORM,
  label: {
    defaultMessage: 'National ID (NID)',
    description: 'This is what this event is referred as in the system',
    id: 'event.nid.label'
  },
  dateOfEvent: field('citizen.dob'),
  title: {
    defaultMessage: 'NID: {citizen.name.firstname} {citizen.name.surname}',
    description: 'This is the title of the summary',
    id: 'event.nid.title'
  },
  fallbackTitle: {
    id: 'event.nid.fallbackTitle',
    defaultMessage: 'New NID Application',
    description: 'Fallback title'
  },
  flags: [
    {
      id: 'validated',
      label: {
        id: 'event.nid.flag.validated',
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
          id: 'event.nid.summary.name.empty'
        },
        label: {
          defaultMessage: 'Citizen Name',
          description: 'Label for citizen name',
          id: 'event.nid.summary.name.label'
        }
      },
      {
        fieldId: 'citizen.dob',
        label: {
          defaultMessage: 'Date of Birth',
          description: 'Label for DOB',
          id: 'event.nid.summary.dob.label'
        }
      }
    ]
  },
  actions: [
    {
      type: ActionType.READ,
      label: {
        id: 'event.nid.action.read.label',
        defaultMessage: 'Review Application',
        description: 'Read action label'
      },
      review: NID_DECLARATION_REVIEW
    },
    {
      type: ActionType.CUSTOM,
      customActionType: 'VALIDATE_DECLARATION',
      auditHistoryLabel: {
        id: 'event.nid.custom.action.validate-declaration.auditHistory.label',
        defaultMessage: 'Validated NID application',
        description: 'Audit history label for the validate declaration action'
      },
      icon: 'Stamp',
      label: {
        defaultMessage: 'Validate / যাচাই করুন',
        description: 'Action label for validating an NID application',
        id: 'event.nid.custom.action.validate-declaration.label'
      },
      supportingCopy: {
        defaultMessage:
          'Validating this application confirms it meets all requirements.',
        description: 'Supporting copy for the Validate action',
        id: 'event.nid.custom.action.validate-declaration.supportingCopy'
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
            id: 'event.nid.custom.action.validate-declaration.field.comments.label'
          }
        }
      ]
    },
    {
      type: ActionType.DECLARE,
      label: {
        id: 'event.nid.action.declare.label',
        defaultMessage: 'Submit NID Application',
        description: 'Declare action label'
      },
      review: NID_DECLARATION_REVIEW
    },
    {
      type: ActionType.REGISTER,
      label: {
        id: 'event.nid.action.register.label',
        defaultMessage: 'Issue NID',
        description: 'Register action label'
      }
    },
    {
      type: ActionType.PRINT_CERTIFICATE,
      label: {
        id: 'event.nid.action.print.label',
        defaultMessage: 'Print NID Card',
        description: 'Print action label'
      },
      printForm: NID_CERTIFICATE_COLLECTOR_FORM
    }
  ],
  advancedSearch: [
    {
      title: {
        defaultMessage: 'NID Search',
        description: 'NID search section title',
        id: 'event.nid.search.title'
      },
      fields: [
        event('legalStatuses.REGISTERED.registrationNumber').exact(),
        field('citizen.name').fuzzy(),
        field('citizen.dob').range()
      ]
    }
  ]
})
