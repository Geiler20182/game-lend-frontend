import Layout from "@/components/layout";
import Link from "next/link";
import CustomerList from "@/components/customer-list";

export default function Home() {
    return (
        <Layout title="Clientes" icon="bi-people" selected={2}>
            <CustomerList />
        </Layout>
    );
}
