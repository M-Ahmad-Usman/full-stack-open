import react from 'react'

export default class ErrorBoundary extends react.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.log({ error })
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <p>An error has occurred. Try to reload the page.</p>
          <button onClick={() => window.location.reload(false)}>Reload</button>
        </>
      )
    }

    return this.props.children
  }
}
