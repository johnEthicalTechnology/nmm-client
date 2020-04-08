export default () => {
  ;(function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) return
    js = d.createElement(s)
    js.id = id
    js.src = '//connect.facebook.net/en_US/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'facebook-jssdk')

  window.fbAsyncInit = function() {
    FB.init({
      appId: process.env.FB_APP_ID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v6.0'
    })
  }
}
