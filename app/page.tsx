import { supabase } from '@/lib/supabase'
import ClientHome from './ClientHome'
import './page.css'

export default async function Home() {
  const { count } = await supabase
    .from('apps')
    .select('*', { count: 'exact', head: true })

  const appCount = count ?? 0

  return (
    <main>
      <ClientHome appCount={appCount} />
    </main>
  )
}
