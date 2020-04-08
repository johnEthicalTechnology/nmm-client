import React from 'react'
import { Grommet } from 'grommet'
import App from 'next/app'
import { ApolloProvider } from '@apollo/react-hooks'
import nextWithApollo from '../utils/withApollo'

import Footer from '../components/Footer'
import Navigation from '../components/Nav'
import '../styles.css'

import { Props } from '../types'

const theme = {
  global: {
    font: {
      family:
        "'Segoe UI', 'Roboto','Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue','sans-serif'",
      face: `
        @font-face {
          font-family: "ImpactReversed";
          src: url("/fonts/ImpactLabelReversed.woff") format("woff");
        },
        @font-face {
          font-family: "NoMeatMayTitle";
          src: url("/fonts/NoMeatMayTitle-Regular.woff2") format("woff2");
        }
      `,
      size: '18px',
      height: '20px'
    },
    colours: {
      red: '#E8161A',
      white: '#FFFFFF'
    },
    hover: {
      color: '#FF0AAD'
    }
  },
  button: {
    border: {
      radius: '2px',
      color: '#FF0AAD'
    },
    padding: {
      horizontal: '21px'
    },
    primary: {
      color: '#FF0AAD'
    },
    extend: `
      font-weight: bold;
      color: white;
    `
  },
  body: {
    extend: `
      margin: 0;
      height: 100vh;
    `
  },
  anchor: {
    color: 'white',
    hover: {
      extend: `
        border: 2px solid #00FF37;
      `
    },
    extend: `
      border: 2px solid #002E5D;
    `
  },
  icon: {
    extend: `
        color: #00FF37;
      `
  }
}

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apollo } = this.props

    return (
      <ApolloProvider client={apollo}>
        <Grommet theme={theme}>
          <Navigation page={Component.name} />
          <Component {...pageProps} />
          <Footer page={Component.name} />
        </Grommet>
      </ApolloProvider>
    )
  }
}

export default nextWithApollo(MyApp)
