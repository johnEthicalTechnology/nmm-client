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
    focus: {
      border: {
        color: '#E8161A'
      }
    },
    font: {
      family:
        "'Segoe UI', 'Roboto','Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue','sans-serif'",
      face: `
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
      color: 'red'
    }
  },
  button: {
    border: {
      radius: '2px'
    },
    padding: {
      horizontal: '21px'
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
        border: 2px solid #19e5e5;
      `
    },
    extend: `
      border: 2px solid red;
    `
  }
}

class MyApp extends App<Props> {
  // Only uncomment this method if you have blocking data requirements for
  // every single page in your application. This disables the ability to
  // perform automatic static optimization, causing every page in your app to
  // be server-side rendered.
  //
  // static async getInitialProps({
  //   Component,
  //   ctx
  // }: {
  //   Component: any
  //   ctx: any
  // }) {
  //   let pageProps: any = {}

  //   if (Component.getInitialProps) {
  //     pageProps = await Component.getInitialProps(ctx)
  //   }

  //   console.log('pageProps', pageProps)
  //   console.log('ctx', ctx.query)

  //   pageProps.query = ctx.query
  //   return { pageProps }
  // }

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
