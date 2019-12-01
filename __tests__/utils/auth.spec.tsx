import * as React from 'react';
import { fireEvent, render, wait, getNodeText } from '@testing-library/react';
import { mocked } from 'ts-jest/utils'

import SignUp from '../../containers/SignUp';
import SignIn from '../../containers/SignIn';

// Mocks
import auth0 from 'auth0-js';

jest.mock('auth0-js');
const webAuth = new auth0.WebAuth({
  domain: 'testdomain.com'|| '',
  clientID: 'testappclientid' || '',
  redirectUri: 'http://testdomain.com/redirect',
  responseType: 'token id_token',
  scope: 'openid profile email',
  audience: 'http://testdomain.com/api/v2/'
})

const mockedWebAuth: any = mocked(webAuth, true);


describe('Auth0 component & functions', () => {
  describe('[SIGN UP] process', () => {
    describe('is given [VALID] signup details', () => {
      it('[RETURNED] - user details', async done => {
        const component = await render(<SignUp />);

        fillField(component.getByTestId('email'), 'test@user.com');
        fillField(component.getByTestId('password'), 'Aoeui1@345');
        fillField(component.getByTestId('username'), 'TestUser');

        fireEvent.click(component.getByTestId('submit'));

        // TODO - not exactly sure if this is really necessary??
        mockedWebAuth.signup.mockReturnValueOnce({
          email: 'test@email.com',
          username: 'TestUser',
          email_verified: false,
          _id: 'testId'
        });
        done();

        // TODO - implement redirect to signin page or maybe
        // sign them in automatically??


      })
    })

    describe('[ERRORS] from incorrect input', () => {
      describe('is given [EMPTY] signup details', () => {
        it('[RETURNED] - "Please enter..." error messages', async () => {
          const component = render(<SignUp />);

          fillField(component.getByTestId('email'), '');
          fillField(component.getByTestId('password'), '');
          fillField(component.getByTestId('username'), '');

          fireEvent.click(component.getByTestId('submit'));

          await wait(() => {
            testFormValidation(component, 'emailError', 'Please enter an email!');
            testFormValidation(component, 'passwordError', 'Please enter a password!');
            testFormValidation(component, 'usernameError', 'Please enter a username!');
          });
        })
      })

      describe('is given [INVALID] signup details', () => {
        it('[RETURNED] - Invalid details error messages', async () => {
          const component = await render(<SignUp />);

          fillField(component.getByTestId('email'), 'test');
          fillField(component.getByTestId('password'), 'Aoeui');
          fillField(component.getByTestId('username'), 'looooonggggusername');

          fireEvent.click(component.getByTestId('submit'));

          await wait(() => {
            testFormValidation(component, 'emailError', 'Invalid email!');
            testFormValidation(component, 'passwordError', 'Too short!');
            testFormValidation(component, 'usernameError', 'Too long!');
          })
        })
      })
    })
  })

  describe('[SIGN IN] process', () => {
    describe('[ERRORS] from incorrect input', () => {
      describe('is given [EMPTY] details', () => {
        it('[RETURNED] - "Please enter..." error messages', async () => {
          const component = render(<SignIn />);

          fillField(component.getByTestId('email'), '');
          fillField(component.getByTestId('password'), '');

          fireEvent.click(component.getByTestId('submit'));

          await wait(() => {
            testFormValidation(component, 'emailError', 'Please enter your email!');
            testFormValidation(component, 'passwordError', 'Please enter your password!');
          });
        })
      })

      describe('is given [INVALID] details', () => {
        it('[RETURNED] - Invalid details error messages', async () => {
          const component = await render(<SignIn />);

          fillField(component.getByTestId('email'), 'test');
          fillField(component.getByTestId('password'), 'Aoeui');

          fireEvent.click(component.getByTestId('submit'));

          await wait(() => {
            testFormValidation(component, 'emailError', 'Invalid email!');
            testFormValidation(component, 'passwordError', 'Too short!');
          })
        })
      })
    })
  })
})


// Helper Functions
const fillField = (field: HTMLElement, value: any) => {
  fireEvent.change(field, {
    persist: () => {},
    target: { value },
 })
};

const testFormValidation = async (component: any, elementDataId: string, errorMessage: string) => {
  const textOfNode = getNodeText(component.getByTestId(elementDataId))
  expect(textOfNode).toBe(errorMessage);
};