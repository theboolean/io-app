/**
 * Useful methods to interact with redux-form
 *
 * @flow
 */

import * as React from 'react'
import { type FieldProps } from 'redux-form'
import { Item, Input, View, Text } from 'native-base'

import I18n from '../../i18n'

const getValidatorMessage = (validatorId: string): string => {
  return I18n.t(`forms.validators.${validatorId}`)
}

const required = (value: string): ?string =>
  value ? undefined : getValidatorMessage('required')

const email = (value: string): ?string =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? getValidatorMessage('email')
    : undefined

/**
 * A utility function that return the translated value for a property of a form field.
 */
export const getFormFieldProperty = (
  formId: string
): (string => string => string) => (fieldId: string): (string => string) => (
  propertyId: string
): string => {
  return I18n.t(`forms.${formId}.fields.${fieldId}.${propertyId}`)
}

/**
 * Methods used to validate redux-form `Field` components.
 */
export const validators = {
  required,
  email
}

/**
 * This method is used by redux-form `Field` components.
 * It takes as input the field properties and return a native-base `Input`.
 */
export const renderNBInput = ({
  input,
  meta: { touched, error },
  ...rest
}: FieldProps): React.Node => {
  return (
    <View>
      <Item error={error && touched}>
        <Input {...input} {...rest} />
      </Item>
      {rest.showError && error && touched && <Text>{error}</Text>}
    </View>
  )
}
