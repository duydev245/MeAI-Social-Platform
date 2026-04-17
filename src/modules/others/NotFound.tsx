import { Link } from 'react-router'

function NotFound() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-white text-neutral-900'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_45%)]' />
      <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-size-[48px_48px] opacity-50' />
      <div className='pointer-events-none absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-slate-200/60 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-32 left-[-10%] h-72 w-72 rounded-full bg-slate-100/80 blur-3xl' />

      <div className='relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 font-sans'>
        <div className='grid w-full items-center gap-10 md:grid-cols-[1.2fr_0.8fr]'>
          <div>
            <p className='text-xs uppercase tracking-[0.28em] text-neutral-500'>MeAI-Social-Platform</p>
            <h1 className='mt-4 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl'>Page not found</h1>
            <p className='mt-4 max-w-xl text-base leading-relaxed text-neutral-600'>
              The page you are looking for does not exist or has been moved. Check the URL or head back to the feed.
            </p>

            <div className='mt-8 flex flex-wrap gap-3'>
              <Link
                to='/'
                className='inline-flex items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 text-white px-5 py-2 text-sm font-medium shadow-[0_10px_30px_rgba(15,23,42,0.2)] transition hover:-translate-y-0.5 hover:bg-neutral-800'
              >
                Back to home
              </Link>
            </div>
          </div>

          <div className='rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur'>
            <div className='text-[7rem] font-semibold leading-none tracking-tight text-neutral-900 md:text-[8rem]'>
              404
            </div>
            <p className='mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500'>Not found</p>
            <div className='mt-6 space-y-3 text-sm text-neutral-600'>
              <div className='flex items-center gap-2'>
                <span className='h-1.5 w-1.5 rounded-full bg-neutral-500' />
                Confirm the link is correct
              </div>
              <div className='flex items-center gap-2'>
                <span className='h-1.5 w-1.5 rounded-full bg-neutral-500' />
                The content might have been removed
              </div>
              <div className='flex items-center gap-2'>
                <span className='h-1.5 w-1.5 rounded-full bg-neutral-500' />
                Use search or return to the feed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
