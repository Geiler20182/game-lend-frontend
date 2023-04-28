
import Layout from '@/components/layout'
import Link from 'next/link'
import Resume from '@/components/resume'

export default function Home() {
    return (
        <Layout title="Resumen" icon="bi-file-bar-graph" >
            <Resume/>
            <hr className="hr hr-blurry h-100" />
        </Layout>
    )
}
