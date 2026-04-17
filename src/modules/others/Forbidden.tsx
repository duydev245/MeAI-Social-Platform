import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router'

function Forbidden() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-white text-neutral-900'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.08),transparent_50%)]' />
      <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.08)_1px,transparent_1px)] bg-size-[52px_52px] opacity-50' />
      <div className='pointer-events-none absolute -top-28 left-[-10%] h-64 w-64 rounded-full bg-slate-200/60 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-28 right-[-10%] h-64 w-64 rounded-full bg-slate-100/80 blur-3xl' />

      <div className='relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12 font-sans'>
        <div className='grid w-full items-center gap-10 md:grid-cols-[0.9fr_1.1fr]'>
          <div className='rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.16)] backdrop-blur'>
            <div className='flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-neutral-500'>
              <ShieldAlert className='h-4 w-4' />
              Access restricted
            </div>
            <div className='mt-6 text-[6.5rem] font-semibold leading-none tracking-tight text-neutral-900 md:text-[7.5rem]'>
              403
            </div>
            <p className='mt-3 text-sm uppercase tracking-[0.2em] text-neutral-500'>Forbidden</p>
          </div>

          <div>
            <p className='text-xs uppercase tracking-[0.28em] text-neutral-500'>Security gate</p>
            <h1 className='mt-4 text-4xl font-semibold tracking-tight text-neutral-900 md:text-5xl'>
              You do not have access
            </h1>
            <p className='mt-4 max-w-xl text-base leading-relaxed text-neutral-600'>
              This area is restricted to authorized users only. If you believe this is an error, request access or
              contact an administrator.
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
        </div>
      </div>
    </div>
  )
}

export default Forbidden
