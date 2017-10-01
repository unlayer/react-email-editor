module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'EmailEditor',
      externals: {
        react: 'React'
      }
    }
  }
}
