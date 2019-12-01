import * as React from 'react'
import {mount} from 'enzyme'
import IndexPage from '../pages/test'

describe('Pages', () => {
  describe('Index', () => {
    it('should render without throwing an error', function () {
      const wrap = mount(<IndexPage/>)
      console.log('wrap1', wrap);
      expect(wrap.find('div').text()).toBe('Hello Next.js')
    })
  })
})