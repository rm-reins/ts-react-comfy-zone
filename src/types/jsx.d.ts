declare global {
  namespace JSX {
    interface IntrinsicElements {
      [
        elemName: string
      ]: React.JSX.IntrinsicElements[keyof React.JSX.IntrinsicElements];
    }
  }
}
