import React from 'react'
import { Footer, Anchor } from 'grommet'
import { Instagram, Facebook, Twitter } from 'grommet-icons'
import styled from 'styled-components'

const FooterStyled = styled(Footer)`
  position: absolute;
  width: 100%;
`

export default function FooterComponent({ page }: { page: string }) {
  if (page == 'SignInPage' || page == 'SignUpPage') return null
  return (
    <FooterStyled a11yTitle='footer' background='#002E5D'>
      <Anchor
        a11yTitle='link to no meat may website'
        color='white'
        href='https://www.nomeatmay.net/'
        label='No Meat May'
        className='impactFont'
      />
      <Anchor
        a11yTitle='link to instagram page'
        href='https://www.instagram.com/no_meat_may/'
        icon={<Instagram color='white' />}
      />
      <Anchor
        a11yTitle='link to the twitter page'
        href='http://www.twitter.com/nomeatmay'
        icon={<Twitter color='white' />}
      />
      <Anchor
        a11yTitle='link to the facebook page'
        href='https://www.facebook.com/nomeatmay/'
        icon={<Facebook color='white' />}
      />
    </FooterStyled>
  )
}
