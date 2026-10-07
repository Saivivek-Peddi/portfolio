export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-end px-5 pb-32 md:px-16">
      <p className="ui text-dim">Error 404</p>
      <h1 className="shout mt-4 text-[clamp(3.5rem,12vw,11rem)]">Lost the loop</h1>
      <p className="mono mt-8 max-w-[44ch] text-dim">
        This page doesn&rsquo;t exist. Head{' '}
        <a href="/" className="wipe text-fg">
          home
        </a>{' '}
        or read the{' '}
        <a href="/notes/" className="wipe text-fg">
          writing
        </a>
        .
      </p>
    </div>
  )
}
