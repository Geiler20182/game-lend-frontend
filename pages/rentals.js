import Layout from "@/components/layout";
import Link from "next/link";
import RentalList from "@/components/rental-list";

export default function Home() {
    return (
        <Layout title="Rentas" icon="bi-calendar-week" selected={3}>
            <RentalList />
        </Layout>
    );
}
